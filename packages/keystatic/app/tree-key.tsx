import { ComponentSchema } from '../src';
import { TreeEntry } from './trees';

export function getDirectoriesForTreeKey(
  schema: ComponentSchema,
  directory: string
) {
  return [directory];
}

export function getTreeKey(
  directories: string[],
  tree: Map<string, TreeEntry>
) {
  return directories.map(d => tree.get(d)?.sha).join('-');
}
