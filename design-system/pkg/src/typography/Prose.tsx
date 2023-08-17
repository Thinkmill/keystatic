import { ReactNode } from 'react';

import {
  BaseStyleProps,
  FontSizeText,
  classNames,
  css,
  filterStyleProps,
  tokenSchema,
  useStyleProps,
} from '@keystar/ui/style';
import { forwardRefWithAs } from '@keystar/ui/utils/ts';
import { toDataAttributes } from '../utils';

export type ProseProps = {
  /** The content to render. */
  children?: ReactNode;
  /**
   * The size of body text.
   * @default 'medium'
   */
  size?: FontSizeText;
} & BaseStyleProps;

/** A typographic component that adds styles for rendering remote HTML content. */
export const Prose = forwardRefWithAs<ProseProps, 'div'>((props, ref) => {
  const { children, elementType: ElementType = 'div', ...otherProps } = props;
  const styleProps = useProseStyles(otherProps);

  return (
    <ElementType ref={ref} {...filterStyleProps(otherProps)} {...styleProps}>
      {children}
    </ElementType>
  );
});

function useProseStyles(props: ProseProps) {
  const { size = 'medium', ...otherProps } = props;
  const styleProps = useStyleProps(otherProps);

  return {
    ...styleProps,
    ...toDataAttributes({ size }),
    className: classNames(
      'ksv:Prose',
      css({
        color: tokenSchema.color.foreground.neutral,
        fontFamily: tokenSchema.typography.fontFamily.base,
        height: '100%',
        maxWidth: '100%',
        minHeight: 0,
        minWidth: 0,
        MozOsxFontSmoothing: 'auto',
        WebkitFontSmoothing: 'auto',

        '&[data-size="small"]': {
          fontSize: tokenSchema.typography.text.small.size,
          lineHeight: 1.6,
        },
        '&[data-size="regular"]': {
          fontSize: tokenSchema.typography.text.regular.size,
          lineHeight: 1.5,
        },
        '&[data-size="medium"]': {
          fontSize: tokenSchema.typography.text.medium.size,
          lineHeight: 1.5,
        },
        '&[data-size="large"]': {
          fontSize: tokenSchema.typography.text.large.size,
          lineHeight: 1.4,
        },

        // Elements
        // ---------------------------------------------------------------------

        '& :is(blockquote, p, ol, ul)': {
          marginBlock: '1em',

          ':first-child': { marginTop: 0 },
          ':last-child': { marginBottom: 0 },
        },
        'ol ol, ul ul, ol ul, ul ol': {
          marginBlock: 0,
        },
        blockquote: {
          borderInlineStart: `${tokenSchema.size.border.large} solid ${tokenSchema.color.border.neutral}`,
          marginInline: '1em',
          paddingInlineStart: '1em',
        },
        hr: {
          marginBlock: '1.5em',
          backgroundColor: tokenSchema.color.alias.borderIdle,
          border: 0,
          height: tokenSchema.size.border.medium,
        },
        img: {
          height: 'auto',
          maxWidth: '100%',
        },
        a: {
          color: tokenSchema.color.foreground.accent,
        },

        // Headings
        // ---------------------------------------------------------------------

        'h1, h2, h3, h4, h5, h6': {
          color: tokenSchema.color.foreground.neutralEmphasis,
          fontWeight: 600,
          lineHeight: 1.25,
          marginTop: '1.5em',
          marginBottom: '0.67em',

          ':first-child': { marginTop: 0 },
          ':last-child': { marginBottom: 0 },
        },
        h1: {
          fontSize: '2em',
        },
        h2: {
          fontSize: '1.5em',
        },
        h3: {
          fontSize: '1.25em',
        },
        h4: {
          fontSize: '1.1em',
        },
        h5: {
          fontSize: '1em',
        },
        h6: {
          fontSize: '0.9em',
        },
        ...getListStyles(),
      }),
      styleProps.className
    ),
  };
}

function getListStyles() {
  let styles: any = {};

  let listDepth = 10;
  const orderedListStyles = ['lower-roman', 'decimal', 'lower-alpha'];
  const unorderedListStyles = ['square', 'disc', 'circle'];

  while (listDepth--) {
    let arr = Array.from({ length: listDepth });
    if (arr.length) {
      styles[arr.map(() => `ol`).join(' ')] = {
        listStyle: orderedListStyles[listDepth % 3],
      };
      styles[arr.map(() => `ul`).join(' ')] = {
        listStyle: unorderedListStyles[listDepth % 3],
      };
    }
  }
  return styles;
}
