import { Fragment, Mark, Node as ProseMirrorNode } from 'prosemirror-model';
import { EditorSchema, getEditorSchema } from '../schema';
import { toUint8Array } from 'js-base64';
import { getSrcPrefixForImageBlock } from '../images';
import { fixPath } from '../../../../../app/path-utils';
import {
  PhrasingContent,
  ListItem,
  Text,
  InlineCode,
  BlockContent,
  Root,
} from 'mdast';
import { MdxJsxAttribute } from 'mdast-util-mdx';
import { internalToSerialized } from '../props-serialization';

type DocumentSerializationState = {
  schema: EditorSchema;
  extraFiles: Map<string, Uint8Array>;
  otherFiles: Map<string, Map<string, Uint8Array>>;
  slug: string | undefined;
};

function _blocks(
  fragment: Fragment,
  state: DocumentSerializationState
): BlockContent[] {
  const children: BlockContent[] = [];
  fragment.forEach(child => {
    children.push(proseMirrorToMDX(child, state));
  });
  return children;
}

function _inline(
  fragment: Fragment,
  state: DocumentSerializationState
): PhrasingContent[] {
  return textblockChildren(fragment, state);
}

function propsToAttributes(props: Record<string, unknown>): MdxJsxAttribute[] {
  return Object.entries(props).map(([key, value]) => ({
    type: 'mdxJsxAttribute',
    name: key,
    value:
      typeof value === 'string'
        ? value
        : {
            type: 'mdxJsxAttributeValueExpression',
            value: JSON.stringify(value),
          },
  }));
}

// TODO: this should handle marks spanning over multiple text nodes properly
function textblockChildren(
  fragment: Fragment,
  state: DocumentSerializationState
): PhrasingContent[] {
  const children: PhrasingContent[] = [];
  fragment.forEach(child => {
    if (child.type === child.type.schema.nodes.image) {
      const src = toUint8Array(
        child.attrs.src.replace(/^data:[a-z/-]+;base64,/, '')
      );

      if (
        typeof state.schema.config.image === 'object' &&
        typeof state.schema.config.image.directory === 'string'
      ) {
        const parent = fixPath(state.schema.config.image.directory);
        if (!state.otherFiles.has(parent)) {
          state.otherFiles.set(parent, new Map());
        }
        state.otherFiles.get(parent)!.set(child.attrs.filename, src);
      } else {
        state.extraFiles.set(child.attrs.filename, src);
      }

      children.push({
        type: 'image',
        url: encodeURI(
          `${getSrcPrefixForImageBlock(state.schema.config, state.slug)}${
            child.attrs.filename
          }`
        ),
        alt: child.attrs.alt,
        title: child.attrs.title,
      });
    }
    const componentConfig = state.schema.components[child.type.name];
    if (componentConfig?.kind === 'inline') {
      children.push({
        type: 'mdxJsxTextElement',
        name: child.type.name,
        attributes: propsToAttributes(child.attrs.props),
        children: [],
      });
      return;
    }
    if (child.text !== undefined) {
      let textNode: Text | InlineCode = { type: 'text', value: child.text };
      let node: PhrasingContent = textNode;
      const schema = getEditorSchema(child.type.schema);
      let linkMark: Mark | undefined;
      for (const mark of child.marks) {
        if (mark.type === schema.marks.link) {
          linkMark = mark;
          continue;
        }
        const componentConfig = schema.components[mark.type.name];
        if (componentConfig) {
          node = {
            type: 'mdxJsxTextElement',
            name: mark.type.name,
            attributes: propsToAttributes(
              internalToSerialized(
                componentConfig.schema,
                mark.attrs.props,
                state
              )
            ),
            children: [node],
          };
          continue;
        }
        let type: 'strong' | 'emphasis' | 'delete' | undefined;
        if (mark.type === schema.marks.bold) {
          type = 'strong';
        }
        if (mark.type === schema.marks.code) {
          (textNode as any).type = 'inlineCode';
          continue;
        }
        if (mark.type === schema.marks.italic) {
          type = 'emphasis';
        }
        if (mark.type === schema.marks.strikethrough) {
          type = 'delete';
        }

        if (type) {
          node = {
            type,
            children: [node],
          };
        }
      }
      if (linkMark) {
        node = {
          type: 'link',
          url: linkMark.attrs.href,
          title: linkMark.attrs.title,
          children: [node],
        };
      }
      children.push(node);
    }
  });

  return children;
}

function mapContent<T>(
  node: ProseMirrorNode,
  fn: (node: ProseMirrorNode) => T
): T[] {
  const result: T[] = [];
  node.content.forEach(node => {
    result.push(fn(node));
  });
  return result;
}

function convertListItem(listItemContent: BlockContent[]): ListItem {
  return { type: 'listItem', children: listItemContent };
}

export function proseMirrorToMDXRoot(
  node: ProseMirrorNode,
  state: DocumentSerializationState
): Root {
  return {
    type: 'root',
    children: _blocks(node.content, state),
  };
}

function proseMirrorToMDX(
  node: ProseMirrorNode,
  state: DocumentSerializationState
): BlockContent {
  const blocks = (fragment: Fragment) => _blocks(fragment, state);
  const inline = (fragment: Fragment) => _inline(fragment, state);
  const schema = getEditorSchema(node.type.schema);

  if (node.type === schema.nodes.paragraph) {
    return { type: 'paragraph', children: inline(node.content) };
  }
  if (node.type === schema.nodes.blockquote) {
    return { type: 'blockquote', children: blocks(node.content) };
  }
  if (node.type === schema.nodes.divider) {
    return { type: 'thematicBreak' };
  }
  if (node.type === schema.nodes.table) {
    return {
      type: 'table',
      children: mapContent(node, row => {
        return {
          type: 'tableRow',
          children: mapContent(row, cell => {
            return {
              type: 'tableCell',
              children: inline(cell.content),
            };
          }),
        };
      }),
    };
  }
  if (node.type === schema.nodes.heading) {
    return {
      type: 'heading',
      depth: node.attrs.level,
      children: inline(node.content),
    };
  }
  if (node.type === schema.nodes.code_block) {
    let lang =
      typeof node.attrs.language === 'string' && node.attrs.language !== 'plain'
        ? node.attrs.language
        : undefined;
    let meta = null;
    if (lang?.includes(' ')) {
      [lang, meta] = lang.split(' ', 2);
    }
    return {
      type: 'code',
      lang,
      meta,
      value: node.textContent,
    };
  }
  if (node.type === schema.nodes.ordered_list) {
    return {
      type: 'list',
      ordered: true,
      children: mapContent(node, node => convertListItem(blocks(node.content))),
    };
  }
  if (node.type === schema.nodes.unordered_list) {
    return {
      type: 'list',
      children: mapContent(node, node => convertListItem(blocks(node.content))),
    };
  }

  const name = node.type.name;
  const componentConfig = schema.components[name];
  if (componentConfig) {
    const children =
      componentConfig.kind === 'wrapper' || componentConfig.kind === 'repeating'
        ? blocks(node.content)
        : [];

    return {
      type: 'mdxJsxFlowElement',
      name,
      attributes: propsToAttributes(
        internalToSerialized(componentConfig.schema, node.attrs.props, state)
      ),
      children,
    };
  }

  return {
    type: 'paragraph',
    children: inline(node.content),
  };
}
