import { useVisuallyHidden } from '@react-aria/visually-hidden';
import { FocusableElement, ItemDropTarget } from '@react-types/shared';
import { assert } from 'emery';
import React, { DOMAttributes, HTMLAttributes, useRef } from 'react';

import { InsertionIndicatorPrimitive } from '@keystar/ui/drag-and-drop';

import { useTableContext } from './context';
import { Rect } from '@react-stately/virtualizer';

interface InsertionIndicatorProps {
  rowProps: HTMLAttributes<HTMLElement> & DOMAttributes<FocusableElement>;
  target: ItemDropTarget;
  visibleRect: Rect;
}

export function InsertionIndicator(props: InsertionIndicatorProps) {
  let { dropState, dragAndDropHooks } = useTableContext();
  const { rowProps, target, visibleRect } = props;

  assert(
    !!dragAndDropHooks?.useDropIndicator,
    'dragAndDropHooks.useDropIndicator is not defined.'
  );

  let ref = useRef<HTMLDivElement>(null);
  let { dropIndicatorProps } = dragAndDropHooks.useDropIndicator(
    props,
    dropState,
    ref
  );
  let { visuallyHiddenProps } = useVisuallyHidden();

  let isDropTarget = dropState.isDropTarget(target);

  if (!isDropTarget && dropIndicatorProps['aria-hidden']) {
    return null;
  }

  console.log('rowProps', rowProps);

  return (
    <div
      style={{
        position: 'absolute',
        top:
          (rowProps?.style?.top as number) +
          (target.dropPosition === 'after'
            ? (rowProps?.style?.height as number)
            : 0),
        // width: rowProps?.style?.width,
        width: visibleRect.width,
        zIndex: 5,
      }}
      role="row"
      aria-hidden={dropIndicatorProps['aria-hidden']}
    >
      <InsertionIndicatorPrimitive role="gridcell" isDropTarget={isDropTarget}>
        <div
          {...visuallyHiddenProps}
          role="button"
          {...dropIndicatorProps}
          ref={ref}
        />
      </InsertionIndicatorPrimitive>
    </div>
  );
}
