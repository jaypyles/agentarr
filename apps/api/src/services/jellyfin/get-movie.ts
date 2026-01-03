import { jellyfinApi } from "@/api";
import {
  JellyfinItem,
  JellyfinItemsResponse,
  SonarrSeries,
} from "@repo/global-types";

const tryGetMovie = async (searchTerm: string) => {
  const response = await jellyfinApi.get<JellyfinItemsResponse>("/Items", {
    params: {
      SearchTerm: searchTerm,
      IncludeItemTypes: "Movie",
      Recursive: true,
    },
  });

  if (response.data.Items.length === 0) {
    return null;
  }

  return response.data.Items[0];
};

const getMovie = async (searchTerm: string, alternateTitles: string[]) => {
  let movie = null;
  movie = await tryGetMovie(searchTerm);

  if (!movie) {
    for (const alternateTitle of alternateTitles) {
      movie = await tryGetMovie(alternateTitle);
      if (movie) {
        break;
      }
    }
  }

  if (!movie) {
    return null;
  }

  return movie;
};

export const searchForMovie = async (
  movieList: Pick<SonarrSeries, "title" | "alternateTitles">[]
) => {
  const movieMap = new Map<string, JellyfinItem>();

  for (const m of movieList) {
    const movie = await getMovie(
      m.title ?? "",
      m.alternateTitles?.map((alt) => alt.title ?? "") ?? []
    );

    if (movie) {
      movieMap.set(m.title ?? "", movie);
    }
  }

  return movieMap;
};
