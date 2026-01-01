import fs from "fs/promises";

export const createDirectory = async (path: string) => {
  try {
    await fs.mkdir(path, { recursive: true });
  } catch (error) {
    console.error(`Failed to create directory ${path}:`, error);
    throw error;
  }

  await fs.mkdir(path, { recursive: true });
};
