import fs from "fs/promises";
import path from "path";

export async function moveFile(src: string, destDir: string) {
  const dest = path.join(destDir, path.basename(src));

  await fs.mkdir(destDir, { recursive: true });

  try {
    await fs.rename(src, dest);
  } catch (err: any) {
    if (err.code !== "EXDEV") throw err;

    await fs.cp(src, dest);
    await fs.rm(src);
  }
}
