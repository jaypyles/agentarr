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

  private async determineSearchQueries(query: string): Promise<any> {
    const response = await new DetermineSearchQueriesAgent().run<{
      searchQuery: string;
    }>(
      JSON.stringify({
        query,
      })
    );

    logger.info(
      `${BOLD}[AI] - Generated search query: ${RESET}${response.searchQuery}`
    );

    return response.searchQuery;
  }

  private async lookupSeries(searchQuery: string): Promise<any> {
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
      console.log(s.tvdbId, series.tvdbId);
      return s.tvdbId === series.tvdbId;
    });

    console.log({ foundSeries });

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

  public async run(args: { query: string }, res: FastifyReply): Promise<any> {
    const originalQuery = args.query;
    await this.send(res, { status: "started", message: "Starting workflow" });
    const searchQuery = await this.determineSearchQueries(originalQuery);
    await this.send(res, {
      status: "progress",
      message: "Determining search queries",
    });
    const series = await this.lookupSeries(searchQuery);
    await this.send(res, { status: "progress", message: "Looking up series" });
    const decision = await this.decideSeries(series, originalQuery);
    await this.send(res, { status: "progress", message: "Deciding series" });

    // const addedSeries = await this.addSeries(decision);
    const prowlarrSeries = await this.getProwlarrSeries(decision.title);
    await this.send(res, {
      status: "progress",
      message: "Getting prowlarr series",
    });
    const downloadedSeries = await this.downloadProwlarrSeries(
      prowlarrSeries.guid,
      prowlarrSeries.indexerId
    );
    await this.send(res, {
      status: "progress",
      message: "Downloading prowlarr series",
    });

    console.log({ downloadedSeries });

    await this.send(res, {
      status: "end",
      message: "Workflow ended",

      data: downloadedSeries,
    });

    res.sse.close();
    return downloadedSeries;
  }
}
