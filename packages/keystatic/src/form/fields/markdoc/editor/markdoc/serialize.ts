import { Ast, Node as MarkdocNode, NodeType } from '@markdoc/markdoc';
import { Fragment, Mark, Node as ProseMirrorNode } from 'prosemirror-model';
import { getEditorSchema } from '../schema';
import { toUint8Array } from 'js-base64';

function _blocks(
  fragment: Fragment,
  extraFiles: Map<string, Uint8Array> | undefined
): MarkdocNode[] {
  const children: MarkdocNode[] = [];
  fragment.forEach(child => {
    children.push(proseMirrorToMarkdoc(child, extraFiles));
  });
  return children;
}

function _inline(
  fragment: Fragment,
  extraFiles: Map<string, Uint8Array> | undefined
): MarkdocNode[] {
  return [new Ast.Node('inline', {}, textblockChildren(fragment, extraFiles))];
}

// TODO: this should handle marks spanning over multiple text nodes properly
function textblockChildren(
  fragment: Fragment,
  extraFiles: Map<string, Uint8Array> | undefined
): MarkdocNode[] {
  const children: MarkdocNode[] = [];
  fragment.forEach(child => {
    if (child.type === child.type.schema.nodes.image) {
      if (extraFiles) {
        const src = toUint8Array(
          child.attrs.src.replace(/^data:[a-z/-]+;base64,/, '')
        );
        extraFiles.set(child.attrs.filename, src);
      }
      children.push(
        new Ast.Node('image', {
          src: child.attrs.filename,
          alt: child.attrs.alt,
          title: child.attrs.title,
        })
      );
    }
    if (child.text !== undefined) {
      const textNode = new Ast.Node('text', { content: child.text }, []);
      let node = textNode;
      const schema = getEditorSchema(child.type.schema);
      let linkMark: Mark | undefined;
      for (const mark of child.marks) {
        if (mark.type === schema.marks.link) {
          linkMark = mark;
          continue;
        }
        let type: NodeType | undefined;
        if (mark.type === schema.marks.bold) {
          type = 'strong';
        }
        if (mark.type === schema.marks.code) {
          textNode.type = 'code';
          continue;
        }
        if (mark.type === schema.marks.italic) {
          type = 'em';
        }
        if (mark.type === schema.marks.strikethrough) {
          type = 's';
        }
        if (type) {
          node = new Ast.Node(type, { type: mark.type.name }, [node]);
        }
      }
      if (linkMark) {
        node = new Ast.Node('link', { href: linkMark.attrs.href }, [node]);
      }
      children.push(node);
    }
  });

  return children;
}

export function proseMirrorToMarkdoc(
  node: ProseMirrorNode,
  extraFiles: Map<string, Uint8Array> | undefined
): MarkdocNode {
  const blocks = (fragment: Fragment) => _blocks(fragment, extraFiles);
  const inline = (fragment: Fragment) => _inline(fragment, extraFiles);
  const schema = getEditorSchema(node.type.schema);
  if (node.type === schema.nodes.doc) {
    return new Ast.Node('document', {}, blocks(node.content));
  }
  if (node.type === schema.nodes.paragraph) {
    return new Ast.Node('paragraph', {}, inline(node.content));
  }
  if (node.type === schema.nodes.blockquote) {
    return new Ast.Node('blockquote', {}, blocks(node.content));
  }
  if (node.type === schema.nodes.divider) {
    return new Ast.Node('hr');
  }
  if (node.type === schema.nodes.table) {
    const rows = blocks(node.content);
    const head = new Ast.Node('thead', {}, []);
    if (rows[0].children[0].type === 'th') {
      head.children.push(rows.shift()!);
    }
    const body = new Ast.Node('tbody', {}, rows);
    return new Ast.Node(
      'tag',
      {},
      [new Ast.Node('table', {}, [head, body])],
      'table'
    );
  }
  if (node.type === schema.nodes.table_row) {
    return new Ast.Node('tr', {}, blocks(node.content));
  }
  if (node.type === schema.nodes.table_header) {
    return new Ast.Node('th', {}, blocks(node.content));
  }
  if (node.type === schema.nodes.table_cell) {
    return new Ast.Node('td', {}, blocks(node.content));
  }
  if (node.type === schema.nodes.heading) {
    return new Ast.Node(
      'heading',
      { level: node.attrs.level },
      inline(node.content)
    );
  }
  if (node.type === schema.nodes.code_block) {
    return new Ast.Node(
      'fence',
      typeof node.attrs.language === 'string' && node.attrs.language !== 'plain'
        ? {
            language: node.attrs.language,
            content: node.textBetween(0, node.content.size) + '\n',
          }
        : { content: node.textBetween(0, node.content.size) + '\n' },
      inline(node.content)
    );
  }
  if (node.type === schema.nodes.list_item) {
    let listItemContent = blocks(node.content);
    if (
      listItemContent.length === 1 &&
      listItemContent[0].type === 'paragraph'
    ) {
      listItemContent = listItemContent[0].children;
    }
    return new Ast.Node('item', {}, listItemContent);
  }
  if (node.type === schema.nodes.ordered_list) {
    return new Ast.Node('list', { ordered: true }, blocks(node.content));
  }
  if (node.type === schema.nodes.unordered_list) {
    return new Ast.Node('list', { ordered: false }, blocks(node.content));
  }

  return new Ast.Node('paragraph', {}, inline(node.content));

  throw new Error('unhandled node type');
}
