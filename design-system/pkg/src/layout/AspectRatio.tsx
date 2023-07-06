import { filterDOMProps } from '@react-aria/utils';
import { DOMProps } from '@react-types/shared';
import { ReactNode } from 'react';

import {
  BaseStyleProps,
  classNames,
  css,
  Responsive,
  useResponsiveValue,
  useStyleProps,
} from '@keystar/ui/style';

type RatioType = `${number}` | `${number}/${number}`;

export type AspectRatioProps = {
  /**
   * Content to be displayed at the specified aspect-ratio.
   */
  children: ReactNode;
  /**
   * The preferred aspect ratio for the box, which will be used in the
   * calculation of auto sizes and some other layout functions. See
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio).
   */
  value: Responsive<RatioType>;
} & BaseStyleProps &
  DOMProps;

/**
 * Present responsive media, such as images and videos or anything within an
 * iFrame, at a specific aspect ratio.
 */
export function AspectRatio(props: AspectRatioProps) {
  const { children, value, ...otherProps } = props;
  const styleProps = useStyleProps(otherProps);
  const responsiveValue = useResponsiveValue();

  return (
    <div
      {...filterDOMProps(otherProps)}
      className={classNames(
        css({
          position: 'relative',

          '> *': {
            height: '100%',
            inset: 0,
            position: 'absolute',
            width: '100%',
          },
        }),
        styleProps.className
      )}
      style={{
        aspectRatio: responsiveValue(value),
        ...styleProps.style,
      }}
    >
      {children}
    </div>
  );
}
