/**
 * Flatten listFiles result so we include actual media file paths:
 * - Top-level files: their path
 * - Top-level directories: each child's path (one level deep)
 * This lets the agent see .mkv/.mp4 etc. inside release folders.
 */
export function flattenFilePaths(
  files: Awaited<any>
): { name: string; path: string }[] {
  const out: { name: string; path: string }[] = [];
  for (const file of files) {
    if (file.isFile) {
      out.push({ name: file.name, path: file.path });
    } else if (file.isDirectory && file.children?.length) {
      for (const child of file.children) {
        out.push({ name: child.name, path: child.path });
      }
    }
  }
  return out;
}
