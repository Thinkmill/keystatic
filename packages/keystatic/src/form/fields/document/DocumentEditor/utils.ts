import {
  Editor,
  Node,
  NodeEntry,
  Path,
  Transforms,
  Element,
  Text,
  Location,
  Point,
} from 'slate';
import { isBlock } from './editor';
import { ComponentBlock } from '../../../..';
import {
  DocumentFeaturesForChildField,
  getSchemaAtPropPath,
  getDocumentFeaturesForChildField,
} from './component-blocks/utils';
import { DocumentFeatures } from './document-features';

export type Mark =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'code'
  | 'superscript'
  | 'subscript'
  | 'keyboard';

export const allMarks: Mark[] = [
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'code',
  'superscript',
  'subscript',
  'keyboard',
];

export const isElementActive = (
  editor: Editor,
  format: Exclude<Element, { text: string }>['type']
) => {
  const [match] = Editor.nodes(editor, {
    match: n => n.type === format,
  });

  return !!match;
};

export function clearFormatting(editor: Editor) {
  Transforms.unwrapNodes(editor, {
    match: node =>
      node.type === 'heading' ||
      node.type === 'blockquote' ||
      node.type === 'code',
  });
  Transforms.unsetNodes(editor, allMarks, { match: Text.isText });
}

export function moveChildren(
  editor: Editor,
  parent: NodeEntry | Path,
  to: Path,
  shouldMoveNode: (node: Node, index: number) => boolean = () => true
) {
  const parentPath = Path.isPath(parent) ? parent : parent[1];
  const parentNode = Path.isPath(parent)
    ? Node.get(editor, parentPath)
    : parent[0];
  if (!isBlock(parentNode)) return;

  for (let i = parentNode.children.length - 1; i >= 0; i--) {
    if (shouldMoveNode(parentNode.children[i], i)) {
      const childPath = [...parentPath, i];
      Transforms.moveNodes(editor, { at: childPath, to });
    }
  }
}

/**
 * This is equivalent to Editor.after except that it ignores points that have no content
 * like the point in a void text node, an empty text node and the last point in a text node
 */
// TODO: this would probably break if you were trying to get the last point in the editor?
export function EditorAfterButIgnoringingPointsWithNoContent(
  editor: Editor,
  at: Location,
  {
    distance = 1,
  }: {
    distance?: number;
  } = {}
): Point | undefined {
  const anchor = Editor.point(editor, at, { edge: 'end' });
  const focus = Editor.end(editor, []);
  const range = { anchor, focus };
  let d = 0;
  let target;

  for (const p of Editor.positions(editor, {
    at: range,
  })) {
    if (d > distance) {
      break;
    }

    // this is the important change
    const node = Node.get(editor, p.path) as Text;
    if (node.text.length === p.offset) {
      continue;
    }

    if (d !== 0) {
      target = p;
    }

    d++;
  }

  return target;
}

export function nodeTypeMatcher<Type extends Element['type'][]>(
  ...args: Type
): (node: Node) => node is Element & { type: Type[number] } {
  if (args.length === 1) {
    const type = args[0];
    return ((node: Node) => node.type === type) as any;
  }
  const set = new Set(args);
  return ((node: Node) =>
    typeof node.type === 'string' && set.has(node.type)) as any;
}

export function getAncestorComponentChildFieldDocumentFeatures(
  editor: Editor,
  editorDocumentFeatures: DocumentFeatures,
  componentBlocks: Record<string, ComponentBlock>
): DocumentFeaturesForChildField | undefined {
  const ancestorComponentProp = Editor.above(editor, {
    match: nodeTypeMatcher('component-block-prop', 'component-inline-prop'),
  });

  if (ancestorComponentProp) {
    const propPath = ancestorComponentProp[0].propPath;
    const ancestorComponent = Editor.parent(editor, ancestorComponentProp[1]);
    if (ancestorComponent[0].type === 'component-block') {
      const component = ancestorComponent[0].component;
      const componentBlock = componentBlocks[component];
      if (componentBlock && propPath) {
        const childField = getSchemaAtPropPath(
          propPath,
          ancestorComponent[0].props,
          componentBlock.schema
        );
        if (childField?.kind === 'child') {
          return getDocumentFeaturesForChildField(
            editorDocumentFeatures,
            childField.options
          );
        }
      }
    }
  }
}
