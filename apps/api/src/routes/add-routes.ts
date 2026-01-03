import { agentRoutes } from "@/routes/agent";
import { downloadRoutes } from "@/routes/download";
import { jellyfinRoutes } from "@/routes/jellyfin";
import { managementRoutes } from "@/routes/management";
import { prowlarrRoutes } from "@/routes/prowlarr";
import { radarrRoutes } from "@/routes/radarr";
import { sonarrRoutes } from "@/routes/sonarr";
import { FastifyInstance } from "fastify";

export const addRoutes = async (server: FastifyInstance) => {
  await agentRoutes(server);
  await jellyfinRoutes(server);
  await downloadRoutes(server);
  await managementRoutes(server);
  await sonarrRoutes(server);
  await radarrRoutes(server);
  await prowlarrRoutes(server);
};
