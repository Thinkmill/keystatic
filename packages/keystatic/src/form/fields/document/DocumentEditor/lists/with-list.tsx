import { Editor, Element, Node, Path, Transforms, Range } from 'slate';
import { moveChildren, nodeTypeMatcher } from '../utils';
import { isBlock } from '../editor';

export const isListType = (type: string | undefined) =>
  type === 'ordered-list' || type === 'unordered-list';

export const isListNode = (
  node: Node
): node is Element & { type: 'ordered-list' | 'unordered-list' } =>
  isListType(node.type);

function getAncestorList(editor: Editor) {
  if (editor.selection) {
    const listItem = Editor.above(editor, {
      match: nodeTypeMatcher('list-item'),
    });
    const list = Editor.above(editor, {
      match: isListNode,
    });
    if (listItem && list) {
      return {
        isInside: true,
        listItem,
        list,
      } as const;
    }
  }
  return { isInside: false } as const;
}

export function withList(editor: Editor): Editor {
  const { insertBreak, normalizeNode, deleteBackward } = editor;
  editor.deleteBackward = unit => {
    if (editor.selection) {
      const ancestorList = getAncestorList(editor);
      if (
        ancestorList.isInside &&
        Range.isCollapsed(editor.selection) &&
        Editor.isStart(editor, editor.selection.anchor, ancestorList.list[1])
      ) {
        Transforms.unwrapNodes(editor, {
          match: isListNode,
          split: true,
        });
        return;
      }
    }
    deleteBackward(unit);
  };
  editor.insertBreak = () => {
    const [listItem] = Editor.nodes(editor, {
      match: node => node.type === 'list-item',
      mode: 'lowest',
    });
    if (listItem && Node.string(listItem[0]) === '') {
      Transforms.unwrapNodes(editor, {
        match: isListNode,
        split: true,
      });
      return;
    }

    insertBreak();
  };

  editor.normalizeNode = entry => {
    const [node, path] = entry;
    if (Element.isElement(node) || Editor.isEditor(node)) {
      const isElementBeingNormalizedAList = isListNode(node);
      for (const [childNode, childPath] of Node.children(editor, path)) {
        const index = childPath[childPath.length - 1];
        // merge sibling lists
        if (isListNode(childNode)) {
          if (
            node.children[childPath[childPath.length - 1] + 1]?.type ===
            childNode.type
          ) {
            const siblingNodePath = Path.next(childPath);
            moveChildren(editor, siblingNodePath, [
              ...childPath,
              childNode.children.length,
            ]);
            Transforms.removeNodes(editor, { at: siblingNodePath });
            return;
          }
          if (isElementBeingNormalizedAList) {
            const previousChild = node.children[index - 1];
            if (Element.isElement(previousChild)) {
              Transforms.moveNodes(editor, {
                at: childPath,
                to: [
                  ...Path.previous(childPath),
                  previousChild.children.length - 1,
                ],
              });
            } else {
              Transforms.unwrapNodes(editor, { at: childPath });
            }
            return;
          }
        }
        if (
          node.type === 'list-item' &&
          childNode.type !== 'list-item-content' &&
          index === 0 &&
          isBlock(childNode)
        ) {
          if (path[path.length - 1] !== 0) {
            const previousChild = Node.get(editor, Path.previous(path));

            if (Element.isElement(previousChild)) {
              Transforms.moveNodes(editor, {
                at: path,
                to: [...Path.previous(path), previousChild.children.length],
              });
              return;
            }
          }
          Transforms.unwrapNodes(editor, { at: childPath });
          return;
        }
        if (
          node.type === 'list-item' &&
          childNode.type === 'list-item-content' &&
          index !== 0
        ) {
          Transforms.splitNodes(editor, { at: childPath });
          return;
        }
      }
    }

    normalizeNode(entry);
  };
  return editor;
}
