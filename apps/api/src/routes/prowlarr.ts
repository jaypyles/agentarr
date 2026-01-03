import { prowlarrService } from "@/services/prowlarr";
import { FastifyInstance } from "fastify";

export const prowlarrRoutes = async (server: FastifyInstance) => {
  server.get("/prowlarr/search", async (req, res) => {
    const { query } = req.query as { query: string };
    const results = await prowlarrService.search(query);
    res.status(200).send(results);
  });
};
