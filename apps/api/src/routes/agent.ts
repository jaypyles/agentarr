import { FastifyInstance } from "fastify";
import { AddMovieWorkflow } from "../workflows/add-movie/workflow";
import { AddSeriesWorkflow } from "../workflows/add-series/workflow";
import { MoveFilesWorkflow } from "../workflows/move-files/workflow";

export const agentRoutes = async (server: FastifyInstance) => {
  server.get("/agent/add-series", async (req, res) => {
    const { query, debug } = req.query as { query: string; debug: string };

    const workflow = new AddSeriesWorkflow(res, debug === "true");
    await workflow.run({ query });
  });

  server.get("/agent/add-movie", async (req, res) => {
    const { query, debug } = req.query as { query: string; debug: string };

    const workflow = new AddMovieWorkflow(res, debug === "true");
    await workflow.run({ query });
  });

  server.get("/agent/move-files", async (req, res) => {
    const { query, debug } = req.query as { query: string; debug: string };

    const workflow = new MoveFilesWorkflow(res, debug === "true");
    await workflow.run({ query });
  });
};
