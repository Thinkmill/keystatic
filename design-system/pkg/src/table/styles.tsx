import { arrowUpIcon } from '@keystar/ui/icon/icons/arrowUpIcon';
import { Icon } from '@keystar/ui/icon';
import {
  ClassList,
  classNames,
  css,
  tokenSchema,
  transition,
} from '@keystar/ui/style';
import { HTMLAttributes } from 'react';

export const tableViewClassList = new ClassList('TableView', [
  'cell',
  'cell-wrapper',
  'row',
  'body',
  'header',
]);

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
        gridArea: 'sort-indicator',
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
// CLASSES
// ============================================================================

// TODO: review styles
export const tableClassname = css({
  display: 'flex',
  flexDirection: 'column',
  isolation: 'isolate',
  minHeight: 0,
  minWidth: 0,
  outline: 'none',
  position: 'relative',
  userSelect: 'none',
});

// Row group (head/body/foot)
// ----------------------------------------------------------------------------

export const headerWrapperClassname = css({
  boxSizing: 'content-box',
  // keep aligned with the border of the body
  borderLeft: `${tokenSchema.size.border.regular} solid transparent`,
  borderRight: `${tokenSchema.size.border.regular} solid transparent`,
});
export const headerClassname = classNames(
  tableViewClassList.element('header'),
  css({
    boxSizing: 'border-box',
  })
);

export const bodyClassname = classNames(
  tableViewClassList.element('body'),
  css({
    backgroundColor: tokenSchema.color.background.canvas,
    border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.neutral}`,
    borderRadius: tokenSchema.size.radius.medium,
    /* Fix scrollbars on iOS with sticky row headers */
    transform: 'translate3d(0, 0, 0)',
  })
);

// resizing
export const columnResizerClassname = css({
  blockSize: '100%',
  boxSizing: 'border-box',
  display: 'flex',
  flexShrink: 0,
  inlineSize: 21,
  insetInlineEnd: -10,
  justifyContent: 'center',
  outline: 0,
  position: 'absolute',
  userSelect: 'none',

  '&::after': {
    backgroundColor: tokenSchema.color.border.neutral,
    blockSize: '100%',
    boxSizing: 'border-box',
    content: '""',
    display: 'block',
    inlineSize: 1,
  },
});
export const columnResizerPlaceholderClassname = css({
  blockSize: '100%',
  boxSizing: 'border-box',
  flex: '0 0 auto',
  flexShrink: 0,
  inlineSize: 10,
  userSelect: 'none',
});
export const columnResizeIndicatorClassname = css({
  backgroundColor: tokenSchema.color.background.accentEmphasis,
  display: 'none',
  flexShrink: 0,
  height: '100%',
  insetInlineEnd: 0,
  pointerEvents: 'none',
  position: 'absolute',
  top: 1,
  width: 2,
  zIndex: 3,

  '&[data-resizing=true]': {
    display: 'block',
  },
});
export const bodyResizeIndicatorClassname = css({
  backgroundColor: tokenSchema.color.background.accentEmphasis,
  display: 'none',
  height: '100%',
  position: 'absolute',
  top: 0,
  width: 2,
});

// utilities
export const centeredWrapperClassname = css({
  alignItems: 'center',
  display: 'flex',
  height: '100%',
  justifyContent: 'center',
  width: '100%',
});

// Row
// ----------------------------------------------------------------------------

export const rowClassname = css({
  boxSizing: 'border-box',
  display: 'flex',
  position: 'relative',
  outline: 0,

  // separators
  [`${tableViewClassList.selector('body')} &::after`]: {
    content: '""',
    boxShadow: `inset 0 -1px 0 0 ${tokenSchema.color.border.muted}`,
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 2,
  },
  '&[data-flush-with-container-bottom]::after': {
    display: 'none',
  },
  // selection
  '&[aria-selected="true"]::after': {
    boxShadow: `inset 0 -1px 0 0 ${tokenSchema.color.alias.backgroundSelectedHovered}`,
  },
  '&[data-next-selected="true"]::after': {
    boxShadow: `inset 0 -1px 0 0 ${tokenSchema.color.alias.backgroundSelectedHovered}`,
  },

  // prominence
  [`${tableViewClassList.selector('root')}:not([data-prominence="low"]) &`]: {
    '&:first-child': {
      borderStartStartRadius: `calc(${tokenSchema.size.radius.medium} - ${tokenSchema.size.border.regular})`,
      borderStartEndRadius: `calc(${tokenSchema.size.radius.medium} - ${tokenSchema.size.border.regular})`,
    },
    '&:last-child': {
      borderEndStartRadius: `calc(${tokenSchema.size.radius.medium} - ${tokenSchema.size.border.regular})`,
      borderEndEndRadius: `calc(${tokenSchema.size.radius.medium} - ${tokenSchema.size.border.regular})`,
    },
  },

  // focus indicator
  '&[data-focus-visible]': {
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
  [`&[data-hovered=true] ${tableViewClassList.selector('cell')}`]: {
    backgroundColor: tokenSchema.color.scale.slate2,
  },
  [`&[data-pressed=true] ${tableViewClassList.selector('cell')}`]: {
    backgroundColor: tokenSchema.color.scale.slate3,
    // backgroundColor: tokenSchema.color.alias.backgroundPressed,
  },
  [`&[data-disabled] ${tableViewClassList.selector('cell')}`]: {
    color: tokenSchema.color.alias.foregroundDisabled,
  },

  // selected
  [`&[aria-selected="true"] ${tableViewClassList.selector('cell')}`]: {
    backgroundColor: tokenSchema.color.alias.backgroundSelected,
  },
  [`&[aria-selected="true"][data-hovered=true] ${tableViewClassList.selector(
    'cell'
  )}`]: {
    backgroundColor: tokenSchema.color.alias.backgroundSelectedHovered,
  },
});

export const rowDragPreviewClassname = css({
  backgroundColor: tokenSchema.color.background.canvas,
  border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.alias.borderSelected}`,
  borderRadius: tokenSchema.size.radius.small,
  paddingInline: tokenSchema.size.space.medium,
  position: 'relative',
  outline: 0,
  width: tokenSchema.size.alias.singleLineWidth,

  // indicate that multiple items are being dragged by implying a stack
  '&[data-multi=true]::after': {
    backgroundColor: 'inherit',
    border: 'inherit',
    borderRadius: 'inherit',
    content: '" "',
    display: 'block',
    height: '100%',
    insetBlockStart: tokenSchema.size.space.small,
    insetInlineStart: tokenSchema.size.space.small,
    position: 'absolute',
    width: '100%',
    zIndex: -1,
  },
});

// Cell
// ----------------------------------------------------------------------------

// FIXME: review these styles. many may not be necessary. def get rid of the
// root selectors, and pass data-attributes onto elements directly
const commonCellStyles = css({
  boxSizing: 'border-box',
  cursor: 'default',
  display: 'flex',
  height: '100%',
  justifyContent: 'flex-start',
  minWidth: 0,
  outline: 0,
  paddingInline: tokenSchema.size.space.medium,
  position: 'relative',
  textAlign: 'start',

  // focus ring
  '&[data-focus=visible]': {
    borderRadius: tokenSchema.size.radius.small,
    inset: 0,
    outline: `${tokenSchema.size.alias.focusRing} solid ${tokenSchema.color.alias.focusRing}`,
    outlineOffset: `calc(${tokenSchema.size.alias.focusRingGap} * -1)`,
    position: 'absolute',
  },

  // density
  paddingBlock: tokenSchema.size.space.regular,
  '&[data-density="compact"]': {
    paddingBlock: tokenSchema.size.space.small,
  },
  '&[data-density="spacious"]': {
    paddingBlock: tokenSchema.size.space.medium,
  },

  // alignment
  '&[data-align="end"]': {
    justifyContent: 'flex-end',
    textAlign: 'end',
  },
  '&[data-align="center"]': {
    justifyContent: 'center',
    textAlign: 'center',
  },

  // overflow mode
  '&[data-overflow-mode="truncate"]': {
    alignItems: 'center',
  },
});

export const cellWrapperClassname = css({
  [`${tableViewClassList.selector('body')} &`]: {
    backgroundColor: tokenSchema.color.background.canvas,
  },
});

// data-attributes
// - align
// - hide-header
// - show-divider
export const cellClassname = classNames(
  tableViewClassList.element('cell'),
  commonCellStyles,
  css({
    color: tokenSchema.color.foreground.neutral,
  })
);
// TODO: assess styles
export const cellContentsClassname = css({
  // color: tokenSchema.color.foreground.neutral,
  // fontFamily: tokenSchema.typography.fontFamily.base,
  // fontSize: tokenSchema.typography.text.regular.size,
  minWidth: 0,
  flex: 1,
});

export const headerCellClassname = classNames(
  commonCellStyles,
  css({
    alignItems: 'center',
    backgroundColor: tokenSchema.color.background.surface,
    color: tokenSchema.color.foreground.neutralSecondary,
    minWidth: 0,
    flex: 1,

    // SORTABLE
    ['&[aria-sort]']: {
      display: 'grid',
      gridTemplateAreas: '". sort-indicator"',

      '&[data-align="end"]': {
        gridTemplateAreas: '"sort-indicator ."',
      },
      '&[data-hovered=true]': {
        color: tokenSchema.color.foreground.neutralEmphasis,
      },
    },
  })
);

export const dragCellClassname = css({
  paddingInlineStart: tokenSchema.size.space.regular,
  paddingInlineEnd: 0,
});
export const checkboxCellClassname = css({
  paddingBlock: 0,
  paddingInlineEnd: tokenSchema.size.space.regular,

  label: {
    paddingInlineEnd: tokenSchema.size.space.regular,
    paddingBlock: tokenSchema.size.space.regular,
  },

  '&[data-density="compact"]': {
    paddingBlock: 0,
    label: {
      paddingBlock: tokenSchema.size.space.small,
    },
  },
  '&[data-density="spacious"]': {
    paddingBlock: 0,
    label: {
      paddingBlock: tokenSchema.size.space.medium,
    },
  },
});
