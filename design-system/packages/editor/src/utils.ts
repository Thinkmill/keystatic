import {
  Middleware,
  flip,
  inline,
  limitShift,
  offset,
  shift,
} from '@floating-ui/react';
import { EditorPopoverProps } from './types';

const DEFAULT_OFFSET = 8;

export function getMiddleware(
  props: EditorPopoverProps
): Array<Middleware | null | undefined | false> {
  const { sticky } = props;

  if (sticky) {
    return [
      offset(DEFAULT_OFFSET),
      shift({
        crossAxis: true,
        padding: DEFAULT_OFFSET,
        limiter: limitShift({
          offset: ({ rects }) => ({
            crossAxis: rects.floating.height,
          }),
        }),
      }),
    ];
  }

  return [
    offset(DEFAULT_OFFSET),
    flip({ padding: DEFAULT_OFFSET }),
    shift({ padding: DEFAULT_OFFSET }),
    inline(),
  ];
}
