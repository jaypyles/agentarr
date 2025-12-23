import { SonarrSeries } from "@repo/global-types";

export const toAiReadableSeries = (
  series: SonarrSeries
): Partial<SonarrSeries> => {
  return {
    title: series.title,
    overview: series.overview,
    year: series.year,
    status: series.status,
    ended: series.ended,
    tvdbId: series.tvdbId,
    imdbId: series.imdbId,
    images: series.images,
    firstAired: series.firstAired,
    lastAired: series.lastAired,
    certification: series.certification,
    genres: series.genres,
    statistics: series.statistics,
  };
};
