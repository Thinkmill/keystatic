import { useVisuallyHidden } from '@react-aria/visually-hidden';
import { assert } from 'emery';
import { useRef } from 'react';

import { useListViewContext } from './context';

export default function RootDropIndicator() {
  let { dropState, dragAndDropHooks } = useListViewContext();
  let ref = useRef<HTMLDivElement>(null);

  assert(
    !!dragAndDropHooks.useDropIndicator,
    'dragAndDropHooks.useDropIndicator is not defined.'
  );

  // eslint-disable-next-line react-compiler/react-compiler
  let { dropIndicatorProps } = dragAndDropHooks.useDropIndicator(
    {
      target: { type: 'root' },
    },
    dropState,
    ref
  );
  let isDropTarget = dropState.isDropTarget({ type: 'root' });
  let { visuallyHiddenProps } = useVisuallyHidden();

  if (!isDropTarget && dropIndicatorProps['aria-hidden']) {
    return null;
  }

  return (
    <div role="row" aria-hidden={dropIndicatorProps['aria-hidden']}>
      <div role="gridcell" aria-selected="false">
        <div
          role="button"
          {...visuallyHiddenProps}
          {...dropIndicatorProps}
          ref={ref}
        />
      </div>
    </div>
  );
}
