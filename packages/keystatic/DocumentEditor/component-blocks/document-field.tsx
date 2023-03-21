import { Descendant } from 'slate';
import { fixPath } from '../../app/path-utils';
import { DocumentFeatures } from '../document-features';
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
  collectedFiles: CollectedFile[],
  documentFeatures: DocumentFeatures,
  slug: string | undefined
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
    if (node.type === 'image') {
      collectedFiles.push({
        data: node.src.content,
        filename: node.src.filename,
        parent:
          typeof documentFeatures.images === 'object' &&
          typeof documentFeatures.images.directory === 'string'
            ? fixPath(documentFeatures.images.directory)
            : undefined,
      });
      return {
        type: 'image',
        src: `${getSrcPrefix(documentFeatures, slug)}${
          node.src.filename
        }` as any,
        alt: node.alt,
        title: node.title,
        children: [],
      };
    }
    if (typeof node.type === 'string') {
      const children = collectFiles(
        node.children,
        componentBlocks,
        collectedFiles,
        documentFeatures,
        slug
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

function getSrcPrefix(
  documentFeatures: DocumentFeatures,
  slug: string | undefined
) {
  return typeof documentFeatures.images === 'object' &&
    typeof documentFeatures.images.publicPath === 'string'
    ? `/${fixPath(documentFeatures.images.publicPath)}/${
        slug === undefined ? '' : slug + '/'
      }`
    : '';
}

export function deserializeFiles(
  nodes: Descendant[],
  componentBlocks: Record<string, ComponentBlock>,
  files: ReadonlyMap<string, Uint8Array>,
  otherFiles: ReadonlyMap<string, ReadonlyMap<string, Uint8Array>>,
  mode: 'read' | 'edit',
  documentFeatures: DocumentFeatures,
  slug: string | undefined
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
    if (
      node.type === 'image' &&
      typeof node.src === 'string' &&
      mode === 'edit'
    ) {
      const prefix = getSrcPrefix(documentFeatures, slug);
      const filename = (node.src as string).slice(prefix.length);
      const content = (
        typeof documentFeatures.images === 'object' &&
        typeof documentFeatures.images.directory === 'string'
          ? otherFiles.get(fixPath(documentFeatures.images.directory))
          : files
      )?.get(filename);
      if (!content) {
        return {
          type: 'paragraph',
          children: [{ text: `Missing image ${filename}` }],
        };
      }
      return {
        type: 'image',
        src: { filename, content },
        alt: node.alt,
        title: node.title,
        children: [{ text: '' }],
      };
    }
    if (typeof node.type === 'string') {
      const children = deserializeFiles(
        node.children,
        componentBlocks,
        files,
        otherFiles,
        mode,
        documentFeatures,
        slug
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
