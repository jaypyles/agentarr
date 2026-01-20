import { TransferInfo } from "qbittorrent-api-v2";
import { withClient } from "./client";

export const getTransferInfo = async (): Promise<TransferInfo> => {
  return withClient(async (client) => {
    const transferInfo = await client.transferInfo();
    return transferInfo;
  });
};
