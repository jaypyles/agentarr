import { sonarrApi } from "@/api";
import { SonarrAddOptions, SonarrSeries } from "@repo/global-types";

export const addSeries = async (
  series: SonarrSeries,
  options?: SonarrAddOptions
) => {
  const response = await sonarrApi.post("/series", {
    title: series.title,
    tvdbId: series.tvdbId,
    year: series.year,
    seriesType: series.seriesType,
    monitored: series.monitored ?? false,
    seasonFolder: series.seasonFolder ?? true,
    qualityProfileId: 1,
    rootFolderPath: series.rootFolderPath ?? "/tv",
    seasons: series.seasons?.map((season) => ({
      seasonNumber: season.seasonNumber,
      monitored: season.monitored ?? false,
    })),
    addOptions: options ?? {
      monitor: "all",
      searchForMissingEpisodes: false,
      searchForCutoffUnmetEpisodes: false,
    },
  });
  return response.data;
};
