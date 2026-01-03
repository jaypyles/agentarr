import cors from "@fastify/cors";
import { Apps, SonarrSeries } from "@repo/global-types";
import { logger } from "@repo/logger";
import fastify from "fastify";
import { FastifySSEPlugin } from "fastify-sse-v2";
import { DecideSeriesAgent } from "./agents/decide-series";
import { downloadRoutes } from "./download";
import { managementRoutes } from "./management";
import { jellyfinService } from "./services/jellyfin/service";
import { prowlarrService } from "./services/prowlarr";
import { radarrService } from "./services/radarr/service";
import { sonarrService } from "./services/sonarr";
import { toAiReadableSeries } from "./utils";
import { AddMovieWorkflow } from "./workflows/add-movie";
import { AddSeriesWorkflow } from "./workflows/add-series";
import { MoveFilesWorkflow } from "./workflows/move-files";

const SERIES_CACHE = new Map<string, SonarrSeries[]>();

async function start() {
  const server = fastify();

  await server.register(cors, {
    origin: "*",
  });

  await server.register(FastifySSEPlugin);
  await downloadRoutes(server);
  await managementRoutes(server);

  server.get("/agent/add-series", async (req, res) => {
    const { query } = req.query as { query: string };

    const workflow = new AddSeriesWorkflow(res);
    await workflow.run({ query });
  });

  server.get("/agent/add-movie", async (req, res) => {
    const { query } = req.query as { query: string };

    const workflow = new AddMovieWorkflow(res);
    await workflow.run({ query });
  });

  server.get("/agent/move-files", async (req, res) => {
    const { query } = req.query as { query: string };

    const workflow = new MoveFilesWorkflow(res);
    await workflow.run({ query });
  });

  server.get("/apps", async (req, res) => {
    const apps: Apps = {
      sonarr: process.env.SONARR_URL ?? "",
      radarr: process.env.RADARR_URL ?? "",
      prowlarr: process.env.PROWLARR_URL ?? "",
      jellyfin: process.env.JELLYFIN_URL ?? "",
    };

    res.status(200).send(apps);
  });

  server.get("/jellyfin/get-series", async (req, res) => {
    const { searchTerm } = req.query as { searchTerm: string };
    const series = await jellyfinService.getSeries(searchTerm);

    if (!series) {
      return res.status(404).send({ error: "Series not found" });
    }

    res.header("Cache-Control", "max-age=120, public");
    res.status(200).send(series);
  });

  server.get("/jellyfin/get-movie", async (req, res) => {
    const { searchTerm } = req.query as { searchTerm: string };
    const series = await jellyfinService.getMovie(searchTerm);

    if (!series) {
      return res.status(404).send({ error: "Movie not found" });
    }

    res.header("Cache-Control", "max-age=120, public");
    res.status(200).send(series);
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

  server.get("/radarr/get-movies", async (req, res) => {
    const movies = await radarrService.getMovies();
    res.status(200).send(movies);
  });

  server.addHook("onResponse", (req, res, done) => {
    const { method, url } = req;
    logger.info(`[${res.statusCode}] - ${method} ${url}`);

    done();
  });

  await server.listen({ port: 3000, host: '0.0.0.0' });
  logger.info(`Server is running on http://0.0.0.0:3000`);
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
