export type MovieResponse = Movie[];

export interface Movie {
  id: number;
  title: string;
  originalTitle: string;
  originalLanguage: OriginalLanguage;
  alternateTitles: AlternateTitle[];
  secondaryYear: number;
  secondaryYearSourceId: number;
  sortTitle: string;
  sizeOnDisk: number;
  status: string;
  overview: string;
  inCinemas: string;
  physicalRelease: string;
  digitalRelease: string;
  releaseDate: string;
  physicalReleaseNote: string;
  images: Image[];
  website: string;
  remotePoster: string;
  year: number;
  youTubeTrailerId: string;
  studio: string;
  path: string;
  qualityProfileId: number;
  hasFile: boolean;
  movieFileId: number;
  monitored: boolean;
  minimumAvailability: string;
  isAvailable: boolean;
  folderName: string;
  runtime: number;
  cleanTitle: string;
  imdbId: string;
  tmdbId: number;
  titleSlug: string;
  rootFolderPath: string;
  folder: string;
  certification: string;
  genres: string[];
  keywords: string[];
  tags: number[];
  added: string;
  addOptions: MovieAddOptions;
  ratings: Ratings;
  movieFile: MovieFile;
  collection: Collection;
  popularity: number;
  lastSearchTime: string;
  statistics: Statistics;
}

export interface OriginalLanguage {
  id: number;
  name: string;
}

export interface AlternateTitle {
  id: number;
  sourceType: string;
  movieMetadataId: number;
  title: string;
  cleanTitle: string;
}

export interface Image {
  coverType: string;
  url: string;
  remoteUrl: string;
}

export interface MovieAddOptions {
  ignoreEpisodesWithFiles: boolean;
  ignoreEpisodesWithoutFiles: boolean;
  monitor: string;
  searchForMovie: boolean;
  addMethod: string;
}

export interface Ratings {
  imdb: Imdb;
  tmdb: Tmdb;
  metacritic: Metacritic;
  rottenTomatoes: RottenTomatoes;
  trakt: Trakt;
}

export interface Imdb {
  votes: number;
  value: number;
  type: string;
}

export interface Tmdb {
  votes: number;
  value: number;
  type: string;
}

export interface Metacritic {
  votes: number;
  value: number;
  type: string;
}

export interface RottenTomatoes {
  votes: number;
  value: number;
  type: string;
}

export interface Trakt {
  votes: number;
  value: number;
  type: string;
}

export interface MovieFile {
  id: number;
  movieId: number;
  relativePath: string;
  path: string;
  size: number;
  dateAdded: string;
  sceneName: string;
  releaseGroup: string;
  edition: string;
  languages: Language[];
  quality: Quality;
  customFormats: CustomFormat[];
  customFormatScore: number;
  indexerFlags: number;
  mediaInfo: MediaInfo;
  originalFilePath: string;
  qualityCutoffNotMet: boolean;
}

export interface Language {
  id: number;
  name: string;
}

export interface Quality {
  quality: Quality2;
  revision: Revision;
}

export interface Quality2 {
  id: number;
  name: string;
  source: string;
  resolution: number;
  modifier: string;
}

export interface Revision {
  version: number;
  real: number;
  isRepack: boolean;
}

export interface CustomFormat {
  id: number;
  name: string;
  includeCustomFormatWhenRenaming: boolean;
  specifications: Specification[];
}

export interface Specification {
  id: number;
  name: string;
  implementation: string;
  implementationName: string;
  infoLink: string;
  negate: boolean;
  required: boolean;
  fields: Field[];
  presets: string[];
}

export interface Field {
  order: number;
  name: string;
  label: string;
  unit: string;
  helpText: string;
  helpTextWarning: string;
  helpLink: string;
  value: string;
  type: string;
  advanced: boolean;
  selectOptions: SelectOption[];
  selectOptionsProviderAction: string;
  section: string;
  hidden: string;
  privacy: string;
  placeholder: string;
  isFloat: boolean;
}

export interface SelectOption {
  value: number;
  name: string;
  order: number;
  hint: string;
  dividerAfter: boolean;
}

export interface MediaInfo {
  id: number;
  audioBitrate: number;
  audioChannels: number;
  audioCodec: string;
  audioLanguages: string;
  audioStreamCount: number;
  videoBitDepth: number;
  videoBitrate: number;
  videoCodec: string;
  videoFps: number;
  videoDynamicRange: string;
  videoDynamicRangeType: string;
  resolution: string;
  runTime: string;
  scanType: string;
  subtitles: string;
}

export interface Collection {
  title: string;
  tmdbId: number;
}

export interface Statistics {
  movieFileCount: number;
  sizeOnDisk: number;
  releaseGroups: string[];
}
