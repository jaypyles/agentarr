import { jellyfinApi } from "@/api";
import {
  JellyfinItem,
  JellyfinItemsResponse,
  SonarrSeries,
} from "@repo/global-types";

const tryGetSeries = async (searchTerm: string) => {
  const response = await jellyfinApi.get<JellyfinItemsResponse>("/Items", {
    params: {
      SearchTerm: searchTerm,
      IncludeItemTypes: "Series",
      HasTvdbId: true,
      Recursive: true,
    },
  });

  if (response.data.Items.length === 0) {
    return null;
  }

  return response.data.Items[0];
};

const getSeries = async (searchTerm: string, alternateTitles: string[]) => {
  let series = null;
  series = await tryGetSeries(searchTerm);

  if (!series) {
    for (const alternateTitle of alternateTitles) {
      series = await tryGetSeries(alternateTitle);
      if (series) {
        break;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  if (!series) {
    return null;
  }

  return series;
};

export const searchForSeries = async (
  seriesList: Pick<SonarrSeries, "title" | "alternateTitles">[]
) => {
  const seriesMap = new Map<string, JellyfinItem>();

  for (const s of seriesList) {
    const series = await getSeries(
      s.title ?? "",
      s.alternateTitles?.map((alt) => alt.title ?? "") ?? []
    );

    if (series) {
      seriesMap.set(s.title ?? "", series);
    }
  }

  return seriesMap;
};
