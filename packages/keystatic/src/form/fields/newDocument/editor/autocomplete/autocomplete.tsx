import {
  EditorListboxProps,
  EditorPopover,
  VirtualElement,
  useEditorListbox,
} from '@voussoir/editor';
import { useMemo, useState } from 'react';
import {
  useEditorViewRef,
  useLayoutEffectWithEditorUpdated,
} from '../editor-view';
import { useEditorKeydownListener } from '../keydown';

export function EditorAutocomplete<Item extends object>(
  props: Omit<EditorListboxProps<Item>, 'listenerRef'> & {
    from: number;
    to: number;
  }
) {
  const viewRef = useEditorViewRef();
  const [referenceElement, setReferenceElement] = useState<VirtualElement>({
    getBoundingClientRect() {
      const coords = viewRef.current!.coordsAtPos(props.from, props.to);
      return {
        x: coords.left,
        y: coords.top,
        width: coords.right - coords.left,
        height: coords.bottom - coords.top,
        top: coords.top,
        right: coords.right,
        bottom: coords.bottom,
        left: coords.left,
      };
    },
  });
  useLayoutEffectWithEditorUpdated(() => {
    const node = viewRef.current!.domAtPos(props.from).node;
    const contextElement = node instanceof Element ? node : node.parentElement;
    setReferenceElement(prevState => {
      return prevState.contextElement === contextElement
        ? prevState
        : {
            getBoundingClientRect: prevState.getBoundingClientRect,
            contextElement: contextElement ?? undefined,
          };
    });
  });
  const listenerRef = useMemo(() => {
    return {
      get current() {
        return viewRef.current?.dom ?? null;
      },
    };
  }, [viewRef]);
  const { keydownListener, listbox } = useEditorListbox({
    listenerRef,
    ...props,
    UNSAFE_style: { width: 320, ...props.UNSAFE_style },
  });
  useEditorKeydownListener(event => {
    keydownListener(event);
    return event.defaultPrevented;
  });
  return (
    <EditorPopover
      reference={referenceElement}
      placement="bottom-start"
      adaptToViewport="stretch"
      minWidth="element.medium"
    >
      {listbox}
    </EditorPopover>
  );
}
