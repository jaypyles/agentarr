import { sonarrApi } from "@/api";
import { SonarrEpisode } from "@repo/global-types";

export const getEpisodesForSeries = async (
  seriesId: number
): Promise<SonarrEpisode[]> => {
  const response = await sonarrApi.get(
    `/episode?seriesId=${seriesId}&sortKey=airDate&sortDirection=descending`
  );

  return response.data;
};
