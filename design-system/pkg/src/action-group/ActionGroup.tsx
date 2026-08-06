import {
  Children,
  createContext,
  type ForwardedRef,
  type ReactElement,
  forwardRef,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { Key } from '@react-types/shared';
import { Toolbar } from 'react-aria-components/Toolbar';

import {
  ActionButton,
  actionButtonClassList,
  ToggleButton,
} from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { moreHorizontalIcon } from '@keystar/ui/icon/icons/moreHorizontalIcon';
import { Menu, MenuItem, MenuTrigger } from '@keystar/ui/menu';
import {
  classNames,
  css,
  toDataAttributes,
  tokenSchema,
  useStyleProps,
} from '@keystar/ui/style';
import { Tooltip, TooltipTrigger } from '@keystar/ui/tooltip';

import type { ActionGroupItemProps, ActionGroupProps } from './types';

const ActionGroupContext = createContext<{
  isDisabled: boolean;
  disabledKeys: Set<Key>;
  onAction?: (key: Key) => void;
  hideButtonText: boolean;
  prominence: 'low' | 'default';
  selectionMode: 'none' | 'single' | 'multiple';
  selectedKeys: Set<Key>;
  toggle(key: Key): void;
} | null>(null);

function ActionGroup<T extends object>(
  props: ActionGroupProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let {
    children,
    items,
    density,
    isJustified,
    isDisabled = false,
    disabledKeys: disabledKeysProp,
    orientation = 'horizontal',
    overflowMode = 'wrap',
    buttonLabelBehavior = 'show',
    onAction,
    prominence = 'default',
    selectionMode = 'none',
    selectedKeys: controlledSelectedKeys,
    defaultSelectedKeys,
    disallowEmptySelection = false,
    onSelectionChange,
    summaryIcon,
    role = selectionMode === 'none' ? 'toolbar' : 'group',
  } = props;
  let styleProps = useStyleProps(props);
  if (
    overflowMode === 'collapse' &&
    (!items || typeof children !== 'function')
  ) {
    throw new Error(
      'ActionGroup requires items and a render function when overflowMode is "collapse".'
    );
  }
  let elements = useMemo(
    () => materializeItems(items, children),
    [children, items]
  );
  let [uncontrolledKeys, setUncontrolledKeys] = useState(
    () => new Set(defaultSelectedKeys)
  );
  let selectedKeys = controlledSelectedKeys
    ? new Set(controlledSelectedKeys)
    : uncontrolledKeys;
  let disabledKeys = new Set(disabledKeysProp);
  let [visibleCount, setVisibleCount] = useState(elements.length);
  let groupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let element = groupRef.current;
    if (!element || overflowMode !== 'collapse') {
      setVisibleCount(elements.length);
      return;
    }

    let update = () => {
      let available = element.getBoundingClientRect().width;
      let children = Array.from(element.children) as HTMLElement[];
      let overflowButtonWidth = 40;
      let used = 0;
      let count = 0;
      for (let child of children.slice(0, elements.length)) {
        let width = child.getBoundingClientRect().width;
        if (used + width + overflowButtonWidth > available) break;
        used += width;
        count++;
      }
      if (selectionMode !== 'none' && count < elements.length) count = 0;
      setVisibleCount(count < elements.length ? count : elements.length);
    };

    let observer = new ResizeObserver(update);
    observer.observe(element);
    update();
    return () => observer.disconnect();
  }, [elements.length, overflowMode, selectionMode]);

  let toggle = (key: Key) => {
    if (selectionMode === 'none') {
      onAction?.(key);
      return;
    }
    let next = new Set(selectedKeys);
    if (selectionMode === 'single') {
      next =
        next.has(key) && !disallowEmptySelection ? new Set() : new Set([key]);
    } else if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    if (!controlledSelectedKeys) setUncontrolledKeys(next);
    onSelectionChange?.(next);
    onAction?.(key);
  };

  let visibleItems = elements.slice(0, visibleCount);
  let overflowItems = elements.slice(visibleCount);
  let groupContents = (
    <>
      {visibleItems}
      {overflowItems.length > 0 && (
        <MenuTrigger>
          <ActionButton aria-label="More actions" prominence={prominence}>
            {summaryIcon ?? <Icon src={moreHorizontalIcon} />}
          </ActionButton>
          <Menu onAction={key => toggle(key)}>
            {overflowItems.map(item => (
              <MenuItem
                id={item.props.id}
                key={item.props.id}
                isDisabled={isDisabled || item.props.isDisabled}
                textValue={item.props.textValue}
                href={item.props.href}
                target={item.props.target}
                rel={item.props.rel}
              >
                {item.props.children}
              </MenuItem>
            ))}
          </Menu>
        </MenuTrigger>
      )}
    </>
  );
  let groupProps = {
    ref: groupRef,
    'aria-label': props['aria-label'],
    'aria-labelledby': props['aria-labelledby'],
    ...toDataAttributes({
      compact: density === 'compact' || undefined,
      justified: isJustified || undefined,
      orientation,
      overflow: overflowMode,
    }),
    className: css({
      display: 'flex',
      flexDirection: orientation === 'vertical' ? 'column' : 'row',
      flexWrap: overflowMode === 'wrap' ? 'wrap' : 'nowrap',
      gap: tokenSchema.size.space.regular,
      minWidth: 0,
      '&[data-justified] > *': { flexGrow: 1 },
    }),
  } as const;
  return (
    <ActionGroupContext.Provider
      value={{
        disabledKeys,
        isDisabled,
        onAction,
        hideButtonText: buttonLabelBehavior === 'hide',
        prominence,
        selectedKeys,
        selectionMode,
        toggle,
      }}
    >
      <div
        {...styleProps}
        ref={forwardedRef}
        className={classNames(
          css({ display: 'flex', minWidth: 0 }),
          styleProps.className
        )}
      >
        {role === 'toolbar' ? (
          <Toolbar {...groupProps} orientation={orientation}>
            {groupContents}
          </Toolbar>
        ) : (
          <div {...groupProps} role="group">
            {groupContents}
          </div>
        )}
      </div>
    </ActionGroupContext.Provider>
  );
}

const _ActionGroup = forwardRef(ActionGroup) as <T extends object>(
  props: ActionGroupProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReactElement;
export { _ActionGroup as ActionGroup };

export function ActionGroupItem(props: ActionGroupItemProps) {
  let context = useContext(ActionGroupContext);
  if (!context) return null;
  let isDisabled =
    context.isDisabled ||
    context.disabledKeys.has(props.id) ||
    props.isDisabled;
  let isSelected = context.selectedKeys.has(props.id);
  let sharedProps = {
    'aria-label': context.hideButtonText ? props.textValue : undefined,
    isDisabled,
    prominence: context.prominence,
    UNSAFE_className: context.hideButtonText
      ? css({
          [actionButtonClassList.selector('text', 'descendant')]: {
            display: 'none',
          },
        })
      : undefined,
  } as const;
  let button =
    context.selectionMode === 'none' ? (
      <ActionButton
        {...sharedProps}
        href={props.href}
        target={props.target}
        rel={props.rel}
        onPress={() => context.toggle(props.id)}
      >
        {props.children}
      </ActionButton>
    ) : (
      <ToggleButton
        {...sharedProps}
        isSelected={isSelected}
        onChange={() => context.toggle(props.id)}
      >
        {props.children}
      </ToggleButton>
    );
  return context.hideButtonText && props.textValue ? (
    <TooltipTrigger>
      {button}
      <Tooltip>{props.textValue}</Tooltip>
    </TooltipTrigger>
  ) : (
    button
  );
}

function materializeItems<T extends object>(
  items: Iterable<T> | undefined,
  children: ActionGroupProps<T>['children']
): ReactElement<ActionGroupItemProps>[] {
  if (items && typeof children === 'function') {
    return Array.from(items, item => children(item)).filter(
      (child): child is ReactElement<ActionGroupItemProps> => child !== null
    );
  }
  if (typeof children === 'function') return [];
  return Children.toArray(children).filter(
    (child): child is ReactElement<ActionGroupItemProps> =>
      isValidElement(child)
  );
}
