import { Descendant } from 'slate';
import { ComponentBlock, fields, ComponentSchema } from './api';
import { transformProps } from './utils';

export type CollectedFile = {
  data: Uint8Array;
  filename: string;
  parent: string | undefined;
};

export function collectFiles(
  nodes: Descendant[],
  componentBlocks: Record<string, ComponentBlock>,
  collectedFiles: CollectedFile[]
): Descendant[] {
  return nodes.map((node): Descendant => {
    if (node.type === 'component-block') {
      const componentBlock = componentBlocks[node.component];
      if (!componentBlock) return node;
      const schema = fields.object(componentBlock.schema);
      return {
        ...node,
        props: transformPropsToFiles(
          schema,
          node.props,
          collectedFiles
        ) as Record<string, any>,
      };
    }
    if (typeof node.type === 'string') {
      const children = collectFiles(
        node.children,
        componentBlocks,
        collectedFiles
      );
      return { ...node, children };
    }
    return node;
  });
}

function transformPropsToFiles(
  schema: ComponentSchema,
  value: unknown,
  collectedFiles: CollectedFile[]
): unknown {
  return transformProps(schema, value, {
    form(schema, value) {
      if ('serializeToFile' in schema && schema.serializeToFile) {
        if (schema.serializeToFile.kind === 'asset') {
          const { content, value: forYaml } = schema.serializeToFile.serialize(
            value,
            undefined
          );
          const filename = schema.serializeToFile.filename(forYaml, undefined);
          if (filename && content) {
            collectedFiles.push({
              data: content,
              filename,
              parent: schema.serializeToFile.directory,
            });
          }
          return forYaml;
        }
        throw new Error('not implemented');
      }
      return value;
    },
  });
}

export function deserializeFiles(
  nodes: Descendant[],
  componentBlocks: Record<string, ComponentBlock>,
  files: ReadonlyMap<string, Uint8Array>,
  otherFiles: ReadonlyMap<string, ReadonlyMap<string, Uint8Array>>,
  mode: 'read' | 'edit'
): Descendant[] {
  return nodes.map((node): Descendant => {
    if (node.type === 'component-block') {
      const componentBlock = componentBlocks[node.component];
      if (!componentBlock) return node;
      const schema = fields.object(componentBlock.schema);
      return {
        ...node,
        props: deserializeProps(
          schema,
          node.props,
          files,
          otherFiles,
          mode
        ) as Record<string, any>,
      };
    }
    if (typeof node.type === 'string') {
      const children = deserializeFiles(
        node.children,
        componentBlocks,
        files,
        otherFiles,
        mode
      );
      return { ...node, children };
    }
    return node;
  });
}

function deserializeProps(
  schema: ComponentSchema,
  value: unknown,
  files: ReadonlyMap<string, Uint8Array>,
  otherFiles: ReadonlyMap<string, ReadonlyMap<string, Uint8Array>>,
  mode: 'read' | 'edit'
) {
  return transformProps(schema, value, {
    form: (schema, value) => {
      if ('serializeToFile' in schema && schema.serializeToFile) {
        if (schema.serializeToFile.kind === 'asset') {
          if (
            !schema.serializeToFile.reader.requiresContentInReader &&
            mode === 'read'
          ) {
            return schema.serializeToFile.reader.parseToReader({
              value: value,
              suggestedFilenamePrefix: undefined,
            });
          }
          const filename = schema.serializeToFile.filename(value, undefined);
          return (
            mode === 'read' &&
              schema.serializeToFile.reader.requiresContentInReader
              ? schema.serializeToFile.reader.parseToReader
              : schema.serializeToFile.parse
          )({
            value: value,
            content: filename
              ? schema.serializeToFile.directory
                ? otherFiles
                    .get(schema.serializeToFile.directory)
                    ?.get(filename)
                : files.get(filename)
              : undefined,
            suggestedFilenamePrefix: undefined,
          });
        }
        throw new Error('not implemented');
      }
      return value;
    },
  });
}
