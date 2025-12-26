import { DecideProwlarrEntryAgent } from "@/agents/decide-prowlarr-entry/agent";
import { DecideSeriesAgent } from "@/agents/decide-series";
import { DetermineSearchQueriesAgent } from "@/agents/determine-search-queries";
import { prowlarrService } from "@/services/prowlarr";
import { sonarrService } from "@/services/sonarr";
import { toAiReadableSeries } from "@/utils";
import { toAiReadableIndex } from "@/utils/to-ai-readable-index";
import { SonarrAddOptions, SonarrSeries } from "@repo/global-types";
import { BOLD, logger, RESET } from "@repo/logger";
import { FastifyReply } from "fastify";
import { Workflow } from "../workflow";

export class AddSeriesWorkflow extends Workflow {
  private foundSeriesCache: SonarrSeries[] | undefined;

  constructor() {
    super("Add Series Workflow");
  }

  private async checkSeries() {
    const series = await sonarrService.getSeries();

    let userSeries = "";

    for (const s of series) {
      userSeries += `${s.title}\n ${s.seasons?.map((season) => (season.seasonNumber ? `Season: ${season.seasonNumber} - ${season.statistics?.episodeFileCount} episodes / ${season.statistics?.totalEpisodeCount} total episodes` : "")).join("\n")}\n`;
    }

    return userSeries;
  }

  private async determineSearchQueries(query: string): Promise<any> {
    const userSeries = await this.checkSeries();

    const userQuery = `
    <user-series>
    ${userSeries ?? "No series found"}
    </user-series>

    ${query}
    `;

    const response = await new DetermineSearchQueriesAgent().run<{
      searchQuery: string;
      season?: number;
      episodes?: number[];
      alreadyInLibrary?: boolean;
    }>(
      JSON.stringify({
        query: userQuery,
      })
    );

    const log = `${BOLD}[AI] - Generated search query: ${RESET}${response.searchQuery} ${response.season ? `S${response.season < 10 ? "0" : ""}${response.season}` : ""} ${response.episodes ? `E${response.episodes.map((e) => (e < 10 ? "0" : "")).join(",")}` : ""}`;
    logger.info(log);

    return response;
  }

  private async lookupSeries(searchQuery: string): Promise<any> {
    logger.info(`Looking up series for "${searchQuery}" in Sonarr`);

    const series = await sonarrService.lookup(searchQuery);
    this.foundSeriesCache = series;
    return series;
  }

  private async decideSeries(
    series: SonarrSeries[],
    originalQuery: string
  ): Promise<any> {
    const decision = await new DecideSeriesAgent().run<SonarrSeries>(
      JSON.stringify({
        series: series.slice(0, 10).map((s) => toAiReadableSeries(s)),
        originalQuery: originalQuery,
      })
    );
    return decision;
  }

  private async addSeries(
    series: SonarrSeries,
    options?: SonarrAddOptions
  ): Promise<any> {
    const foundSeries = this.foundSeriesCache?.find((s) => {
      return s.tvdbId === series.tvdbId;
    });

    if (!foundSeries) {
      throw new Error("Series not found");
    }

    try {
      const response = await sonarrService.addSeries(foundSeries, options);
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  private async addEpisodes(
    series: SonarrSeries,
    season: number,
    episodes: number[],
    res: FastifyReply
  ): Promise<any> {
    logger.info("User is looking for specific episodes.");

    for (const episode of episodes) {
      await this.getAndAddToProwlarr(
        `${series.title ?? ""} S${season < 10 ? "0" : ""}${season}E${episode < 10 ? "0" : ""}${episode}`,
        res
      );
    }
  }

  private async getAndAddToProwlarr(
    searchTerm: string,
    res: FastifyReply
  ): Promise<any> {
    logger.info(`User is searching for "${searchTerm}" in Prowlarr`);
    await this.send(res, {
      status: "progress",
      message: `Searching prowlarr for "${searchTerm}"`,
    });

    const prowlarrSeries = await this.getProwlarrSeries(searchTerm);

    logger.info(`Adding "${prowlarrSeries.title}" to download client`);
    await this.send(res, {
      status: "progress",
      message: `Adding "${prowlarrSeries.title}" to download client`,
    });

    const downloadedSeries = await this.downloadProwlarrSeries(
      prowlarrSeries.guid,
      prowlarrSeries.indexerId
    );
    return downloadedSeries;
  }

  private async getProwlarrSeries(title: string): Promise<any> {
    const series = await prowlarrService.search(title);
    const sortedSeries = series
      .sort((a, b) => b.seeders - a.seeders)
      .slice(0, 15);

    const agent = new DecideProwlarrEntryAgent();

    const decision = await agent.run(
      JSON.stringify({
        prowlarrSeries: sortedSeries.map((s) => toAiReadableIndex(s)),
        originalQuery: title,
      })
    );

    return decision;
  }

  private async downloadProwlarrSeries(
    guid: string,
    indexerId: number
  ): Promise<any> {
    // const response = await prowlarrService.download(guid, indexerId);
    // return response.data;
  }

  public async run(args: { query: string }, res: FastifyReply): Promise<any> {
    await this.send(res, { status: "started", message: "Starting workflow" });

    let decision: SonarrSeries | string | undefined;
    const originalQuery = args.query;

    try {
      await this.send(res, {
        status: "progress",
        message: "Determining search queries",
      });
      const searchQuery = await this.determineSearchQueries(originalQuery);

      const seasonPart = searchQuery.season
        ? ` S${searchQuery.season < 10 ? "0" : ""}${searchQuery.season}`
        : "";
      decision = `${searchQuery.searchQuery} ${seasonPart}`;

      if (searchQuery.alreadyInLibrary) {
        logger.info(
          "User already has series in their library, not adding to Sonarr."
        );

        await this.send(res, {
          status: "info",
          message:
            "User already has series in their library, not adding to Sonarr.",
        });
      } else {
        // User does not have series in their library, looking up series in Sonarr

        await this.send(res, {
          status: "progress",
          message: "Looking up series",
        });

        const series = await this.lookupSeries(searchQuery.searchQuery);

        await this.send(res, {
          status: "progress",
          message: "Deciding series",
        });
        const decidedSeries = await this.decideSeries(series, originalQuery);

        // const addedSeries = await this.addSeries(decision);
      }

      if (searchQuery.episodes) {
        await this.addEpisodes(
          searchQuery.title,
          searchQuery.season,
          searchQuery.episodes,
          res
        );
      } else {
        await this.getAndAddToProwlarr(decision, res);
      }

      await this.send(res, {
        status: "end",
        message: "Workflow ended",
      });

      res.sseContext.source.end();
    } catch (error) {
      logger.error({ err: error }, "Workflow error");
      try {
        await this.send(res, {
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        });
        res.sseContext.source.end();
      } catch (sendError) {
        // If we can't send the error, the connection is likely already closed
        logger.error({ err: sendError }, "Failed to send error response");
      }
      throw error;
    }
  }
}
