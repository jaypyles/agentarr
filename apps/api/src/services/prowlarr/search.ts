import { prowlarrApi } from "@/api";
import { ProwlarrSearchResult } from "@repo/global-types";

export const search = async (
  query: string
): Promise<ProwlarrSearchResult[]> => {
  const response = await prowlarrApi.get(
    `/search?type=search&query=${query}&limit=100&offset=0`
  );
  return response.data;
};
