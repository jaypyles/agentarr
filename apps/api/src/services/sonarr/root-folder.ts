import { sonarrApi } from "@/api";

export const getRootFolder = async () => {
  const response = await sonarrApi.get(`/rootfolder`);
  return response.data;
};
