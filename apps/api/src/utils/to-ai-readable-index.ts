import { ProwlarrSearchResult } from "@repo/global-types";

export const toAiReadableIndex = (
  index: ProwlarrSearchResult
): Partial<ProwlarrSearchResult> => {
  return {
    guid: index.guid,
    indexerId: index.indexerId,
    size: index.size,
    title: index.title,
    seeders: index.seeders,
    leechers: index.leechers,
  };
};
