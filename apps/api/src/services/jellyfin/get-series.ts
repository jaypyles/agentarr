import { jellyfinApi } from "@/api";
import { JellyfinItemsResponse } from "@repo/global-types";

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

export const getSeries = async (
  searchTerm: string,
  alternateTitles: string[]
) => {
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
