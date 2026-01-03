import { Movie, SonarrSeries } from "@repo/global-types";
import { logger } from "@repo/logger";
import { FastifyInstance } from "fastify";
import { jellyfinService } from "../services/jellyfin/service";

export const jellyfinRoutes = async (server: FastifyInstance) => {
  server.post("/jellyfin/get-series", async (req, res) => {
    const {
      series: { title, alternateTitles },
    } = req.body as { series: Pick<SonarrSeries, "title" | "alternateTitles"> };

    const series = await jellyfinService.getSeries(
      title ?? "",
      alternateTitles?.map((alt) => alt.title ?? "") ?? []
    );

    if (!series) {
      return res.status(404).send({ error: "Series not found" });
    }

    res.header("Cache-Control", "max-age=120, public");
    res.status(200).send(series);
  });

  server.post("/jellyfin/get-movie", async (req, res) => {
    try {
      const {
        series: { title, alternateTitles },
      } = req.body as { series: Pick<Movie, "title" | "alternateTitles"> };

      const movie = await jellyfinService.getMovie(
        title ?? "",
        alternateTitles?.map((alt) => alt?.title ?? "") ?? []
      );

      if (!movie) {
        return res.status(404).send({ error: "Movie not found" });
      }

      res.header("Cache-Control", "max-age=120, public");
      res.status(200).send(movie);
    } catch (error) {
      logger.error({ err: error, body: req.body }, "Error in get-movie");
      res.status(500).send({
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });
};
