import { css } from '@keystar-ui/style';
import React, {
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import { Editor, Element, Node, PathRef, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

export function focusWithPreviousSelection(editor: Editor) {
  const selection = window.getSelection();
  if (selection) {
    selection.removeAllRanges();
    selection.addRange(ReactEditor.toDOMRange(editor, editor.selection!));
  }
  ReactEditor.focus(editor);
}

export const blockElementSpacing = css({
  marginBlock: '1em',
  '&:first-child': {
    marginBlockStart: 0,
  },
  '&:last-child': {
    marginBlockEnd: 0,
  },
});

const ForceValidationContext = React.createContext(false);

export const ForceValidationProvider = ForceValidationContext.Provider;

export function useForceValidation() {
  return useContext(ForceValidationContext);
}

// this ensures that when changes happen, they are immediately shown
// this stops the problem of a cursor resetting to the end when a change is made
// because the changes are applied asynchronously
export function useElementWithSetNodes<TElement extends Element>(
  editor: Editor,
  element: TElement
) {
  const [state, setState] = useState({ element, elementWithChanges: element });
  if (state.element !== element) {
    setState({ element, elementWithChanges: element });
  }

  const elementRef = useRef(element);

  useEffect(() => {
    elementRef.current = element;
  });

  const setNodes = useCallback(
    (
      changesOrCallback:
        | Partial<TElement>
        | ((current: TElement) => Partial<TElement>)
    ) => {
      const currentElement = elementRef.current;
      const changes =
        typeof changesOrCallback === 'function'
          ? changesOrCallback(currentElement)
          : changesOrCallback;
      Transforms.setNodes(editor, changes, {
        at: ReactEditor.findPath(editor, currentElement),
      });
      setState({
        element: currentElement,
        elementWithChanges: { ...currentElement, ...changes },
      });
    },
    [editor]
  );
  return [state.elementWithChanges, setNodes] as const;
}

export function useEventCallback<Func extends (...args: any) => any>(
  callback: Func
): Func {
  const callbackRef = useRef(callback);
  const cb = useCallback((...args: any[]) => {
    return callbackRef.current(...args);
  }, []);
  useEffect(() => {
    callbackRef.current = callback;
  });
  return cb as any;
}

export function insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(
  editor: Editor,
  nodes: Node | Node[]
) {
  let pathRefForEmptyNodeAtCursor: PathRef | undefined;
  const entry = Editor.above(editor, {
    match: node => node.type === 'heading' || node.type === 'paragraph',
  });
  if (entry && Node.string(entry[0]) === '') {
    pathRefForEmptyNodeAtCursor = Editor.pathRef(editor, entry[1]);
  }
  Transforms.insertNodes(editor, nodes);
  let path = pathRefForEmptyNodeAtCursor?.unref();
  if (path) {
    Transforms.removeNodes(editor, { at: path });
    // even though the selection is in the right place after the removeNodes
    // for some reason the editor blurs so we need to focus it again
    ReactEditor.focus(editor);
  }
}
