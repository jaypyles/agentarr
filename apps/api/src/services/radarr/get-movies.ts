import { radarrApi } from "@/api";

export const getMovies = async () => {
  const response = await radarrApi.get(`/movie`);
  return response.data;
};