import { Descendant } from 'slate';
import { fixPath } from '../../../../../app/path-utils';
import { DocumentFeatures } from '../document-features';
import { ComponentBlock, ComponentSchema } from '../../../../api';
import { transformProps } from '../../../../props-value';
import { object } from '../../../object';
import { getSrcPrefix } from '../../../image/getSrcPrefix';

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
      const schema = object(componentBlock.schema);
      return {
        ...node,
        props: deserializeProps(
          schema,
          node.props,
          files,
          otherFiles,
          mode,
          slug
        ) as Record<string, any>,
      };
    }
    if (
      node.type === 'image' &&
      typeof node.src === 'string' &&
      mode === 'edit'
    ) {
      const prefix = getSrcPrefixForImageBlock(documentFeatures, slug);
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
  mode: 'read' | 'edit',
  slug: string | undefined
) {
  return transformProps(schema, value, {
    form: (schema, value) => {
      if (schema.formKind === 'asset') {
        if (mode === 'read') {
          return schema.reader.parse(value);
        }
        const filename = schema.filename(value, {
          slug,
          suggestedFilenamePrefix: undefined,
        });
        return schema.parse(value, {
          asset: filename
            ? schema.directory
              ? otherFiles.get(schema.directory)?.get(filename)
              : files.get(filename)
            : undefined,
          slug,
        });
      }

      if (schema.formKind === 'content' || schema.formKind === 'assets') {
        throw new Error('Not implemented');
      }
      if (mode === 'read') {
        return schema.reader.parse(value);
      }
      return schema.parse(value, undefined);
    },
  });
}

export function getSrcPrefixForImageBlock(
  documentFeatures: DocumentFeatures,
  slug: string | undefined
) {
  return getSrcPrefix(
    typeof documentFeatures.images === 'object'
      ? documentFeatures.images.publicPath
      : undefined,
    slug
  );
}
