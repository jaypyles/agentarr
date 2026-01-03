import { radarrService } from "@/services/radarr/service";
import { FastifyInstance } from "fastify";

export const radarrRoutes = async (server: FastifyInstance) => {
  server.get("/radarr/get-movies", async (req, res) => {
    const movies = await radarrService.getMovies();
    res.status(200).send(movies);
  });
};
