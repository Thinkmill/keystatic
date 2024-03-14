import { FocusScope, createFocusManager } from '@react-aria/focus';
import { useLocale } from '@react-aria/i18n';
import { PressProps, PressResponder } from '@react-aria/interactions';
import { filterDOMProps, isMac, mergeProps } from '@react-aria/utils';
import { AriaLabelingProps, DOMAttributes } from '@react-types/shared';
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
import { HStack } from '@keystar/ui/layout';
import {
  BaseStyleProps,
  css,
  onlyStyleProps,
  tokenSchema,
} from '@keystar/ui/style';

type EditorToolbarState = {
  /** The value of the last focused node. */
  readonly lastFocusedId: Key | null;
  /** Sets the last focused node. */
  setLastFocusedId: Dispatch<SetStateAction<Key | null>>;
};
type EditorToolbarContextType = EditorToolbarState;
const EditorToolbarContext = createContext<EditorToolbarContextType | null>(
  null
);
function useToolbarContext() {
  let context = useContext(EditorToolbarContext);
  if (context == null) {
    throw new Error('useToolbarContext must be used within a EditorToolbar');
  }
  return { state: context };
}

type EditorToolbarProps = PropsWithChildren<BaseStyleProps> & AriaLabelingProps;
export function EditorToolbar(props: EditorToolbarProps) {
  let { children } = props;
  let ref = useRef<HTMLDivElement>(null);
  let { state, toolbarProps } = useToolbar(props, ref);

  return (
    <EditorToolbarContext.Provider value={state}>
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
      value: Key | null;
      onChange: (value: Key) => void;
    }
  | {
      disabledKeys?: Iterable<Key>;
      selectionMode: 'multiple';
      value: Key[];
      onChange: (value: Key) => void;
    };
const GroupSelectionContext = createContext<GroupSelectionType | null>(null);
function useGroupSelectionContext() {
  let context = useContext(GroupSelectionContext);

  assert(
    context !== null,
    'An `EditorToolbarItem` is only valid inside an `EditorToolbarGroup` with a `selectionMode` of "single" or "multiple". When no selection is needed, use `EditorToolbarButton` instead.'
  );

  let disabledKeys = useSetFromIterable(context.disabledKeys);

  return { ...context, disabledKeys };
}
function useSelectionItem(props: EditorToolbarItemProps): {
  isDisabled: boolean;
  isSelected: boolean;
  buttonProps: PressProps & DOMAttributes;
} {
  let context = useGroupSelectionContext();

  if (context.selectionMode === 'single') {
    let { disabledKeys, value, onChange } = context;
    let isDisabled = disabledKeys.has(props.value);
    let isSelected = value === props.value;

    return {
      isDisabled,
      isSelected,
      buttonProps: {
        ...filterDOMProps(props, { labelable: true }),
        role: 'radio' as const,
        'aria-checked': isSelected,
        onPress: () => {
          if (isDisabled) {
            return;
          }
          onChange(props.value);
        },
      },
    };
  }
  if (context.selectionMode === 'multiple') {
    let { disabledKeys, value, onChange } = context;
    let isDisabled = disabledKeys.has(props.value);
    let isSelected = value.includes(props.value);

    return {
      isDisabled,
      isSelected,
      buttonProps: {
        ...filterDOMProps(props, { labelable: true }),
        role: 'checkbox' as const,
        'aria-checked': isSelected,
        onPress: () => {
          if (isDisabled) {
            return;
          }
          onChange(props.value);
        },
      },
    };
  }
  assertNever(context);
}

export type SelectionMode = 'none' | 'single' | 'multiple';
type ChangeHandler<T> = (value: T) => void;
type EditorToolbarGroupProps = AriaLabelingProps & {
  /** The contents of the group. */
  children?: ReactNode;
} & (
    | {
        selectionMode: 'multiple';
        disabledKeys?: Iterable<Key>;
        onChange: ChangeHandler<Key>;
        value: Key[];
      }
    | {
        selectionMode: 'single';
        disabledKeys?: Iterable<Key>;
        onChange: ChangeHandler<Key>;
        value: Key | null;
      }
    | {
        selectionMode?: 'none';
        disabledKeys?: never;
        onChange?: never;
        value?: never;
      }
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
  let { children, ...context } = props;

  return (
    <GroupSelectionContext.Provider value={context}>
      <HStack
        gap="xsmall"
        role="radiogroup"
        {...filterPropsWithLabelWarning(props)}
      >
        {children}
      </HStack>
    </GroupSelectionContext.Provider>
  );
}
/** @private MULTI selection */
function EditorMultipleSelectionGroup(
  props: EditorToolbarGroupProps & { selectionMode: 'multiple' }
) {
  let { children, ...context } = props;

  return (
    <GroupSelectionContext.Provider value={context}>
      <HStack gap="xsmall" role="group" {...filterPropsWithLabelWarning(props)}>
        {children}
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
} & AriaLabelingProps;

/** A toolbar item may be a checkbox/radio/toggle button, depending on context. */
export function EditorToolbarItem(props: EditorToolbarItemProps) {
  let { isDisabled, isSelected, buttonProps } = useSelectionItem(props);
  let { itemProps } = useToolbarItem({ ...props, isDisabled });

  // Use a PressResponder to send DOM props through, allow overriding things
  // like role and tabIndex.
  return (
    <PressResponder {...mergeProps(buttonProps, itemProps)}>
      <ActionButton
        prominence="low"
        isDisabled={isDisabled}
        isSelected={isSelected}
      >
        {props.children}
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
    <div
      role="separator"
      aria-orientation="vertical"
      className={css({
        alignSelf: 'center',
        backgroundColor: tokenSchema.color.border.muted,
        flexShrink: 0,
        height: tokenSchema.size.icon.regular,
        width: tokenSchema.size.border.regular,
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
    state: useMemo(
      () => ({
        lastFocusedId,
        setLastFocusedId,
      }),
      [lastFocusedId]
    ),
  };
}

function useSetFromIterable<T>(value?: Iterable<T> | null) {
  return useMemo(
    () => (value == null ? new Set<Key>() : new Set(value)),
    [value]
  );
}
