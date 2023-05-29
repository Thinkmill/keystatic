import { FocusScope, createFocusManager } from '@react-aria/focus';
import { useLocale } from '@react-aria/i18n';
import { PressProps, PressResponder } from '@react-aria/interactions';
import { mergeProps } from '@react-aria/utils';
import { useControlledState } from '@react-stately/utils';
import {
  AriaLabelingProps,
  DOMAttributes,
  FocusableElement,
  ValueBase,
} from '@react-types/shared';
import { assert, assertNever } from 'emery';

import {
  ActionButton,
  ToggleButton,
  ToggleButtonProps,
} from '@voussoir/button';
import { Divider, Flex } from '@voussoir/layout';
import { filterDOMProps } from '@voussoir/utils';
import {
  FocusEvent,
  Key,
  KeyboardEvent,
  PropsWithChildren,
  ReactNode,
  RefObject,
  createContext,
  useContext,
  useRef,
  useState,
} from 'react';

interface EditorToolbarState {
  /** The value of the last focused node. */
  readonly lastFocusedNode: FocusableElement | null;
  /** Sets the last focused node. */
  setLastFocusedNode(value: FocusableElement | null): void;
}
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

type EditorToolbarProps = PropsWithChildren<{}> & AriaLabelingProps;
export function EditorToolbar(props: EditorToolbarProps) {
  let { children } = props;
  let ref = useRef<HTMLDivElement>(null);
  let { state, toolbarProps } = useToolbar(props, ref);

  return (
    <EditorToolbarContext.Provider value={{ state }}>
      <FocusScope>
        <Flex gap="regular" ref={ref} {...toolbarProps}>
          {children}
        </Flex>
      </FocusScope>
    </EditorToolbarContext.Provider>
  );
}

// Group

type GroupSelectionType =
  | {
      selectionMode: 'single';
      selectedValue: Key | null;
      setSelectedValue: (value: Key | null) => void;
    }
  | {
      selectionMode: 'multiple';
      selectedValue: Key[];
      setSelectedValue: (value: Key[]) => void;
    };
const GroupSelectionContext = createContext<GroupSelectionType | null>(null);
function useGroupSelectionContext() {
  let context = useContext(GroupSelectionContext);
  if (context == null) {
    throw new Error('useGroupSelectionContext must be used within a group');
  }
  return context;
}
function useSelectionItem(value: Key): {
  isSelected: boolean;
  buttonProps: PressProps & DOMAttributes;
} {
  let context = useGroupSelectionContext();

  if (context.selectionMode === 'single') {
    let { selectedValue, setSelectedValue } = context;
    let isSelected = selectedValue === value;
    return {
      isSelected,
      buttonProps: {
        'aria-checked': isSelected,
        onPress: () => {
          if (isSelected) {
            setSelectedValue(null);
          } else {
            setSelectedValue(value);
          }
        },
        role: 'radio' as const,
      },
    };
  }
  if (context.selectionMode === 'multiple') {
    let { selectedValue, setSelectedValue } = context;
    let isSelected = selectedValue.includes(value);
    return {
      isSelected,
      buttonProps: {
        'aria-pressed': isSelected,
        onPress: () => {
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

  // @ts-expect-error
  assertNever(context.selectionMode);
}

export type SelectionMode = 'none' | 'single' | 'multiple';
type EditorToolbarGroupProps = AriaLabelingProps & {
  /** The contents of the group. */
  children?: ReactNode;
} & (
    | ({ selectionMode: 'multiple' } & ValueBase<Key[]>)
    | ({ selectionMode: 'single' } & ValueBase<Key | null>)
  );
export function EditorToolbarGroup(props: EditorToolbarGroupProps) {
  let { selectionMode = 'none' } = props;

  if (selectionMode === 'single') {
    return <EditorSingleSelectionGroup {...props} />;
  }
  if (selectionMode === 'multiple') {
    return <EditorMultipleSelectionGroup {...props} />;
  }

  return (
    <Flex gap="xsmall" role="group" {...filterDOMPropsWithLabelWarning(props)}>
      {props.children}
    </Flex>
  );
}
/** @private SINGLE selection */
function EditorSingleSelectionGroup(props: EditorToolbarGroupProps) {
  assert(props.selectionMode === 'single');

  let [selectedValue, setSelectedValue] = useControlledState<Key | null>(
    props.value!,
    props.defaultValue!,
    props.onChange!
  );

  let context = {
    selectionMode: props.selectionMode,
    selectedValue,
    setSelectedValue,
  };

  return (
    <GroupSelectionContext.Provider value={context}>
      <Flex
        gap="xsmall"
        role="radiogroup"
        {...filterDOMPropsWithLabelWarning(props)}
      >
        {props.children}
      </Flex>
    </GroupSelectionContext.Provider>
  );
}
/** @private MULTI selection */
function EditorMultipleSelectionGroup(props: EditorToolbarGroupProps) {
  assert(props.selectionMode === 'multiple');

  let [selectedValue, setSelectedValue] = useControlledState(
    props.value!,
    props.defaultValue || [],
    props.onChange!
  );

  let context = {
    selectionMode: props.selectionMode,
    selectedValue,
    setSelectedValue,
  };

  return (
    <GroupSelectionContext.Provider value={context}>
      <Flex
        gap="xsmall"
        role="group"
        {...filterDOMPropsWithLabelWarning(props)}
      >
        {props.children}
      </Flex>
    </GroupSelectionContext.Provider>
  );
}

type EditorToolbarItemProps = {
  /** The value of the item. */
  value: Key;
  /** Whether the item is disabled. */
  isDisabled?: boolean;
  /** The contents of the item. */
  children?: ReactNode;
};

/** A toolbar item may be a checkbox/radio/toggle button, depending on context. */
export function EditorToolbarItem(props: EditorToolbarItemProps) {
  let { children, value, ...otherProps } = props;
  let ref = useRef<HTMLButtonElement>(null);
  let { itemProps } = useToolbarItem(ref);
  let { isSelected, buttonProps } = useSelectionItem(value);

  return (
    // Use a PressResponder to send DOM props through.
    // Button doesn't allow overriding the role by default.
    <PressResponder {...mergeProps(buttonProps, itemProps, otherProps)}>
      <ActionButton ref={ref} prominence="low" isSelected={isSelected}>
        {children}
      </ActionButton>
    </PressResponder>
  );
}

type EditorToolbarButtonProps = Omit<ToggleButtonProps, 'prominence'>;
export function EditorToolbarButton(props: EditorToolbarButtonProps) {
  let ref = useRef<HTMLButtonElement>(null);
  let { itemProps } = useToolbarItem(ref);

  return (
    <ToggleButton
      ref={ref}
      prominence="low"
      {...mergeProps(props, itemProps)}
    />
  );
}

export function EditorToolbarSeparator() {
  return <Divider orientation="vertical" flexShrink={0} />;
}

// Utils
// ------------------------------

function filterDOMPropsWithLabelWarning<P extends AriaLabelingProps>(props: P) {
  let { 'aria-labelledby': ariaLabelledby, 'aria-label': ariaLabel } = props;

  if (!ariaLabelledby && !ariaLabel) {
    console.warn(
      'You must specify an aria-label or aria-labelledby attribute for accessibility.'
    );
  }

  return filterDOMProps(props, { labellable: true });
}

function useToolbarItem(ref: RefObject<HTMLElement>) {
  let { state } = useToolbarContext();
  let tabIndex =
    state.lastFocusedNode === ref.current || state.lastFocusedNode == null
      ? 0
      : -1;

  return {
    itemProps: {
      tabIndex,
      onFocus: (e: FocusEvent) => {
        state.setLastFocusedNode(e.target as FocusableElement);
      },
    },
  };
}

function useToolbar(props: EditorToolbarProps, ref: RefObject<HTMLElement>) {
  let [lastFocusedNode, setLastFocusedNode] = useState<FocusableElement | null>(
    null
  );
  let { direction } = useLocale();
  let focusManager = createFocusManager(ref, { wrap: true });
  let isRtl = direction === 'rtl';

  let onKeyDown = (e: KeyboardEvent) => {
    if (!e.currentTarget.contains(e.target as HTMLElement)) {
      return;
    }

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
          focusManager.focusPrevious();
        } else {
          focusManager.focusNext();
        }
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        e.stopPropagation();
        if (e.key === 'ArrowLeft' && isRtl) {
          focusManager.focusNext({ wrap: true });
        } else {
          focusManager.focusPrevious({ wrap: true });
        }
        break;
    }
  };

  return {
    toolbarProps: {
      ...filterDOMPropsWithLabelWarning(props),
      onKeyDown,
      role: 'toolbar',
      'aria-orientation': 'horizontal' as const,
    },
    state: {
      lastFocusedNode,
      setLastFocusedNode,
    },
  };
}
