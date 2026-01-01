import { addMovie } from "./add-movie";
import { getMovies } from "./get-movies";
import { getRootFolder } from "./get-root-folder";
import { manualImport } from "./manual-import";
import { searchMovie } from "./search-movie";

export const radarrService = {
  getMovies,
  searchMovie,
  addMovie,
  manualImport,
  getRootFolder,
};
