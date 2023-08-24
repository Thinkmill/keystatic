import { useDialog } from '@react-aria/dialog';
import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { mergeProps, useObjectRef } from '@react-aria/utils';
import {
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  Ref,
  useContext,
  useMemo,
  useRef,
} from 'react';

import { ActionButton } from '@keystar/ui/button';
import { xIcon } from '@keystar/ui/icon/icons/xIcon';
import { Icon } from '@keystar/ui/icon';
import { Grid } from '@keystar/ui/layout';
import { SlotProvider } from '@keystar/ui/slots';
import {
  breakpointQueries,
  classNames,
  css,
  toDataAttributes,
  tokenSchema,
  useStyleProps,
} from '@keystar/ui/style';
import { useHasChild } from '@keystar/ui/utils';

import localizedMessages from './l10n.json';
import { DialogContext, DialogContextValue } from './context';
import { DialogProps, DialogSize, DialogType } from './types';

const slotClassNames = {
  root: 'ksv-dialog-root',
  grid: 'ksv-dialog-grid',
  heading: 'ksv-dialog-heading',
  header: 'ksv-dialog-header',
  footer: 'ksv-dialog-footer',
  buttonGroup: 'ksv-dialog-button-group',
};

/**
 * Dialogs are windows containing contextual information, tasks, or workflows
 * that appear over the user interface. Depending on the kind of dialog, further
 * interactions may be blocked until the dialog is closed.
 */
export const Dialog: ForwardRefExoticComponent<
  DialogProps & { ref?: Ref<HTMLDivElement> }
> = forwardRef(function Dialog(
  props: DialogProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let { type = 'modal', ...contextProps } =
    useContext(DialogContext) || ({} as DialogContextValue);
  let {
    children,
    isDismissable = contextProps.isDismissable,
    onDismiss = contextProps.onClose,
    size,
  } = props;
  let stringFormatter = useLocalizedStringFormatter(localizedMessages);

  let domRef = useObjectRef(forwardedRef);
  let gridRef = useRef<HTMLDivElement>(null);
  let { dialogProps, titleProps } = useDialog(
    mergeProps(contextProps, props),
    domRef
  );

  // analyse children to determine grid areas. need a unique identifier for each slot.
  // const headingSize = type === 'popover' ? 'small' : 'regular';
  const headingSize = 'regular';
  let hasHeading = useHasChild(`.${slotClassNames.heading}`, gridRef);
  let hasHeader = useHasChild(`.${slotClassNames.header}`, gridRef);
  let hasFooter = useHasChild(`.${slotClassNames.footer}`, gridRef);
  let hasButtonGroup = useHasChild(`.${slotClassNames.buttonGroup}`, gridRef);

  let slots = useMemo(
    () => ({
      heading: {
        ...toDataAttributes({ hasHeader }),
        UNSAFE_className: classNames(
          slotClassNames.heading,
          getHeadingStyles()
        ),
        elementType: 'h2' as const,
        size: headingSize as typeof headingSize, // FIXME: declared as const—shouldn't need this weirdness.
        ...titleProps,
      },
      header: {
        // ...toDataAttributes({ hasHeading }),
        UNSAFE_className: classNames(slotClassNames.header, getHeaderStyles()),
      },
      content: {
        ...toDataAttributes({
          hasHeader: hasHeader || hasHeading || undefined,
          hasFooter: hasFooter || hasButtonGroup || undefined,
        }),
        UNSAFE_className: getContentStyles(),
      },
      footer: {
        UNSAFE_className: classNames(slotClassNames.footer, getFooterStyles()),
      },
      buttonGroup: {
        ...toDataAttributes({ hasFooter }),
        UNSAFE_className: classNames(
          slotClassNames.buttonGroup,
          getButtonGroupStyles()
        ),
        align: 'end',
      },
    }),
    [hasButtonGroup, hasFooter, hasHeader, hasHeading, headingSize, titleProps]
  );

  const sizeVariant = getSizeVariant(type, size);
  const dialogStyleProps = useDialogStyleProps(props, sizeVariant);
  const gridStyleProps = useGridStyleProps({
    isDismissable,
    size: sizeVariant,
  });

  return (
    <section {...dialogStyleProps} {...dialogProps} ref={domRef}>
      <Grid ref={gridRef} {...gridStyleProps}>
        <SlotProvider slots={slots}>{children}</SlotProvider>
        {isDismissable && (
          <ActionButton
            prominence="low"
            aria-label={stringFormatter.format('dismiss')}
            onPress={onDismiss}
            gridArea="closeButton"
            UNSAFE_className={css({
              placeSelf: 'flex-start end',
              paddingInline: 0,
              marginBlock: `calc((${tokenSchema.size.element.regular} - ${tokenSchema.typography.heading[headingSize].capheight}) / 2 * -1)`,
              marginInlineEnd: `calc(${tokenSchema.size.space.medium} * -1)`,
              marginInlineStart: tokenSchema.size.space.regular,
            })}
          >
            <Icon src={xIcon} size="medium" />
          </ActionButton>
        )}
      </Grid>
    </section>
  );
});

// Utils
// =============================================================================

type SizeVariant = ReturnType<typeof getSizeVariant>;

function getSizeVariant(type: DialogType, size?: DialogSize) {
  if (type === 'fullscreen') {
    return 'fullscreen';
  }

  if (type === 'popover') {
    return size || 'xsmall';
  }

  return size || 'medium';
}

// Styles
// =============================================================================

function useDialogStyleProps(props: DialogProps, sizeVariant: SizeVariant) {
  let styleProps = useStyleProps(props);

  return {
    ...toDataAttributes({ size: sizeVariant }),
    ...styleProps,
    className: classNames(
      slotClassNames.root,
      css({
        display: 'flex',
        maxHeight: 'inherit',
        maxWidth: '100%',
        outline: 0,
        width: 'var(--dialog-width)',
        '--dialog-width': 'fit-content',

        '&[data-size="xsmall"]': {
          '--dialog-width': tokenSchema.size.dialog.xsmall,
        },
        '&[data-size="small"]': {
          '--dialog-width': tokenSchema.size.dialog.small,
        },
        '&[data-size="medium"]': {
          '--dialog-width': tokenSchema.size.dialog.medium,
        },
        '&[data-size="large"]': {
          '--dialog-width': tokenSchema.size.dialog.large,
        },
        '&[data-size="fullscreen"]': {
          maxHeight: 'none',
          maxWidth: 'none',
          height: '100%',
          '--dialog-width': '100%',
        },
      }),
      styleProps.className
    ),
  };
}

function useGridStyleProps({
  isDismissable,
  size,
}: {
  isDismissable?: boolean;
  size: SizeVariant;
}) {
  let gridStyles = css({
    display: 'grid',
    padding: tokenSchema.size.space.xxlarge,
    gridTemplateColumns: 'auto 1fr auto',
    gridTemplateRows: 'auto 1fr auto',
    gridTemplateAreas: `"heading header header"
      "content content content"
      "footer footer buttonGroup"`,
    width: '100%',

    '&[data-dismissable]': {
      gridTemplateColumns: 'auto 1fr auto minmax(0, auto)',
      gridTemplateAreas: `"heading header header closeButton"
        "content content content content"
        "footer footer footer footer"`,

      // slot styles
      [`.${slotClassNames.buttonGroup}`]: {
        display: 'none',
      },
    },

    // MOBILE SPECIFIC
    [breakpointQueries.below.tablet]: {
      padding: tokenSchema.size.space.large,
      gridTemplateRows: 'auto auto 1fr auto',
      gridTemplateAreas: `"heading heading heading"
      "header header header"
        "content content content"
        "footer footer buttonGroup"`,

      '&[data-dismissable]': {
        gridTemplateAreas: `"heading heading closeButton"
          "header header header"
            "content content content"
            "footer footer buttonGroup"`,
      },
    },

    // TABLET & ABOVE
    [breakpointQueries.above.mobile]: {
      '&[data-size="fullscreen"]': {
        gridTemplateAreas: `"heading header buttonGroup"
          "content content content"
          "footer footer footer"`,
      },
    },
  });
  return {
    ...toDataAttributes({ dismissable: isDismissable || undefined, size }),
    UNSAFE_className: classNames(slotClassNames.grid, gridStyles),
  };
}

// Slots
// -----------------------------------------------------------------------------

function getHeadingStyles() {
  return css({
    alignSelf: 'center',
    gridArea: 'heading',

    '&[data-has-header=false]': {
      gridArea: 'heading-start / heading-start / header-end / header-end',
    },
  });
}

function getHeaderStyles() {
  return css({
    alignItems: 'center',
    boxSizing: 'border-box',
    display: 'flex',
    gridArea: 'header',
    minWidth: 'fit-content',
    outline: 0,

    [breakpointQueries.below.tablet]: {
      paddingTop: tokenSchema.size.space.regular,
    },
    [breakpointQueries.above.mobile]: {
      justifyContent: 'flex-end',
    },
  });
}

function getContentStyles() {
  return css({
    gridArea: 'content',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',

    // naive scroll indicators
    background: [
      // masks
      `linear-gradient(${tokenSchema.color.background.surface}, transparent) center top`,
      `linear-gradient(transparent, ${tokenSchema.color.background.surface}) center bottom`,
      // dividers
      `linear-gradient(${tokenSchema.color.border.neutral}, ${tokenSchema.color.border.neutral}) center top`,
      `linear-gradient(${tokenSchema.color.border.neutral}, ${tokenSchema.color.border.neutral}) center bottom`,
    ].join(', '),
    backgroundRepeat: 'no-repeat',
    backgroundSize: `100% ${tokenSchema.size.element.regular}, 100% ${tokenSchema.size.element.regular}, 100% ${tokenSchema.size.border.regular}, 100% ${tokenSchema.size.border.regular}`,
    backgroundAttachment: 'local, local, scroll, scroll',

    // NOTE: focus rings are clipped by overflow: auto
    padding: tokenSchema.size.alias.focusRing,
    margin: `calc(${tokenSchema.size.alias.focusRing} * -1)`,

    /**
     * FIXME: content that wouldn't otherwise be scrollable is introducing
     * scrollbars because of the baseline trim of capsize text. only relevant if
     * that text element is last, but it could be wrapped any number of ways so
     * there isn't a selector that safely targets only the offending node.
     *
     * This is a shitty ~solution~ because it adds padding regardless of whether
     * or not there's trimmed text node that would require it.
     */
    marginBlockEnd: tokenSchema.typography.text.regular.baselineTrim,
    paddingBlockEnd: `calc(${tokenSchema.typography.text.regular.baselineTrim} * -1)`,
    paddingBlockStart: `calc(${tokenSchema.typography.text.regular.capheightTrim} * -0.1)`, // capsize ascender clipping issue

    '&[data-has-header]': {
      marginBlockStart: tokenSchema.size.space.xlarge,
    },
    '&[data-has-footer]': {
      marginBlockEnd: tokenSchema.size.space.xlarge,
    },
  });
}

function getButtonGroupStyles() {
  return css({
    gridArea: 'buttonGroup',
    minWidth: 0,
    marginInlineStart: tokenSchema.size.space.regular,

    [`.${slotClassNames.root}:not([data-size=fullscreen]) &[data-has-footer=false]`]:
      {
        gridArea:
          'footer-start / footer-start / buttonGroup-end / buttonGroup-end',
      },

    // correct consumer error; hide the button group when the dialog is dismissable
    [`.${slotClassNames.root}[data-dismissable] &`]: {
      display: 'none',
    },
  });
}

function getFooterStyles() {
  return css({
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gridArea: 'footer',
    minWidth: 0,
  });
}
