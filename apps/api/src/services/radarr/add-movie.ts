import { radarrApi } from "@/api";
import { Movie, MovieAddOptions } from "@repo/global-types";

export const addMovie = async (movie: Movie, addOptions?: MovieAddOptions) => {
  const response = await radarrApi.post(`/movie`, {
    ...movie,
    addOptions: addOptions ?? {
      monitor: "movieOnly",
      searchForMovie: false,
    },
  });

  return response.data;
};
