import { FocusScope, createFocusManager } from '@react-aria/focus';
import { useLocale } from '@react-aria/i18n';
import { PressProps, PressResponder } from '@react-aria/interactions';
import { filterDOMProps, isMac, mergeProps } from '@react-aria/utils';
import { useControlledState } from '@react-stately/utils';
import {
  AriaLabelingProps,
  DOMAttributes,
  ValueBase,
} from '@react-types/shared';
import { assert, assertNever } from 'emery';
import {
  Dispatch,
  Key,
  KeyboardEvent,
  PropsWithChildren,
  ReactNode,
  RefObject,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  ActionButton,
  ToggleButton,
  ToggleButtonProps,
} from '@keystar/ui/button';
import {
  BaseStyleProps,
  css,
  onlyStyleProps,
  tokenSchema,
} from '@keystar/ui/style';
import { Divider, HStack } from '@keystar/ui/layout';

type EditorToolbarState = {
  /** The value of the last focused node. */
  readonly lastFocusedId: Key | null;
  /** Sets the last focused node. */
  setLastFocusedId: Dispatch<SetStateAction<Key | null>>;
};
type EditorToolbarContextType = {
  state: EditorToolbarState;
};
const EditorToolbarContext = createContext<EditorToolbarContextType | null>(
  null
);
function useToolbarContext() {
  let context = useContext(EditorToolbarContext);
  if (context == null) {
    throw new Error('useToolbarContext must be used within a EditorToolbar');
  }
  return context;
}

type EditorToolbarProps = PropsWithChildren<BaseStyleProps> & AriaLabelingProps;
export function EditorToolbar(props: EditorToolbarProps) {
  let { children } = props;
  let ref = useRef<HTMLDivElement>(null);
  let { state, toolbarProps } = useToolbar(props, ref);

  return (
    <EditorToolbarContext.Provider value={{ state }}>
      <FocusScope>
        <HStack alignItems="center" gap="regular" ref={ref} {...toolbarProps}>
          {children}
        </HStack>
      </FocusScope>
    </EditorToolbarContext.Provider>
  );
}

// =============================================================================
// Group
// =============================================================================

type GroupSelectionType =
  | {
      disabledKeys?: Iterable<Key>;
      selectionMode: 'single';
      selectedValue: Key | null;
      setSelectedValue: (value: Key | null) => void;
    }
  | {
      disabledKeys?: Iterable<Key>;
      selectionMode: 'multiple';
      selectedValue: Key[];
      setSelectedValue: (value: Key[]) => void;
    };
const GroupSelectionContext = createContext<GroupSelectionType | null>(null);
function useGroupSelectionContext() {
  let context = useContext(GroupSelectionContext);

  assert(
    context !== null,
    'useGroupSelectionContext must be used within a group'
  );

  let disabledKeys = useSetFromIterable(context.disabledKeys);

  return { ...context, disabledKeys };
}
function useSelectionItem(props: EditorToolbarItemProps): {
  isDisabled: boolean;
  isSelected: boolean;
  buttonProps: PressProps & DOMAttributes;
} {
  let { value } = props;
  let context = useGroupSelectionContext();

  if (context.selectionMode === 'single') {
    let { disabledKeys, selectedValue, setSelectedValue } = context;
    let isDisabled = disabledKeys.has(value);
    let isSelected = selectedValue === value;

    return {
      isDisabled,
      isSelected,
      buttonProps: {
        role: 'radio' as const,
        'aria-checked': isSelected,
        onPress: () => {
          if (isDisabled) {
            return;
          }

          if (isSelected) {
            setSelectedValue(null);
          } else {
            setSelectedValue(value);
          }
        },
      },
    };
  }
  if (context.selectionMode === 'multiple') {
    let { disabledKeys, selectedValue, setSelectedValue } = context;
    let isDisabled = disabledKeys.has(value);
    let isSelected = selectedValue.includes(value);

    return {
      isDisabled,
      isSelected,
      buttonProps: {
        role: 'checkbox' as const,
        'aria-checked': isSelected,
        onPress: () => {
          if (isDisabled) {
            return;
          }

          if (selectedValue.includes(value)) {
            setSelectedValue(
              selectedValue.filter(existingValue => existingValue !== value)
            );
          } else {
            setSelectedValue(selectedValue.concat(value));
          }
        },
      },
    };
  }
  assertNever(context);
}

export type SelectionMode = 'none' | 'single' | 'multiple';
type EditorToolbarGroupProps = AriaLabelingProps & {
  /** The contents of the group. */
  children?: ReactNode;
} & (
    | ({
        selectionMode: 'multiple';
        disabledKeys?: Iterable<Key>;
        // onValueChange?: (value: Key) => void;
      } & ValueBase<Key[]>)
    | ({
        selectionMode: 'single';
        disabledKeys?: Iterable<Key>;
      } & ValueBase<Key | null>)
    | { selectionMode?: 'none' }
  );
export function EditorToolbarGroup(props: EditorToolbarGroupProps) {
  if (props.selectionMode === 'single') {
    return <EditorSingleSelectionGroup {...props} />;
  }
  if (props.selectionMode === 'multiple') {
    return <EditorMultipleSelectionGroup {...props} />;
  }

  return (
    <HStack gap="xsmall" role="group" {...filterPropsWithLabelWarning(props)}>
      {props.children}
    </HStack>
  );
}
/** @private SINGLE selection */
function EditorSingleSelectionGroup(
  props: EditorToolbarGroupProps & { selectionMode: 'single' }
) {
  let [selectedValue, setSelectedValue] = useControlledState<Key | null>(
    props.value!,
    props.defaultValue!,
    props.onChange!
  );

  let context = {
    disabledKeys: props.disabledKeys,
    selectionMode: props.selectionMode,
    selectedValue,
    setSelectedValue,
  };

  return (
    <GroupSelectionContext.Provider value={context}>
      <HStack
        gap="xsmall"
        role="radiogroup"
        {...filterPropsWithLabelWarning(props)}
      >
        {props.children}
      </HStack>
    </GroupSelectionContext.Provider>
  );
}
/** @private MULTI selection */
function EditorMultipleSelectionGroup(
  props: EditorToolbarGroupProps & { selectionMode: 'multiple' }
) {
  let [selectedValue, setSelectedValue] = useControlledState(
    props.value!,
    props.defaultValue || [],
    props.onChange!
  );

  let context = {
    disabledKeys: props.disabledKeys,
    selectionMode: props.selectionMode,
    selectedValue,
    setSelectedValue,
  };

  return (
    <GroupSelectionContext.Provider value={context}>
      <HStack gap="xsmall" role="group" {...filterPropsWithLabelWarning(props)}>
        {props.children}
      </HStack>
    </GroupSelectionContext.Provider>
  );
}

// =============================================================================
// Item
// =============================================================================

type EditorToolbarItemProps = {
  /** The contents of the item. */
  children?: ReactNode;
  /** The value of the item. */
  value: Key;
};

/** A toolbar item may be a checkbox/radio/toggle button, depending on context. */
export function EditorToolbarItem(props: EditorToolbarItemProps) {
  let { children, ...otherProps } = props;
  let { isDisabled, isSelected, buttonProps } = useSelectionItem(props);
  let { itemProps } = useToolbarItem({ ...props, isDisabled });

  return (
    // Use a PressResponder to send DOM props through, allow overriding things
    // like role and tabIndex.
    <PressResponder {...mergeProps(buttonProps, itemProps)}>
      <ActionButton
        prominence="low"
        isDisabled={isDisabled}
        isSelected={isSelected}
        {...otherProps}
      >
        {children}
      </ActionButton>
    </PressResponder>
  );
}

type EditorToolbarButtonProps = Omit<ToggleButtonProps, 'prominence'>;
export function EditorToolbarButton(props: EditorToolbarButtonProps) {
  let { itemProps } = useToolbarItem(props);

  return (
    <PressResponder {...itemProps}>
      <ToggleButton prominence="low" {...props} />
    </PressResponder>
  );
}

export function EditorToolbarSeparator() {
  return (
    <Divider
      orientation="vertical"
      flexShrink={0}
      UNSAFE_className={css({
        backgroundColor: tokenSchema.color.border.muted,
      })}
    />
  );
}

// =============================================================================
// Utils
// =============================================================================

function filterPropsWithLabelWarning<P extends AriaLabelingProps>(props: P) {
  let { 'aria-labelledby': ariaLabelledby, 'aria-label': ariaLabel } = props;

  if (!ariaLabelledby && !ariaLabel) {
    console.warn(
      'You must specify an aria-label or aria-labelledby attribute for accessibility.'
    );
  }

  return {
    ...onlyStyleProps(props),
    ...filterDOMProps(props, { labelable: true }),
  };
}

function useToolbarItem<P extends { isDisabled?: boolean }>(props: P) {
  let { isDisabled } = props;
  let { state } = useToolbarContext();
  let { lastFocusedId, setLastFocusedId } = state;
  let id = useId();
  let tabIndex = lastFocusedId === id || lastFocusedId == null ? 0 : -1;

  // clear the last focused ID when the item is unmounted or becomes disabled,
  // which will reset the tabIndex for each item to 0 avoiding a situation where
  // the user cannot tab to any items
  useEffect(() => {
    let reset = (lastId: Key | null) => (lastId === id ? null : lastId);
    if (isDisabled) {
      setLastFocusedId(reset);
    }
    return () => {
      setLastFocusedId(reset);
    };
  }, [id, isDisabled, setLastFocusedId]);

  return {
    itemProps: {
      tabIndex,
      onFocus: () => {
        setLastFocusedId(id);
      },
    },
  };
}

function useToolbar(props: EditorToolbarProps, ref: RefObject<HTMLElement>) {
  let [lastFocusedId, setLastFocusedId] = useState<Key | null>(null);
  let { direction } = useLocale();
  let focusManager = createFocusManager(ref, { wrap: true });
  let isRtl = direction === 'rtl';

  let onKeyDown = (e: KeyboardEvent) => {
    if (!e.currentTarget.contains(e.target as HTMLElement)) {
      return;
    }

    // let users navigate by group with alt/ctrl + arrow keys
    let accept = (node: Element) => {
      let isFirstChild = node.parentElement?.firstElementChild === node;
      let isGroupChild = /group/.test(node.parentElement?.role || '');

      return !isGroupChild || isFirstChild;
    };
    let options = (isMac() ? e.altKey : e.ctrlKey) ? { accept } : {};

    switch (e.key) {
      case 'Home':
        e.preventDefault();
        e.stopPropagation();
        focusManager.focusFirst();
        break;
      case 'End':
        e.preventDefault();
        e.stopPropagation();
        focusManager.focusLast();
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        e.stopPropagation();
        if (e.key === 'ArrowRight' && isRtl) {
          focusManager.focusPrevious(options);
        } else {
          focusManager.focusNext(options);
        }
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        e.stopPropagation();
        if (e.key === 'ArrowLeft' && isRtl) {
          focusManager.focusNext(options);
        } else {
          focusManager.focusPrevious(options);
        }
        break;
    }
  };

  return {
    toolbarProps: {
      ...filterPropsWithLabelWarning(props),
      onKeyDown,
      role: 'toolbar',
      'aria-orientation': 'horizontal' as const,
    },
    state: {
      lastFocusedId,
      setLastFocusedId,
    },
  };
}

function useSetFromIterable<T>(value?: Iterable<T> | null) {
  return useMemo(
    () => (value == null ? new Set<Key>() : new Set(value)),
    [value]
  );
}
