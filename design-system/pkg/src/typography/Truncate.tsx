import { HTMLAttributes } from 'react';

import { css } from '@keystar/ui/style';
import { isReactText } from '@keystar/ui/utils';

type TruncateProps = {
  /**
   * Limit the contents of the element to the specified number of lines, or
   * provide a shorthand boolean to conveniently express a single line.
   */
  lines: number | true;
} & HTMLAttributes<HTMLSpanElement>;

/** @private Truncate text with an ellipsis after the specified number of lines */
export function Truncate({ lines, title, ...props }: TruncateProps) {
  const className = useTruncateStyles(typeof lines === 'boolean' ? 1 : lines);
  return (
    <span
      className={className}
      title={
        title ??
        (isReactText(props.children) ? props.children.toString() : undefined)
      }
      {...props}
    />
  );
}

export function useTruncateStyles(lineClamp: number) {
  return css({
    display: '-webkit-box',
    WebkitLineClamp: lineClamp,
    textOverflow: 'ellipsis',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  });
}
