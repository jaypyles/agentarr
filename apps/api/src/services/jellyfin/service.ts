import { searchForMovie } from "./get-movie";
import { searchForSeries } from "./get-series";
import { scanLibrary } from "./scan-library";

export const jellyfinService = {
  searchForSeries,
  searchForMovie,
  scanLibrary,
};
