import { useVisuallyHidden } from '@react-aria/visually-hidden';
import { ItemDropTarget } from '@react-types/shared';
import { assert } from 'emery';
import { useRef } from 'react';

import { InsertionIndicatorPrimitive } from '@keystar/ui/drag-and-drop';

import { useListViewContext } from './context';

interface InsertionIndicatorProps {
  target: ItemDropTarget;
  isPresentationOnly?: boolean;
}

export function InsertionIndicator(props: InsertionIndicatorProps) {
  let { dropState, dragAndDropHooks } = useListViewContext();
  const { target, isPresentationOnly } = props;

  assert(
    !!dragAndDropHooks.useDropIndicator,
    'dragAndDropHooks.useDropIndicator is not defined.'
  );

  let ref = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line react-compiler/react-compiler
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

  return (
    <div role="row" aria-hidden={dropIndicatorProps['aria-hidden']}>
      <InsertionIndicatorPrimitive
        role="gridcell"
        aria-selected="false"
        isDropTarget={isDropTarget}
      >
        {!isPresentationOnly && (
          <div
            {...visuallyHiddenProps}
            role="button"
            {...dropIndicatorProps}
            ref={ref}
          />
        )}
      </InsertionIndicatorPrimitive>
    </div>
  );
}
