import { prowlarrApi } from "@/api";

export const download = async (guid: string, indexerId: number) => {
  const response = await prowlarrApi.post(`/search`, {
    guid,
    indexerId,
  });

  return response.data;
};
