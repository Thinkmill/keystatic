import { Ast, Node as MarkdocNode, NodeType } from '@markdoc/markdoc';
import { Fragment, Mark, Node as ProseMirrorNode } from 'prosemirror-model';
import { getEditorSchema } from '../schema';

function blocks(fragment: Fragment): MarkdocNode[] {
  const children: MarkdocNode[] = [];
  fragment.forEach(child => {
    children.push(proseMirrorToMarkdoc(child));
  });
  return children;
}

function inline(fragment: Fragment): MarkdocNode[] {
  return [new Ast.Node('inline', {}, textblockChildren(fragment))];
}

// TODO: this should handle marks spanning over multiple text nodes properly
function textblockChildren(fragment: Fragment): MarkdocNode[] {
  const children: MarkdocNode[] = [];
  fragment.forEach(child => {
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

export function proseMirrorToMarkdoc(node: ProseMirrorNode): MarkdocNode {
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
    return new Ast.Node('item', {}, blocks(node.content));
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
