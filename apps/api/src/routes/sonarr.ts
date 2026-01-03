import { SonarrSeries } from "@repo/global-types";
import { FastifyInstance } from "fastify";
import { sonarrService } from "../services/sonarr";
import { DecideSeriesAgent } from "../agents/decide-series";
import { toAiReadableSeries } from "../utils";

const SERIES_CACHE = new Map<string, SonarrSeries[]>();

export const sonarrRoutes = async (server: FastifyInstance) => {
  server.get("/sonarr/get-series", async (req, res) => {
    const series = await sonarrService.getSeries();
    res.status(200).send(series);
  });

  server.get("/sonarr/lookup", async (req, res) => {
    const { query } = req.query as { query: string };

    let series = SERIES_CACHE.get(query);

    if (!series) {
      series = await sonarrService.lookup(query);
      SERIES_CACHE.set(query, series);
    }

    res.status(200).send(series);
  });

  server.post("/sonarr/decide-series", async (req, res) => {
    const { series, originalQuery } = req.body as {
      series: Partial<SonarrSeries>[];
      originalQuery: string;
    };

    const decision = await new DecideSeriesAgent().run(
      JSON.stringify({
        series: series.splice(0, 10).map((s) => toAiReadableSeries(s)),
        originalQuery: originalQuery,
      })
    );

    res.status(200).send(decision);
  });
};
