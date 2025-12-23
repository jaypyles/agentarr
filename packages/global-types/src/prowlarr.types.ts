export interface ProwlarrSearchResult {
  guid: string;
  age: number;
  ageHours: number;
  ageMinutes: number;
  size: number;
  indexerId: number;
  indexer: string;
  title: string;
  sortTitle: string;
  imdbId: number;
  tmdbId: number;
  tvdbId: number;
  tvMazeId: number;
  publishDate: string;
  downloadUrl: string;
  infoUrl: string;
  indexerFlags: string[];
  categories: {
    id: number;
    name: string;
    subCategories: {
      id: number;
      name: string;
    }[];
  }[];
  seeders: number;
  leechers: number;
  protocol: string;
  fileName: string;
  sizeBytes: number;
}
