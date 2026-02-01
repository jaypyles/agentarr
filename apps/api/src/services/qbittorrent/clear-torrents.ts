import { withClient } from "./client";

export const clearTorrents = async (): Promise<void> => {
  return withClient(async (client) => {
    await client.deleteTorrents("all", false);
  });
};
