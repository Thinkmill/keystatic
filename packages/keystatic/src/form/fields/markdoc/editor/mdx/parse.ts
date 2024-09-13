import {
  Mark,
  MarkType,
  NodeType,
  Node as ProseMirrorNode,
} from 'prosemirror-model';
import { EditorSchema } from '../schema';
import { fixPath } from '../../../../../app/path-utils';
import { getSrcPrefixForImageBlock } from '../images';
import { Nodes, PhrasingContent, Definition } from 'mdast';
import { visit } from 'unist-util-visit';
import { MdxJsxAttributeValueExpression, mdxToMarkdown } from 'mdast-util-mdx';
import { assert } from 'emery';
import { deserializeProps, toSerialized } from '../props-serialization';
import { toMarkdown } from 'mdast-util-to-markdown';
import { gfmAutolinkLiteralToMarkdown } from 'mdast-util-gfm-autolink-literal';
import { gfmStrikethroughToMarkdown } from 'mdast-util-gfm-strikethrough';
import { gfmTableToMarkdown } from 'mdast-util-gfm-table';

let state:
  | {
      schema: EditorSchema;
      errors: string[];
      marks: readonly Mark[];
      extraFiles: ReadonlyMap<string, Uint8Array>;
      otherFiles: ReadonlyMap<string, ReadonlyMap<string, Uint8Array>>;
      slug: string | undefined;
      definitions: Map<string, Definition>;
    }
  | undefined;
function getState(): typeof state & {} {
  if (!state) {
    throw new Error('state not set');
  }
  return state;
}

function error(message: string) {
  getState().errors.push(message);
}

function getSchema() {
  return getState().schema;
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
  nodes: Nodes[],
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

function notAllowed(node: Nodes, parentType: NodeType | undefined) {
  error(`${node.type} is not allowed`);
  return childrenToProseMirrorNodes(
    'children' in node ? node.children : [],
    parentType
  );
}

function createAndFill(
  mdNode: Nodes,
  nodeType: NodeType,
  attrs: Record<string, any>,
  mapChildren?: (children: ProseMirrorNode[]) => ProseMirrorNode[]
) {
  let children = childrenToProseMirrorNodes(
    'children' in mdNode ? mdNode.children : [],
    nodeType
  );
  if (mapChildren) {
    children = mapChildren(children);
  }
  const node = nodeType.createAndFill(attrs, children);
  if (!node) {
    error(`${mdNode.type} has unexpected children`);
  }
  return node;
}

function addMark(
  node: PhrasingContent,
  mark: Mark | MarkType | undefined,
  parentType: NodeType | undefined
) {
  if (!mark) return notAllowed(node, parentType);
  return withMark(mark instanceof MarkType ? mark.create() : mark, () =>
    childrenToProseMirrorNodes(
      'children' in node ? node.children : [],
      parentType
    )
  );
}

export function mdxToProseMirror(
  node: Nodes,
  schema: EditorSchema,
  files: ReadonlyMap<string, Uint8Array> | undefined,
  otherFiles: ReadonlyMap<string, ReadonlyMap<string, Uint8Array>> | undefined,
  slug: string | undefined
): ProseMirrorNode {
  state = {
    schema,
    errors: [],
    marks: [],
    extraFiles: files ?? new Map(),
    otherFiles: otherFiles ?? new Map(),
    slug,
    definitions: new Map(),
  };
  visit(node, node => {
    if (node.type === 'definition') {
      const id = String(node.identifier).toUpperCase();

      // Mimick CM behavior of link definitions.
      // See: <https://github.com/syntax-tree/mdast-util-definitions/blob/9032189/lib/index.js#L20-L21>.
      if (!getState().definitions.has(id)) {
        getState().definitions.set(id, node);
      }
    }
  });
  try {
    let pmNode = markdocNodeToProseMirrorNode(node, undefined);
    if (state.errors.length) {
      throw new Error(state.errors.join('\n'));
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

type Program = (MdxJsxAttributeValueExpression['data'] & {})['estree'] & {};
function programToValue(program: Program) {
  assert(program.body.length === 1);
  const statement = program.body[0];
  assert(statement.type === 'ExpressionStatement');
  return expressionToValue(statement.expression);
}

type Expression = (Program['body'][number] & {
  type: 'ExpressionStatement';
})['expression'];

function expressionToValue(expression: Expression): unknown {
  if (expression.type === 'Literal') {
    const val = expression.value;
    assert(
      typeof val === 'string' ||
        typeof val === 'number' ||
        typeof val === 'boolean' ||
        val === null
    );
    return val;
  }
  if (expression.type === 'ArrayExpression') {
    return expression.elements.map(value => {
      assert(value !== null && value.type !== 'SpreadElement');
      return expressionToValue(value as Expression);
    });
  }
  if (expression.type === 'ObjectExpression') {
    return Object.fromEntries(
      expression.properties.map(property => {
        assert(
          property.type === 'Property' &&
            !property.computed &&
            property.kind === 'init'
        );
        const key = property.key;
        const name =
          key.type === 'Identifier'
            ? key.name
            : key.type === 'Literal'
            ? key.value
            : undefined;
        assert(typeof name === 'string');
        return [name, expressionToValue(property.value as Expression)];
      })
    );
  }
  throw new Error(`Unexpected expression type ${expression.type}`);
}

function markdocNodeToProseMirrorNode(
  node: Nodes,
  parentType: NodeType | undefined
): ProseMirrorNode | ProseMirrorNode[] | null {
  const schema = getSchema();
  if (node.type === 'emphasis') {
    return addMark(node, schema.marks.italic, parentType);
  }
  if (node.type === 'inlineCode') {
    if (!schema.marks.code) return notAllowed(node, parentType);
    return schema.schema.text(node.value, [
      ...getState().marks,
      schema.marks.code.create(),
    ]);
  }
  if (node.type === 'delete') {
    return addMark(node, schema.marks.strikethrough, parentType);
  }
  if (node.type === 'strong') {
    return addMark(node, schema.marks.bold, parentType);
  }
  if (node.type === 'break') {
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
      level: node.depth,
    });
  }
  if (node.type === 'paragraph') {
    return createAndFill(node, schema.nodes.paragraph, {});
  }
  if (node.type === 'root') {
    return createAndFill(node, schema.nodes.doc, {});
  }
  if (node.type === 'code') {
    if (!schema.nodes.code_block) return notAllowed(node, parentType);
    let language = typeof node.lang === 'string' ? node.lang : '';
    if (node.meta) {
      language += ' ' + node.meta;
    }
    return schema.nodes.code_block.createAndFill(
      { language },
      schema.schema.text(node.value)
    );
  }
  if (node.type === 'thematicBreak') {
    if (!schema.nodes.divider) return notAllowed(node, parentType);
    return createAndFill(node, schema.nodes.divider, {});
  }
  if (node.type === 'link') {
    return addMark(
      node,
      schema.marks.link?.create({ href: node.url }),
      parentType
    );
  }
  if (node.type === 'linkReference') {
    const data = getState().definitions.get(node.identifier.toUpperCase());
    if (!data) {
      error(`Could not find definition for ${node.identifier}`);
      return childrenToProseMirrorNodes(node.children, parentType);
    }
    return addMark(
      node,
      schema.marks.link?.create({ href: data.url }),
      parentType
    );
  }
  if (node.type === 'text') {
    return schema.schema.text(node.value, getState().marks);
  }
  if (node.type === 'listItem') {
    if (!schema.nodes.list_item) return notAllowed(node, parentType);
    return createAndFill(
      node,
      schema.nodes.list_item,
      {},
      wrapInParagraph(schema)
    );
  }
  if (node.type === 'list') {
    const listType = node.ordered
      ? schema.nodes.ordered_list
      : schema.nodes.unordered_list;
    if (!listType) return notAllowed(node, parentType);
    return createAndFill(
      node,
      listType,
      node.ordered && node.start != null ? { start: node.start } : {}
    );
  }
  if (node.type === 'table') {
    if (!schema.nodes.table) return notAllowed(node, parentType);
    return createAndFill(node, schema.nodes.table, {});
  }
  if (node.type === 'tableRow') {
    if (!schema.nodes.table_row) return notAllowed(node, parentType);
    return createAndFill(node, schema.nodes.table_row, {});
  }
  if (node.type === 'tableCell') {
    if (!schema.nodes.table_cell) return notAllowed(node, parentType);
    return createAndFill(
      node,
      schema.nodes.table_cell,
      {},
      wrapInParagraph(schema)
    );
  }
  if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
    if (!node.name) {
      return notAllowed(node, parentType);
    }
    const componentConfig = schema.components[node.name];
    if (componentConfig) {
      const state = getState();
      const attributes: Record<string, unknown> = {};
      for (const attribute of node.attributes) {
        if (attribute.type === 'mdxJsxAttribute') {
          if (attribute.value == null) {
            attributes[attribute.name] = true;
            continue;
          }
          try {
            attributes[attribute.name] =
              typeof attribute.value === 'string'
                ? attribute.value
                : programToValue(attribute.value.data!.estree!);
          } catch {
            error(`${node.type} has unexpected attributes`);
          }
          continue;
        }
        error(`${node.type} has unexpected attributes`);
      }
      const deserialized = deserializeProps(
        componentConfig.schema,
        attributes,
        state
      );

      if (componentConfig.kind === 'mark') {
        if (node.type === 'mdxJsxFlowElement') {
          return notAllowed(node, parentType);
        }
        return addMark(
          node,
          schema.schema.marks[node.name].create({
            props: toSerialized(deserialized, componentConfig.schema),
          }),
          parentType
        );
      }
      const nodeType = schema.schema.nodes[node.name];

      const pmNode = nodeType.createAndFill(
        { props: toSerialized(deserialized, componentConfig.schema) },
        childrenToProseMirrorNodes(node.children, nodeType)
      );
      if (!pmNode) {
        error(`${node.type} has unexpected children`);
      }
      if (componentConfig.kind === 'inline' && !parentType?.isTextblock) {
        return schema.nodes.paragraph.createAndFill({}, pmNode)!;
      }
      return pmNode;
    }
    error(`Missing component definition for ${node.name}`);
    return childrenToProseMirrorNodes(
      'children' in node ? node.children : [],
      parentType
    );
  }
  if (node.type === 'image' || node.type === 'imageReference') {
    const data =
      node.type === 'image'
        ? node
        : getState().definitions.get(node.identifier.toUpperCase());
    if (!data) {
      error(
        `Could not find definition for ${
          (node as typeof node & { type: 'imageReference' }).identifier
        }`
      );
      return null;
    }
    const prefix = getSrcPrefixForImageBlock(schema.config, getState().slug);
    const fullFilename = decodeURI(data.url);
    const filename = fullFilename.slice(prefix.length);
    const content = (
      typeof schema.config.image === 'object' &&
      typeof schema.config.image.directory === 'string'
        ? getState().otherFiles.get(fixPath(schema.config.image.directory))
        : getState().extraFiles
    )?.get(filename);

    if (content && schema.nodes.image) {
      return schema.nodes.image.createChecked({
        src: content,
        alt: node.alt,
        title: data.title,
        filename,
      });
    }
    return schema.schema.text(
      `![${node.alt || ''}](${data.url || ''}${
        data.title ? ` "${data.title}"` : ''
      })`
    );
  }
  if (node.type === 'definition') return [];
  error(
    `Unhandled type ${node.type}: ${toMarkdown(node, {
      extensions: [
        gfmAutolinkLiteralToMarkdown(),
        gfmStrikethroughToMarkdown(),
        gfmTableToMarkdown(),
        mdxToMarkdown(),
      ],
      rule: '-',
    })}`
  );
  return null;
}
