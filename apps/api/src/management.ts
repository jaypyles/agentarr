import type { FastifyInstance } from "fastify";
import { listFiles } from "./files/list-files";
import { mounts } from "./mounts";

export const managementRoutes = (fastify: FastifyInstance) => {
  fastify.get("/management/mounts", async (req, res) => {
    res.status(200).send(mounts);
  });

  fastify.get("/management/files", async (req, res) => {
    const { path } = req.query as { path: string };
    const files = await listFiles(path);
    res.status(200).send(files);
  });
};
