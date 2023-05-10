import { ReferenceElement } from '@floating-ui/react';
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

/**
 * Only one popover may be open at any time. The most recent "open" event should
 * call the `onClose()` method of any others and be the one that is rendered.
 */

type EditorPopoverContextValue = ReturnType<
  typeof useState<ReferenceElement | null>
>;
const noop = () => {};

const EditorPopoverContext = createContext<EditorPopoverContextValue>([
  null,
  noop,
]);

export const useEditorPopover = () => {
  const context = useContext(EditorPopoverContext);
  if (!context) {
    throw new Error(
      '`useEditorPopover` must be used within an `EditorPopoverProvider`.'
    );
  }
  return context;
};

export const EditorPopoverProvider = (props: PropsWithChildren) => {
  const state = useState<ReferenceElement | null>(null);
  return (
    <EditorPopoverContext.Provider value={state}>
      {props.children}
    </EditorPopoverContext.Provider>
  );
};
