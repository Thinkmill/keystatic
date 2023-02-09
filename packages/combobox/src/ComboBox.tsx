import { useComboBox } from '@react-aria/combobox';
import { useFilter, useLocalizedStringFormatter } from '@react-aria/i18n';
import { PressResponder, useHover } from '@react-aria/interactions';
import { useComboBoxState } from '@react-stately/combobox';
import { AriaButtonProps } from '@react-types/button';
import { FocusableRef, FocusableRefValue } from '@react-types/shared';
import React, {
  InputHTMLAttributes,
  ReactElement,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { FieldButton } from '@voussoir/button';
import { useProvider, useProviderProps } from '@voussoir/core';
import { FieldPrimitive } from '@voussoir/field';
import { Icon } from '@voussoir/icon';
import { chevronDownIcon } from '@voussoir/icon/icons/chevronDownIcon';
import { ListBoxBase, useListBoxLayout } from '@voussoir/listbox';
import { Popover } from '@voussoir/overlays';
import { ProgressCircle } from '@voussoir/progress';
import { classNames, useIsMobileDevice } from '@voussoir/style';
import { TextFieldPrimitive } from '@voussoir/text-field';
import {
  FocusRing,
  useLayoutEffect,
  useObjectRef,
  useResizeObserver,
} from '@voussoir/utils';

import { messages } from '../intl';

import { MobileComboBox } from './MobileComboBox';
import { ComboBoxProps } from './types';
import { Flex } from '@voussoir/layout';

const comboboxStyles = {}; // remove
const styles = {}; // remove
const textfieldStyles = {}; // remove

function ComboBox<T extends object>(
  props: ComboBoxProps<T>,
  ref: RefObject<HTMLElement>
) {
  props = useProviderProps(props);

  if (props.placeholder) {
    console.warn(
      'Placeholders are deprecated due to accessibility issues. Please use help text instead. See the docs for details: https://react-spectrum.adobe.com/react-spectrum/ComboBox.html#help-text'
    );
  }

  let isMobile = useIsMobileDevice();
  if (isMobile) {
    // menuTrigger=focus/manual don't apply to mobile combobox
    return <MobileComboBox {...props} menuTrigger="input" ref={ref} />;
  } else {
    return <ComboBoxBase {...props} ref={ref} />;
  }
}

const ComboBoxBase = React.forwardRef(function ComboBoxBase<T extends object>(
  props: ComboBoxProps<T>,
  ref: FocusableRef<HTMLElement>
) {
  let {
    menuTrigger = 'input',
    shouldFlip = true,
    direction = 'bottom',
    loadingState,
    onLoadMore,
  } = props;

  let stringFormatter = useLocalizedStringFormatter(messages);
  let isAsync = loadingState != null;
  let buttonRef = useRef<HTMLElement>(null);
  let inputRef = useRef<HTMLInputElement>(null);
  let listBoxRef = useRef();
  let popoverRef = useRef<HTMLDivElement>(null);
  let domRef = useObjectRef(ref, inputRef);

  let { contains } = useFilter({ sensitivity: 'base' });
  let state = useComboBoxState({
    ...props,
    defaultFilter: contains,
    allowsEmptyCollection: isAsync,
  });
  let layout = useListBoxLayout(state);

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
      keyboardDelegate: layout,
      buttonRef,
      popoverRef,
      listBoxRef,
      inputRef,
      menuTrigger,
    },
    state
  );

  // Measure the width of the inputfield and the button to inform the width of the menu (below).
  let [menuWidth, setMenuWidth] = useState(null);
  let { scale } = useProvider();

  let onResize = useCallback(() => {
    if (unwrappedButtonRef.current && inputRef.current) {
      let buttonWidth = unwrappedButtonRef.current.offsetWidth;
      let inputWidth = inputRef.current.offsetWidth;
      setMenuWidth(buttonWidth + inputWidth);
    }
  }, [unwrappedButtonRef, inputRef, setMenuWidth]);

  useResizeObserver({
    ref: domRef,
    onResize: onResize,
  });

  useLayoutEffect(onResize, [scale, onResize]);

  let style = {
    width: menuWidth,
    minWidth: menuWidth,
  };

  return (
    <>
      <FieldPrimitive
        {...props}
        descriptionProps={descriptionProps}
        errorMessageProps={errorMessageProps}
        labelProps={labelProps}
        ref={domRef}
      >
        <ComboBoxInput
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
        UNSAFE_style={style}
        UNSAFE_className={classNames(styles, 'spectrum-InputGroup-popover')}
        ref={popoverRef}
        triggerRef={unwrappedButtonRef}
        scrollRef={listBoxRef}
        placement={`${direction} end`}
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
          renderEmptyState={() =>
            isAsync && (
              <span className={classNames(comboboxStyles, 'no-results')}>
                {loadingState === 'loading'
                  ? stringFormatter.format('loading')
                  : stringFormatter.format('noResults')}
              </span>
            )
          }
        />
      </Popover>
    </>
  );
});

interface ComboBoxInputProps extends ComboBoxProps<unknown> {
  inputProps: InputHTMLAttributes<HTMLInputElement>;
  inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement>;
  triggerProps: AriaButtonProps;
  triggerRef: RefObject<FocusableRefValue<HTMLElement>>;
  style?: React.CSSProperties;
  className?: string;
  isOpen?: boolean;
}

const ComboBoxInput = React.forwardRef(function ComboBoxInput(
  props: ComboBoxInputProps,
  ref: RefObject<HTMLElement>
) {
  let {
    isDisabled,
    validationState,
    inputProps,
    inputRef,
    triggerProps,
    triggerRef,
    autoFocus,
    style,
    className,
    loadingState,
    isOpen,
    menuTrigger,
  } = props;
  let { hoverProps, isHovered } = useHover({});
  let stringFormatter = useLocalizedStringFormatter(messages);
  let timeout = useRef<NodeJS.Timeout>();
  let [showLoading, setShowLoading] = useState(false);

  let loadingCircle = (
    <Flex
      alignItems="center"
      flexShrink={0}
      justifyContent="center"
      pointerEvents="none"
      width="regular"
    >
      <ProgressCircle
        aria-label={stringFormatter.format('loading')}
        size="small"
        isIndeterminate
        UNSAFE_className={classNames(
          textfieldStyles,
          'spectrum-Textfield-circleLoader',
          classNames(styles, 'spectrum-InputGroup-input-circleLoader')
        )}
      />
    </Flex>
  );

  let isLoading = loadingState === 'loading' || loadingState === 'filtering';
  let inputValue = inputProps.value;
  let lastInputValue = useRef(inputValue);
  useEffect(() => {
    if (isLoading && !showLoading) {
      if (timeout.current === null) {
        timeout.current = setTimeout(() => {
          setShowLoading(true);
        }, 500);
      }

      // If user is typing, clear the timer and restart since it is a new request
      if (inputValue !== lastInputValue.current) {
        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
          setShowLoading(true);
        }, 500);
      }
    } else if (!isLoading) {
      // If loading is no longer happening, clear any timers and hide the loading circle
      setShowLoading(false);
      clearTimeout(timeout.current);
      timeout.current = undefined;
    }

    lastInputValue.current = inputValue;
  }, [isLoading, showLoading, inputValue]);

  return (
    <FocusRing autoFocus={autoFocus} isTextInput within>
      <div
        {...hoverProps}
        ref={ref as RefObject<HTMLDivElement>}
        style={style}
        className={classNames(
          styles,
          'spectrum-InputGroup',
          {
            'is-disabled': isDisabled,
            'spectrum-InputGroup--invalid':
              validationState === 'invalid' && !isDisabled,
            'is-hovered': isHovered,
          },
          className
        )}
      >
        <TextFieldPrimitive
          inputProps={inputProps}
          ref={inputRef}
          UNSAFE_className={classNames(styles, 'spectrum-InputGroup-field')}
          // UNUSED_START
          // disableFocusRing
          // inputClassName={classNames(styles, 'spectrum-InputGroup-input')}
          // validationState={validationState}
          // UNUSED_END
          isDisabled={isDisabled}
          // loading circle should only be displayed if menu is open, if
          // menuTrigger is "manual", or first time load (to stop circle from
          // showing up when user selects an option)
          startElement={
            showLoading &&
            (isOpen || menuTrigger === 'manual' || loadingState === 'loading')
              ? loadingCircle
              : null
          }
        />
        <PressResponder preventFocusOnPress isPressed={isOpen}>
          <FieldButton
            {...triggerProps}
            ref={triggerRef}
            UNSAFE_className={classNames(styles, 'spectrum-FieldButton')}
            validationState={validationState}
          >
            <Icon
              src={chevronDownIcon}
              UNSAFE_className={classNames(styles, 'spectrum-Dropdown-chevron')}
            />
          </FieldButton>
        </PressResponder>
      </div>
    </FocusRing>
  );
});

/**
 * ComboBoxes combine a text entry with a picker menu, allowing users to filter
 * longer lists to only the selections matching a query.
 */
const _ComboBox = React.forwardRef(ComboBox as any) as <T>(
  props: ComboBoxProps<T> & { ref?: RefObject<HTMLElement> }
) => ReactElement;
export { _ComboBox as ComboBox };
