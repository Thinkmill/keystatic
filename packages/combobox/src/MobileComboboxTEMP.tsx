import { useButton } from '@react-aria/button';
import { useComboBox } from '@react-aria/combobox';
import { useDialog } from '@react-aria/dialog';
import { FocusRing, FocusScope, focusSafely } from '@react-aria/focus';
import { useFilter, useLocalizedStringFormatter } from '@react-aria/i18n';
import { setInteractionModality, useHover } from '@react-aria/interactions';
import { useField } from '@react-aria/label';
import { DismissButton, useOverlayTrigger } from '@react-aria/overlays';
import { mergeProps, useId } from '@react-aria/utils';
import { ComboBoxState, useComboBoxState } from '@react-stately/combobox';
import { AriaButtonProps } from '@react-types/button';
import { FocusableRefValue, ValidationState } from '@react-types/shared';
import React, {
  HTMLAttributes,
  ReactElement,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { ClearButton } from '@voussoir/button';
import { FieldPrimitive } from '@voussoir/field';
import { Icon } from '@voussoir/icon';
import { chevronDownIcon } from '@voussoir/icon/icons/chevronDownIcon';
import { ListBoxBase, useListBoxLayout } from '@voussoir/listbox';
import { ProgressCircle } from '@voussoir/progress';
import { classNames } from '@voussoir/style';
import { TextFieldPrimitive } from '@voussoir/text-field';
import { Tray } from '@voussoir/overlays';

import { useProviderProps } from '@voussoir/core';

import { messages } from '../intl';
import { ComboboxProps } from './types';

const buttonStyles = {}; // remove
const comboboxStyles = {}; // remove
const labelStyles = {}; // remove
const searchStyles = {}; // remove
const styles = {}; // remove
const textfieldStyles = {}; // remove

export const MobileCombobox = React.forwardRef(function MobileCombobox<
  T extends object
>(props: ComboboxProps<T>, ref: RefObject<HTMLElement>) {
  props = useProviderProps(props);

  let { isDisabled, validationState, isReadOnly } = props;

  let { contains } = useFilter({ sensitivity: 'base' });
  let state = useComboBoxState({
    ...props,
    defaultFilter: contains,
    allowsEmptyCollection: true,
    // Needs to be false here otherwise we double up on commitSelection/commitCustomValue calls when
    // user taps on underlay (i.e. initial tap will call setFocused(false) -> commitSelection/commitCustomValue via onBlur,
    // then the closing of the tray will call setFocused(false) again due to cleanup effect)
    shouldCloseOnBlur: false,
  });

  let buttonRef = useRef<HTMLElement>(null);
  let domRef = useFocusableRef(ref, buttonRef);
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
  labelProps.onClick = () => {
    if (!props.isDisabled) {
      buttonRef.current.focus();
      setInteractionModality('keyboard');
    }
  };

  return (
    <>
      <FieldPrimitive
        {...props}
        labelProps={labelProps}
        elementType="span"
        ref={domRef}
        includeNecessityIndicatorInAccessibilityName
      >
        <ComboBoxButton
          {...mergeProps(triggerProps, fieldProps, {
            autoFocus: props.autoFocus,
          })}
          ref={buttonRef}
          isDisabled={isDisabled}
          isPlaceholder={!state.inputValue}
          validationState={validationState}
          onPress={() => !isReadOnly && state.open(null, 'manual')}
        >
          {state.inputValue || props.placeholder || ''}
        </ComboBoxButton>
      </FieldPrimitive>
      <Tray state={state} isFixedHeight {...overlayProps}>
        <ComboBoxTray
          {...props}
          onClose={state.close}
          overlayProps={overlayProps}
          state={state}
        />
      </Tray>
    </>
  );
});

interface ComboBoxButtonProps extends AriaButtonProps {
  isDisabled?: boolean;
  isPlaceholder?: boolean;
  validationState?: ValidationState;
  children?: ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const ComboBoxButton = React.forwardRef(function ComboBoxButton(
  props: ComboBoxButtonProps,
  ref: RefObject<HTMLElement>
) {
  let {
    isDisabled,
    isPlaceholder,
    validationState,
    children,
    style,
    className,
  } = props;
  let stringFormatter = useLocalizedStringFormatter(messages);
  let valueId = useId();
  let invalidId = useId();

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
    ref
  );

  return (
    <FocusRing
      focusClass={classNames(styles, 'is-focused')}
      focusRingClass={classNames(styles, 'focus-ring')}
    >
      <div
        {...mergeProps(hoverProps, buttonProps)}
        aria-haspopup="dialog"
        ref={ref as RefObject<HTMLDivElement>}
        style={{ ...style, outline: 'none' }}
        className={classNames(
          styles,
          'spectrum-InputGroup',
          {
            'is-disabled': isDisabled,
            'spectrum-InputGroup--invalid':
              validationState === 'invalid' && !isDisabled,
            'is-hovered': isHovered,
          },
          classNames(comboboxStyles, 'mobile-combobox'),
          className
        )}
      >
        <div
          className={classNames(
            textfieldStyles,
            'spectrum-Textfield',
            {
              'spectrum-Textfield--invalid':
                validationState === 'invalid' && !isDisabled,
              'spectrum-Textfield--valid':
                validationState === 'valid' && !isDisabled,
            },
            classNames(styles, 'spectrum-InputGroup-field')
          )}
        >
          <div
            className={classNames(
              textfieldStyles,
              'spectrum-Textfield-input',
              {
                'is-hovered': isHovered,
                'is-placeholder': isPlaceholder,
                'is-disabled': isDisabled,
              },
              classNames(
                styles,
                'spectrum-InputGroup-input',
                classNames(labelStyles, 'spectrum-Field-field')
              ),
              classNames(comboboxStyles, 'mobile-input')
            )}
          >
            <span
              id={valueId}
              className={classNames(comboboxStyles, 'mobile-value')}
            >
              {children}
            </span>
          </div>
        </div>
        <div
          className={classNames(
            buttonStyles,
            'spectrum-FieldButton',
            {
              'is-active': isPressed,
              'is-disabled': isDisabled,
              'spectrum-FieldButton--invalid':
                validationState === 'invalid' && !isDisabled,
              'is-hovered': isHovered,
            },
            classNames(styles, 'spectrum-FieldButton')
          )}
        >
          <Icon
            src={chevronDownIcon}
            UNSAFE_className={classNames(styles, 'spectrum-Dropdown-chevron')}
          />
        </div>
      </div>
    </FocusRing>
  );
});

interface ComboBoxTrayProps extends ComboboxProps<unknown> {
  state: ComboBoxState<unknown>;
  overlayProps: HTMLAttributes<HTMLElement>;
  loadingIndicator?: ReactElement;
  onClose: () => void;
}

function ComboBoxTray(props: ComboBoxTrayProps) {
  let {
    // completionMode = 'suggest',
    state,
    isDisabled,
    validationState,
    label,
    overlayProps,
    loadingState,
    onLoadMore,
    onClose,
  } = props;

  let timeout = useRef(null);
  let [showLoading, setShowLoading] = useState(false);
  let inputRef = useRef<HTMLInputElement>();
  let buttonRef = useRef<FocusableRefValue<HTMLElement>>();
  let popoverRef = useRef<HTMLDivElement>();
  let listBoxRef = useRef<HTMLDivElement>();
  let layout = useListBoxLayout(state);
  let stringFormatter = useLocalizedStringFormatter(messages);

  let { inputProps, listBoxProps, labelProps } = useComboBox(
    {
      ...props,
      // completionMode,
      keyboardDelegate: layout,
      buttonRef: unwrapDOMRef(buttonRef),
      popoverRef: popoverRef,
      listBoxRef,
      inputRef,
    },
    state
  );

  React.useEffect(() => {
    focusSafely(inputRef.current);

    // When the tray unmounts, set state.isFocused (i.e. the tray input's focus tracker) to false.
    // This is to prevent state.isFocused from being set to true when the tray closes via tapping on the underlay
    // (FocusScope attempts to restore focus to the tray input when tapping outside the tray due to "contain")
    // Have to do this manually since React doesn't call onBlur when a component is unmounted: https://github.com/facebook/react/issues/12363
    return () => {
      state.setFocused(false);
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
        inputRef.current.focus();
      }}
      UNSAFE_className={classNames(searchStyles, 'spectrum-ClearButton')}
      isDisabled={isDisabled}
    />
  );

  let loadingCircle = (
    <ProgressCircle
      aria-label={stringFormatter.format('loading')}
      size="S"
      isIndeterminate
      UNSAFE_className={classNames(
        searchStyles,
        'spectrum-Search-circleLoader',
        classNames(textfieldStyles, 'spectrum-Textfield-circleLoader')
      )}
    />
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
    if (
      !inputRef.current ||
      document.activeElement !== inputRef.current ||
      !isTouchDown.current
    ) {
      return;
    }

    popoverRef.current.focus();
  }, [inputRef, popoverRef, isTouchDown]);

  let inputValue = inputProps.value;
  let lastInputValue = useRef(inputValue);
  useEffect(() => {
    if (loadingState === 'filtering' && !showLoading) {
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
    } else if (loadingState !== 'filtering') {
      // If loading is no longer happening, clear any timers and hide the loading circle
      setShowLoading(false);
      clearTimeout(timeout.current);
      timeout.current = null;
    }

    lastInputValue.current = inputValue;
  }, [loadingState, inputValue, showLoading]);

  let onKeyDown = e => {
    // Close virtual keyboard if user hits Enter w/o any focused options
    if (e.key === 'Enter' && state.selectionManager.focusedKey == null) {
      popoverRef.current.focus();
    } else {
      inputProps.onKeyDown(e);
    }
  };

  return (
    <FocusScope restoreFocus contain>
      <div
        {...mergeProps(overlayProps, dialogProps)}
        ref={popoverRef}
        className={classNames(comboboxStyles, 'tray-dialog')}
      >
        <DismissButton onDismiss={onClose} />
        <TextFieldPrimitive
          label={label}
          labelProps={labelProps}
          inputProps={{ ...inputProps, onKeyDown }}
          inputRef={inputRef}
          isDisabled={isDisabled}
          isLoading={showLoading && loadingState === 'filtering'}
          loadingIndicator={loadingState != null && loadingCircle}
          validationState={validationState}
          labelAlign="start"
          labelPosition="top"
          wrapperChildren={
            (state.inputValue !== '' ||
              loadingState === 'filtering' ||
              validationState != null) &&
            !props.isReadOnly &&
            clearButton
          }
          UNSAFE_className={classNames(
            searchStyles,
            'spectrum-Search',
            'spectrum-Textfield',
            'spectrum-Search--loadable',
            {
              'spectrum-Search--invalid':
                validationState === 'invalid' && !isDisabled,
              'spectrum-Search--valid':
                validationState === 'valid' && !isDisabled,
            },
            classNames(comboboxStyles, 'tray-textfield', {
              'has-label': !!props.label,
            })
          )}
          inputClassName={classNames(
            comboboxStyles,
            'tray-textfield-input',
            classNames(searchStyles, 'spectrum-Search-input')
          )}
          validationIconClassName={classNames(
            searchStyles,
            'spectrum-Search-validationIcon'
          )}
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
              <span className={classNames(comboboxStyles, 'no-results')}>
                {stringFormatter.format('noResults')}
              </span>
            )
          }
          UNSAFE_className={classNames(comboboxStyles, 'tray-listbox')}
          ref={listBoxRef}
          onScroll={onScroll}
          onLoadMore={onLoadMore}
          isLoading={
            loadingState === 'loading' || loadingState === 'loadingMore'
          }
        />
        <DismissButton onDismiss={onClose} />
      </div>
    </FocusScope>
  );
}
