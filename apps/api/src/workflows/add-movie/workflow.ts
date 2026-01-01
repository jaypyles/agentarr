import { DecideProwlarrEntryAgent } from "@/agents/decide-prowlarr-entry/agent";
import { DecideSeriesAgent } from "@/agents/decide-series/agent";
import { DetermineSearchQueriesAgent } from "@/agents/determine-search-queries";
import { prowlarrService } from "@/services/prowlarr";
import { radarrService } from "@/services/radarr/service";
import { Movie, ProwlarrSearchResult } from "@repo/global-types";
import { BOLD, logger, RESET } from "@repo/logger";
import { FastifyReply } from "fastify";
import { Workflow } from "../workflow";

type ProwlarrDecision = Pick<
  ProwlarrSearchResult,
  "guid" | "indexerId" | "title"
>;

export class AddMovieWorkflow extends Workflow {
  res: FastifyReply;
  foundMoviesCache: Movie[] | undefined;

  constructor(res: FastifyReply) {
    super("Add Movie Workflow");
    this.res = res;
  }

  private async checkMovies() {
    const movies = await radarrService.getMovies();
    this.foundMoviesCache = movies;

    let userSeries = "";

    for (const m of movies) {
      userSeries += `${m.title}\n`;
    }

    return userSeries;
  }

  private async determineSearchQueries(query: string): Promise<any> {
    const userMovies = await this.checkMovies();

    const userQuery = `
    <user-movies>
    ${userMovies ?? "No movies found"}
    </user-movies>

    ${query}
    `;

    const response = await new DetermineSearchQueriesAgent().run<{
      searchQuery: string;
      alreadyInLibrary?: boolean;
    }>(
      JSON.stringify({
        query: userQuery,
      })
    );

    const log = `${BOLD}[AI] - Generated search query: ${RESET}${response.searchQuery}`;

    this.send(this.res, {
      status: "progress",
      message: "Generated search query: " + `"${response.searchQuery}"`,
    });

    logger.info(log);

    return response;
  }

  private async searchForMovie(query: string): Promise<any> {
    const response = await radarrService.searchMovie(query);

    this.send(this.res, {
      status: "progress",
      message: `Found ${response.length} movies`,
    });

    return response;
  }

  private async decideMovie(
    movies: Movie[],
    originalQuery: string
  ): Promise<any> {
    const decision = await new DecideSeriesAgent().run<Movie>(
      JSON.stringify({
        movies: movies.slice(0, 10),
        originalQuery: originalQuery,
      })
    );
    this.send(this.res, {
      status: "progress",
      message: "Decided on movie: " + `"${decision.title}"`,
    });

    return decision;
  }

  private async checkIfMovieInLibrary(movie: Movie): Promise<boolean> {
    const isInLibrary =
      this.foundMoviesCache?.some((m) => m.tmdbId === movie.tmdbId) ?? false;

    this.send(this.res, {
      status: "info",
      message:
        "Movie " +
        `"${movie.title}"` +
        " is " +
        (isInLibrary ? "in" : "not") +
        " in library",
    });

    return isInLibrary;
  }

  private async searchForMovieInProwlarr(
    query: string
  ): Promise<ProwlarrSearchResult[]> {
    const response = await prowlarrService.search(query);

    this.send(this.res, {
      status: "progress",
      message: `Found ${response.length} movies in Prowlarr`,
    });

    return response;
  }

  private async decideMovieInProwlarr(
    movies: ProwlarrSearchResult[],
    originalQuery: string
  ): Promise<ProwlarrDecision> {
    const moviesToDecide = movies
      .sort((a, b) => b.seeders - a.seeders)
      .slice(0, 10);

    const decision = await new DecideProwlarrEntryAgent().run<ProwlarrDecision>(
      JSON.stringify({
        movies: moviesToDecide,
        originalQuery: originalQuery,
      })
    );

    this.send(this.res, {
      status: "progress",
      message: "Decided on movie in Prowlarr: " + `"${decision.title}"`,
    });

    return decision;
  }

  private async addMovieToProwlarr(
    title: string,
    guid: string,
    indexerId: number
  ) {
    const response = await prowlarrService.download(guid, indexerId);

    this.send(this.res, {
      status: "progress",
      message: "Added movie to Prowlarr: " + `"${title}"`,
    });

    return response.data;
  }

  public async run(args: { query: string }): Promise<any> {
    try {
      await this.send(this.res, {
        status: "started",
        message: "Starting workflow",
      });

      const queryResponse = await this.determineSearchQueries(args.query);
      const searchResults = await this.searchForMovie(
        queryResponse.searchQuery
      );
      const movieDecision = await this.decideMovie(searchResults, args.query);
      const movieInLibrary = await this.checkIfMovieInLibrary(movieDecision);

      if (movieInLibrary) {
        logger.info("Movie already in library, not adding to Radarr.");
      } else {
        // Movie is not in library, adding to Radarr
        await radarrService.addMovie(movieDecision);
        logger.info("Movie added to Radarr");
      }

      const prowlarrMovies = await this.searchForMovieInProwlarr(
        queryResponse.searchQuery
      );
      const prowlarrMovieDecision = await this.decideMovieInProwlarr(
        prowlarrMovies,
        args.query
      );

      await this.addMovieToProwlarr(
        prowlarrMovieDecision.title,
        prowlarrMovieDecision.guid,
        prowlarrMovieDecision.indexerId
      );

      await this.send(this.res, {
        status: "end",
        message: "Workflow ended",
      });

      this.res.sseContext.source.end();
    } catch (error) {
      logger.error({ err: error }, "Workflow error");
      try {
        await this.send(this.res, {
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        });
        this.res.sseContext.source.end();
      } catch (sendError) {
        // If we can't send the error, the connection is likely already closed
        logger.error({ err: sendError }, "Failed to send error response");
      }
      throw error;
    }
  }
}
