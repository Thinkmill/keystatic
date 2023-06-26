'use client';
import Markdoc, {
  Ast,
  Node as MarkdocNode,
  ValidateError,
} from '@markdoc/markdoc';
import {
  Mark,
  MarkType,
  NodeType,
  Node as ProseMirrorNode,
} from 'prosemirror-model';
import { EditorSchema } from '../schema';

let state:
  | { schema: EditorSchema; errors: ValidateError[]; marks: readonly Mark[] }
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

function childrenToProseMirrorNodes(nodes: MarkdocNode[]) {
  const children: ProseMirrorNode[] = [];
  for (const node of nodes) {
    const pmNode = markdocNodeToProseMirrorNode(node);
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

function notAllowed(node: MarkdocNode) {
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
  return childrenToProseMirrorNodes(node.children);
}

function genericConvertNode(
  markdocNode: MarkdocNode,
  nodeType: NodeType,
  attrs: Record<string, any>,
  supportsAnnotations: boolean
) {
  let children = childrenToProseMirrorNodes(markdocNode.children);

  if (supportsAnnotations) {
    children = [...children, ...parseAnnotations(markdocNode)];
  } else if (markdocNode.annotations.length) {
    error({
      error: {
        id: 'unexpected-annotations',
        level: 'critical',
        message: `${markdocNode.type} has unexpected annotations`,
      },
      lines: markdocNode.lines,
      type: markdocNode.type,
      location: markdocNode.location,
    });
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

function addMark(node: MarkdocNode, mark: Mark | MarkType | undefined) {
  if (!mark) return notAllowed(node);
  return withMark(mark instanceof MarkType ? mark.create() : mark, () =>
    childrenToProseMirrorNodes(node.children)
  );
}

export function markdocToProseMirror(
  node: MarkdocNode,
  schema: EditorSchema
): ProseMirrorNode {
  state = {
    schema,
    errors: [],
    marks: [],
  };
  try {
    let pmNode = markdocNodeToProseMirrorNode(node);
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

function parseAnnotations(node: MarkdocNode): ProseMirrorNode[] {
  const schema = getSchema();
  return node.annotations.map((x): ProseMirrorNode => {
    if (x.type === 'id') {
      return schema.nodes.attribute.createChecked({ name: 'id' }, [
        schema.schema.text(x.name),
      ]);
    }
    if (x.type === 'class') {
      return schema.nodes.attribute.createChecked({ name: 'class' }, [
        schema.schema.text(x.name),
      ]);
    }
    let val =
      typeof x.value === 'string'
        ? schema.schema.text(x.value)
        : schema.nodes.attribute_expression.createChecked({
            value: Markdoc.format(x.value),
          });
    return schema.nodes.attribute.createChecked({ name: x.name }, [val]);
  });
}

function markdocNodeToProseMirrorNode(
  node: MarkdocNode
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
    return childrenToProseMirrorNodes(node.children);
  }
  if (node.type === 'em') {
    return addMark(node, schema.marks.italic);
  }
  if (node.type === 'code') {
    return schema.schema.text(node.attributes.content, [
      ...getState().marks,
      schema.marks.code.create(),
    ]);
  }
  if (node.type === 's') {
    return addMark(node, schema.marks.strikethrough);
  }
  if (node.type === 'strong') {
    return addMark(node, schema.marks.bold);
  }
  if (node.type === 'softbreak') {
    return schema.schema.text('\n');
  }
  if (node.type === 'hardbreak') {
    if (!schema.nodes.hard_break) return notAllowed(node);
    return schema.nodes.hard_break.create();
  }
  if (node.type === 'blockquote') {
    return genericConvertNode(node, schema.nodes.blockquote, {}, false);
  }
  if (node.type === 'heading') {
    return genericConvertNode(
      node,
      schema.nodes.heading,
      { level: node.attributes.level },
      true
    );
  }
  if (node.type === 'paragraph') {
    return genericConvertNode(node, schema.nodes.paragraph, {}, true);
  }
  if (node.type === 'document') {
    return genericConvertNode(node, schema.nodes.doc, {}, false);
  }
  if (node.type === 'fence') {
    if (node.annotations.length) {
      throw new Error('annotations on code blocks not yet supported');
    }
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
    return genericConvertNode(node, schema.nodes.divider, {}, false);
  }
  if (node.type === 'link') {
    return addMark(
      node,
      schema.marks.link?.create({ href: node.attributes.href })
    );
  }
  if (node.type === 'text') {
    return schema.schema.text(node.attributes.content, getState().marks);
  }
  if (node.type === 'item') {
    const updatedNode = new Ast.Node(
      'item',
      node.attributes,
      node.children.map(node => {
        if (node.type !== 'inline') return node;
        return new Ast.Node('paragraph', {}, [node]);
      })
    );

    return genericConvertNode(updatedNode, schema.nodes.list_item, {}, false);
  }
  if (node.type === 'list') {
    return genericConvertNode(
      node,
      node.attributes.ordered
        ? schema.nodes.ordered_list
        : schema.nodes.unordered_list,
      {},
      false
    );
  }
  if (node.type === 'tag' && node.tag) {
    const children = childrenToProseMirrorNodes(node.children);
    const tagChildren = [
      schema.nodes.tag_attributes.createChecked(null, parseAnnotations(node)),
      ...children,
    ];
    const tagType =
      tagChildren.length === 1 &&
      node.findSchema(schema.markdocConfig)?.selfClosing
        ? schema.nodes.tag_self_closing
        : schema.nodes.tag_with_children;
    if (
      tagType === schema.nodes.tag_with_children &&
      tagChildren.length === 1
    ) {
      tagChildren.push(schema.nodes.paragraph.createChecked());
    }
    try {
      return tagType.createChecked({ name: node.tag }, tagChildren);
    } catch (err) {
      console.log(tagChildren);
      throw err;
    }
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
