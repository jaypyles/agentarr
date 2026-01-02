import { TransferInfo } from "qbittorrent-api-v2";
import getClient from "./client";

export const getTransferInfo = async (): Promise<TransferInfo> => {
  const client = await getClient();
  const transferInfo = await client.transferInfo();
  return transferInfo;
};
