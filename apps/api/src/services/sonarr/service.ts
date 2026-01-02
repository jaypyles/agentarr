import { addSeries } from "./add-series";
import { getEpisodesForSeries } from "./get-episodes-for-series";
import { getSeries } from "./get-series";
import { lookup } from "./lookup";
import { manualImport } from "./manual-import";
import { mapFileToEpisodeIds } from "./map-file-to-episode-ids";
import { getRootFolder } from "./root-folder";

export const sonarrService = {
  lookup,
  addSeries,
  getSeries,
  getRootFolder,
  getEpisodesForSeries,
  mapFileToEpisodeIds,
  manualImport,
};
