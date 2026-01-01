import { radarrApi } from "@/api";

export const searchMovie = async (query: string) => {
  const response = await radarrApi.get(`/movie/lookup`, {
    params: {
      term: query,
    },
  });
  return response.data;
};
