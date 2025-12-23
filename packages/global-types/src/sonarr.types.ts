export type SonarrSeries = {
  id?: number;
  title?: string | null;
  alternateTitles?:
    | {
        title?: string | null;
        seasonNumber?: number | null;
        sceneSeasonNumber?: number | null;
        sceneOrigin?: string | null;
        comment?: string | null;
      }[]
    | null;
  sortTitle?: string | null;
  status?: "continuing" | "ended" | "upcoming" | "deleted";
  ended?: boolean;
  profileName?: string | null;
  overview?: string | null;
  nextAiring?: string | null;
  previousAiring?: string | null;
  network?: string | null;
  airTime?: string | null;
  images?:
    | {
        coverType?:
          | "unknown"
          | "poster"
          | "banner"
          | "fanart"
          | "screenshot"
          | "headshot"
          | "clearlogo";
        url?: string | null;
        remoteUrl?: string | null;
      }[]
    | null;
  originalLanguage?: {
    id?: number;
    name?: string | null;
  };
  remotePoster?: string | null;
  seasons?:
    | {
        seasonNumber?: number;
        monitored?: boolean;
        statistics?: {
          nextAiring?: string | null;
          previousAiring?: string | null;
          episodeFileCount?: number;
          episodeCount?: number;
          totalEpisodeCount?: number;
          sizeOnDisk?: number;
          releaseGroups?: string[] | null;
          percentOfEpisodes?: number;
        };
        images?:
          | {
              coverType?:
                | "unknown"
                | "poster"
                | "banner"
                | "fanart"
                | "screenshot"
                | "headshot"
                | "clearlogo";
              url?: string | null;
              remoteUrl?: string | null;
            }[]
          | null;
      }[]
    | null;
  year?: number;
  path?: string | null;
  qualityProfileId?: number;
  seasonFolder?: boolean;
  monitored?: boolean;
  monitorNewItems?: "all" | "none";
  useSceneNumbering?: boolean;
  runtime?: number;
  tvdbId?: number;
  tvRageId?: number;
  tvMazeId?: number;
  tmdbId?: number;
  firstAired?: string | null;
  lastAired?: string | null;
  seriesType?: "standard" | "daily" | "anime";
  cleanTitle?: string | null;
  imdbId?: string | null;
  titleSlug?: string | null;
  rootFolderPath?: string | null;
  folder?: string | null;
  certification?: string | null;
  genres?: string[] | null;
  tags?: number[] | null;
  added?: string;
  addOptions?: {
    ignoreEpisodesWithFiles?: boolean;
    ignoreEpisodesWithoutFiles?: boolean;
    monitor?:
      | "unknown"
      | "all"
      | "future"
      | "missing"
      | "existing"
      | "firstSeason"
      | "lastSeason"
      | "latestSeason"
      | "pilot"
      | "recent"
      | "monitorSpecials"
      | "unmonitorSpecials"
      | "none"
      | "skip";
    searchForMissingEpisodes?: boolean;
    searchForCutoffUnmetEpisodes?: boolean;
  };
  ratings?: {
    votes?: number;
    value?: number;
  };
  statistics?: {
    seasonCount?: number;
    episodeFileCount?: number;
    episodeCount?: number;
    totalEpisodeCount?: number;
    sizeOnDisk?: number;
    releaseGroups?: string[] | null;
    percentOfEpisodes?: number;
  };
  episodesChanged?: boolean | null;
  languageProfileId?: number;
};

export type SonarrAddOptions = {
  ignoreEpisodesWithFiles?: boolean;
  ignoreEpisodesWithoutFiles?: boolean;
  monitor?: "all" | "none";
  searchForMissingEpisodes?: boolean;
  searchForCutoffUnmetEpisodes?: boolean;
};
