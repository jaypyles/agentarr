import { SonarrEpisode } from "@repo/global-types";

export interface MapFileToEpisodeIdsResult {
  seasonNumber: number;
  episodeNumber: number;
  episodeId: number | undefined;
}

export const mapFileToEpisodeIds = async (
  fileName: string,
  episodes: SonarrEpisode[]
): Promise<MapFileToEpisodeIdsResult | undefined> => {
  // Regex Sd+Ed+
  const seasonNumber = fileName.match(/S(\d+)/)?.[1];
  const episodeNumber = fileName.match(/E(\d+)/)?.[1];

  if (!seasonNumber || !episodeNumber) {
    return;
  }

  const episode = episodes.find(
    (episode) =>
      episode.seasonNumber === parseInt(seasonNumber) &&
      episode.episodeNumber === parseInt(episodeNumber)
  );

  return {
    seasonNumber: parseInt(seasonNumber),
    episodeNumber: parseInt(episodeNumber),
    episodeId: episode?.id,
  };
};
