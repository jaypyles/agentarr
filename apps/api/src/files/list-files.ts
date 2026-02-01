import fs from "fs/promises";
import path from "path";

type FileEntry = {
  name: string;
  path: string;
  isDirectory: boolean;
  isFile: boolean;
  children?: FileEntry[];
};

export const listFiles = async (
  dirPath: string,
  recursive: boolean = false
): Promise<FileEntry[]> => {
  const files = await fs.readdir(dirPath, {
    withFileTypes: true,
  });

  const entries: FileEntry[] = await Promise.all(
    files.map(async (file) => {
      const fullPath = path.join(dirPath, file.name);
      const entry: FileEntry = {
        name: file.name,
        path: fullPath,
        isDirectory: file.isDirectory(),
        isFile: file.isFile(),
      };

      if (file.isDirectory() && recursive) {
        const children = await fs.readdir(fullPath, { withFileTypes: true });
        entry.children = children.map((child) => ({
          name: child.name,
          path: path.join(fullPath, child.name),
          isDirectory: child.isDirectory(),
          isFile: child.isFile(),
        }));
      }

      return entry;
    })
  );

  return entries;
};
