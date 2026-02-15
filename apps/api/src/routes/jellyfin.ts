import { SimpleCache } from "@/utils";
import { SonarrSeries } from "@repo/global-types";
import { logger } from "@repo/logger";
import { FastifyInstance } from "fastify";
import { jellyfinService } from "../services/jellyfin/service";

type JellfinSearchBody = {
  series: Pick<SonarrSeries, "title" | "alternateTitles">[];
};

const SERIES_CACHE = new SimpleCache<Record<string, any>>(300000);
const MOVIE_CACHE = new SimpleCache<Record<string, any>>(300000);

const getCacheKey = (
  series: Pick<SonarrSeries, "title" | "alternateTitles">[],
): string => {
  const normalized = series
    .map((s) => ({
      title: s.title ?? "",
      alternateTitles: (s.alternateTitles ?? [])
        .map((alt) => alt.title ?? "")
        .sort(),
    }))
    .sort((a, b) => (a.title > b.title ? 1 : -1));

  return JSON.stringify(normalized);
};

export const jellyfinRoutes = async (server: FastifyInstance) => {
  server.post("/jellyfin/get-series", async (req, res) => {
    const { series } = req.body as JellfinSearchBody;

    const cacheKey = getCacheKey(series);
    let seriesObject = SERIES_CACHE.get(cacheKey);

    if (!seriesObject) {
      const seriesMap = await jellyfinService.searchForSeries(series);

      if (seriesMap.size === 0) {
        return res.status(404).send({ error: "Series not found" });
      }

      seriesObject = Object.fromEntries(seriesMap);

      SERIES_CACHE.set(cacheKey, seriesObject);
    }

    res.status(200).send(seriesObject);
  });

  server.post("/jellyfin/get-movie", async (req, res) => {
    try {
      const { series } = req.body as JellfinSearchBody;

      const cacheKey = getCacheKey(series);
      let movieObject = MOVIE_CACHE.get(cacheKey);

      if (!movieObject) {
        const movieMap = await jellyfinService.searchForMovie(series);

        if (movieMap.size === 0) {
          return res.status(404).send({ error: "Movie not found" });
        }

        movieObject = Object.fromEntries(movieMap);
        MOVIE_CACHE.set(cacheKey, movieObject);
      }

      res.status(200).send(movieObject);
    } catch (error) {
      logger.error({ err: error, body: req.body }, "Error in get-movie");
      res.status(500).send({
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  server.post("/jellyfin/scan-library", async (req, res) => {
    try {
      await jellyfinService.scanLibrary();
      res.status(200).send({ message: "Library scan started." });
    } catch (error) {
      logger.error({ err: error, body: req.body }, "Error in get-movie");
      res.status(500).send({
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });
};
