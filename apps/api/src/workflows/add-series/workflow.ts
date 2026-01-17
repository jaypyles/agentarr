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
  res: FastifyReply;
  private foundSeriesCache: SonarrSeries[] | undefined;

  constructor(res: FastifyReply, debug: boolean = false) {
    super("Add Series Workflow", debug);
    this.res = res;
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

    const searchQuery = `${response.searchQuery} ${response.season ? `S${response.season < 10 ? "0" : ""}${response.season}` : ""} ${response.episodes ? `E${response.episodes.map((e) => `${e < 10 ? "0" : ""}${e}`).join(",")}` : ""}`;

    const log = `${BOLD}[AI] - Generated search query: ${RESET}${searchQuery}`;
    logger.info(log);

    this.send(this.res, {
      status: "progress",
      message: "Generated search query: " + `"${searchQuery}"`,
      ...(this.debug ? { raw: response } : {}),
    });

    return response;
  }

  private async lookupSeries(searchQuery: string): Promise<any> {
    logger.info(`Looking up series for "${searchQuery}" in Sonarr`);

    this.send(this.res, {
      status: "progress",
      message: "Looking up series for " + `"${searchQuery}"`,
      ...(this.debug ? { raw: searchQuery } : {}),
    });

    const series = await sonarrService.lookup(searchQuery);
    this.foundSeriesCache = series;
    return series;
  }

  private async decideSeries(
    series: SonarrSeries[],
    originalQuery: string
  ): Promise<any> {
    const seriesToDecide = series
      .slice(0, 10)
      .map((s) => toAiReadableSeries(s));

    const decision = await new DecideSeriesAgent().run<SonarrSeries>(
      JSON.stringify({
        series: seriesToDecide,
        originalQuery: originalQuery,
      })
    );

    this.send(this.res, {
      status: "progress",
      message: "Decided on series: " + `"${decision.title}"`,
      ...(this.debug ? { raw: { decision, series: seriesToDecide } } : {}),
    });

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

    if (this.debug) {
      // no-op
      return;
    }

    try {
      const response = await sonarrService.addSeries(foundSeries, options);

      this.send(this.res, {
        status: "progress",
        message: "Series added to Sonarr: " + `"${foundSeries.title}"`,
        ...(this.debug ? { raw: response } : {}),
      });

      return response;
    } catch (error) {
      console.error(error);
    }
  }

  private async addEpisodes(
    series: SonarrSeries,
    season: number,
    episodes: number[]
  ): Promise<any> {
    logger.info("User is looking for specific episodes.");

    for (const episode of episodes) {
      await this.getAndAddToProwlarr(
        `${series.title ?? ""} S${season < 10 ? "0" : ""}${season}E${episode < 10 ? "0" : ""}${episode}`
      );
    }
  }

  private async getAndAddToProwlarr(searchTerm: string): Promise<any> {
    logger.info(`User is searching for "${searchTerm}" in Prowlarr`);

    await this.send(this.res, {
      status: "progress",
      message: `Searching prowlarr for "${searchTerm}"`,
      ...(this.debug ? { raw: searchTerm } : {}),
    });

    const prowlarrSeries = await this.getProwlarrSeries(searchTerm);

    logger.info(`Adding "${prowlarrSeries.title}" to download client`);

    await this.send(this.res, {
      status: "progress",
      message: `Adding "${prowlarrSeries.title}" to download client`,
      ...(this.debug ? { raw: prowlarrSeries } : {}),
    });

    if (this.debug) {
      // no-op
      return;
    }

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
    const response = await prowlarrService.download(guid, indexerId);
    return response.data;
  }

  public async run(args: { query: string }): Promise<any> {
    await this.send(this.res, {
      status: "started",
      message: "Starting workflow",
    });

    let decision: SonarrSeries | string | undefined;
    const originalQuery = args.query;

    try {
      const searchQuery = await this.determineSearchQueries(originalQuery);

      const seasonPart = searchQuery.season
        ? ` S${searchQuery.season < 10 ? "0" : ""}${searchQuery.season}`
        : "";
      decision = `${searchQuery.searchQuery} ${seasonPart}`;

      if (searchQuery.alreadyInLibrary) {
        await this.send(this.res, {
          status: "info",
          message: `User already has ${searchQuery.searchQuery} in library, not adding to Sonarr.`
        })

        logger.info(
          "User already has series in their library, not adding to Sonarr."
        );

        await this.send(this.res, {
          status: "info",
          message:
            "User already has series in their library, not adding to Sonarr.",
        });
      } else {
        // User does not have series in their library, looking up series in Sonarr
        const series = await this.lookupSeries(searchQuery.searchQuery);
        const decidedSeries = await this.decideSeries(series, originalQuery);
        await this.addSeries(decidedSeries);
      }

      if (searchQuery.episodes) {
        await this.addEpisodes(
          { title: searchQuery.searchQuery },
          searchQuery.season,
          searchQuery.episodes
        );
      } else {
        await this.getAndAddToProwlarr(decision);
      }

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
