import { useVisuallyHidden } from '@react-aria/visually-hidden';
import { ItemDropTarget } from '@react-types/shared';
import { assert } from 'emery';
import { useRef } from 'react';

import {
  classNames,
  css,
  toDataAttributes,
  tokenSchema,
} from '@keystar/ui/style';

import { useListViewContext } from './context';

interface InsertionIndicatorProps {
  target: ItemDropTarget;
  isPresentationOnly?: boolean;
}

export default function InsertionIndicator(props: InsertionIndicatorProps) {
  let { dropState, dragAndDropHooks } = useListViewContext();
  const { target, isPresentationOnly } = props;

  assert(
    !!dragAndDropHooks.useDropIndicator,
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

  let maskColor = tokenSchema.color.background.canvas;
  let borderColor = tokenSchema.color.background.accentEmphasis;
  let borderSize = tokenSchema.size.border.medium;
  let circleSize = tokenSchema.size.space.regular;

  return (
    <div role="row" aria-hidden={dropIndicatorProps['aria-hidden']}>
      <div
        role="gridcell"
        aria-selected="false"
        {...toDataAttributes({ dropTarget: isDropTarget })}
        className={classNames(
          css({
            insetInlineStart: circleSize,
            outline: 'none',
            position: 'absolute',
            width: `calc(100% - (2 * ${circleSize}))`,

            '&[data-drop-target=true]': {
              borderBottom: `${borderSize} solid ${borderColor}`,

              '&::before': {
                left: `calc(${circleSize} * -1)`,
              },

              '&::after': {
                right: `calc(${circleSize} * -1)`,
              },

              '&::before, &::after': {
                backgroundColor: maskColor,
                border: `${borderSize} solid ${borderColor}`,
                borderRadius: '50%',
                content: '" "',
                height: circleSize,
                position: 'absolute',
                top: `calc(${circleSize} / -2 - ${borderSize} / 2)`,
                width: circleSize,
                zIndex: 5,
              },
            },
          })
        )}
      >
        {!isPresentationOnly && (
          <div
            {...visuallyHiddenProps}
            role="button"
            {...dropIndicatorProps}
            ref={ref}
          />
        )}
      </div>
    </div>
  );
}
