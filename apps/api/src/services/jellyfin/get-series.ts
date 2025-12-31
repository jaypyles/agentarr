import { jellyfinApi } from "@/api";
import { JellyfinItemsResponse } from "@repo/global-types";

export const getSeries = async (searchTerm: string) => {
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
