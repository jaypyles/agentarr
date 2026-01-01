import { radarrApi } from "@/api";
import { Movie, MovieAddOptions } from "@repo/global-types";

export const addMovie = async (movie: Movie, addOptions?: MovieAddOptions) => {
  const response = await radarrApi.post(`/movie`, {
    title: movie.title,
    tmdbId: movie.tmdbId,
    qualityProfileId: 1,
    rootFolderPath: movie.rootFolderPath ?? "/movies",
    monitored: movie.monitored ?? false,
    addOptions: addOptions ?? {
      monitor: "movieOnly",
      searchForMovie: false,
    },
  });

  return response.data;
};
