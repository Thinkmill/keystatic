import { arrowUpIcon } from '@keystar/ui/icon/icons/arrowUpIcon';
import { Icon } from '@keystar/ui/icon';
import {
  ClassList,
  classNames,
  css,
  toDataAttributes,
  tokenSchema,
  transition,
  useStyleProps,
} from '@keystar/ui/style';
import { CSSProperties, HTMLAttributes } from 'react';

import { TableProps } from './types';

export const tableViewClassList = new ClassList('TableView', [
  'cell',
  'cell-wrapper',
  'row',
]);

// ============================================================================
// UTILS
// ============================================================================

// function getStyleFromColumn(props: CellProps) {
//   const { maxWidth, minWidth, width } = props;

//   if (width) {
//     return { flex: '0 0 auto', width, maxWidth, minWidth };
//   }

//   return { maxWidth, minWidth };
// }

// ============================================================================
// COMPONENTS
// ============================================================================

export const CellContents = (props: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={css({
        flex: 1,

        // align with checkboxes
        [`${tableViewClassList.selector('root')}[data-overflow-mode="wrap"] &`]:
          {
            paddingTop: `calc((${tokenSchema.size.element.xsmall} - ${tokenSchema.typography.text.regular.capheight}) / 2)`,
          },
      })}
      {...props}
    />
  );
};

export const SortIndicator = () => {
  // fix alignment: reduce the space the icon takes up, w/o affecting the icon layout itself
  let labelHeight = tokenSchema.typography.text.regular.capheight;

  return (
    <span
      aria-hidden="true"
      className={css({
        alignItems: 'center',
        display: 'flex',
        flexShrink: 0,
        height: labelHeight,
        justifyContent: 'center',
        marginInline: tokenSchema.size.space.small,
        opacity: 0,
        position: 'relative',
        transition: transition(['opacity', 'transform'], {
          easing: 'easeOut',
        }),
        width: labelHeight,

        svg: {
          position: 'absolute',
        },

        ['[aria-sort="ascending"] &, [aria-sort="descending"] &']: {
          opacity: 1,
        },
        ['[aria-sort="descending"] &']: {
          transform: 'rotate(180deg)',
        },
      })}
    >
      <Icon src={arrowUpIcon} />
    </span>
  );
};

// ============================================================================
// HOOKS
// ============================================================================

// Table root
// ----------------------------------------------------------------------------

export function useTableStyleProps<T>(props: TableProps<T>) {
  let { density, overflowMode, prominence } = props;
  let styleProps = useStyleProps(props);

  return {
    ...toDataAttributes({ density, overflowMode, prominence }),
    className: classNames(
      tableViewClassList.element('root'),
      styleProps.className,
      css({
        display: 'flex',
        flexDirection: 'column',
        isolation: 'isolate',
        minHeight: 0,
        minWidth: 0,
        outline: 'none',
        position: 'relative',
        userSelect: 'none',
      })
    ),
    style: styleProps.style,
  };
}

// Row group (head/body/foot)
// ----------------------------------------------------------------------------

export function useHeaderWrapperStyleProps({
  style,
}: {
  style?: CSSProperties;
} = {}) {
  return {
    className: css({
      overflow: 'hidden',
      position: 'relative',
      boxSizing: 'content-box',
      flex: 'none',
      // keep aligned with the border of the body
      [`${tableViewClassList.selector('root')}:not([data-prominence="low"]) &`]:
        {
          borderLeft: `${tokenSchema.size.border.regular} solid transparent`,
          borderRight: `${tokenSchema.size.border.regular} solid transparent`,
        },
    }),
    style,
  };
}
export function useHeadStyleProps({ style }: { style?: CSSProperties } = {}) {
  return {
    className: css({
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
    }),
    style,
  };
}
export function useBodyStyleProps({ style }: { style?: CSSProperties } = {}) {
  return {
    className: css({
      [`${tableViewClassList.selector('root')}[data-prominence="low"] &`]: {
        borderBlock: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.muted}`,
      },
      [`${tableViewClassList.selector('root')}:not([data-prominence="low"]) &`]:
        {
          backgroundColor: tokenSchema.color.background.canvas,
          border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.muted}`,
          borderRadius: tokenSchema.size.radius.medium,
          /* Fix scrollbars on iOS with sticky row headers */
          transform: 'translate3d(0, 0, 0)',
        },
    }),
    style,
  };
}

// Cell common
// ----------------------------------------------------------------------------

const commonCellStyles = {
  // borderBottom: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.neutral}`,
  boxSizing: 'border-box',
  cursor: 'default',
  display: 'flex',
  height: '100%',
  justifyContent: 'flex-start',
  minWidth: 0,
  outline: 0,
  paddingInline: tokenSchema.size.space.medium,
  position: 'relative',

  // Density
  paddingBlock: tokenSchema.size.space.medium,
  [`${tableViewClassList.selector(
    'root'
  )}[data-density="compact"] &:not([role="columnheader"])`]: {
    paddingBlock: tokenSchema.size.space.regular,
  },
  [`${tableViewClassList.selector(
    'root'
  )}[data-density="spacious"] &:not([role="columnheader"])`]: {
    paddingBlock: tokenSchema.size.space.large,
  },

  // wrapping text shouldn't be centered
  alignItems: 'center',
  [`${tableViewClassList.selector(
    'root'
  )}[data-overflow-mode="wrap"] &:not([role="columnheader"])`]: {
    alignItems: 'start',
  },
} as const;

type CellProps = {
  align?: 'start' | 'end' | 'center';
  maxWidth?: number | string;
  minWidth?: number | string;
  width?: number | string;
};

export function useCellStyleProps(
  props: CellProps,
  state?: { isFocusVisible: boolean }
) {
  const className = classNames(
    tableViewClassList.element('cell'),
    css([
      commonCellStyles,
      {
        // Alignment
        '&[data-align="end"]': {
          justifyContent: 'flex-end',
          textAlign: 'end',
        },
        '&[data-align="center"]': {
          justifyContent: 'center',
          textAlign: 'center',
        },

        // focus ring
        '&[data-focus="visible"]::after': {
          borderRadius: tokenSchema.size.radius.small,
          boxShadow: `inset 0 0 0 ${tokenSchema.size.alias.focusRing} ${tokenSchema.color.alias.focusRing}`,
          content: '""',
          inset: 0,
          position: 'absolute',
          transition: transition(['box-shadow', 'margin'], {
            easing: 'easeOut',
          }),
        },

        // HEADERS
        '&[role="columnheader"]': {
          color: tokenSchema.color.foreground.neutralSecondary,

          ['&[aria-sort]']: {
            cursor: 'default',

            '&:hover, &[data-focus="visible"]': {
              color: tokenSchema.color.foreground.neutralEmphasis,
            },
          },
        },
      },
    ])
  );

  return {
    ...toDataAttributes({
      focus: state?.isFocusVisible ? 'visible' : undefined,
      align: props?.align,
    }),
    className,
    // style: getStyleFromColumn(props),
  };
}

export function useSelectionCellStyleProps() {
  return {
    className: classNames(
      tableViewClassList.element('cell'),
      css(commonCellStyles, {
        alignItems: 'center',
        flex: '0 0 auto',
        paddingInlineStart: tokenSchema.size.space.medium,
        width: 'auto',
      })
    ),
  };
}

// Row body
// ----------------------------------------------------------------------------

export function useRowStyleProps(
  props: {
    style?: CSSProperties;
  },
  state: {
    isFocusVisible: boolean;
    isFocusWithin: boolean;
    isPressed: boolean;
    isHovered: boolean;
  }
) {
  let { style } = props;
  let calculatedRadius = `calc(${tokenSchema.size.radius.medium} - ${tokenSchema.size.border.regular})`;

  const className = css({
    boxSizing: 'border-box',
    display: 'flex',
    position: 'relative',
    outline: 0,

    // separators
    '&:not(:last-child)': {
      backgroundColor: tokenSchema.color.border.muted,
      paddingBottom: 1,
    },

    // prominence
    [`${tableViewClassList.selector('root')}:not([data-prominence="low"]) &`]: {
      '&:first-child': {
        borderStartStartRadius: calculatedRadius,
        borderStartEndRadius: calculatedRadius,
      },
      '&:last-child': {
        borderEndStartRadius: calculatedRadius,
        borderEndEndRadius: calculatedRadius,
      },
    },

    // focus indicator
    '&[data-focus="visible"]': {
      '&::before': {
        backgroundColor: tokenSchema.color.background.accentEmphasis,
        borderRadius: tokenSchema.size.space.small,
        content: '""',
        insetInlineStart: tokenSchema.size.space.xsmall,
        marginBlock: tokenSchema.size.space.xsmall,
        marginInlineEnd: `calc(${tokenSchema.size.space.small} * -1)`,
        position: 'sticky',
        width: tokenSchema.size.space.small,
        zIndex: 4,
      },
    },

    // interactions
    [`&[data-interaction="hover"] ${tableViewClassList.selector('cell')}`]: {
      backgroundColor: tokenSchema.color.scale.slate2,
    },
    [`&[data-interaction="press"] ${tableViewClassList.selector('cell')}`]: {
      backgroundColor: tokenSchema.color.scale.slate3,
      // backgroundColor: tokenSchema.color.alias.backgroundPressed,
    },

    // selected
    [`&[aria-selected="true"] ${tableViewClassList.selector('cell')}`]: {
      backgroundColor: tokenSchema.color.alias.backgroundSelected,
    },
    [`&[aria-selected="true"][data-interaction="hover"] ${tableViewClassList.selector(
      'cell'
    )}`]: {
      backgroundColor: tokenSchema.color.alias.backgroundSelectedHovered,
    },
  });

  return {
    ...toDataAttributes({
      focus: state.isFocusVisible
        ? 'visible'
        : state.isFocusWithin
        ? 'within'
        : undefined,
      interaction: state.isPressed
        ? 'press'
        : state.isHovered
        ? 'hover'
        : undefined,
    }),
    className: classNames(tableViewClassList.element('row'), className),
    style,
  };
}

// Row header
// ----------------------------------------------------------------------------

export function useRowHeaderStyleProps({ style }: { style?: CSSProperties }) {
  const className = css({
    display: 'flex',
  });

  return { className, style };
}
