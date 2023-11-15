import { useHover, usePress } from '@react-aria/interactions';
import { useLocale } from '@react-aria/i18n';
import { useTab, useTabList, useTabPanel } from '@react-aria/tabs';
import {
  filterDOMProps,
  mergeProps,
  useId,
  useLayoutEffect,
  useObjectRef,
  useResizeObserver,
} from '@react-aria/utils';
import { ListCollection } from '@react-stately/list';
import { useCollection } from '@react-stately/collections';
import { TabListState, useTabListState } from '@react-stately/tabs';
import { DOMProps, Node, Orientation } from '@react-types/shared';
import React, {
  CSSProperties,
  ForwardedRef,
  Key,
  ReactElement,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useProvider, useProviderProps } from '@keystar/ui/core';
import { Item, Picker, PickerProps } from '@keystar/ui/picker';
import { SlotProvider } from '@keystar/ui/slots';
import {
  ClassList,
  FocusRing,
  classNames,
  css,
  toDataAttributes,
  tokenSchema,
  transition,
  useStyleProps,
} from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';

import {
  TabsProps,
  TabListProps,
  TabPanelsProps,
  TabProminence,
} from './types';
import { TabContext, useTabContext } from './context';

export const tabsClassList = new ClassList('Tabs', [
  'collapseWrapper',
  'indicator',
  'list',
  'panel',
  'picker',
  'tab',
  'tab-icon',
  'tab-label',
]);

function Tabs<T extends object>(
  props: TabsProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  props = useProviderProps(props);
  let {
    orientation = 'horizontal' as Orientation,
    prominence = 'default',
    children,
    ...otherProps
  } = props;

  let domRef = useObjectRef(forwardedRef);
  let tablistRef = useRef<HTMLDivElement>(null);
  let wrapperRef = useRef<HTMLDivElement>(null);

  let { direction } = useLocale();
  let styleProps = useStyleProps(otherProps);
  let [collapsed, setCollapsed] = useState(false);
  let [selectedTab, setSelectedTab] = useState<HTMLElement>();
  const [tabListState, setTabListState] = useState<TabListState<T> | null>(
    null
  );

  useEffect(() => {
    if (tablistRef.current) {
      let selectedTab: HTMLElement | null = tablistRef.current.querySelector(
        `[data-key="${tabListState?.selectedKey}"]`
      );

      if (selectedTab != null) {
        setSelectedTab(selectedTab);
      }
    }
    // collapse is in the dep array so selectedTab can be updated for  dicator positioning
  }, [children, tabListState?.selectedKey, collapsed, tablistRef]);

  let checkShouldCollapse = useCallback(() => {
    let wrapperEl = wrapperRef.current;
    let tablistEl = tablistRef.current;
    if (wrapperEl && tablistEl && orientation !== 'vertical') {
      let tabs = tablistEl.querySelectorAll('[role="tab"]');
      let lastTab = tabs[tabs.length - 1];

      const end = direction === 'rtl' ? 'left' : 'right';
      let farEdgeTabList = wrapperEl.getBoundingClientRect()[end];
      let farEdgeLastTab = lastTab?.getBoundingClientRect()[end];
      let shouldCollapse =
        direction === 'rtl'
          ? farEdgeLastTab < farEdgeTabList
          : farEdgeTabList < farEdgeLastTab;
      setCollapsed(shouldCollapse);
    }
  }, [tablistRef, wrapperRef, direction, orientation, setCollapsed]);

  useEffect(() => {
    checkShouldCollapse();
  }, [children, checkShouldCollapse]);

  useResizeObserver({ ref: wrapperRef, onResize: checkShouldCollapse });

  let tabPanelProps: Record<string, string | undefined> = {
    'aria-labelledby': undefined,
  };

  // When the tabs are collapsed, the tabPanel should be labelled by the Picker button element.
  let collapsibleTabListId = useId();
  if (collapsed && orientation !== 'vertical') {
    tabPanelProps['aria-labelledby'] = collapsibleTabListId;
  }

  return (
    <TabContext.Provider
      value={{
        tabProps: { ...props, orientation, prominence },
        tabState: { tabListState, setTabListState, selectedTab, collapsed },
        refs: { tablistRef, wrapperRef },
        tabPanelProps,
      }}
    >
      <div
        {...filterDOMProps(otherProps)}
        {...toDataAttributes({ orientation })}
        {...styleProps}
        ref={domRef}
        className={classNames(
          css({
            display: 'flex',
            /*
            Allow collapse with wrapping block/flex containers out of the box.
            If consumers want to place element next to tabpanel, they must
            include flex: 1 1 auto and min-width: 0 on the Tabs component.
            */
            width: '100%',

            '&[data-orientation="vertical"]': {
              flexDirection: 'row',
            },
            '&[data-orientation="horizontal"]': {
              flexDirection: 'column',
            },
          }),
          tabsClassList.element('root'),
          styleProps.className
        )}
      >
        {props.children}
      </div>
    </TabContext.Provider>
  );
}

interface TabProps<T> extends DOMProps {
  item: Node<T>;
  state: TabListState<T>;
  isDisabled?: boolean;
  orientation?: Orientation;
}

// @private
function Tab<T>(props: TabProps<T>) {
  let { item, state, ...otherProps } = props;
  let { key, rendered } = item;

  let tabContext = useTabContext<T>();
  let ref = useRef<any>(null); // HTMLAnchorElement | HTMLDivElement
  let { tabProps, isDisabled } = useTab({ key }, state, ref);

  let { pressProps, isPressed } = usePress({ ...otherProps, isDisabled });
  let { hoverProps, isHovered } = useHover({ ...otherProps, isDisabled });

  let ElementType: React.ElementType = item.props.href ? 'a' : 'div';

  return (
    <FocusRing>
      <ElementType
        {...mergeProps(tabProps, hoverProps, pressProps)}
        {...toDataAttributes({
          interaction: isPressed ? 'press' : isHovered ? 'hover' : undefined,
          orientation: tabContext.tabProps.orientation,
          prominence: tabContext.tabProps.prominence,
        })}
        ref={ref}
        className={classNames(
          css({
            display: 'flex',
            alignItems: 'center',
            gap: tokenSchema.size.space.small,

            color: tokenSchema.color.foreground.neutralSecondary,
            cursor: 'pointer',
            outline: 'none',
            position: 'relative', // Contain the focus ring
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            zIndex: '1', // Float above the tab line

            // interaction indicator
            '&::before': {
              content: '" "',
              // opacity: 0,
              position: 'absolute',
              // transition: transition('opacity'),
              zIndex: -1, // behind the tab content
            },
            '&[data-prominence=default]::before': {
              borderRadius: tokenSchema.size.radius.regular,
            },
            '&[data-prominence=low]::before': {
              borderRadius: tokenSchema.size.radius.small,
            },

            // modifiers
            '&[data-prominence=default]': {
              fontWeight: tokenSchema.typography.fontWeight.medium,
              fontSize: tokenSchema.typography.text.regular.size,
            },
            '&[data-prominence=low]': {
              fontSize: tokenSchema.typography.text.regular.size,
            },

            // orientation
            '&[orientation=horizontal]': {
              // modifiers
              '&[data-prominence=default]': {
                fontWeight: tokenSchema.typography.fontWeight.medium,
                fontSize: tokenSchema.typography.text.regular.size,
                height: tokenSchema.size.element.medium,
                paddingBottom: tokenSchema.size.space.regular,

                '&::before': {
                  insetBlockEnd: tokenSchema.size.space.regular,
                  insetBlockStart: 0,
                  insetInline: `calc(${tokenSchema.size.space.medium} * -1)`,
                },
              },
              '&[data-prominence=low]': {
                fontSize: tokenSchema.typography.text.regular.size,
                height: tokenSchema.size.element.regular,
                paddingBottom: tokenSchema.size.space.small,

                '&::before': {
                  insetBlockEnd: tokenSchema.size.space.small,
                  insetBlockStart: 0,
                  insetInline: `calc(${tokenSchema.size.space.regular} * -1)`,
                },
              },
            },
            '&[orientation=vertical]': {
              paddingInline: tokenSchema.size.space.large,

              '&[data-prominence=default]': {
                height: tokenSchema.size.element.large,

                '&::before': {
                  insetBlock: tokenSchema.size.space.regular,
                  insetInlineEnd: tokenSchema.size.space.regular,
                  insetInlineStart: 0,
                },
              },
              '&[data-prominence=low]': {
                height: tokenSchema.size.element.regular,

                '&::before': {
                  insetBlock: tokenSchema.size.space.xsmall,
                  insetInlineEnd: tokenSchema.size.space.regular,
                  insetInlineStart: 0,
                },
              },
            },

            // interaction

            '&:where([data-interaction=hover], [data-focus=visible])': {
              color: tokenSchema.color.foreground.neutral,

              '&::before': {
                backgroundColor: tokenSchema.color.alias.backgroundHovered,
              },
            },
            '&[data-interaction=press]::before': {
              backgroundColor: tokenSchema.color.alias.backgroundPressed,
            },

            // state
            '&[aria-selected=true]': {
              color: tokenSchema.color.foreground.neutralEmphasis,
            },
            '&[aria-disabled=true]': {
              color: tokenSchema.color.alias.foregroundDisabled,
              cursor: 'default',
            },
          }),
          tabsClassList.element('tab')
        )}
      >
        <SlotProvider
          slots={{
            icon: {
              UNSAFE_className: tabsClassList.element('tab-icon'),
            },
            text: {
              UNSAFE_className: classNames(
                css({
                  color: 'inherit',
                  fontSize: 'inherit',
                  fontWeight: 'inherit',
                }),
                tabsClassList.element('tab-label')
              ),
            },
          }}
        >
          {isReactText(rendered) ? <Text>{rendered}</Text> : rendered}
        </SlotProvider>
      </ElementType>
    </FocusRing>
  );
}

interface SelectionIndicatorProps {
  orientation?: Orientation;
  prominence?: TabProminence;
  selectedTab?: HTMLElement;
  selectedKey?: Key;
}

// @private
function SelectionIndicator(props: SelectionIndicatorProps) {
  let {
    orientation,
    // Is either the tab node (non-collapsed) or the picker node (collapsed)
    selectedTab,
    // selectedKey is provided so that the SelectionIndicator styles are updated when the TabPicker's width updates from a selection change
    selectedKey,
  } = props;

  let { direction } = useLocale();
  let { scale } = useProvider();
  const tabContext = useTabContext();

  let [style, setStyle] = useState<CSSProperties>({
    width: undefined,
    height: undefined,
  });

  useLayoutEffect(() => {
    if (selectedTab) {
      let styleObj: CSSProperties = {
        transform: undefined,
        width: undefined,
        height: undefined,
      };
      // In RTL, calculate the transform from the right edge of the tablist so
      // that resizing the window doesn't break the Tabline position due to
      // offsetLeft changes
      let offset =
        direction === 'rtl'
          ? -1 *
            ((selectedTab.offsetParent as HTMLElement)?.offsetWidth -
              selectedTab.offsetWidth -
              selectedTab.offsetLeft)
          : selectedTab.offsetLeft;
      styleObj.transform =
        orientation === 'vertical'
          ? `translateY(${selectedTab.offsetTop}px)`
          : `translateX(${offset}px)`;

      if (orientation === 'horizontal') {
        styleObj.width = `${selectedTab.offsetWidth}px`;
      } else {
        styleObj.height = `${selectedTab.offsetHeight}px`;
      }
      setStyle(styleObj);
    }
  }, [direction, setStyle, selectedTab, orientation, scale, selectedKey]);

  return (
    <div
      {...toDataAttributes({
        disabled: tabContext.tabProps.isDisabled,
        orientation,
        prominence: tabContext.tabProps.prominence,
      })}
      className={classNames(
        css({
          borderRadius: 9999,
          position: 'absolute',
          transformOrigin: 'top left',
          zIndex: 0, // Below tab content

          '&[data-orientation=horizontal]': {
            transition: transition(['transform', 'width'], {
              duration: 'regular',
            }),
          },
          '&[data-orientation=vertical]': {
            transition: transition(['transform', 'width'], {
              duration: 'regular',
            }),
          },

          '&[data-prominence=default]': {
            backgroundColor: tokenSchema.color.background.accentEmphasis,

            '&[data-orientation=horizontal]': {
              bottom: tokenSchema.size.border.medium,
              blockSize: tokenSchema.size.border.large,
            },
            '&[data-orientation=vertical]': {
              insetInlineEnd: tokenSchema.size.border.regular,
              inlineSize: tokenSchema.size.border.large,
            },
          },
          '&[data-prominence=low]': {
            backgroundColor: tokenSchema.color.foreground.neutralEmphasis,

            '&[data-orientation=horizontal]': {
              bottom: `calc(${tokenSchema.size.border.regular} * -1)`,
              blockSize: tokenSchema.size.border.medium,
            },
            '&[data-orientation=vertical]': {
              insetInlineEnd: `calc(${tokenSchema.size.border.regular} * -1)`,
              inlineSize: tokenSchema.size.border.medium,
            },
          },

          '&[data-disabled=true]': {
            backgroundColor: tokenSchema.color.alias.foregroundDisabled,
          },
        }),
        tabsClassList.element('indicator')
      )}
      role="presentation"
      style={style}
    />
  );
}

/**
 * A TabList is used within Tabs to group tabs that a user can switch between.
 * The keys of the items within the <TabList> must match up with a corresponding
 * item inside the <TabPanels>.
 */
export function TabList<T extends object>(props: TabListProps<T>) {
  const tabContext = useTabContext<T>();
  const { refs, tabState, tabProps, tabPanelProps } = tabContext;
  const { prominence, orientation } = tabProps;
  const { selectedTab, collapsed, setTabListState } = tabState;
  const { tablistRef, wrapperRef } = refs;
  // Pass original Tab props but override children to create the collection.
  const state = useTabListState({ ...tabProps, children: props.children });

  let styleProps = useStyleProps(props);
  const { tabListProps } = useTabList(
    { ...tabProps, ...props },
    state,
    tablistRef
  );

  useEffect(() => {
    // Passing back to root as useTabPanel needs the TabListState
    setTabListState(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.disabledKeys,
    state.selectedItem,
    state.selectedKey,
    props.children,
  ]);

  let collapseStyle: CSSProperties =
    collapsed && orientation !== 'vertical'
      ? {
          maxWidth: 'calc(100% + 1px)',
          overflow: 'hidden',
          visibility: 'hidden',
          position: 'absolute',
        }
      : { maxWidth: 'calc(100% + 1px)' };
  let stylePropsFinal =
    orientation === 'vertical' ? styleProps : { style: collapseStyle };

  if (collapsed && orientation !== 'vertical') {
    tabListProps['aria-hidden'] = true;
  }

  const tabContent = (
    <div
      {...stylePropsFinal}
      {...tabListProps}
      {...toDataAttributes({ orientation, prominence })}
      ref={tablistRef}
      className={classNames(
        css({
          display: 'flex',
          margin: 0,
          outline: 'none',
          padding: 0,
          position: 'relative', // Contain the selection indicator
          userSelect: 'none',
          verticalAlign: 'top', // Friends should align to the top of the tabs
          zIndex: 0,

          '&[data-orientation=horizontal]': {
            alignItems: 'flex-end',
            flex: 1,

            '&[data-prominence=default]': {
              gap: tokenSchema.size.space.xlarge,
            },
            '&[data-prominence=low]': {
              gap: tokenSchema.size.space.large,
            },
          },

          '&[data-orientation=vertical]': {
            flexDirection: 'column',
          },
        }),
        tabsClassList.element('list'),
        orientation === 'vertical' && styleProps.className
      )}
    >
      {[...state.collection].map(item => (
        <Tab
          key={item.key}
          item={item}
          state={state}
          orientation={orientation}
        />
      ))}
      <SelectionIndicator orientation={orientation} selectedTab={selectedTab} />
    </div>
  );

  if (orientation === 'vertical') {
    return tabContent;
  } else {
    return (
      <div
        {...styleProps}
        ref={wrapperRef}
        className={classNames(
          css({
            display: 'flex',
            position: 'relative',
          }),
          tabsClassList.element('collapseWrapper'),
          styleProps.className
        )}
      >
        {/* @ts-expect-error FIXME */}
        <TabPicker
          {...props}
          {...tabProps}
          visible={collapsed}
          id={tabPanelProps['aria-labelledby']}
          state={state}
        />
        {tabContent}
      </div>
    );
  }
}

/**
 * TabPanels is used within Tabs as a container for the content of each tab.
 * The keys of the items within the <TabPanels> must match up with a corresponding item inside the <TabList>.
 */
export function TabPanels<T>(props: TabPanelsProps<T>) {
  const { tabState, tabProps } = useTabContext();
  const { tabListState } = tabState;

  const factory = (nodes: any) => new ListCollection(nodes);
  const collection = useCollection(
    // @ts-expect-error FIXME: not sure how to resolve, right now.
    { items: tabProps.items, ...props },
    factory,
    { suppressTextValueWarning: true }
  );
  const selectedItem = tabListState
    ? collection.getItem(tabListState.selectedKey)
    : null;

  return (
    <TabPanel {...props} key={tabListState?.selectedKey}>
      {selectedItem && selectedItem.props.children}
    </TabPanel>
  );
}

// @private
function TabPanel<T>(props: TabPanelsProps<T>) {
  const { tabState, tabPanelProps: ctxTabPanelProps } = useTabContext<T>();
  const { tabListState } = tabState;

  let ref = useRef<HTMLDivElement>(null);
  // @ts-expect-error `tabListState` will exist by here...
  const { tabPanelProps } = useTabPanel(props, tabListState, ref);
  let styleProps = useStyleProps(props);

  if (ctxTabPanelProps['aria-labelledby']) {
    tabPanelProps['aria-labelledby'] = ctxTabPanelProps['aria-labelledby'];
  }

  return (
    <FocusRing>
      <div
        {...styleProps}
        {...tabPanelProps}
        ref={ref}
        className={classNames(
          css({
            flexGrow: 1,
            '&[data-focus=visible]': {
              boxShadow: `inset 0 0 0 ${tokenSchema.size.alias.focusRing} ${tokenSchema.color.alias.focusRing}`,
              outline: 'none',
            },
          }),
          tabsClassList.element('panel'),
          styleProps.className
        )}
      >
        {/* @ts-expect-error FIXME: not sure how to resolve, right now. */}
        {props.children}
      </div>
    </FocusRing>
  );
}

interface TabPickerProps<T> extends Omit<PickerProps<T>, 'children'> {
  prominence?: TabProminence;
  state: TabListState<T>;
  className?: string;
  visible: boolean;
}

function TabPicker<T>(props: TabPickerProps<T>) {
  let {
    isDisabled,
    state,
    'aria-labelledby': ariaLabeledBy,
    'aria-label': ariaLabel,
    prominence,
    className,
    id,
    visible,
  } = props;

  let items = [...state.collection];

  let pickerProps = {
    'aria-labelledby': ariaLabeledBy,
    'aria-label': ariaLabel,
  };

  const style: CSSProperties = visible
    ? {}
    : { visibility: 'hidden', position: 'absolute' };

  // wrapper around the picker, keeps everything aligned when viewport changes
  return (
    <div
      {...toDataAttributes({ prominence, orientation: 'horizontal' })}
      className={className}
      style={style}
      aria-hidden={visible ? undefined : true}
    >
      <Picker
        {...pickerProps}
        id={id}
        items={items}
        isDisabled={!visible || isDisabled}
        selectedKey={state.selectedKey}
        disabledKeys={state.disabledKeys}
        onSelectionChange={state.setSelectedKey}
        marginBottom="xsmall"
        UNSAFE_className={tabsClassList.element('picker')}
      >
        {item => <Item {...item.props}>{item.rendered}</Item>}
      </Picker>
    </div>
  );
}

/**
 * Tabs organise related content into multiple sections. They allow the user to
 * navigate between groups of information that appear within the same context.
 */
// forwardRef doesn't support generic parameters, so cast the result to the correct type
// https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref
const _Tabs: <T>(
  props: TabsProps<T> & { ref?: RefObject<HTMLDivElement> }
) => ReactElement = React.forwardRef(Tabs) as any;
export { _Tabs as Tabs };
