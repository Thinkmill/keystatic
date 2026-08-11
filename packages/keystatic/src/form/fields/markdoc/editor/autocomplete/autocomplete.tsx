import { EditorPopover } from '@keystar/ui/editor';

import { useEditorReferenceElement } from '../popovers/reference';
import { EditorListbox, EditorListboxProps } from './EditorListbox';

export function EditorAutocomplete<Item extends object>(
  props: EditorListboxProps<Item> & {
    from: number;
    to: number;
  }
) {
  const referenceElement = useEditorReferenceElement(props.from, props.to);
  return (
    referenceElement && (
      <EditorPopover
        adaptToBoundary="stretch"
        portal={false}
        minWidth="element.medium"
        placement="bottom-start"
        reference={referenceElement}
      >
        <EditorListbox
          {...props}
          UNSAFE_style={{ width: 320, ...props.UNSAFE_style }}
        />
      </EditorPopover>
    )
  );
}
