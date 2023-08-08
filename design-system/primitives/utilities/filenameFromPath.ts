/**
 * Get the file name from a path.
 * @example
 * filenameFromPath('path/to/filename.ts') // 'filename'
 */
export function filenameFromPath(path: string) {
  const lastSlash = path.lastIndexOf('/');
  return path.substring(lastSlash + 1, path.lastIndexOf('.'));
}
