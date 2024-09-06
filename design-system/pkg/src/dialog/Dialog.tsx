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
  ClassList,
  breakpointQueries,
  classNames,
  css,
  toDataAttributes,
  tokenSchema,
  useStyleProps,
} from '@keystar/ui/style';
import { useHasChild } from '@keystar/ui/utils';

import localizedMessages from './l10n';
import { DialogContext, DialogContextValue } from './context';
import { DialogProps, DialogSize, DialogType } from './types';

const dialogClassList = new ClassList('Dialog', [
  'root',
  'grid',
  'heading',
  'header',
  'footer',
  'button-group',
]);

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
  let hasHeading = useHasChild(dialogClassList.selector('heading'), gridRef);
  let hasHeader = useHasChild(dialogClassList.selector('header'), gridRef);
  let hasFooter = useHasChild(dialogClassList.selector('footer'), gridRef);
  let hasButtonGroup = useHasChild(
    dialogClassList.selector('button-group'),
    gridRef
  );

  let slots = useMemo(
    () => ({
      heading: {
        ...toDataAttributes({ hasHeader }),
        UNSAFE_className: classNames(
          dialogClassList.element('heading'),
          getHeadingStyles()
        ),
        elementType: 'h2' as const,
        size: headingSize as typeof headingSize, // FIXME: declared as const—shouldn't need this weirdness.
        ...titleProps,
      },
      header: {
        // ...toDataAttributes({ hasHeading }),
        UNSAFE_className: classNames(
          dialogClassList.element('header'),
          getHeaderStyles()
        ),
      },
      content: {
        ...toDataAttributes({
          hasHeader: hasHeader || hasHeading || undefined,
          hasFooter:
            hasFooter || (hasButtonGroup && type !== 'fullscreen') || undefined,
        }),
        UNSAFE_className: getContentStyles(),
      },
      footer: {
        UNSAFE_className: classNames(
          dialogClassList.element('footer'),
          getFooterStyles()
        ),
      },
      buttonGroup: {
        ...toDataAttributes({ hasFooter }),
        UNSAFE_className: classNames(
          dialogClassList.element('button-group'),
          getButtonGroupStyles()
        ),
        align: 'end',
      },
    }),
    [
      hasButtonGroup,
      hasFooter,
      hasHeader,
      hasHeading,
      headingSize,
      titleProps,
      type,
    ]
  );

  const sizeVariant = getSizeVariant(type, size);
  const dialogStyleProps = useDialogStyleProps(props, {
    type,
    size: sizeVariant,
  });
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

function useDialogStyleProps(
  props: DialogProps,
  { size, type }: { size: SizeVariant; type: DialogType }
) {
  let styleProps = useStyleProps(props);

  return {
    ...toDataAttributes({ size: type === 'tray' ? undefined : size }),
    ...styleProps,
    className: classNames(
      dialogClassList.element('root'),
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
  // NOTE: it's very tempting to use "gap" here but don't! It stops the grid
  // areas from collapsing, even when hidden or omitted.
  let gridStyles = css({
    display: 'grid',
    padding: tokenSchema.size.space.xxlarge,
    gridTemplateColumns: 'auto minmax(0, 1fr) auto',
    gridTemplateRows: 'auto minmax(0, 1fr) auto',
    gridTemplateAreas: `"heading header header"
      "content content content"
      "footer footer buttonGroup"`,
    width: '100%',

    '&[data-dismissable]': {
      gridTemplateColumns: 'auto minmax(0, 1fr) auto auto',
      gridTemplateAreas: `"heading header header closeButton"
        "content content content content"
        "footer footer footer footer"`,

      // slot styles
      [dialogClassList.selector('button-group')]: {
        display: 'none',
      },
    },

    // MOBILE SPECIFIC
    [breakpointQueries.below.tablet]: {
      padding: tokenSchema.size.space.xlarge,
      gridTemplateRows: 'auto auto minmax(0, 1fr) auto',
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
    UNSAFE_className: classNames(dialogClassList.element('grid'), gridStyles),
  };
}

// Slots
// -----------------------------------------------------------------------------

function getHeadingStyles() {
  return css({
    alignSelf: 'center',
    gridArea: 'heading',
    paddingBottom: tokenSchema.size.space.large,

    [breakpointQueries.above.mobile]: {
      paddingBottom: tokenSchema.size.space.xlarge,
    },

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
    paddingBottom: tokenSchema.size.space.large,

    [breakpointQueries.above.mobile]: {
      justifyContent: 'flex-end',
      paddingBottom: tokenSchema.size.space.xlarge,
    },
  });
}

function getContentStyles() {
  return css({
    gridArea: 'content',
    overflowX: 'hidden',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',

    // fixes two issues:
    // - focus rings get clipped by overflow: auto
    // - trimmed text (capsize) creates unwanted scrollbars
    padding: tokenSchema.size.space.regular,
    margin: `calc(${tokenSchema.size.space.regular} * -1)`,
  });
}

function getButtonGroupStyles() {
  return css({
    gridArea: 'buttonGroup',
    minWidth: 0,
    marginInlineStart: tokenSchema.size.space.regular,
    paddingTop: tokenSchema.size.space.large,
    [breakpointQueries.above.mobile]: {
      paddingTop: tokenSchema.size.space.xlarge,
    },

    [`${dialogClassList.selector(
      'root'
    )}:not([data-size=fullscreen]) &[data-has-footer=false]`]: {
      gridArea:
        'footer-start / footer-start / buttonGroup-end / buttonGroup-end',
    },

    // correct consumer error; hide the button group when the dialog is dismissable
    [`${dialogClassList.selector('root')}[data-dismissable] &`]: {
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
    paddingTop: tokenSchema.size.space.large,
    [breakpointQueries.above.mobile]: {
      paddingTop: tokenSchema.size.space.xlarge,
    },
  });
}
