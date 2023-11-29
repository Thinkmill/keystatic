import { ReactNode } from 'react';

import {
  BaseStyleProps,
  FontSizeText,
  classNames,
  css,
  filterStyleProps,
  toDataAttributes,
  tokenSchema,
  useStyleProps,
} from '@keystar/ui/style';
import { forwardRefWithAs } from '@keystar/ui/utils/ts';

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
  const styleProps = useProseStyleProps(otherProps);

  return (
    <ElementType ref={ref} {...filterStyleProps(otherProps)} {...styleProps}>
      {children}
    </ElementType>
  );
});

export function useProseStyleProps(props: ProseProps) {
  const { size = 'medium', ...otherProps } = props;
  const styleProps = useStyleProps(otherProps);

  return {
    ...styleProps,
    ...toDataAttributes({ size }),
    className: classNames(
      css({
        color: tokenSchema.color.foreground.neutral,
        fontFamily: tokenSchema.typography.fontFamily.base,
        height: '100%',
        maxWidth: '100%',
        minHeight: 0,
        minWidth: 0,
        position: 'relative',
        overflowWrap: 'break-word',
        whiteSpace: 'break-spaces',

        fontVariantLigatures: 'none',
        fontFeatureSettings: '"liga" 0', // the above doesn't seem to work in Edge
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

        '& :is(blockquote, p, pre, ol, ul, table)': {
          marginBlock: '0.75em',

          ':first-child': { marginTop: 0 },
          ':last-child': { marginBottom: 0 },
        },
        'ol, ul': {
          paddingInlineStart: '1em',
        },
        'ol ol, ul ul, ol ul, ul ol': {
          marginBlock: 0,
        },
        'li :is(blockquote, p, pre, ol, ul, table)': {
          marginBottom: 0,
        },
        blockquote: {
          borderInlineStart: `${tokenSchema.size.border.large} solid ${tokenSchema.color.foreground.neutral}`,
          marginInline: 0,
          paddingInlineStart: '1em',
        },
        hr: {
          backgroundColor: tokenSchema.color.alias.borderIdle,
          border: 0,
          borderRadius: tokenSchema.size.border.medium,
          height: tokenSchema.size.border.medium,
          marginBlock: '1.5em',
        },

        // inline elements
        img: {
          height: 'auto',
          maxWidth: '100%',
        },
        strong: {
          fontWeight: tokenSchema.typography.fontWeight.semibold,
        },
        a: {
          color: tokenSchema.color.foreground.accent,
        },

        // code block
        pre: {
          backgroundColor: tokenSchema.color.background.surface,
          borderRadius: tokenSchema.size.radius.medium,
          color: tokenSchema.color.foreground.neutralEmphasis,
          fontFamily: tokenSchema.typography.fontFamily.code,
          fontSize: '0.85em',
          lineHeight: tokenSchema.typography.lineheight.medium,
          minWidth: 0,
          maxWidth: '100%',
          overflow: 'auto',
          padding: tokenSchema.size.space.medium,
          whiteSpace: 'pre-wrap',
        },
        'pre > code': {
          fontFamily: 'inherit',
        },
        // inline code
        '& :not(pre) > code': {
          backgroundColor: tokenSchema.color.background.accent,
          borderRadius: tokenSchema.size.radius.small,
          color: tokenSchema.color.foreground.neutralEmphasis,
          display: 'inline-block',
          fontSize: '0.85em',
          fontFamily: tokenSchema.typography.fontFamily.code,
          paddingInline: tokenSchema.size.space.small,
        },

        // Headings
        // ---------------------------------------------------------------------

        '& :is(h1, h2, h3, h4, h5, h6)': {
          color: tokenSchema.color.foreground.neutralEmphasis,
          lineHeight: 1.25,
          marginTop: '1.5em',
          marginBottom: '0.67em',

          ':first-child': { marginTop: 0 },
          ':last-child': { marginBottom: 0 },
        },
        h1: {
          fontSize: '2em',
          fontWeight: tokenSchema.typography.fontWeight.bold,
        },
        h2: {
          fontSize: '1.5em',
          fontWeight: tokenSchema.typography.fontWeight.bold,
        },
        h3: {
          fontSize: '1.25em',
          fontWeight: tokenSchema.typography.fontWeight.bold,
        },
        h4: {
          fontSize: '1.1em',
          fontWeight: tokenSchema.typography.fontWeight.semibold,
        },
        h5: {
          fontSize: '1em',
          fontWeight: tokenSchema.typography.fontWeight.semibold,
        },
        h6: {
          fontSize: '0.9em',
          fontWeight: tokenSchema.typography.fontWeight.semibold,
          letterSpacing: '0.0125em',
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
