import cors from "@fastify/cors";
import fastifySSE from "@fastify/sse";
import { SonarrSeries } from "@repo/global-types";
import { logger } from "@repo/logger";
import fastify from "fastify";
import { DecideSeriesAgent } from "./agents/decide-series";
import { prowlarrService } from "./services/prowlarr";
import { sonarrService } from "./services/sonarr";
import { toAiReadableSeries } from "./utils";
import { AddSeriesWorkflow } from "./workflows/add-series";

const SERIES_CACHE = new Map<string, SonarrSeries[]>();

async function start() {
  const server = fastify();

  await server.register(cors, {
    origin: "*",
  });

  await server.register(fastifySSE);

  server.get("/agent/add-series", { sse: true }, async (req, res) => {
    const { query } = req.query as { query: string };

    const workflow = new AddSeriesWorkflow();
    await workflow.run({ query }, res);
  });

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

  server.get("/prowlarr/search", async (req, res) => {
    const { query } = req.query as {
      query: string;
    };

    const results = await prowlarrService.search(query);

    res.status(200).send(results);
  });

  server.addHook("onResponse", (req, res, done) => {
    const { method, url } = req;
    logger.info(`[${res.statusCode}] - ${method} ${url}`);

    done();
  });

  await server.listen({ port: 3000 });
  logger.info(`Server is running on http://127.0.0.1:3000`);
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
