import { clearTorrents } from "@/services/qbittorrent/clear-torrents";
import { logger } from "@repo/logger";
import { FastifyInstance } from "fastify";
import { getTorrentList } from "../services/qbittorrent/get-torrent-list";
import { getTransferInfo } from "../services/qbittorrent/get-transfer-info";

export const downloadRoutes = (server: FastifyInstance) => {
  server.get("/download/list", async (req, res) => {
    const torrents = await getTorrentList();
    res.status(200).send(torrents);
  });

  server.get("/download/torrents", async (req, res) => {
    const transferInfo = await getTransferInfo();
    res.status(200).send(transferInfo);
  });

  server.delete("/download/torrents", async (req, res) => {
    try {
      await clearTorrents();
      res.status(200).send({ success: true });
    } catch (err: any) {
      logger.error(err);
      const message = err?.message ?? "Failed to clear torrents";
      res.status(500).send({ success: false, message });
    }
  });
};
