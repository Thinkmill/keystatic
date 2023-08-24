import { arrowUpIcon } from '@keystar/ui/icon/icons/arrowUpIcon';
import { Icon } from '@keystar/ui/icon';
import {
  classNames,
  css,
  toDataAttributes,
  tokenSchema,
  transition,
  useStyleProps,
} from '@keystar/ui/style';

import { TableProps } from './types';

// ============================================================================
// UTILS
// ============================================================================

function getStyleFromColumn(props: CellProps) {
  const { maxWidth, minWidth, width } = props;

  if (width) {
    return { flex: '0 0 auto', width, maxWidth, minWidth };
  }

  return { maxWidth, minWidth };
}

// ============================================================================
// COMPONENTS
// ============================================================================

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
      styleProps.className,
      'ksv-table-view',
      css({
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        minWidth: 0,
      })
    ),
    style: styleProps.style,
  };
}

// Row group (head/body/foot)
// ----------------------------------------------------------------------------

export function useHeadStyleProps() {
  return {
    className: css({
      display: 'flex',
      flexDirection: 'column',

      '.ksv-table-view[data-prominence="low"] &': {
        borderBottom: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.muted}`,
      },
    }),
  };
}
export function useBodyStyleProps() {
  return {
    className: css({
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',

      '.ksv-table-view:not([data-prominence="low"]) &': {
        backgroundColor: tokenSchema.color.background.canvas,
        border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.muted}`,
        borderRadius: tokenSchema.size.radius.medium,
      },
    }),
  };
}

// Cell common
// ----------------------------------------------------------------------------

const commonCellStyles = {
  // borderBottom: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.neutral}`,
  boxSizing: 'border-box',
  cursor: 'default',
  display: 'flex',
  flex: 1,
  justifyContent: 'flex-start',
  minWidth: 0,
  outline: 0,
  paddingInline: tokenSchema.size.space.medium,
  position: 'relative',
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
  const className = css([
    commonCellStyles,
    {
      // Alignment
      '&[data-align="end"]': {
        justifyContent: 'flex-end',
      },
      '&[data-align="center"]': {
        justifyContent: 'center',
      },

      // wrapping text shouldn't be centered
      alignItems: 'center',
      '.ksv-table-view[data-overflow-mode="wrap"] &': {
        alignItems: 'initial',
      },

      // Density
      paddingBlock: tokenSchema.size.space.medium,
      '.ksv-table-view[data-density="compact"] &': {
        paddingBlock: tokenSchema.size.space.regular,
      },
      '.ksv-table-view[data-density="spacious"] &': {
        paddingBlock: tokenSchema.size.space.large,
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
  ]);

  return {
    ...toDataAttributes({
      focus: state?.isFocusVisible ? 'visible' : undefined,
      align: props?.align,
    }),
    className,
    style: getStyleFromColumn(props),
  };
}

export function useSelectionCellStyleProps() {
  return {
    className: css(commonCellStyles, {
      alignItems: 'center',
      flex: '0 0 auto',
      paddingInlineStart: tokenSchema.size.space.medium,
      width: 'auto',
    }),
  };
}

// Row body
// ----------------------------------------------------------------------------

export function useRowStyleProps(state: {
  isFocusVisible: boolean;
  isFocusWithin: boolean;
  isPressed: boolean;
  isHovered: boolean;
}) {
  let calculatedRadius = `calc(${tokenSchema.size.radius.medium} - ${tokenSchema.size.border.regular})`;

  const className = css({
    boxSizing: 'border-box',
    display: 'flex',
    position: 'relative',
    outline: 0,

    '&:not(:last-child)': {
      borderBottom: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.muted}`,
    },

    // prominence
    '.ksv-table-view:not([data-prominence="low"]) &': {
      '&:first-child': {
        borderStartStartRadius: calculatedRadius,
        borderStartEndRadius: calculatedRadius,
      },
      '&:last-child': {
        borderEndStartRadius: calculatedRadius,
        borderEndEndRadius: calculatedRadius,
      },
    },

    // interactions
    '&[data-interaction="hover"]': {
      backgroundColor: tokenSchema.color.alias.backgroundIdle,
    },
    '&[data-interaction="press"]': {
      backgroundColor: tokenSchema.color.alias.backgroundHovered,
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
      },
    },

    // selected
    '&[aria-selected="true"]': {
      backgroundColor: tokenSchema.color.alias.backgroundSelected,
      // boxShadow: `0 0 0 ${tokenSchema.size.border.regular} ${tokenSchema.color.alias.focusRing}`,

      '&[data-interaction="hover"]': {
        backgroundColor: tokenSchema.color.alias.backgroundSelectedHovered,
      },
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
    className,
  };
}

// Row header
// ----------------------------------------------------------------------------

export function useRowHeaderStyleProps() {
  const className = css({
    display: 'flex',
  });

  return { className };
}
