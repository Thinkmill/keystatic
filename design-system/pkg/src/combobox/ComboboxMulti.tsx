import { useObjectRef } from '@react-aria/utils';
import React, { ForwardedRef, ReactElement, useRef } from 'react';

import { useProviderProps } from '@keystar/ui/core';
import { FieldPrimitive } from '@keystar/ui/field';
import { ListBoxBase, listStyles, useListBoxLayout } from '@keystar/ui/listbox';
import { Popover } from '@keystar/ui/overlays';
import { useIsMobileDevice } from '@keystar/ui/style';
import { validateTextFieldProps } from '@keystar/ui/text-field';

import {
  ComboboxEmptyState,
  ComboboxInput,
  usePopoverStyles,
  useStatefulRef,
} from './Combobox';
import { MobileComboboxMulti } from './MobileComboboxMulti';
import { ComboboxMultiProps } from './types';
import { useComboboxMultiState } from './useComboboxMultiState';
import { useComboboxMulti } from './useComboboxMulti';

function ComboboxMulti<T extends object>(
  props: ComboboxMultiProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  props = useProviderProps(props);
  // FIXME
  props = validateTextFieldProps(props as any) as typeof props;

  let isMobile = useIsMobileDevice();
  if (isMobile) {
    // menuTrigger=focus/manual don't apply to mobile combobox
    return (
      <MobileComboboxMulti {...props} menuTrigger="input" ref={forwardedRef} />
    );
  } else {
    // @ts-expect-error FIXME: 'T' could be instantiated with an arbitrary type which could be unrelated to 'unknown'.
    return <ComboboxMultiBase {...props} ref={forwardedRef} />;
  }
}

const ComboboxMultiBase = React.forwardRef(function ComboboxMultiBase<
  T extends object,
>(props: ComboboxMultiProps<T>, forwardedRef: ForwardedRef<HTMLDivElement>) {
  let {
    align = 'start',
    // menuTrigger = 'focus',
    shouldFlip = true,
    direction = 'bottom',
    loadingState,
    menuWidth,
    onLoadMore,
  } = props;

  let isAsync = loadingState != null;
  let buttonRef = useRef<HTMLButtonElement>(null);
  let inputRef = useRef<HTMLInputElement>(null);
  let listBoxRef = useRef<HTMLDivElement>(null);
  let [popoverRefLikeValue, popoverRef] = useStatefulRef<HTMLDivElement>();
  let fieldRef = useObjectRef(forwardedRef);

  let layoutDelegate = useListBoxLayout();
  let state = useComboboxMultiState(props);
  let {
    buttonProps,
    descriptionProps,
    errorMessageProps,
    inputProps,
    labelProps,
    listBoxProps,
  } = useComboboxMulti(
    {
      ...props,
      buttonRef,
      inputRef,
      layoutDelegate,
      listBoxRef,
      popoverRef: popoverRefLikeValue,
    },
    state
  );

  let popoverStyle = usePopoverStyles({
    menuWidth,
    buttonRef,
    inputRef,
    fieldRef,
  });

  return (
    <>
      <FieldPrimitive
        width="alias.singleLineWidth"
        {...props}
        descriptionProps={descriptionProps}
        errorMessageProps={errorMessageProps}
        labelProps={labelProps}
        ref={fieldRef}
      >
        {/* @ts-expect-error FIXME: not sure how to resolve this type error */}
        <ComboboxInput
          {...props}
          isOpen={state.isOpen}
          loadingState={loadingState}
          inputProps={inputProps}
          inputRef={inputRef}
          triggerProps={buttonProps}
          triggerRef={buttonRef}
        />
      </FieldPrimitive>
      <Popover
        state={state}
        UNSAFE_style={popoverStyle}
        ref={popoverRef}
        triggerRef={align === 'end' ? buttonRef : inputRef}
        scrollRef={listBoxRef}
        placement={`${direction} ${align}`}
        hideArrow
        isNonModal
        shouldFlip={shouldFlip}
      >
        <ListBoxBase
          {...listBoxProps}
          ref={listBoxRef}
          autoFocus={state.focusStrategy}
          disallowEmptySelection
          focusOnPointerEnter
          isLoading={loadingState === 'loadingMore'}
          layout={layoutDelegate}
          onLoadMore={onLoadMore}
          state={state}
          UNSAFE_className={listStyles}
          renderEmptyState={() =>
            isAsync && <ComboboxEmptyState loadingState={loadingState} />
          }
        />
      </Popover>
    </>
  );
});

/**
 * This component is not accessible, use with caution.
 *
 * A multi-combobox combines a text input with a listbox, and allows users to filter a
 * list of options.
 */
const _ComboboxMulti: <T>(
  props: ComboboxMultiProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReactElement = React.forwardRef(ComboboxMulti as any) as any;

export { _ComboboxMulti as ComboboxMulti };
