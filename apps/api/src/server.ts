import cors from "@fastify/cors";
import { Apps } from "@repo/global-types";
import { logger } from "@repo/logger";
import fastify from "fastify";
import { FastifySSEPlugin } from "fastify-sse-v2";
import { addRoutes } from "./routes/add-routes";

async function start() {
  const server = fastify();

  await server.register(cors, {
    origin: "*",
  });

  await server.register(FastifySSEPlugin);

  await addRoutes(server);

  server.get("/health", async (req, res) => {
    res.status(200).send({ message: "OK" });
  });

  server.get("/apps", async (req, res) => {
    const apps: Apps = {
      sonarr: process.env.SONARR_URL ?? "",
      radarr: process.env.RADARR_URL ?? "",
      prowlarr: process.env.PROWLARR_URL ?? "",
      jellyfin: process.env.JELLYFIN_URL ?? "",
      qbittorrent: process.env.QB_URL ?? "",
    };

    res.status(200).send(apps);
  });

  server.addHook("onResponse", (req, res, done) => {
    const { method, url } = req;
    logger.info(`[${res.statusCode}] - ${method} ${url}`);

    done();
  });

  await server.listen({ port: 3000, host: "0.0.0.0" });
  logger.info(`Server is running on http://0.0.0.0:3000`);
}

process.on("uncaughtException", (err) => {
  logger.error({ err }, "Uncaught Exception");
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error({ err: reason }, "Unhandled Rejection");
  process.exit(1);
});

process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", async () => {
  logger.info("SIGINT received, shutting down gracefully");
  process.exit(0);
});

start().catch((err) => {
  logger.error({ err }, "Failed to start server");
  process.exit(1);
});
