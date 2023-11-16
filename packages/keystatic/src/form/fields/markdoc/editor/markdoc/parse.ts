import { Ast, Node as MarkdocNode, ValidateError } from '@markdoc/markdoc';
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

function createAndFill(
  markdocNode: MarkdocNode,
  nodeType: NodeType,
  attrs: Record<string, any>,
  extraChildren?: ProseMirrorNode[],
  mapChildren?: (children: ProseMirrorNode[]) => ProseMirrorNode[]
) {
  let children = childrenToProseMirrorNodes(markdocNode.children);
  if (mapChildren) {
    children = mapChildren(children);
  }
  const node = nodeType.createAndFill(
    attrs,
    extraChildren ? [...children, ...extraChildren] : children
  );
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
        schema.nodes.attribute_string.createChecked(null, [
          schema.schema.text(x.name),
        ]),
      ]);
    }
    if (x.type === 'class') {
      return schema.nodes.attribute.createChecked({ name: 'class' }, [
        schema.nodes.attribute_string.createChecked(null, [
          schema.schema.text(x.name),
        ]),
      ]);
    }
    let val: undefined | ProseMirrorNode;
    if (typeof x.value === 'string') {
      val = schema.nodes.attribute_string.createChecked(null, [
        schema.schema.text(x.value),
      ]);
    }
    if (x.value === true) {
      val = schema.nodes.attribute_true.createChecked();
    }
    if (x.value === false) {
      val = schema.nodes.attribute_false.createChecked();
    }
    if (val === undefined) {
      error({
        error: {
          id: 'unimplemented-annotation',
          level: 'critical',
          message: `currently, only string and boolean annotations are implemented (got ${x.value})`,
        },
        lines: node.lines,
        type: node.type,
        location: node.location,
      });
      return schema.nodes.attribute.createAndFill({ name: x.name })!;
    }
    return schema.nodes.attribute.createChecked({ name: x.name }, [val]);
  });
}

const wrapInParagraph =
  (schema: EditorSchema) => (children: ProseMirrorNode[]) => {
    if (children?.[0].isInline) {
      return [schema.nodes.paragraph.createAndFill({}, children)!];
    }
    return children;
  };

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
    return createAndFill(node, schema.nodes.blockquote, {});
  }
  if (node.type === 'heading') {
    return createAndFill(
      node,
      schema.nodes.heading,
      {
        level: node.attributes.level,
      },
      parseAnnotations(node)
    );
  }
  if (node.type === 'paragraph') {
    return createAndFill(
      node,
      schema.nodes.paragraph,
      {},
      parseAnnotations(node)
    );
  }
  if (node.type === 'comment') {
    return [];
  }
  if (node.type === 'document') {
    return createAndFill(node, schema.nodes.doc, {});
  }
  if (node.type === 'fence') {
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
    return createAndFill(node, schema.nodes.divider, {});
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
    if (node.children[0]?.type === 'inline') {
      node = new Ast.Node('item', node.attributes, [
        new Ast.Node('paragraph', {}, node.children),
      ]);
    }
    return createAndFill(node, schema.nodes.list_item, {});
  }
  if (node.type === 'list') {
    return createAndFill(
      node,
      node.attributes.ordered
        ? schema.nodes.ordered_list
        : schema.nodes.unordered_list,
      {}
    );
  }
  if (node.type === 'table') {
    return createAndFill(node, schema.nodes.table, {});
  }
  if (node.type === 'tbody' || node.type === 'thead') {
    return childrenToProseMirrorNodes(node.children);
  }
  if (node.type === 'tr') {
    return createAndFill(node, schema.nodes.table_row, {});
  }
  if (node.type === 'th') {
    return createAndFill(
      node,
      schema.nodes.table_header,
      {},
      undefined,
      wrapInParagraph(schema)
    );
  }
  if (node.type === 'td') {
    return createAndFill(
      node,
      schema.nodes.table_cell,
      {},
      undefined,
      wrapInParagraph(schema)
    );
  }
  if (node.type === 'tag' && node.tag) {
    if (node.tag === 'table') {
      return markdocNodeToProseMirrorNode(node.children[0]);
    }
    const children = childrenToProseMirrorNodes(node.children);
    const tagChildren = [
      schema.nodes.tag_attributes.createChecked(null, parseAnnotations(node)),
      ...Object.entries(node.slots).map(
        ([slotName, slotContent]) => (
          console.log(slotContent),
          schema.nodes.tag_slot.createChecked(
            { name: slotName },
            childrenToProseMirrorNodes([slotContent])
          )
        )
      ),
      ...children,
    ];

    const pmNode = schema.nodes.tag.createChecked(
      { name: node.tag },
      tagChildren
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
    return pmNode;
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
