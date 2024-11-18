import { useButton } from '@react-aria/button';
import { useDialog } from '@react-aria/dialog';
import { FocusScope, focusSafely } from '@react-aria/focus';
import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { setInteractionModality, useHover } from '@react-aria/interactions';
import { useField } from '@react-aria/label';
import { DismissButton, useOverlayTrigger } from '@react-aria/overlays';
import { mergeProps, useId, useObjectRef } from '@react-aria/utils';
import { AriaButtonProps } from '@react-types/button';
import { ValidationState } from '@react-types/shared';
import React, {
  ForwardedRef,
  HTMLAttributes,
  KeyboardEvent,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ClearButton,
  FieldButtonProps,
  useFieldButton,
} from '@keystar/ui/button';
import { useProviderProps } from '@keystar/ui/core';
import { FieldPrimitive } from '@keystar/ui/field';
import { Icon } from '@keystar/ui/icon';
import { chevronDownIcon } from '@keystar/ui/icon/icons/chevronDownIcon';
import { Flex } from '@keystar/ui/layout';
import { ListBoxBase, useListBoxLayout } from '@keystar/ui/listbox';
import { Tray } from '@keystar/ui/overlays';
import { ProgressCircle } from '@keystar/ui/progress';
import {
  FocusRing,
  css,
  toDataAttributes,
  tokenSchema,
  transition,
} from '@keystar/ui/style';
import { TextFieldPrimitive } from '@keystar/ui/text-field';
import { Text } from '@keystar/ui/typography';

import localizedMessages from './l10n';
import { ComboboxMultiProps } from './types';
import { comboboxClassList } from './class-list';
import {
  ComboboxMultiState,
  useComboboxMultiState,
} from './useComboboxMultiState';
import { useComboboxMulti } from './useComboboxMulti';

function MobileComboboxMulti<T extends object>(
  _props: ComboboxMultiProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  const props = useProviderProps(_props);

  let { isDisabled, isReadOnly, validationState } = props;

  // let { contains } = useFilter({ sensitivity: 'base' });
  let state = useComboboxMultiState({
    ...props,
    // defaultFilter: contains,
    allowsEmptyCollection: true,
  });

  let buttonRef = useRef<HTMLDivElement>(null);
  let domRef = useObjectRef(forwardedRef);
  let { triggerProps, overlayProps } = useOverlayTrigger(
    { type: 'listbox' },
    state,
    buttonRef
  );

  let { labelProps, fieldProps } = useField({
    ...props,
    labelElementType: 'span',
  });

  // Focus the button and show focus ring when clicking on the label
  labelProps = {
    ...labelProps,
    onClick: () => {
      let button = buttonRef.current;
      if (button && !props.isDisabled) {
        button.focus();
        setInteractionModality('keyboard');
      }
    },
  };

  return (
    <>
      <FieldPrimitive
        {...props}
        labelProps={labelProps}
        // elementType="span"
        ref={domRef}
        supplementRequiredState
      >
        <ComboboxButton
          {...mergeProps(triggerProps, fieldProps, {
            autoFocus: props.autoFocus,
          })}
          ref={buttonRef}
          isDisabled={isDisabled}
          isReadOnly={isReadOnly}
          isPlaceholder={!state.inputValue}
          validationState={validationState}
          onPress={() => !isReadOnly && state.open()}
        >
          {state.inputValue || props.placeholder || ''}
        </ComboboxButton>
      </FieldPrimitive>
      <Tray state={state} isFixedHeight {...overlayProps}>
        <ComboboxTray
          {...props}
          onClose={state.close}
          overlayProps={overlayProps}
          state={state}
        />
      </Tray>
    </>
  );
}

interface ComboboxButtonProps extends AriaButtonProps {
  children?: ReactNode;
  className?: string;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  isPlaceholder?: boolean;
  style?: React.CSSProperties;
  validationState?: ValidationState;
}

const ComboboxButton = React.forwardRef(function ComboboxButton(
  props: ComboboxButtonProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let { isDisabled, isPlaceholder, validationState, children, style } = props;
  let valueId = useId();
  let invalidId = useId();

  let domRef = useObjectRef(forwardedRef);
  let { hoverProps, isHovered } = useHover({});
  let { buttonProps, isPressed } = useButton(
    {
      ...props,
      'aria-labelledby': [
        props['aria-labelledby'],
        props['aria-label'] && !props['aria-labelledby'] ? props.id : null,
        valueId,
        validationState === 'invalid' ? invalidId : null,
      ]
        .filter(Boolean)
        .join(' '),
      elementType: 'div',
    },
    domRef
  );

  return (
    <FocusRing>
      <Flex
        position="relative"
        width="alias.singleLineWidth"
        zIndex={0} // create a new stacking context
        {...toDataAttributes({ readonly: props.isReadOnly })}
        {...mergeProps(hoverProps, buttonProps)}
        aria-haspopup="dialog"
        ref={domRef}
        UNSAFE_className={comboboxClassList.element('mobile-trigger')}
        UNSAFE_style={{ ...style, outline: 'none' }}
      >
        <Flex alignItems="center" paddingX="medium" flex>
          <Text
            id={valueId}
            color={isPlaceholder ? 'neutralSecondary' : undefined}
            trim={false}
            truncate
          >
            {children}
          </Text>
        </Flex>
        <InputStateIndicator
          isHovered={isHovered}
          isPressed={isPressed}
          isDisabled={isDisabled}
          validationState={validationState}
        />
        <CosmeticFieldButton
          isHovered={isHovered}
          isPressed={isPressed}
          isDisabled={isDisabled}
          validationState={validationState}
          UNSAFE_className={css({
            borderEndStartRadius: 0,
            borderStartStartRadius: 0,

            [`${comboboxClassList.selector('mobile-trigger')}[data-focus] &`]: {
              borderColor: tokenSchema.color.alias.borderFocused,
            },
          })}
        >
          <Icon src={chevronDownIcon} />
        </CosmeticFieldButton>
      </Flex>
    </FocusRing>
  );
});

type CosmeticProps = FieldButtonProps & {
  isHovered: boolean;
  isPressed: boolean;
};
const CosmeticFieldButton = (props: CosmeticProps) => {
  let { isHovered, isPressed, ...otherProps } = props;
  let { children, styleProps } = useFieldButton(otherProps, {
    isHovered,
    isPressed,
  });
  return (
    <div data-disabled={props.isDisabled} {...styleProps}>
      {children}
    </div>
  );
};

const InputStateIndicator = (props: CosmeticProps) => {
  let { isDisabled, isHovered, isPressed } = props;
  return (
    <div
      role="presentation"
      {...toDataAttributes({
        disabled: isDisabled,
        interaction: isPressed ? 'press' : isHovered ? 'hover' : undefined,
        validation: props.validationState,
      })}
      className={css({
        backgroundColor: tokenSchema.color.background.canvas,
        border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.alias.borderIdle}`,
        borderRadius: tokenSchema.size.radius.regular,
        inset: 0,
        position: 'absolute',
        transition: transition(['border-color', 'box-shadow']),
        zIndex: -1,

        '&[data-interaction=hover]': {
          borderColor: tokenSchema.color.alias.borderHovered,
        },
        '&[data-validation=invalid]': {
          borderColor: tokenSchema.color.alias.borderInvalid,
        },
        [`${comboboxClassList.selector('mobile-trigger')}[data-focus] &`]: {
          borderColor: tokenSchema.color.alias.borderFocused,
        },
        [`${comboboxClassList.selector(
          'mobile-trigger'
        )}[data-focus]:not([data-readonly]) &`]: {
          boxShadow: `0 0 0 1px ${tokenSchema.color.alias.borderFocused}`,
        },
        '&[data-disabled=true]': {
          backgroundColor: tokenSchema.color.background.surfaceSecondary,
          borderColor: 'transparent',
        },
      })}
    />
  );
};

interface ComboboxTrayProps<T extends object> extends ComboboxMultiProps<T> {
  state: ComboboxMultiState<T>;
  overlayProps: HTMLAttributes<HTMLElement>;
  loadingIndicator?: ReactElement;
  onClose: () => void;
}

function ComboboxTray<T extends object>(props: ComboboxTrayProps<T>) {
  let {
    state,
    isDisabled,
    validationState,
    label,
    overlayProps,
    loadingState,
    onLoadMore,
    onClose,
  } = props;

  let timeoutRef = useRef<NodeJS.Timeout>();
  let [showLoading, setShowLoading] = useState(false);
  let inputRef = useRef<HTMLInputElement>(null);
  let buttonRef = useRef<HTMLDivElement>(null);
  let popoverRef = useRef<HTMLDivElement>(null);
  let listBoxRef = useRef<HTMLDivElement>(null);
  let layout = useListBoxLayout();
  let stringFormatter = useLocalizedStringFormatter(localizedMessages);

  let { inputProps, listBoxProps, labelProps } = useComboboxMulti(
    {
      ...props,
      layoutDelegate: layout,
      buttonRef,
      popoverRef,
      listBoxRef,
      inputRef,
      // fix for close on blur behaviour
      shouldCloseOnBlur: false,
    },
    state
  );

  React.useEffect(() => {
    let input = inputRef.current;
    if (input) {
      focusSafely(input);
    }

    // When the tray unmounts, set state.isFocused (i.e. the tray input's focus tracker) to false.
    // This is to prevent state.isFocused from being set to true when the tray closes via tapping on the underlay
    // (FocusScope attempts to restore focus to the tray input when tapping outside the tray due to "contain")
    // Have to do this manually since React doesn't call onBlur when a component is unmounted: https://github.com/facebook/react/issues/12363
    return () => {
      state.selectionManager.setFocusedKey(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let { dialogProps } = useDialog(
    {
      'aria-labelledby': useId(labelProps.id),
    },
    popoverRef
  );

  // Override the role of the input to "searchbox" instead of "combobox".
  // Since the listbox is always visible, the combobox role doesn't really give us anything.
  // VoiceOver on iOS reads "double tap to collapse" when focused on the input rather than
  // "double tap to edit text", as with a textbox or searchbox. We'd like double tapping to
  // open the virtual keyboard rather than closing the tray.
  inputProps.role = 'searchbox';
  inputProps['aria-haspopup'] = 'listbox';
  delete inputProps.onTouchEnd;

  let clearButton = (
    <ClearButton
      preventFocus
      aria-label={stringFormatter.format('clear')}
      excludeFromTabOrder
      onPress={() => {
        state.setInputValue('');
        let input = inputRef.current;
        if (input) {
          input.focus();
        }
      }}
      isDisabled={isDisabled}
    />
  );

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

  // Close the software keyboard on scroll to give the user a bigger area to scroll.
  // But only do this if scrolling with touch, otherwise it can cause issues with touch
  // screen readers.
  let isTouchDown = useRef(false);
  let onTouchStart = () => {
    isTouchDown.current = true;
  };

  let onTouchEnd = () => {
    isTouchDown.current = false;
  };

  let onScroll = useCallback(() => {
    let input = inputRef.current;
    let popover = popoverRef.current;
    if (!input || document.activeElement !== input || !isTouchDown.current) {
      return;
    }

    if (popover) {
      popover.focus();
    }
  }, [inputRef, popoverRef, isTouchDown]);

  let inputValue = inputProps.value;
  let lastInputValue = useRef(inputValue);
  useEffect(() => {
    if (loadingState === 'filtering' && !showLoading) {
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
    } else if (loadingState !== 'filtering') {
      // If loading is no longer happening, clear any timers and hide the loading circle
      setShowLoading(false);
      // @ts-expect-error FIXME: NodeJS.Timeout is not assignable to number
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }

    lastInputValue.current = inputValue;
  }, [loadingState, inputValue, showLoading]);

  let onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    let popover = popoverRef.current;
    // Close virtual keyboard if user hits Enter w/o any focused options
    if (
      popover &&
      e.key === 'Enter' &&
      state.selectionManager.focusedKey == null
    ) {
      popover.focus();
    } else {
      inputProps.onKeyDown?.(e);
    }
  };

  return (
    <FocusScope restoreFocus contain>
      <Flex
        direction="column"
        height="100%"
        ref={popoverRef}
        {...mergeProps(overlayProps, dialogProps)}
      >
        <DismissButton onDismiss={onClose} />
        <TextFieldPrimitive
          label={label}
          labelProps={labelProps}
          inputProps={{ ...inputProps, onKeyDown }}
          ref={inputRef}
          isDisabled={isDisabled}
          marginX="small"
          marginTop="regular"
          endElement={
            <Flex>
              {showLoading && loadingState === 'filtering' && loadingCircle}
              {(state.inputValue !== '' ||
                loadingState === 'filtering' ||
                validationState != null) &&
                !props.isReadOnly &&
                clearButton}
            </Flex>
          }
        />
        <ListBoxBase
          {...listBoxProps}
          domProps={{ onTouchStart, onTouchEnd }}
          disallowEmptySelection
          shouldSelectOnPressUp
          focusOnPointerEnter
          layout={layout}
          state={state}
          shouldUseVirtualFocus
          renderEmptyState={() =>
            loadingState !== 'loading' && (
              <Flex
                height="element.regular"
                alignItems="center"
                paddingX="medium"
              >
                <Text color="neutralSecondary">
                  {stringFormatter.format('noResults')}
                </Text>
              </Flex>
            )
          }
          ref={listBoxRef}
          onScroll={onScroll}
          onLoadMore={onLoadMore}
          isLoading={
            loadingState === 'loading' || loadingState === 'loadingMore'
          }
        />
        <DismissButton onDismiss={onClose} />
      </Flex>
    </FocusScope>
  );
}
const _MobileComboboxMulti: <T>(
  props: ComboboxMultiProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReactElement = React.forwardRef(MobileComboboxMulti as any) as any;

export { _MobileComboboxMulti as MobileComboboxMulti };
