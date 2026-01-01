import fs from "fs/promises";
import path from "path";

export const listFiles = async (dirPath: string) => {
  const files = await fs.readdir(dirPath, {
    withFileTypes: true,
  });
  return files.map((file) => {
    const fullPath = path.join(dirPath, file.name);
    return {
      name: file.name,
      path: fullPath,
      isDirectory: file.isDirectory(),
      isFile: file.isFile(),
    };
  });
};
