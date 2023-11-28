import { useMemo } from 'react';

import { EditorPopover } from '@keystar/ui/editor';

import { useEditorViewRef } from '../editor-view';
import { useEditorKeydownListener } from '../keydown';
import { useEditorReferenceElement } from '../popovers/reference';
import { EditorListboxProps, useEditorListbox } from './EditorListbox';
import { useBoundaryRect } from '../popovers';

export function EditorAutocomplete<Item extends object>(
  props: Omit<EditorListboxProps<Item>, 'listenerRef'> & {
    from: number;
    to: number;
  }
) {
  const boundary = useBoundaryRect();
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
        adaptToBoundary="stretch"
        boundary={boundary}
        minWidth="element.medium"
        placement="bottom-start"
        reference={referenceElement}
      >
        {listbox}
      </EditorPopover>
    )
  );
}
