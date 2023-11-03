import {
  ClassList,
  css,
  maybeTokenByKey,
  tokenSchema,
  useStyleProps,
} from '@keystar/ui/style';
import { PartialRequired, TextProps } from '@keystar/ui/types';

import { useTextContext } from './context';
import { getTrimStyles } from '../getTrimStyles';

export const textClassList = new ClassList('Text');

export function useTextStyles(
  props: PartialRequired<TextProps, 'color' | 'size' | 'weight'>
) {
  const prevContext = useTextContext();
  const {
    align,
    casing,
    overflow = 'breakword',
    size,
    color,
    trim = !prevContext,
    variant,
    weight,
    UNSAFE_className,
    ...otherProps
  } = props;

  const fontDefinition = tokenSchema.typography.text[size];
  const trimStyles = trim ? getTrimStyles(fontDefinition) : null;
  const styles = [
    {
      color: maybeTokenByKey('color.foreground', color),
      fontFamily: tokenSchema.typography.fontFamily.base,
      fontSize: fontDefinition.size,
      fontVariantNumeric: variant,
      fontWeight:
        weight === 'inherit'
          ? undefined
          : tokenSchema.typography.fontWeight[weight],
      minWidth: 0,
      textAlign: align ? alignmentMap[align] : undefined,
      textTransform: casing,
    },
    textOptimizationStyles,
    overflow && overflowMap[overflow],
    trimStyles,
  ];

  return useStyleProps({
    ...otherProps,
    UNSAFE_className: [
      css(styles),
      UNSAFE_className,
      textClassList.element('root'),
    ],
  });
}

// Constants
// ----------------------------------------------------------------------------

export const textOptimizationStyles = {
  MozOsxFontSmoothing: 'auto',
  WebkitFontSmoothing: 'auto',
} as const;

const alignmentMap = {
  start: 'start',
  center: 'center',
  end: 'end',
  FORCE_left: 'left',
  FORCE_right: 'right',
} as const;

const overflowMap = {
  unset: {},
  nowrap: {
    whiteSpace: 'nowrap',
  },
  breakword: {
    // hyphens: 'auto', // too eager
    overflowWrap: 'break-word',
  },
} as const;
