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
  let { rowProps, target, visibleRect } = props;
  let { dropState, dragAndDropHooks } = useTableContext();
  let ref = useRef<HTMLDivElement>(null);

  assert(
    !!dragAndDropHooks?.useDropIndicator,
    'dragAndDropHooks.useDropIndicator is not defined.'
  );
  assert(!!dropState, 'dropState is not defined.');

  // if the indicator is rendered dnd hooks are defined
  // eslint-disable-next-line react-compiler/react-compiler
  let { dropIndicatorProps } = dragAndDropHooks.useDropIndicator(
    props,
    dropState,
    ref
  );
  let { visuallyHiddenProps } = useVisuallyHidden();

  let isDropTarget = dropState && dropState.isDropTarget(target);

  if (!isDropTarget && dropIndicatorProps['aria-hidden']) {
    return null;
  }

  let rowTop = Number(rowProps?.style?.top) ?? 0;
  let rowHeight = Number(rowProps?.style?.height) ?? 0;

  return (
    <div
      style={{
        left: visibleRect.x,
        position: 'absolute',
        top: rowTop + (target.dropPosition === 'after' ? rowHeight : 0),
        width: visibleRect.width,
        zIndex: 4,
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
