import fs from "fs/promises";
import path from "path";

export async function moveFile(src: string, dest: string) {
  await fs.mkdir(path.dirname(dest), { recursive: true });

  try {
    await fs.rename(src, dest);
  } catch (err: any) {
    if (err.code !== "EXDEV") throw err;

    await fs.cp(src, dest, { recursive: true });
    await fs.rm(src, { recursive: true, force: true });
  }
}
