import { radarrApi } from "@/api";

export const getRootFolder = async () => {
  const response = await radarrApi.get(`/rootfolder`);
  return response.data;
};