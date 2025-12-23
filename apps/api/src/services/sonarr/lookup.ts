import { sonarrApi } from "@/api";
import { SonarrSeries } from "@repo/global-types";

export const lookup = async (query: string): Promise<SonarrSeries[]> => {
  const response = await sonarrApi.get(`/series/lookup?term=${query}`, {
    params: {
      query,
    },
  });

  return response.data;
};
