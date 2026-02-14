import { prowlarrApi } from "@/api";

export const download = async (guid: string, indexerId: number) => {
  if (!guid) {
    throw new Error("GUID is required");
  }

  const cleanGuid = guid.trim().replace(/\r?\n/g, "").replace(/\s+/g, "");

  try {
    const response = await prowlarrApi.post("/search", {
      guid: cleanGuid,
      indexerId,
    });

    return response.data;
  } catch (error: any) {
    console.error("Prowlarr grab failed:", {
      status: error?.response?.status,
      data: error?.response?.data,
    });
    throw error;
  }
};
