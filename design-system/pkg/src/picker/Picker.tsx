import { PressResponder } from '@react-aria/interactions';
import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { HiddenSelect, useSelect } from '@react-aria/select';
import { useLayoutEffect, useResizeObserver } from '@react-aria/utils';
import { useSelectState } from '@react-stately/select';
import {
  ReactElement,
  RefObject,
  forwardRef,
  useCallback,
  useRef,
  useState,
} from 'react';

import { FieldButton } from '@keystar/ui/button';
import { useProvider, useProviderProps } from '@keystar/ui/core';
import { FieldPrimitive } from '@keystar/ui/field';
import { chevronsUpDownIcon } from '@keystar/ui/icon/icons/chevronsUpDownIcon';
import { Icon } from '@keystar/ui/icon';
import { ListBoxBase, listStyles, useListBoxLayout } from '@keystar/ui/listbox';
import { Popover, Tray } from '@keystar/ui/overlays';
import { ProgressCircle } from '@keystar/ui/progress';
import { SlotProvider, useSlotProps } from '@keystar/ui/slots';
import {
  classNames,
  css,
  tokenSchema,
  useIsMobileDevice,
} from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';

import localizedMessages from './l10n';
import { PickerProps } from './types';

function Picker<T extends object>(
  props: PickerProps<T>,
  forwardedRef: RefObject<HTMLDivElement>
) {
  props = useSlotProps(props, 'picker');
  props = useProviderProps(props);
  let stringFormatter = useLocalizedStringFormatter(localizedMessages);
  let {
    align = 'start',
    autoComplete,
    autoFocus,
    direction = 'bottom',
    isDisabled,
    label,
    menuWidth,
    name,
    placeholder = stringFormatter.format('placeholder'),
    prominence,
    shouldFlip = true,
  } = props;

  let popoverRef = useRef<HTMLDivElement>(null);
  let triggerRef = useRef<HTMLButtonElement>(null);
  let listboxRef = useRef<HTMLDivElement>(null);

  // We create the listbox layout in Picker and pass it to ListBoxBase below
  // so that the layout information can be cached even while the listbox is not mounted.
  let layout = useListBoxLayout();
  let state = useSelectState(props);
  let {
    labelProps,
    triggerProps,
    valueProps,
    menuProps,
    descriptionProps,
    errorMessageProps,
  } = useSelect(props, state, triggerRef);
  let isMobile = useIsMobileDevice();

  let isLoadingInitial = props.isLoading && state.collection.size === 0;
  let isLoadingMore = props.isLoading && state.collection.size > 0;

  // On small screen devices, the listbox is rendered in a tray, otherwise a popover.
  let listbox = (
    <ListBoxBase
      {...menuProps}
      ref={listboxRef}
      disallowEmptySelection
      autoFocus={state.focusStrategy || true}
      shouldSelectOnPressUp
      focusOnPointerEnter
      layout={layout}
      state={state}
      UNSAFE_className={listStyles}
      isLoading={isLoadingMore}
      onLoadMore={props.onLoadMore}
    />
  );

  // Measure the width of the button to inform the width of the menu (below).
  let [buttonWidth, setButtonWidth] = useState<number>();
  let { scale } = useProvider();

  let onResize = useCallback(() => {
    if (!isMobile && triggerRef.current) {
      let width = triggerRef.current.offsetWidth;
      setButtonWidth(width);
    }
  }, [triggerRef, setButtonWidth, isMobile]);

  useResizeObserver({
    ref: triggerRef,
    onResize: onResize,
  });

  useLayoutEffect(onResize, [scale, state.selectedKey, onResize]);

  let overlay;
  if (isMobile) {
    overlay = <Tray state={state}>{listbox}</Tray>;
  } else {
    // Match the width of the button, unless explicitly overridden by the
    // consumer via `menuWidth` prop. The width should never be less than the
    // invoking button.
    let style = {
      minWidth: buttonWidth,
      width: menuWidth ?? buttonWidth,
    };

    // FIXME: should close on blur
    // @see http://localhost:6006/?path=/story/pickers-picker--focus
    // open then tab to next element
    overlay = (
      <Popover
        UNSAFE_style={style}
        ref={popoverRef}
        placement={`${direction} ${align}`}
        shouldFlip={shouldFlip}
        hideArrow
        state={state}
        triggerRef={triggerRef}
        scrollRef={listboxRef}
      >
        {listbox}
      </Popover>
    );
  }

  let contents = state.selectedItem ? state.selectedItem.rendered : placeholder;
  if (isReactText(contents)) {
    contents = <Text>{contents}</Text>;
  }

  let picker = (
    <div>
      <HiddenSelect
        autoComplete={autoComplete}
        isDisabled={isDisabled}
        label={label}
        name={name}
        state={state}
        triggerRef={triggerRef}
      />
      <PressResponder {...triggerProps}>
        <FieldButton
          aria-required
          prominence={prominence}
          ref={triggerRef}
          isActive={state.isOpen}
          isDisabled={isDisabled}
          autoFocus={autoFocus}
          UNSAFE_className={classNames(
            css({
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between',
              position: 'relative',
              width: '100%',

              /* Ensure that changing the selected item doesn't affect the size of the dropdown and its parents */
              contain: 'size',
            })
          )}
        >
          <SlotProvider
            slots={{
              icon: {
                marginEnd: 'small',
              },
              text: {
                ...valueProps,
                // when no item is selected, we're styling the placeholder
                color: !state.selectedItem ? 'neutralSecondary' : 'inherit',
                // weight: state.selectedItem ? 'medium' : undefined,
              },
              // we try to maintain most of the selected item's rendered content
              // within the button, but description text is too long
              description: {
                isHidden: true,
              },
            }}
          >
            {contents}
          </SlotProvider>
          {isLoadingInitial && (
            <ProgressCircle
              isIndeterminate
              size="small"
              aria-label={stringFormatter.format('loading')}
              UNSAFE_className={css({
                marginInlineStart: tokenSchema.size.space.small,
              })}
            />
          )}
          <Icon
            src={chevronsUpDownIcon}
            UNSAFE_className={css({
              marginInlineStart: tokenSchema.size.space.small,
            })}
          />
        </FieldButton>
      </PressResponder>
      {state.collection.size === 0 ? null : overlay}
    </div>
  );

  return (
    <FieldPrimitive
      width="alias.singleLineWidth"
      {...props}
      ref={forwardedRef}
      labelProps={labelProps}
      descriptionProps={descriptionProps}
      errorMessageProps={errorMessageProps}
      supplementRequiredState
    >
      {picker}
    </FieldPrimitive>
  );
}

// forwardRef doesn't support generic parameters, so cast the result to the correct type
// https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref

/**
 * Pickers allow users to choose a single option from a collapsible list of options when space is limited.
 */
const _Picker: <T>(
  props: PickerProps<T> & { ref?: RefObject<HTMLDivElement> }
) => ReactElement = forwardRef(Picker as any) as any;
export { _Picker as Picker };
