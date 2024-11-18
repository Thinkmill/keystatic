import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { useMenuTrigger } from '@react-aria/menu';
import { getItemId, listData } from '@react-aria/listbox';
import { ariaHideOutside } from '@react-aria/overlays';
import {
  ListKeyboardDelegate,
  useSelectableCollection,
} from '@react-aria/selection';
import { useTextField } from '@react-aria/textfield';
import { chain, mergeProps, useLabels } from '@react-aria/utils';
import {
  KeyboardDelegate,
  KeyboardEvent,
  LayoutDelegate,
  PressEvent,
  RefObject,
} from '@react-types/shared';
import { FocusEvent, useEffect, useMemo, useRef } from 'react';

import localizedMessages from './l10n';
import { ComboboxMultiProps } from './types';
import { ComboboxMultiState } from './useComboboxMultiState';

export interface ComboboxMultiOptions<T>
  extends Omit<ComboboxMultiProps<T>, 'children'> {
  /** The ref for the input element. */
  inputRef: RefObject<HTMLInputElement | null>;
  /** The ref for the list box popover. */
  popoverRef: RefObject<Element | null>;
  /** The ref for the list box. */
  listBoxRef: RefObject<HTMLElement | null>;
  /** The ref for the optional list box popup trigger button.  */
  buttonRef?: RefObject<Element | null>;
  /** An optional keyboard delegate implementation, to override the default. */
  keyboardDelegate?: KeyboardDelegate;
  /**
   * A delegate object that provides layout information for items in the collection.
   * By default this uses the DOM, but this can be overridden to implement things like
   * virtualized scrolling.
   */
  layoutDelegate?: LayoutDelegate;
  /** Whether the combo box menu should close on blur. */
  shouldCloseOnBlur?: boolean;
}

export function useComboboxMulti<T extends object>(
  props: ComboboxMultiOptions<T>,
  state: ComboboxMultiState<T>
) {
  let {
    isDisabled,
    isReadOnly,
    menuTrigger = 'input',
    buttonRef: buttonRefProp,
    inputRef,
    keyboardDelegate,
    layoutDelegate,
    listBoxRef,
    popoverRef,
    shouldCloseOnBlur = true,
  } = props;

  // combobox doesn't require a button element, so we need a backup ref for the
  // menu trigger hook
  let backupBtnRef = useRef(null);
  let buttonRef = buttonRefProp ?? backupBtnRef;
  let { menuTriggerProps, menuProps } = useMenuTrigger<T>(
    {
      type: 'listbox',
      isDisabled: isDisabled || isReadOnly,
    },
    state,
    buttonRef
  );

  // Set listbox id so it can be used when calling getItemId later
  listData.set(state, { id: menuProps.id! });

  let stringFormatter = useLocalizedStringFormatter(localizedMessages);

  // By default, a KeyboardDelegate is provided which uses the DOM to query
  // layout information (e.g. for page up/page down). When virtualized, the
  // layout object will be passed in as a prop and override this.
  let delegate = useMemo(
    () =>
      keyboardDelegate ||
      new ListKeyboardDelegate({
        collection: state.collection,
        disabledKeys: state.selectionManager.disabledKeys,
        ref: listBoxRef,
        layoutDelegate,
      }),
    [
      keyboardDelegate,
      layoutDelegate,
      state.collection,
      state.selectionManager.disabledKeys,
      listBoxRef,
    ]
  );

  // Use useSelectableCollection to get the keyboard handlers to apply to the textfield
  let { collectionProps } = useSelectableCollection({
    selectionManager: state.selectionManager,
    keyboardDelegate: delegate,
    disallowTypeAhead: true,
    disallowEmptySelection: true,
    shouldFocusWrap: true,
    ref: inputRef,
    // This would be nice but it'd have to work with the _filtered_ collection
    disallowSelectAll: true,
    // Prevent item scroll behavior from being applied here, should be handled in the user's Popover + ListBox component
    isVirtualized: true,
  });

  useEffect(() => {
    if (state.isOpen) {
      return ariaHideOutside(
        [inputRef.current, popoverRef.current].filter(
          element => element != null
        )
      );
    }
  }, [state.isOpen, inputRef, popoverRef]);

  // TextField
  // ---------------------------------------------------------------------------

  let onKeyDown = (e: KeyboardEvent) => {
    // Ignore composition events for CJK input
    if (e.nativeEvent.isComposing) {
      return;
    }

    switch (e.key) {
      case 'Enter':
        // Prevent form submission when open, assume the intent is selection
        if (state.isOpen) {
          e.preventDefault();
        }

        state.selectionManager.select(state.selectionManager.focusedKey);

        // Clear the input value after selection but keep the menu open
        state.setInputValue('');
        break;
      case 'Escape':
        // Propagate the event when closed, assume the intent is to dismiss a
        // parental the dialog
        if (!state.isOpen) {
          e.continuePropagation();
        }

        state.close();
        break;
      case 'ArrowDown':
        state.open('first');
        break;
      case 'ArrowUp':
        state.open('last');
        break;
      case 'ArrowLeft':
      case 'ArrowRight':
        state.selectionManager.setFocusedKey(null);
        break;
    }
  };
  let onBlur = (e: FocusEvent<HTMLInputElement>) => {
    props.onBlur?.(e);
    if (shouldCloseOnBlur) {
      state.close();
    }
  };
  let onFocus = (e: FocusEvent<HTMLInputElement>) => {
    props.onFocus?.(e);
    if (menuTrigger === 'focus' && !props.isReadOnly) {
      state.open();
    }
    state.selectionManager.setFocused(true);
  };

  let { labelProps, inputProps, descriptionProps, errorMessageProps } =
    useTextField(
      {
        ...props,
        // @ts-expect-error — hook type generic to support textareas
        onBlur,
        // @ts-expect-error — hook type generic to support textareas
        onFocus,
        onChange: state.setInputValue,
        onKeyDown: !props.isReadOnly
          ? chain(
              state.isOpen && collectionProps.onKeyDown,
              onKeyDown,
              props.onKeyDown
            )
          : props.onKeyDown,
        autoComplete: 'off',
        validate: undefined,
        value: state.inputValue,
      },
      inputRef
    );

  // Button
  // ---------------------------------------------------------------------------

  let onPress = (e: PressEvent) => {
    if (e.pointerType === 'touch') {
      // Focus the input field in case it isn't focused yet
      inputRef.current?.focus();
      state.toggle();
    }
  };
  let onPressStart = (e: PressEvent) => {
    if (e.pointerType !== 'touch') {
      inputRef.current?.focus();
      let strategy =
        e.pointerType === 'keyboard' || e.pointerType === 'virtual'
          ? ('first' as const)
          : null;
      state.toggle(strategy);
    }
  };

  // Misc.
  // ---------------------------------------------------------------------------

  let { isInvalid, validationErrors, validationDetails } =
    state.displayValidation;
  let focusedItem =
    state.selectionManager.focusedKey != null && state.isOpen
      ? state.collection.getItem(state.selectionManager.focusedKey)
      : undefined;

  let triggerLabelProps = useLabels({
    id: menuTriggerProps.id,
    'aria-label': stringFormatter.format('buttonLabel'),
    'aria-labelledby': props['aria-labelledby'] || labelProps.id,
  });
  let listBoxProps = useLabels({
    id: menuProps.id,
    'aria-label': stringFormatter.format('listboxLabel'),
    'aria-labelledby': props['aria-labelledby'] || labelProps.id,
  });

  return {
    buttonProps: {
      ...menuTriggerProps,
      ...triggerLabelProps,
      excludeFromTabOrder: true,
      isDisabled: props.isDisabled || props.isReadOnly,
      onPress,
      onPressStart,
    },
    descriptionProps,
    errorMessageProps,
    inputProps: mergeProps(inputProps, {
      role: 'combobox',
      'aria-expanded': menuTriggerProps['aria-expanded'],
      'aria-controls': state.isOpen ? menuProps.id : undefined,
      'aria-autocomplete': 'list',
      'aria-activedescendant': focusedItem
        ? getItemId(state, focusedItem.key)
        : undefined,
      // onTouchEnd,
      // This disable's iOS's autocorrect suggestions, since the combo box provides its own suggestions.
      autoCorrect: 'off',
      // This disable's the macOS Safari spell check auto corrections.
      spellCheck: 'false',
    }),
    listBoxProps: mergeProps(menuProps, listBoxProps, {
      // autoFocus: state.focusStrategy,
      shouldUseVirtualFocus: true,
      shouldSelectOnPressUp: true,
      shouldFocusOnHover: true,
      // layout: layoutDelegate,
      linkBehavior: 'selection' as const,
    }),
    labelProps,
    isInvalid,
    validationErrors,
    validationDetails,
  };
}
