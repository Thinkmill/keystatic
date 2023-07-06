'use client';
import Markdoc, {
  Ast,
  AttributeValue,
  Node as MarkdocNode,
  NodeType,
} from '@markdoc/markdoc';
import { Fragment, Mark, Node as ProseMirrorNode } from 'prosemirror-model';
import { EditorSchema, getEditorSchema } from '../schema';
import { syntaxOnlyMarkdocValidate } from '../../utils';

function blocks(fragment: Fragment): MarkdocNode[] {
  const children: MarkdocNode[] = [];
  fragment.forEach(child => {
    children.push(proseMirrorToMarkdoc(child));
  });
  return children;
}

// TODO: this should handle marks spanning over multiple text nodes properly
function textblockChildren(
  fragment: Fragment,
  annotations: AttributeValue[],
  schema: EditorSchema
): MarkdocNode[] {
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
      return;
    }
    if (child.type === schema.nodes.attribute) {
      annotations.push(toAttributeValue(child));
      return;
    }
    throw new Error(`unknown inline node type: ${child.type.name}`);
  });
  return [new Ast.Node('inline', {}, children)];
}

export function proseMirrorToMarkdoc(node: ProseMirrorNode): MarkdocNode {
  const schema = getEditorSchema(node.type.schema);
  if (node.type === schema.nodes.doc) {
    return new Ast.Node('document', {}, blocks(node.content));
  }
  if (node.type === schema.nodes.paragraph) {
    const annotations: AttributeValue[] = [];
    const markdocNode = new Ast.Node(
      'paragraph',
      {},
      textblockChildren(node.content, annotations, schema)
    );
    markdocNode.annotations = annotations;
    return markdocNode;
  }
  if (node.type === schema.nodes.blockquote) {
    return new Ast.Node('blockquote', {}, blocks(node.content));
  }
  if (node.type === schema.nodes.divider) {
    return new Ast.Node('hr');
  }
  if (node.type === schema.nodes.heading) {
    const annotations: AttributeValue[] = [];
    const markdocNode = new Ast.Node(
      'heading',
      { level: node.attrs.level },
      textblockChildren(node.content, annotations, schema)
    );
    markdocNode.annotations = annotations;
    return markdocNode;
  }
  if (node.type === schema.nodes.code_block) {
    return new Ast.Node(
      'fence',
      typeof node.attrs.language === 'string' && node.attrs.language !== 'plain'
        ? { language: node.attrs.language, content: node.textContent + '\n' }
        : { content: node.textContent + '\n' },
      [new Ast.Node('text', { content: node.textContent + '\n' })]
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
  if (
    node.type === schema.nodes.tag_self_closing ||
    node.type === schema.nodes.tag_with_children
  ) {
    const annotations: AttributeValue[] = [];
    const children: MarkdocNode[] = [];
    node.content.forEach((node, _, i) => {
      if (i === 0) {
        node.content.forEach(attribute => {
          annotations.push(toAttributeValue(attribute));
        });
        return;
      }
      children.push(proseMirrorToMarkdoc(node));
    });

    const markdocNode = new Ast.Node(
      'tag',
      Object.fromEntries(annotations.map(x => [x.name, x.value])),
      children,
      node.attrs.name
    );
    markdocNode.annotations = annotations;
    return markdocNode;
  }
  throw new Error(`unhandled node type ${node.type.name}`);
}

function toAttributeValue(attribute: ProseMirrorNode): AttributeValue {
  const value = getValFromAttributeContent(
    attribute.content,
    getEditorSchema(attribute.type.schema)
  );
  return {
    name: attribute.attrs.name,
    type: 'attribute',
    value,
  };
}

function getValFromAttributeContent(fragment: Fragment, schema: EditorSchema) {
  if (fragment.firstChild?.type === schema.nodes.attribute_expression) {
    const parsed = Markdoc.parse(
      `{% some-tag attr=${fragment.firstChild.attrs.value} /%}`
    );
    const parseErrors = syntaxOnlyMarkdocValidate(parsed);
    if (parseErrors.length) {
      throw new Error(
        `failed to parse value in attribute expression node:\n` +
          parseErrors.map(e => e.lines[0] + ':' + e.error.message).join('\n')
      );
    }
    return parsed.children[0].annotations[0].value as unknown;
  }
  return fragment.textBetween(0, fragment.size);
}
