import { Torrent } from "qbittorrent-api-v2";
import getClient from "./client";

export const getTorrentList = async (): Promise<Torrent[]> => {
  const client = await getClient();
  const torrents = await client.torrents();
  return torrents;
};
