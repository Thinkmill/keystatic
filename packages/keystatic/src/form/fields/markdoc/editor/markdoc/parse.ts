import { Node as MarkdocNode, ValidateError } from '@markdoc/markdoc';
import {
  Mark,
  MarkType,
  NodeType,
  Node as ProseMirrorNode,
} from 'prosemirror-model';
import { EditorSchema } from '../schema';
import { fromUint8Array } from 'js-base64';
import { ComponentSchema } from '../../../../api';
import { transformProps } from '../../../../props-value';

let state:
  | {
      schema: EditorSchema;
      errors: ValidateError[];
      marks: readonly Mark[];
      files: ReadonlyMap<string, Uint8Array>;
      otherFiles: ReadonlyMap<string, ReadonlyMap<string, Uint8Array>>;
      slug: string | undefined;
    }
  | undefined;
function getState(): typeof state & {} {
  if (!state) {
    throw new Error('state not set');
  }
  return state;
}

function getSchema() {
  return getState().schema;
}

function error(error: ValidateError) {
  getState().errors.push(error);
}

function withMark<T>(mark: Mark, fn: () => T): T {
  const state = getState();
  const oldMarks = state.marks;
  state.marks = mark.addToSet(state.marks);
  try {
    return fn();
  } finally {
    state.marks = oldMarks;
  }
}

function childrenToProseMirrorNodes(
  nodes: MarkdocNode[],
  parentType: NodeType | undefined
) {
  const children: ProseMirrorNode[] = [];
  for (const node of nodes) {
    const pmNode = markdocNodeToProseMirrorNode(node, parentType);
    if (pmNode) {
      if (Array.isArray(pmNode)) {
        children.push(...pmNode);
      } else {
        children.push(pmNode);
      }
    }
  }
  return children;
}

function notAllowed(node: MarkdocNode, parentType: NodeType | undefined) {
  error({
    error: {
      id: 'unspecified-type',
      level: 'critical',
      message: `${node.type} is not allowed`,
    },
    lines: node.lines,
    type: node.type,
    location: node.location,
  });
  return childrenToProseMirrorNodes(node.children, parentType);
}

function createAndFill(
  markdocNode: MarkdocNode,
  nodeType: NodeType,
  attrs: Record<string, any>,
  mapChildren?: (children: ProseMirrorNode[]) => ProseMirrorNode[]
) {
  let children = childrenToProseMirrorNodes(markdocNode.children, nodeType);
  if (mapChildren) {
    children = mapChildren(children);
  }
  const node = nodeType.createAndFill(attrs, children);
  if (!node) {
    error({
      error: {
        id: 'unexpected-children',
        level: 'critical',
        message: `${markdocNode.type} has unexpected children`,
      },
      lines: markdocNode.lines,
      type: markdocNode.type,
      location: markdocNode.location,
    });
  }
  return node;
}

function addMark(
  node: MarkdocNode,
  mark: Mark | MarkType | undefined,
  parentType: NodeType | undefined
) {
  if (!mark) return notAllowed(node, parentType);
  return withMark(mark instanceof MarkType ? mark.create() : mark, () =>
    childrenToProseMirrorNodes(node.children, parentType)
  );
}

export function markdocToProseMirror(
  node: MarkdocNode,
  schema: EditorSchema,
  files: ReadonlyMap<string, Uint8Array> | undefined,
  otherFiles: ReadonlyMap<string, ReadonlyMap<string, Uint8Array>> | undefined,
  slug: string | undefined
): ProseMirrorNode {
  state = {
    schema,
    errors: [],
    marks: [],
    files: files ?? new Map(),
    otherFiles: otherFiles ?? new Map(),
    slug,
  };
  try {
    let pmNode = markdocNodeToProseMirrorNode(node, undefined);
    if (state.errors.length) {
      throw new Error(
        state.errors.map(e => e.lines[0] + ':' + e.error.message).join('\n')
      );
    }
    if (!(pmNode instanceof ProseMirrorNode)) {
      throw new Error('unexpected node');
    }
    return pmNode;
  } finally {
    state = undefined;
  }
}

const wrapInParagraph =
  (schema: EditorSchema) => (children: ProseMirrorNode[]) => {
    const newChildren: ProseMirrorNode[] = [];
    let inlineQueue: ProseMirrorNode[] = [];
    for (const child of children) {
      if (child.isInline) {
        inlineQueue.push(child);
        continue;
      }
      if (inlineQueue.length) {
        newChildren.push(schema.nodes.paragraph.createChecked({}, inlineQueue));
        inlineQueue = [];
      }
      newChildren.push(child);
    }
    if (inlineQueue.length) {
      newChildren.push(schema.nodes.paragraph.createChecked({}, inlineQueue));
    }
    return newChildren;
  };

function markdocNodeToProseMirrorNode(
  node: MarkdocNode,
  parentType: NodeType | undefined
): ProseMirrorNode | ProseMirrorNode[] | null {
  if (node.errors.length) {
    for (const err of node.errors) {
      error({
        error: err,
        lines: node.lines,
        type: node.type,
        location: node.location,
      });
    }
    return null;
  }
  if (node.type === 'error') {
    error({
      error: {
        id: 'error-node',
        level: 'critical',
        message: 'Unexpected error node without errors',
      },
      lines: node.lines,
      type: node.type,
      location: node.location,
    });
    return null;
  }
  const schema = getSchema();
  if (node.type === 'inline') {
    return childrenToProseMirrorNodes(node.children, parentType);
  }
  if (node.type === 'em') {
    return addMark(node, schema.marks.italic, parentType);
  }
  if (node.type === 'code') {
    if (!schema.marks.code) return notAllowed(node, parentType);
    return schema.schema.text(node.attributes.content, [
      ...getState().marks,
      schema.marks.code.create(),
    ]);
  }
  if (node.type === 's') {
    return addMark(node, schema.marks.strikethrough, parentType);
  }
  if (node.type === 'strong') {
    return addMark(node, schema.marks.bold, parentType);
  }
  if (node.type === 'softbreak') {
    return schema.schema.text('\n');
  }
  if (node.type === 'hardbreak') {
    if (!schema.nodes.hard_break) return notAllowed(node, parentType);
    return schema.nodes.hard_break.create();
  }
  if (node.type === 'blockquote') {
    if (!schema.nodes.blockquote) return notAllowed(node, parentType);
    return createAndFill(node, schema.nodes.blockquote, {});
  }
  if (node.type === 'heading') {
    if (!schema.nodes.heading) return notAllowed(node, parentType);
    return createAndFill(node, schema.nodes.heading, {
      level: node.attributes.level,
    });
  }
  if (node.type === 'paragraph') {
    return createAndFill(node, schema.nodes.paragraph, {});
  }
  if (node.type === 'comment') {
    return [];
  }
  if (node.type === 'document') {
    return createAndFill(node, schema.nodes.doc, {});
  }
  if (node.type === 'fence') {
    if (!schema.nodes.code_block) return notAllowed(node, parentType);
    return schema.nodes.code_block.createAndFill(
      {
        language:
          typeof node.attributes.language === 'string'
            ? node.attributes.language
            : 'plain',
      },
      schema.schema.text(node.attributes.content.slice(0, -1))
    );
  }
  if (node.type === 'hr') {
    if (!schema.nodes.divider) return notAllowed(node, parentType);
    return createAndFill(node, schema.nodes.divider, {});
  }
  if (node.type === 'link') {
    return addMark(
      node,
      schema.marks.link?.create({ href: node.attributes.href }),
      parentType
    );
  }
  if (node.type === 'text') {
    return schema.schema.text(node.attributes.content, getState().marks);
  }
  if (node.type === 'item') {
    if (!schema.nodes.list_item) return notAllowed(node, parentType);
    return createAndFill(
      node,
      schema.nodes.list_item,
      {},
      wrapInParagraph(schema)
    );
  }
  if (node.type === 'list') {
    const listType = node.attributes.ordered
      ? schema.nodes.ordered_list
      : schema.nodes.unordered_list;
    if (!listType) return notAllowed(node, parentType);
    return createAndFill(node, listType, {});
  }
  if (node.type === 'table') {
    if (!schema.nodes.table) return notAllowed(node, parentType);
    return createAndFill(node, schema.nodes.table, {});
  }
  if (node.type === 'tbody' || node.type === 'thead') {
    return childrenToProseMirrorNodes(node.children, parentType);
  }
  if (node.type === 'tr') {
    if (!schema.nodes.table_row) return notAllowed(node, parentType);
    return createAndFill(node, schema.nodes.table_row, {});
  }
  if (node.type === 'th') {
    if (!schema.nodes.table_header) return notAllowed(node, parentType);
    return createAndFill(
      node,
      schema.nodes.table_header,
      {},
      wrapInParagraph(schema)
    );
  }
  if (node.type === 'td') {
    if (!schema.nodes.table_cell) return notAllowed(node, parentType);
    return createAndFill(
      node,
      schema.nodes.table_cell,
      {},
      wrapInParagraph(schema)
    );
  }
  if (node.type === 'tag' && node.tag) {
    if (node.tag === 'table') {
      return markdocNodeToProseMirrorNode(node.children[0], parentType);
    }
    const children = childrenToProseMirrorNodes(node.children, parentType);

    const componentConfig = schema.components[node.tag];
    if (componentConfig) {
      if (componentConfig.kind === 'mark') {
        return addMark(node, schema.schema.marks[node.tag], parentType);
      }
      const nodeType = schema.schema.nodes[node.tag];
      // TODO: validation and handling of e.g. image fields
      const state = getState();
      const pmNode = nodeType.createChecked(
        {
          props: deserializeProps(
            { kind: 'object', fields: componentConfig.schema },
            node.attributes,
            state.files,
            state.otherFiles,
            state.slug
          ),
        },
        children
      );
      if (!pmNode) {
        error({
          error: {
            id: 'unexpected-children',
            level: 'critical',
            message: `${node.type} has unexpected children`,
          },
          lines: node.lines,
          type: node.type,
          location: node.location,
        });
      }
      if (componentConfig.kind === 'inline' && !parentType?.isTextblock) {
        return schema.nodes.paragraph.createAndFill({}, pmNode)!;
      }
      return pmNode;
    }
    return schema.nodes.paragraph.createChecked({}, children);
  }
  if (node.type === 'image') {
    const fileContents = getState().files.get(node.attributes.src);
    if (fileContents && schema.nodes.image) {
      return schema.nodes.image.createChecked({
        src: `data:application/octet-stream;base64,${fromUint8Array(
          fileContents
        )}`,
        alt: node.attributes.alt,
        title: node.attributes.title,
        filename: node.attributes.src,
      });
    }
    return schema.schema.text(
      `![${node.attributes.alt || ''}](${node.attributes.src || ''}${
        node.attributes.title?.length ? ` "${node.attributes.title}"` : ''
      })`
    );
  }

  error({
    error: {
      id: 'unhandled-type',
      level: 'critical',
      message: `Unhandled type ${node.type}`,
    },
    lines: node.lines,
    type: node.type,
    location: node.location,
  });
  return null;
}

function deserializeProps(
  schema: ComponentSchema,
  value: unknown,
  files: ReadonlyMap<string, Uint8Array>,
  otherFiles: ReadonlyMap<string, ReadonlyMap<string, Uint8Array>>,
  slug: string | undefined
) {
  return transformProps(schema, value, {
    form: (schema, value) => {
      if (schema.formKind === 'asset') {
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

      if (schema.formKind === 'content') {
        throw new Error('Not implemented');
      }
      return schema.parse(value, undefined);
    },
  });
}
