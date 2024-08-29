import { Fragment, Mark, Node as ProseMirrorNode } from 'prosemirror-model';
import { EditorSchema, getEditorSchema } from '../schema';
import { getSrcPrefixForImageBlock } from '../images';
import { fixPath } from '../../../../../app/path-utils';
import { PhrasingContent, ListItem, BlockContent, Root } from 'mdast';
import { MdxJsxAttribute } from 'mdast-util-mdx';
import { internalToSerialized } from '../props-serialization';
import { textblockChildren } from '../serialize-inline';

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
  return textblockChildren(
    fragment,
    (text): PhrasingContent => ({ type: 'text', value: text }),
    node => getLeafContent(node, state),
    mark => getWrapperForMark(mark, state)
  );
}

function propsToAttributes(props: Record<string, unknown>): MdxJsxAttribute[] {
  return Object.entries(props).map(([key, value]) => ({
    type: 'mdxJsxAttribute',
    name: key,
    value:
      value === true
        ? null
        : typeof value === 'string'
        ? value
        : {
            type: 'mdxJsxAttributeValueExpression',
            value: JSON.stringify(value),
          },
  }));
}

function getLeafContent(
  node: ProseMirrorNode,
  state: DocumentSerializationState
): PhrasingContent | undefined {
  const { schema } = state;
  if (node.type === schema.nodes.hard_break) {
    return { type: 'break' };
  }
  if (node.type === schema.nodes.image) {
    const { src, filename } = node.attrs;

    if (
      typeof state.schema.config.image === 'object' &&
      typeof state.schema.config.image.directory === 'string'
    ) {
      const parent = fixPath(state.schema.config.image.directory);
      if (!state.otherFiles.has(parent)) {
        state.otherFiles.set(parent, new Map());
      }
      state.otherFiles.get(parent)!.set(filename, src);
    } else {
      state.extraFiles.set(filename, src);
    }

    return {
      type: 'image',
      url: encodeURI(
        `${getSrcPrefixForImageBlock(state.schema.config, state.slug)}${
          node.attrs.filename
        }`
      ),
      alt: node.attrs.alt,
      title: node.attrs.title,
    };
  }
  const componentConfig = state.schema.components[node.type.name];
  if (componentConfig?.kind === 'inline') {
    return {
      type: 'mdxJsxTextElement',
      name: node.type.name,
      attributes: propsToAttributes(
        internalToSerialized(componentConfig.schema, node.attrs.props, state)
      ),
      children: [],
    };
  }
  if (node.text !== undefined) {
    return {
      type: node.marks.some(x => x.type === schema.marks.code)
        ? 'inlineCode'
        : 'text',
      value: node.text,
    };
  }
}

function getWrapperForMark(
  mark: Mark,
  state: DocumentSerializationState
): Extract<PhrasingContent, { children: PhrasingContent[] }> | undefined {
  const { schema } = state;

  if (mark.type === schema.marks.code) {
    return;
  }
  const componentConfig = schema.components[mark.type.name];
  if (componentConfig) {
    return {
      type: 'mdxJsxTextElement',
      name: mark.type.name,
      attributes: propsToAttributes(
        internalToSerialized(componentConfig.schema, mark.attrs.props, state)
      ),
      children: [],
    };
  }

  let type: 'strong' | 'emphasis' | 'delete' | undefined;
  if (mark.type === schema.marks.bold) {
    type = 'strong';
  }
  if (mark.type === schema.marks.italic) {
    type = 'emphasis';
  }
  if (mark.type === schema.marks.strikethrough) {
    type = 'delete';
  }

  if (type) {
    return { type, children: [] };
  }
  if (mark.type === schema.marks.link) {
    return {
      type: 'link',
      url: mark.attrs.href,
      title: mark.attrs.title,
      children: [],
    };
  }
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
  return {
    type: 'listItem',
    spread:
      listItemContent.length === 2 &&
      listItemContent[0].type === 'paragraph' &&
      listItemContent[1].type === 'list'
        ? false
        : undefined,
    children: listItemContent,
  };
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
              children: inline(cell.content.child(0).content),
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
      spread: false,
      start: node.attrs.start,
      children: mapContent(node, node => convertListItem(blocks(node.content))),
    };
  }
  if (node.type === schema.nodes.unordered_list) {
    return {
      type: 'list',
      spread: false,
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
