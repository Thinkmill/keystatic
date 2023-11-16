import { useButton } from '@react-aria/button';
import { DragPreview, useDrag, useDrop } from '@react-aria/dnd';
import { mergeProps } from '@react-aria/utils';
import React, { useRef } from 'react';

export function Draggable(props: any) {
  let preview = useRef(null);
  let { dragProps, isDragging } = useDrag({
    getItems() {
      return [
        {
          'text/plain': 'hello world',
        },
      ];
    },
    preview,
    ...props,
  });

  return (
    <>
      <div {...dragProps} role="button" tabIndex={0} data-dragging={isDragging}>
        {props.children || 'Drag me'}
      </div>
      {props.renderPreview && (
        <DragPreview ref={preview}>{props.renderPreview}</DragPreview>
      )}
    </>
  );
}

export function Droppable(props: any) {
  let ref = useRef(null);
  let { dropProps, isDropTarget } = useDrop({
    ref,
    ...props,
  });

  let { buttonProps } = useButton({ elementType: 'div' }, ref);

  return (
    <div
      {...mergeProps(dropProps, buttonProps)}
      ref={ref}
      data-droptarget={isDropTarget}
    >
      {props.children || 'Drop here'}
    </div>
  );
}
