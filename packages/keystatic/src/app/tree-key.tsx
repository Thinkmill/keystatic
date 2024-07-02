import { assertNever } from 'emery';

import { ComponentSchema } from '..';
import { fixPath, FormatInfo, getDataFileExtension } from './path-utils';
import { getTreeNodeAtPath, TreeNode } from './trees';

function collectDirectoriesUsedInSchemaInner(
  schema: ComponentSchema,
  directories: Set<string>,
  seenSchemas: Set<ComponentSchema>
): void {
  if (seenSchemas.has(schema)) {
    return;
  }
  seenSchemas.add(schema);
  if (schema.kind === 'array') {
    return collectDirectoriesUsedInSchemaInner(
      schema.element,
      directories,
      seenSchemas
    );
  }
  if (schema.kind === 'child') {
    return;
  }
  if (schema.kind === 'form') {
    if (schema.formKind === 'asset' && schema.directory !== undefined) {
      directories.add(fixPath(schema.directory));
    }
    if (
      (schema.formKind === 'content' || schema.formKind === 'assets') &&
      schema.directories !== undefined
    ) {
      for (const directory of schema.directories) {
        directories.add(fixPath(directory));
      }
    }
    return;
  }
  if (schema.kind === 'object') {
    for (const field of Object.values(schema.fields)) {
      collectDirectoriesUsedInSchemaInner(field, directories, seenSchemas);
    }
    return;
  }
  if (schema.kind === 'conditional') {
    for (const innerSchema of Object.values(schema.values)) {
      collectDirectoriesUsedInSchemaInner(
        innerSchema,
        directories,
        seenSchemas
      );
    }
    return;
  }
  assertNever(schema);
}

export function collectDirectoriesUsedInSchema(
  schema: ComponentSchema
): Set<string> {
  const directories = new Set<string>();
  collectDirectoriesUsedInSchemaInner(schema, directories, new Set());
  return directories;
}

export function getDirectoriesForTreeKey(
  schema: ComponentSchema,
  directory: string,
  slug: string | undefined,
  format: FormatInfo
) {
  const directories = [fixPath(directory)];
  if (format.dataLocation === 'outer') {
    directories.push(fixPath(directory) + getDataFileExtension(format));
  }
  const toAdd = slug === undefined ? '' : `/${slug}`;
  for (const directory of collectDirectoriesUsedInSchema(schema)) {
    directories.push(directory + toAdd);
  }
  return directories;
}

export function getTreeKey(directories: string[], tree: Map<string, TreeNode>) {
  return directories.map(d => getTreeNodeAtPath(tree, d)?.entry.sha).join('-');
}
