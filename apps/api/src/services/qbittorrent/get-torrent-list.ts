import { Torrent } from "qbittorrent-api-v2";
import { withClient } from "./client";

export const getTorrentList = async (): Promise<Torrent[]> => {
  return withClient(async (client) => {
    const torrents = await client.torrents();
    return torrents;
  });
};
