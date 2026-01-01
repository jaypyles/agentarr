import fs from "fs/promises";

export const moveFile = async (sourcePath: string, destinationPath: string) => {
  try {
    await fs.rename(sourcePath, destinationPath);
  } catch (error) {
    console.error(
      `Failed to move file ${sourcePath} to ${destinationPath}:`,
      error
    );
    throw error;
  }
};
