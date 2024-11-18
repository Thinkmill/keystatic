import { useComboBox } from '@react-aria/combobox';
import { useFilter, useLocalizedStringFormatter } from '@react-aria/i18n';
import { PressResponder } from '@react-aria/interactions';
import {
  useLayoutEffect,
  useObjectRef,
  useResizeObserver,
} from '@react-aria/utils';
import { useComboBoxState } from '@react-stately/combobox';
import { AriaButtonProps } from '@react-types/button';
import { LoadingState } from '@react-types/shared';
import React, {
  ForwardedRef,
  InputHTMLAttributes,
  ReactElement,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { FieldButton } from '@keystar/ui/button';
import { useProviderProps } from '@keystar/ui/core';
import { FieldPrimitive } from '@keystar/ui/field';
import { Icon } from '@keystar/ui/icon';
import { chevronDownIcon } from '@keystar/ui/icon/icons/chevronDownIcon';
import { Flex } from '@keystar/ui/layout';
import { ListBoxBase, listStyles, useListBoxLayout } from '@keystar/ui/listbox';
import { Popover } from '@keystar/ui/overlays';
import { ProgressCircle } from '@keystar/ui/progress';
import {
  FocusRing,
  css,
  tokenSchema,
  useIsMobileDevice,
} from '@keystar/ui/style';
import {
  TextFieldPrimitive,
  validateTextFieldProps,
} from '@keystar/ui/text-field';
import { Text } from '@keystar/ui/typography';

import { comboboxClassList } from './class-list';
import localizedMessages from './l10n';
import { MobileCombobox } from './MobileCombobox';
import { ComboboxProps } from './types';

function Combobox<T extends object>(
  props: ComboboxProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  props = useProviderProps(props);
  // FIXME
  props = validateTextFieldProps(props as any) as typeof props;

  let isMobile = useIsMobileDevice();
  if (isMobile) {
    // menuTrigger=focus/manual don't apply to mobile combobox
    return <MobileCombobox {...props} menuTrigger="input" ref={forwardedRef} />;
  } else {
    // @ts-expect-error FIXME: 'T' could be instantiated with an arbitrary type which could be unrelated to 'unknown'.
    return <ComboboxBase {...props} ref={forwardedRef} />;
  }
}

const ComboboxBase = React.forwardRef(function ComboboxBase<T extends object>(
  props: ComboboxProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let {
    align = 'start',
    menuTrigger = 'input',
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

  let { contains } = useFilter({ sensitivity: 'base' });
  let state = useComboBoxState({
    ...props,
    defaultFilter: contains,
    allowsEmptyCollection: isAsync,
  });
  let layout = useListBoxLayout();

  let {
    buttonProps,
    inputProps,
    listBoxProps,
    labelProps,
    descriptionProps,
    errorMessageProps,
  } = useComboBox(
    {
      ...props,
      layoutDelegate: layout,
      buttonRef,
      popoverRef: popoverRefLikeValue,
      listBoxRef,
      inputRef,
      menuTrigger,
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
          disallowEmptySelection
          autoFocus={state.focusStrategy}
          shouldSelectOnPressUp
          focusOnPointerEnter
          layout={layout}
          state={state}
          shouldUseVirtualFocus
          isLoading={loadingState === 'loadingMore'}
          onLoadMore={onLoadMore}
          UNSAFE_className={listStyles}
          renderEmptyState={() =>
            isAsync && <ComboboxEmptyState loadingState={loadingState} />
          }
        />
      </Popover>
    </>
  );
});

export function ComboboxEmptyState(props: { loadingState?: LoadingState }) {
  let stringFormatter = useLocalizedStringFormatter(localizedMessages);
  return (
    <Flex height="element.regular" alignItems="center" paddingX="medium">
      <Text color="neutralSecondary">
        {props.loadingState === 'loading'
          ? stringFormatter.format('loading')
          : stringFormatter.format('noResults')}
      </Text>
    </Flex>
  );
}

export function usePopoverStyles(props: {
  menuWidth?: number;
  buttonRef: RefObject<HTMLButtonElement>;
  inputRef: RefObject<HTMLInputElement>;
  fieldRef: RefObject<HTMLDivElement>;
}) {
  const { buttonRef, inputRef, fieldRef, menuWidth: menuWidthProp } = props;

  // Measure the width of the input and the button to inform the width of the menu (below).
  let [menuWidth, setMenuWidth] = useState<number>();

  let onResize = useCallback(() => {
    if (buttonRef.current && inputRef.current) {
      let buttonWidth = buttonRef.current.offsetWidth;
      let inputWidth = inputRef.current.offsetWidth;

      setMenuWidth(inputWidth + buttonWidth);
    }
  }, [buttonRef, inputRef, setMenuWidth]);

  useResizeObserver({
    ref: fieldRef,
    onResize: onResize,
  });

  useLayoutEffect(onResize, [onResize]);

  return {
    width: menuWidth,
    minWidth: menuWidthProp ?? menuWidth,
  };
}

// FIXME: this is a hack to work around a requirement of react-aria. object refs
// never have the value early enough, so we need to use a stateful ref to force
// a re-render.
export function useStatefulRef<T extends HTMLElement>() {
  let [current, statefulRef] = useState<T | null>(null);
  return useMemo(() => {
    return [{ current }, statefulRef] as const;
  }, [current, statefulRef]);
}

interface ComboboxInputProps extends ComboboxProps<unknown> {
  inputProps: InputHTMLAttributes<HTMLInputElement>;
  inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement>;
  triggerProps: AriaButtonProps;
  triggerRef: RefObject<HTMLButtonElement>;
  style?: React.CSSProperties;
  isOpen?: boolean;
}

/** @private Used by multi variant. */
export const ComboboxInput = React.forwardRef(function ComboboxInput(
  props: ComboboxInputProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let {
    isDisabled,
    inputProps,
    inputRef,
    triggerProps,
    triggerRef,
    autoFocus,
    style,
    loadingState,
    isOpen,
    menuTrigger,
  } = props;
  let stringFormatter = useLocalizedStringFormatter(localizedMessages);
  let timeoutRef = useRef<NodeJS.Timeout>();
  let [showLoading, setShowLoading] = useState(false);

  let loadingCircle = (
    <Flex
      alignItems="center"
      flexShrink={0}
      justifyContent="center"
      pointerEvents="none"
      width="element.regular"
    >
      <ProgressCircle
        aria-label={stringFormatter.format('loading')}
        size="small"
        isIndeterminate
      />
    </Flex>
  );

  let isLoading = loadingState === 'loading' || loadingState === 'filtering';
  let inputValue = inputProps.value;
  let lastInputValue = useRef(inputValue);
  useEffect(() => {
    if (isLoading && !showLoading) {
      if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          setShowLoading(true);
        }, 500);
      }

      // If user is typing, clear the timer and restart since it is a new request
      if (inputValue !== lastInputValue.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setShowLoading(true);
        }, 500);
      }
    } else if (!isLoading) {
      // If loading is no longer happening, clear any timers and hide the loading circle
      setShowLoading(false);
      // @ts-expect-error FIXME: not sure how to resolve this type error
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }

    lastInputValue.current = inputValue;
  }, [isLoading, showLoading, inputValue]);

  return (
    <FocusRing autoFocus={autoFocus} isTextInput within>
      <div ref={forwardedRef} style={style}>
        <TextFieldPrimitive
          inputProps={{
            ...inputProps,
            className: comboboxClassList.element('input'),
          }}
          ref={inputRef}
          isDisabled={isDisabled}
          // loading circle should only be displayed if menu is open, if
          // menuTrigger is "manual", or first time load (to stop circle from
          // showing up when user selects an option)
          // startElement={
          //   showLoading &&
          //   (isOpen || menuTrigger === 'manual' || loadingState === 'loading')
          //     ? loadingState != null && loadingCircle
          //     : null
          // }
          endElement={
            <>
              {showLoading &&
              (isOpen || menuTrigger === 'manual' || loadingState === 'loading')
                ? loadingCircle
                : null}
              <PressResponder preventFocusOnPress isPressed={isOpen}>
                <FieldButton
                  {...triggerProps}
                  ref={triggerRef}
                  UNSAFE_className={css({
                    borderEndStartRadius: 0,
                    borderStartStartRadius: 0,

                    [`${comboboxClassList.selector(
                      'input'
                    )}[aria-invalid] ~ &`]: {
                      borderColor: tokenSchema.color.alias.borderInvalid,
                    },

                    [`${comboboxClassList.selector('input')}[readonly] ~ &`]: {
                      borderColor: tokenSchema.color.alias.borderIdle,
                    },

                    [`${comboboxClassList.selector('input')}:focus ~ &`]: {
                      borderColor: tokenSchema.color.alias.borderFocused,
                    },
                  })}
                >
                  <Icon src={chevronDownIcon} />
                </FieldButton>
              </PressResponder>
            </>
          }
        />
      </div>
    </FocusRing>
  );
});

/**
 * A combobox combines a text input with a listbox, and allows users to filter a
 * list of options.
 */
const _Combobox: <T>(
  props: ComboboxProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReactElement = React.forwardRef(Combobox as any) as any;

export { _Combobox as Combobox };
