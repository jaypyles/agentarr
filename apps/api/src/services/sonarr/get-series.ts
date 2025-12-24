import { sonarrApi } from "@/api";
import { SonarrSeries } from "@repo/global-types";

export const getSeries = async (): Promise<SonarrSeries[]> => {
  const response = await sonarrApi.get(`/series`);
  return response.data;
};
