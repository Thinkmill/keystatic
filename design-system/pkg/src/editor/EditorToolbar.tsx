import { Toolbar, type ToolbarProps } from 'react-aria-components/Toolbar';
import {
  ToggleButtonGroup,
  type ToggleButtonGroupProps,
} from 'react-aria-components/ToggleButtonGroup';
import { Separator } from 'react-aria-components/Separator';
import type { Key } from '@react-types/shared';
import { type ReactNode, createContext, useContext } from 'react';

import { ToggleButton, type ToggleButtonProps } from '@keystar/ui/button';
import {
  type BaseStyleProps,
  classNames,
  css,
  filterStyleProps,
  tokenSchema,
  useStyleProps,
} from '@keystar/ui/style';

type EditorToolbarProps = Omit<
  ToolbarProps,
  'children' | 'className' | 'style'
> &
  BaseStyleProps & {
    children: ReactNode;
  };

/** A formatting toolbar with RAC roving focus and keyboard navigation. */
export function EditorToolbar(props: EditorToolbarProps) {
  let { children } = props;
  let styleProps = useStyleProps(props);

  return (
    <Toolbar
      {...(filterStyleProps(props) as ToolbarProps)}
      className={classNames(
        css({
          alignItems: 'center',
          display: 'flex',
          gap: tokenSchema.size.space.regular,
        }),
        styleProps.className
      )}
      style={styleProps.style}
    >
      {children}
    </Toolbar>
  );
}

type GroupSelectionProps = {
  disabledKeys?: Iterable<Key>;
  selectionMode: 'single' | 'multiple';
};
const GroupSelectionContext = createContext<GroupSelectionProps | null>(null);

export type SelectionMode = 'none' | 'single' | 'multiple';
type EditorToolbarGroupProps = {
  children?: ReactNode;
  'aria-label'?: string;
  'aria-labelledby'?: string;
} & (
  | {
      selectionMode: 'multiple';
      disabledKeys?: Iterable<Key>;
      onChange: (value: Key) => void;
      value: Key[];
    }
  | {
      selectionMode: 'single';
      disabledKeys?: Iterable<Key>;
      onChange: (value: Key) => void;
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
  let className = css({
    alignItems: 'center',
    display: 'flex',
    gap: tokenSchema.size.space.xsmall,
  });

  if (!props.selectionMode || props.selectionMode === 'none') {
    return (
      <div
        role="group"
        aria-label={props['aria-label']}
        aria-labelledby={props['aria-labelledby']}
        className={className}
      >
        {props.children}
      </div>
    );
  }

  let selectedValues: Key[] =
    props.selectionMode === 'single'
      ? props.value == null
        ? []
        : [props.value]
      : props.value || [];
  let selectedKeys = selectedValues.map(toItemId);
  let onChange = props.onChange!;
  let onSelectionChange: ToggleButtonGroupProps['onSelectionChange'] = keys => {
    let previousKeys = new Set(selectedKeys);
    let nextKeys = new Set([...keys].map(String));
    let changedKey = [...nextKeys].find(key => !previousKeys.has(key));
    changedKey ??= [...previousKeys].find(key => !nextKeys.has(key));
    if (changedKey != null) onChange(fromItemId(String(changedKey)));
  };

  return (
    <GroupSelectionContext.Provider
      value={{
        disabledKeys: props.disabledKeys,
        selectionMode: props.selectionMode,
      }}
    >
      <ToggleButtonGroup
        aria-label={props['aria-label']}
        aria-labelledby={props['aria-labelledby']}
        selectionMode={props.selectionMode}
        selectedKeys={selectedKeys}
        onSelectionChange={onSelectionChange}
        className={className}
      >
        {props.children}
      </ToggleButtonGroup>
    </GroupSelectionContext.Provider>
  );
}

type EditorToolbarItemProps = {
  children?: ReactNode;
  value: Key;
  'aria-label'?: string;
  'aria-labelledby'?: string;
};

/** A toggle item whose selection is managed by its RAC toggle group. */
export function EditorToolbarItem(props: EditorToolbarItemProps) {
  let context = useContext(GroupSelectionContext);
  if (!context) {
    throw new Error(
      'EditorToolbarItem must be inside a single or multiple EditorToolbarGroup.'
    );
  }
  let isDisabled = new Set(
    context.disabledKeys ? [...context.disabledKeys].map(toItemId) : []
  ).has(toItemId(props.value));

  return (
    <ToggleButton
      id={toItemId(props.value)}
      prominence="low"
      isDisabled={isDisabled}
      aria-label={props['aria-label']}
      aria-labelledby={props['aria-labelledby']}
    >
      {props.children}
    </ToggleButton>
  );
}

function toItemId(key: Key) {
  return `${typeof key}:${key}`;
}

function fromItemId(id: string): Key {
  let [type, ...value] = id.split(':');
  let key = value.join(':');
  return type === 'number' ? Number(key) : key;
}

type EditorToolbarButtonProps = Omit<ToggleButtonProps, 'prominence'>;
export function EditorToolbarButton(props: EditorToolbarButtonProps) {
  return <ToggleButton prominence="low" {...props} />;
}

export function EditorToolbarSeparator() {
  return (
    <Separator
      orientation="vertical"
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
