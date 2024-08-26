import { useActionGroup, useActionGroupItem } from '@react-aria/actiongroup';
import { FocusScope } from '@react-aria/focus';
import { PressResponder } from '@react-aria/interactions';
import {
  filterDOMProps,
  mergeProps,
  useId,
  useLayoutEffect,
  useObjectRef,
  useResizeObserver,
  useValueEffect,
} from '@react-aria/utils';
import { ListState, useListState } from '@react-stately/list';
import { AriaLabelingProps, DOMProps, Node } from '@react-types/shared';
import {
  ForwardedRef,
  Key,
  ReactElement,
  ReactNode,
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState,
  RefObject,
} from 'react';

import { ActionButton, actionButtonClassList } from '@keystar/ui/button';
import { KeystarProvider, useProviderProps } from '@keystar/ui/core';
import { chevronDownIcon } from '@keystar/ui/icon/icons/chevronDownIcon';
import { moreHorizontalIcon } from '@keystar/ui/icon/icons/moreHorizontalIcon';
import { Icon } from '@keystar/ui/icon';
import { Item, Menu, MenuTrigger } from '@keystar/ui/menu';
import { Kbd, Text } from '@keystar/ui/typography';
import { Tooltip, TooltipTrigger } from '@keystar/ui/tooltip';
import { ClearSlots, SlotProvider, useSlotProps } from '@keystar/ui/slots';
import {
  BaseStyleProps,
  classNames,
  css,
  toDataAttributes,
  tokenSchema,
  useStyleProps,
} from '@keystar/ui/style';
import { isReactText } from '@keystar/ui/utils';

import { ActionGroupProps } from './types';

function ActionGroup<T extends object>(
  props: ActionGroupProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  props = useProviderProps(props);
  props = useSlotProps(props, 'actionGroup');

  let {
    density,
    prominence,
    isJustified,
    isDisabled,
    orientation = 'horizontal',
    overflowMode = 'wrap',
    onAction,
    buttonLabelBehavior,
    summaryIcon,
    ...otherProps
  } = props;

  // High prominence buttons should be used sparingly and in isolation, so they
  // are not supported in groups.
  prominence = prominence === 'low' ? 'low' : 'default';

  let domRef = useObjectRef(forwardedRef);
  let wrapperRef = useRef<HTMLDivElement>(null);
  let state = useListState({ ...props, suppressTextValueWarning: true });
  let { actionGroupProps } = useActionGroup(props, state, domRef);
  let providerProps = { isDisabled };
  let styleProps = useStyleProps(props);

  // Only hide button text if every item contains more than just plain text (we assume an icon).
  let isIconCollapsible = useMemo(
    () =>
      [...state.collection].every(item => typeof item.rendered !== 'string'),
    [state.collection]
  );
  let [{ visibleItems, hideButtonText, isMeasuring }, setVisibleItems] =
    useValueEffect({
      visibleItems: state.collection.size,
      hideButtonText: buttonLabelBehavior === 'hide' && isIconCollapsible,
      isMeasuring: false,
    });

  let selectionMode = state.selectionManager.selectionMode;
  let updateOverflow = useCallback(() => {
    if (overflowMode === 'wrap') {
      return;
    }

    if (orientation === 'vertical' && selectionMode !== 'none') {
      // Collapsing vertical action groups with selection is currently unsupported.
      return;
    }

    let computeVisibleItems = (visibleItems: number) => {
      if (domRef.current && wrapperRef.current) {
        let listItems = Array.from(domRef.current.children) as HTMLLIElement[];
        let containerSize =
          orientation === 'horizontal'
            ? wrapperRef.current.getBoundingClientRect().width
            : wrapperRef.current.getBoundingClientRect().height;

        let isShowingMenu = visibleItems < state.collection.size;
        let calculatedSize = 0;
        let newVisibleItems = 0;

        if (isShowingMenu) {
          let item = listItems.pop();
          if (item) {
            calculatedSize +=
              orientation === 'horizontal'
                ? outerWidth(item, false, true)
                : outerHeight(item, false, true);
          }
        }

        for (let [i, item] of listItems.entries()) {
          calculatedSize +=
            orientation === 'horizontal'
              ? outerWidth(item, i === 0, i === listItems.length - 1)
              : outerHeight(item, i === 0, i === listItems.length - 1);
          if (Math.round(calculatedSize) <= Math.round(containerSize)) {
            newVisibleItems++;
          } else {
            break;
          }
        }

        // If selection is enabled, and not all of the items fit, collapse all of them into a dropdown
        // immediately rather than having some visible and some not.
        if (
          selectionMode !== 'none' &&
          newVisibleItems < state.collection.size
        ) {
          return 0;
        }

        return newVisibleItems;
      }
      return visibleItems;
    };

    setVisibleItems(function* () {
      let hideButtonText = buttonLabelBehavior === 'hide' && isIconCollapsible;

      // Update to show all items.
      yield {
        visibleItems: state.collection.size,
        hideButtonText,
        isMeasuring: true,
      };

      // Measure, and update to show the items that fit.
      let newVisibleItems = computeVisibleItems(state.collection.size);
      let isMeasuring =
        newVisibleItems < state.collection.size && newVisibleItems > 0;

      // If not all of the buttons fit, and buttonLabelBehavior is 'collapse', then first try hiding
      // the button text and only showing icons. Only if that still doesn't fit collapse into a menu.
      if (
        newVisibleItems < state.collection.size &&
        buttonLabelBehavior === 'collapse' &&
        isIconCollapsible
      ) {
        yield {
          visibleItems: state.collection.size,
          hideButtonText: true,
          isMeasuring: true,
        };

        newVisibleItems = computeVisibleItems(state.collection.size);
        isMeasuring =
          newVisibleItems < state.collection.size && newVisibleItems > 0;
        hideButtonText = true;
      }

      yield {
        visibleItems: newVisibleItems,
        hideButtonText,
        isMeasuring,
      };

      // If the number of items is less than the number of children,
      // then update again to ensure that the menu fits.
      if (isMeasuring) {
        yield {
          visibleItems: computeVisibleItems(newVisibleItems),
          hideButtonText,
          isMeasuring: false,
        };
      }
    });
  }, [
    domRef,
    state.collection,
    setVisibleItems,
    overflowMode,
    selectionMode,
    buttonLabelBehavior,
    isIconCollapsible,
    orientation,
  ]);

  // Watch the parent element for size changes. Watching only the action group itself may not work
  // in all scenarios because it may not shrink when available space is reduced.
  let parentRef = useMemo(
    () => ({
      get current() {
        return wrapperRef.current?.parentElement;
      },
    }),
    [wrapperRef]
  );
  useResizeObserver({
    ref: overflowMode !== 'wrap' ? parentRef : undefined,
    onResize: updateOverflow,
  });
  useLayoutEffect(updateOverflow, [updateOverflow, state.collection]);

  let children = [...state.collection];
  let menuItem: ReactElement | null = null;
  let menuProps = {};

  // If there are no visible items, don't apply any props to the action group container
  // and pass all aria labeling props through to the menu button.
  if (overflowMode === 'collapse' && visibleItems === 0) {
    menuProps = filterDOMProps(props, { labelable: true });
    actionGroupProps = {};
  }

  if (overflowMode === 'collapse' && visibleItems < state.collection.size) {
    let menuChildren = children.slice(visibleItems);
    children = children.slice(0, visibleItems);
    menuItem = (
      <ActionGroupMenu
        {...menuProps}
        items={menuChildren}
        prominence={prominence}
        onAction={onAction}
        isDisabled={isDisabled}
        state={state}
        summaryIcon={summaryIcon}
        hideButtonText={hideButtonText}
        isOnlyItem={visibleItems === 0}
        orientation={orientation}
      />
    );
  }

  let style = {
    ...styleProps.style,
    // While measuring, take up as much space as possible.
    flexBasis: isMeasuring ? '100%' : undefined,
  };

  return (
    <FocusScope>
      <div
        {...styleProps}
        style={style}
        className={classNames(
          css({ display: 'flex', minWidth: 0 }),
          styleProps.className
        )}
        ref={wrapperRef}
      >
        <div
          {...actionGroupProps}
          {...toDataAttributes({
            overflow: overflowMode,
            prominence,
            justified: (isJustified && !isMeasuring) || undefined,
            compact: density === 'compact' || undefined,
            vertical: orientation === 'vertical' || undefined,
          })}
          ref={domRef}
          className={classNames(
            css({
              display: 'flex',
              // NOTE: prefer `gap` but it breaks the measurement/collapse logic, so we use margin instead.
              margin: `calc(var(--action-item-gap) / -2)`,
              minWidth: 0,
              width: 'calc(100% + var(--action-item-gap) + 1px)',

              '--action-item-gap': tokenSchema.size.space.regular,

              [actionButtonClassList.selector('root', 'child')]: {
                margin: `calc(var(--action-item-gap) / 2)`,
              },

              // wrap
              '&[data-overflow=wrap]': {
                flexWrap: 'wrap',
              },

              // justified
              '&[data-justified]': {
                [actionButtonClassList.selector('root', 'child')]: {
                  flexGrow: 1,
                },
              },

              // compact
              '&[data-compact]:not([data-prominence=low])': {
                '--action-item-gap': 0,
                // gap: 0,

                [actionButtonClassList.selector('root', 'child')]: {
                  borderRadius: 0,

                  '&:first-of-type': {
                    borderTopLeftRadius: tokenSchema.size.radius.regular,
                    borderBottomLeftRadius: tokenSchema.size.radius.regular,
                  },
                  '&:last-of-type': {
                    borderTopRightRadius: tokenSchema.size.radius.regular,
                    borderBottomRightRadius: tokenSchema.size.radius.regular,
                  },

                  '&:not(:last-of-type)': {
                    marginRight: `calc(${tokenSchema.size.border.regular} * -1)`,
                  },
                  '&[data-interaction=hover], &[data-focus=visible], &[data-interaction=press]':
                    {
                      zIndex: 1,
                    },
                  '&[data-selected]': {
                    zIndex: 2,
                  },
                },
              },
              '&[data-compact][data-prominence=low]': {
                '--action-item-gap': tokenSchema.size.space.small,
              },
            }),
            otherProps.UNSAFE_className
          )}
        >
          <KeystarProvider {...providerProps}>
            {children.map(item => (
              <ActionGroupItem
                key={item.key}
                onAction={onAction}
                prominence={prominence}
                isDisabled={isDisabled}
                item={item}
                state={state}
                hideButtonText={hideButtonText}
                orientation={orientation}
              />
            ))}
            {menuItem}
          </KeystarProvider>
        </div>
      </div>
    </FocusScope>
  );
}

// forwardRef doesn't support generic parameters, so cast the result to the correct type
// https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref

/** Group related action buttons together. */
const _ActionGroup: <T>(
  props: ActionGroupProps<T> & { ref?: RefObject<HTMLDivElement> }
) => ReactElement = forwardRef(ActionGroup) as any;
export { _ActionGroup as ActionGroup };

interface ActionGroupItemProps<T> extends DOMProps, BaseStyleProps {
  item: Node<T>;
  state: ListState<T>;
  isDisabled?: boolean;
  hideButtonText?: boolean;
  orientation?: 'horizontal' | 'vertical';
  prominence?: 'low' | 'default';
  onAction?: (key: Key) => void;
}

function ActionGroupItem<T>({
  item,
  state,
  isDisabled,
  onAction,
  hideButtonText,
  orientation,
  prominence,
}: ActionGroupItemProps<T>) {
  let ref = useRef(null);
  let { buttonProps } = useActionGroupItem({ key: item.key }, state);
  isDisabled = isDisabled || state.disabledKeys.has(item.key);
  let isSelected = state.selectionManager.isSelected(item.key);
  let domProps = filterDOMProps(item.props);

  if (onAction && !isDisabled) {
    buttonProps = mergeProps(buttonProps, {
      onPress: () => onAction(item.key),
    });
  }

  // If button text is hidden, we need to show it as a tooltip instead, so
  // go find the text element in the DOM after rendering.
  let textId = useId();
  let kbdId = useId();
  let [textContent, setTextContent] = useState<string | null | undefined>('');
  let [kbdContent, setKbdContent] = useState<string | null | undefined>('');
  useLayoutEffect(() => {
    if (hideButtonText) {
      setTextContent(document.getElementById(textId)?.textContent);
      setKbdContent(document.getElementById(kbdId)?.textContent);
    }
  }, [hideButtonText, item.rendered, textId, kbdId]);

  let button = (
    // Use a PressResponder to send DOM props through.
    // Button doesn't allow overriding the role by default.
    <PressResponder {...mergeProps(buttonProps, domProps)}>
      <ClearSlots>
        <SlotProvider
          slots={{
            kbd: {
              id: hideButtonText ? kbdId : undefined,
              isHidden: true, // always hide kbd in buttons
            },
            text: {
              id: hideButtonText ? textId : undefined,
              isHidden: hideButtonText,
            },
          }}
        >
          <ActionButton
            {...item.props}
            prominence={prominence}
            ref={ref}
            UNSAFE_className={classNames(
              css({
                flexShrink: 0,
              })
            )}
            isSelected={isSelected}
            isDisabled={isDisabled}
            // data-contents={hideButtonText ? 'icon' : undefined}
            aria-label={item['aria-label']}
            aria-labelledby={
              item['aria-label'] == null && hideButtonText ? textId : undefined
            }
          >
            {item.rendered}
          </ActionButton>
        </SlotProvider>
      </ClearSlots>
    </PressResponder>
  );

  if (hideButtonText && textContent) {
    button = (
      <TooltipTrigger placement={orientation === 'vertical' ? 'end' : 'top'}>
        {button}
        <Tooltip>
          {kbdContent ? (
            <>
              <Text>{textContent}</Text>
              <Kbd>{kbdContent}</Kbd>
            </>
          ) : (
            textContent
          )}
        </Tooltip>
      </TooltipTrigger>
    );
  }

  if (item.wrapper) {
    button = item.wrapper(button);
  }

  return button;
}

interface ActionGroupMenuProps<T> extends AriaLabelingProps {
  hideButtonText?: boolean;
  isDisabled?: boolean;
  isOnlyItem?: boolean;
  items: Node<T>[];
  onAction?: (key: Key) => void;
  orientation?: 'horizontal' | 'vertical';
  prominence?: 'low' | 'default';
  state: ListState<T>;
  summaryIcon?: ReactNode;
}

function ActionGroupMenu<T>({
  hideButtonText,
  isDisabled,
  isOnlyItem,
  items,
  onAction,
  orientation,
  prominence,
  state,
  summaryIcon,
  ...otherProps
}: ActionGroupMenuProps<T>) {
  // Use the key of the first item within the menu as the key of the button.
  // The key must actually exist in the collection for focus to work correctly.
  let key = items[0].key;
  let { buttonProps } = useActionGroupItem({ key }, state);

  // The menu button shouldn't act like an actual action group item.
  delete buttonProps.onPress;
  delete buttonProps.role;
  delete buttonProps['aria-checked'];

  // If no aria-label or aria-labelledby is given, provide a default one.
  let ariaLabel =
    otherProps['aria-label'] ||
    (otherProps['aria-labelledby'] ? undefined : '…');
  let ariaLabelledby = otherProps['aria-labelledby'];
  let textId = useId();
  let id = useId();

  // Summary icon only applies when selection is enabled.
  if (state.selectionManager.selectionMode === 'none') {
    summaryIcon = null;
  }

  // If there is a selection, show the selected state on the menu button.
  let isSelected =
    state.selectionManager.selectionMode !== 'none' &&
    items.some(i => state.selectionManager.isSelected(i.key));

  // If single selection and empty selection is not allowed, swap the contents of the button to the selected item (like a Picker).
  if (
    !summaryIcon &&
    state.selectionManager.selectionMode === 'single' &&
    state.selectionManager.disallowEmptySelection &&
    state.selectionManager.firstSelectedKey != null
  ) {
    let selectedItem = state.collection.getItem(
      state.selectionManager.firstSelectedKey
    );
    if (selectedItem) {
      summaryIcon = selectedItem.rendered;
      if (isReactText(summaryIcon)) {
        summaryIcon = <Text>{summaryIcon}</Text>;
      }
      ariaLabelledby = `${ariaLabelledby ?? id} ${textId}`;
    }
  }

  if (summaryIcon) {
    // If there's a custom summary icon, also add a chevron.
    summaryIcon = (
      <>
        {summaryIcon}
        <Icon src={chevronDownIcon} />
      </>
    );
  }

  return (
    // Use a PressResponder to send DOM props through.
    <MenuTrigger
      align={isOnlyItem ? 'start' : 'end'}
      direction={orientation === 'vertical' ? 'end' : 'bottom'}
    >
      <SlotProvider
        slots={{
          text: {
            id: hideButtonText ? textId : undefined,
            isHidden: hideButtonText,
          },
        }}
      >
        <PressResponder {...buttonProps}>
          <ActionButton
            {...otherProps}
            id={id}
            prominence={prominence}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            isDisabled={isDisabled}
            isSelected={isSelected}
          >
            {summaryIcon || <Icon src={moreHorizontalIcon} />}
          </ActionButton>
        </PressResponder>
      </SlotProvider>
      <Menu
        items={items}
        disabledKeys={state.disabledKeys}
        selectionMode={state.selectionManager.selectionMode}
        selectedKeys={state.selectionManager.selectedKeys}
        disallowEmptySelection={state.selectionManager.disallowEmptySelection}
        onSelectionChange={keys => state.selectionManager.setSelectedKeys(keys)}
        onAction={onAction}
      >
        {node => (
          <Item {...node.props} textValue={node.textValue}>
            {node.rendered}
          </Item>
        )}
      </Menu>
    </MenuTrigger>
  );
}

function outerWidth(
  element: HTMLElement,
  ignoreLeftMargin: boolean,
  ignoreRightMargin: boolean
) {
  let style = window.getComputedStyle(element);
  return (
    element.offsetWidth +
    (ignoreLeftMargin ? 0 : toNumber(style.marginLeft)) +
    (ignoreRightMargin ? 0 : toNumber(style.marginRight))
  );
}

function outerHeight(
  element: HTMLElement,
  ignoreTopMargin: boolean,
  ignoreBottomMargin: boolean
) {
  let style = window.getComputedStyle(element);
  return (
    element.offsetHeight +
    (ignoreTopMargin ? 0 : toNumber(style.marginTop)) +
    (ignoreBottomMargin ? 0 : toNumber(style.marginBottom))
  );
}

function toNumber(value: string) {
  let parsed = parseInt(value, 10);
  return isNaN(parsed) ? 0 : parsed;
}
