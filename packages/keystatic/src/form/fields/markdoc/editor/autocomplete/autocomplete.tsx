import {
  EditorListboxProps,
  EditorPopover,
  useEditorListbox,
} from '../new-primitives';
import { useMemo } from 'react';
import { useEditorViewRef } from '../editor-view';
import { useEditorKeydownListener } from '../keydown';
import { useEditorReferenceElement } from '../popovers/reference';

export function EditorAutocomplete<Item extends object>(
  props: Omit<EditorListboxProps<Item>, 'listenerRef'> & {
    from: number;
    to: number;
  }
) {
  const viewRef = useEditorViewRef();
  const referenceElement = useEditorReferenceElement(props.from, props.to);
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
    referenceElement && (
      <EditorPopover
        reference={referenceElement}
        placement="bottom-start"
        adaptToViewport="stretch"
        minWidth="element.medium"
      >
        {listbox}
      </EditorPopover>
    )
  );
}
