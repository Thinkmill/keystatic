import { classNames, css, tokenSchema } from '@keystar/ui/style';
import React, { HTMLAttributes } from 'react';

export function InsertionIndicatorPrimitive(
  props: { isDropTarget?: boolean } & HTMLAttributes<HTMLDivElement>
) {
  let { children, isDropTarget, ...otherProps } = props;
  let maskColor = tokenSchema.color.background.canvas;
  let borderColor = tokenSchema.color.background.accentEmphasis;
  let borderSize = tokenSchema.size.border.medium;
  let circleSize = tokenSchema.size.space.regular;

  return (
    <div
      data-drop-target={isDropTarget}
      {...otherProps}
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
        }),
        otherProps.className
      )}
    >
      {children}
    </div>
  );
}
