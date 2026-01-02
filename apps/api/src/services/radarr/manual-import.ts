import { radarrApi } from "@/api";

export interface ManualImportCommand {
  name?: string;
  files?: File[];
  importMode?: string;
}

export interface File {
  path: string;
  folderName: string;
  movieId: number;
  releaseGroup: string;
  quality: Quality;
  languages: Language[];
  indexerFlags: number;
  episodeIds: number[];
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

export interface Language {
  id: number;
  name: string;
}

export const manualImport = async (command: ManualImportCommand) => {
  const defaultLanguages = [{ id: 0, name: "Unknown" }];
  const defaultQuality = {
    quality: {
      id: 0,
      name: "Unknown",
      modifier: "none",
      resolution: 0,
      source: "unknown",
    },
    revision: { version: 1, real: 0, isRepack: false },
  };

  const files = command.files?.map((file) => ({
    folderName: file.folderName,
    movieId: file.movieId,
    path: file.path,
    indexerFlags: file.indexerFlags ?? 0,
    releaseGroup: file.releaseGroup ?? "",
    quality: file.quality ?? defaultQuality,
    languages: file.languages ?? defaultLanguages,
  }));

  const response = await radarrApi.post("/command", {
    name: command.name ?? "ManualImport",
    importMode: command.importMode ?? "auto",
    files,
  });

  return response.data;
};
