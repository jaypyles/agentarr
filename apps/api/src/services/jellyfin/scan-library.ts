import { jellyfinApi } from "@/api";

export const scanLibrary = async () => {
  const response = await jellyfinApi.post("/Library/Refresh");
  return response.data;
};
