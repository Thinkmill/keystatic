import { Descendant } from 'slate';
import { sha1 } from '../../app/utils';
import { ComponentBlock, fields, ComponentSchema } from './api';

export type CollectedFile = { data: Uint8Array; filename: string };

export async function collectFiles(
  nodes: Descendant[],
  componentBlocks: Record<string, ComponentBlock>,
  collectedFiles: CollectedFile[]
): Promise<Descendant[]> {
  return Promise.all(
    nodes.map(async (node): Promise<Descendant> => {
      if (node.type === 'component-block') {
        const componentBlock = componentBlocks[node.component];
        if (!componentBlock) return node;
        const schema = fields.object(componentBlock.schema);
        return {
          ...node,
          props: (await transformProps(schema, node.props, collectedFiles)) as Record<string, any>,
        };
      }
      if (typeof node.type === 'string') {
        const children = await collectFiles(node.children, componentBlocks, collectedFiles);
        return { ...node, children };
      }
      return node;
    })
  );
}

async function transformProps(
  schema: ComponentSchema,
  value: unknown,
  collectedFiles: CollectedFile[]
): Promise<unknown> {
  if (schema.kind === 'child' || schema.kind === 'relationship') {
    return value;
  }
  if (schema.kind === 'form') {
    if ('serializeToFile' in schema && schema.serializeToFile) {
      if (schema.serializeToFile.kind === 'asset') {
        const {
          content,
          value: forYaml,
          suggestedFilename,
        } = schema.serializeToFile.serialize(value);
        let filename;
        if (content) {
          const extension = schema.serializeToFile.extension(forYaml);
          if (suggestedFilename) {
            filename = suggestedFilename;
          } else {
            const sha = await sha1(content);
            filename = sha + extension;
          }
          collectedFiles.push({
            data: content,
            filename,
          });
        }
        return { filename, value: forYaml };
      }
      throw new Error('not implemented');
    }
    return value;
  }
  if (schema.kind === 'object') {
    return Object.fromEntries(
      await Promise.all(
        Object.entries(schema.fields).map(async ([key, val]) => [
          key,
          await transformProps(val, (value as any)[key], collectedFiles),
        ])
      )
    );
  }
  if (schema.kind === 'array') {
    return Promise.all(
      (value as unknown[]).map(val => transformProps(schema.element, val, collectedFiles))
    );
  }
  if (schema.kind === 'conditional') {
    return {
      discriminant: (value as any).discriminant,
      value: await transformProps(
        schema.values[(value as any).discriminant],
        (value as any).value,
        collectedFiles
      ),
    };
  }
}

export function deserializeFiles(
  nodes: Descendant[],
  componentBlocks: Record<string, ComponentBlock>,
  files: Record<string, Uint8Array>
): Descendant[] {
  return nodes.map((node): Descendant => {
    if (node.type === 'component-block') {
      const componentBlock = componentBlocks[node.component];
      if (!componentBlock) return node;
      const schema = fields.object(componentBlock.schema);
      return {
        ...node,
        props: deserializeProps(schema, node.props, files) as Record<string, any>,
      };
    }
    if (typeof node.type === 'string') {
      const children = deserializeFiles(node.children, componentBlocks, files);
      return { ...node, children };
    }
    return node;
  });
}

function deserializeProps(
  schema: ComponentSchema,
  value: unknown,
  files: Record<string, Uint8Array>
): unknown {
  if (schema.kind === 'child' || schema.kind === 'relationship') {
    return value;
  }
  if (schema.kind === 'form') {
    if ('serializeToFile' in schema && schema.serializeToFile) {
      if (schema.serializeToFile.kind === 'asset') {
        return schema.serializeToFile.parse({
          value: (value as any).value,
          content: files[(value as any).filename],
        });
      }
      throw new Error('not implemented');
    }
    return value;
  }
  if (schema.kind === 'object') {
    return Object.fromEntries(
      Object.entries(schema.fields).map(([key, val]) => [
        key,
        deserializeProps(val, (value as any)[key], files),
      ])
    );
  }
  if (schema.kind === 'array') {
    return (value as unknown[]).map(val => deserializeProps(schema.element, val, files));
  }
  if (schema.kind === 'conditional') {
    return {
      discriminant: (value as any).discriminant,
      value: deserializeProps(
        schema.values[(value as any).discriminant],
        (value as any).value,
        files
      ),
    };
  }
}
