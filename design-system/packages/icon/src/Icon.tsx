import React, { SVGProps } from 'react';

import { useSlotProps } from '@voussoir/slots';
import {
  classNames,
  css,
  maybeTokenByKey,
  tokenSchema,
  useStyleProps,
} from '@voussoir/style';
import { IconProps } from '@voussoir/types';
import { filterDOMProps, toDataAttributes } from '@voussoir/utils';

export const Icon = (props: IconProps) => {
  props = useSlotProps(props, 'icon');
  const { strokeScaling, size, color, ...otherProps } = props;
  const stroke = maybeTokenByKey('color.foreground', color) ?? 'currentColor';

  const iconClassName = css({
    fill: 'none',
    stroke: 'var(--ksv-icon-stroke)',
    flexShrink: 0,
    height: tokenSchema.size.icon.regular,
    width: tokenSchema.size.icon.regular,

    '&[data-size=small]': {
      height: tokenSchema.size.icon.small,
      width: tokenSchema.size.icon.small,
    },
    '&[data-size=medium]': {
      height: tokenSchema.size.icon.medium,
      width: tokenSchema.size.icon.medium,
    },
    '&[data-size=large]': {
      height: tokenSchema.size.icon.large,
      width: tokenSchema.size.icon.large,
    },

    // Maintain stroke width, no matter the size.
    // @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/vector-effect#non-scaling-stroke
    '&[data-stroke-scaling=false] > *': {
      vectorEffect: 'non-scaling-stroke',
    },
  });
  const styleProps = useStyleProps(otherProps) as SVGProps<SVGSVGElement>;

  return React.cloneElement(props.src as React.ReactSVGElement, {
    ...toDataAttributes({ strokeScaling, size }),
    ...filterDOMProps(otherProps),
    'aria-hidden': 'true',
    focusable: 'false',
    role: 'img',
    className: classNames(iconClassName, styleProps.className),
    style: {
      '--ksv-icon-stroke': stroke,
      ...styleProps.style,
    },
  });
};
