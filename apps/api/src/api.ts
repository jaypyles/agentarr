import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const sonarrApi = axios.create({
  baseURL: `${process.env.SONARR_URL}/api/v3`,
  headers: {
    "X-Api-Key": process.env.SONARR_API_KEY || "",
  },
});

export const prowlarrApi = axios.create({
  baseURL: `${process.env.PROWLARR_URL}/api/v1`,
  headers: {
    "X-Api-Key": process.env.PROWLARR_API_KEY || "",
  },
});

export const radarrApi = axios.create({
  baseURL: process.env.RADARR_URL || "",
  headers: {
    "X-Api-Key": process.env.RADARR_API_KEY || "",
  },
});
