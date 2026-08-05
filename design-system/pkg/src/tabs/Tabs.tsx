import {
  SelectionIndicator,
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  TabPanels as AriaTabPanels,
  Tabs as AriaTabs,
  type TabRenderProps,
} from 'react-aria-components/Tabs';
import {
  createContext,
  type ForwardedRef,
  type ReactElement,
  type ReactNode,
  forwardRef,
  useContext,
} from 'react';

import { SlotProvider } from '@keystar/ui/slots';
import {
  ClassList,
  classNames,
  css,
  toDataAttributes,
  tokenSchema,
  transition,
  useStyleProps,
} from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';

import type {
  TabListProps,
  TabPanelProps,
  TabPanelsProps,
  TabProminence,
  TabProps,
  TabsProps,
} from './types';

export const tabsClassList = new ClassList('Tabs', [
  'indicator',
  'list',
  'panel',
  'tab',
  'tab-icon',
  'tab-label',
]);

const TabsStyleContext = createContext({
  prominence: 'default' as TabProminence,
});

function TabsImpl(
  props: TabsProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let { prominence = 'default', ...otherProps } = props;
  let styleProps = useStyleProps(props);
  return (
    <TabsStyleContext.Provider value={{ prominence }}>
      <AriaTabs
        {...otherProps}
        {...styleProps}
        {...toDataAttributes({ prominence })}
        ref={forwardedRef}
        className={classNames(
          css({ display: 'flex', minWidth: 0 }),
          styleProps.className
        )}
      />
    </TabsStyleContext.Provider>
  );
}

export const Tabs = forwardRef(TabsImpl);

function TabList<T>(
  props: TabListProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let { prominence } = useContext(TabsStyleContext);
  let styleProps = useStyleProps(props);
  return (
    <AriaTabList
      {...props}
      {...styleProps}
      {...toDataAttributes({ prominence })}
      ref={forwardedRef}
      className={classNames(
        tabsClassList.element('list'),
        css({
          display: 'flex',
          margin: 0,
          outline: 'none',
          padding: 0,
          position: 'relative',
          userSelect: 'none',

          '&[data-orientation=horizontal]': {
            alignItems: 'flex-end',
            flex: 1,
            gap: tokenSchema.size.space.xlarge,
          },
          '&[data-orientation=vertical]': {
            flexDirection: 'column',
          },
          '&[data-prominence=low]': {
            gap: tokenSchema.size.space.large,
          },
        }),
        styleProps.className
      )}
    />
  );
}

const _TabList = forwardRef(TabList) as <T>(
  props: TabListProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReactElement;
export { _TabList as TabList };

function TabImpl(props: TabProps, forwardedRef: ForwardedRef<HTMLDivElement>) {
  let { children, ...otherProps } = props;
  let { prominence } = useContext(TabsStyleContext);
  let styleProps = useStyleProps(props);
  return (
    <AriaTab
      {...otherProps}
      {...styleProps}
      {...toDataAttributes({ prominence })}
      ref={forwardedRef}
      className={classNames(
        tabsClassList.element('tab'),
        css({
          alignItems: 'center',
          color: tokenSchema.color.foreground.neutralSecondary,
          cursor: 'default',
          display: 'flex',
          gap: tokenSchema.size.space.regular,
          outline: 0,
          position: 'relative',
          transition: transition(['color']),

          '&[data-orientation=horizontal]': {
            height: tokenSchema.size.element.medium,
            paddingBottom: tokenSchema.size.space.regular,
          },
          '&[data-orientation=vertical]': {
            height: tokenSchema.size.element.large,
            paddingInline: tokenSchema.size.space.large,
          },
          '&[data-prominence=low]': {
            fontSize: tokenSchema.typography.text.regular.size,
          },
          '&[data-hovered], &[data-focus-visible]': {
            color: tokenSchema.color.foreground.neutral,
          },
          '&[data-selected]': {
            color: tokenSchema.color.foreground.neutralEmphasis,
          },
          '&[data-disabled]': {
            color: tokenSchema.color.alias.foregroundDisabled,
          },
        }),
        styleProps.className
      )}
    >
      {states => (
        <>
          <SlotProvider
            slots={{
              icon: { UNSAFE_className: tabsClassList.element('tab-icon') },
              text: {
                UNSAFE_className: tabsClassList.element('tab-label'),
                color: 'inherit',
              },
            }}
          >
            {renderTabChildren(children, states)}
          </SlotProvider>
          <SelectionIndicator
            className={classNames(
              tabsClassList.element('indicator'),
              css({
                backgroundColor: tokenSchema.color.background.accentEmphasis,
                borderRadius: tokenSchema.size.radius.full,
                position: 'absolute',
                '&[data-orientation=horizontal]': {
                  blockSize: tokenSchema.size.border.large,
                  insetBlockEnd: 0,
                  insetInline: 0,
                },
                '&[data-orientation=vertical]': {
                  inlineSize: tokenSchema.size.border.large,
                  insetBlock: tokenSchema.size.space.regular,
                  insetInlineStart: 0,
                },
              })
            )}
          />
        </>
      )}
    </AriaTab>
  );
}

export const Tab = forwardRef(TabImpl);

function TabPanels<T>(
  props: TabPanelsProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let styleProps = useStyleProps(props);
  return <AriaTabPanels {...props} {...styleProps} ref={forwardedRef} />;
}

const _TabPanels = forwardRef(TabPanels) as <T>(
  props: TabPanelsProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReactElement;
export { _TabPanels as TabPanels };

function TabPanelImpl(
  props: TabPanelProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let styleProps = useStyleProps(props);
  return (
    <AriaTabPanel
      {...props}
      {...styleProps}
      ref={forwardedRef}
      className={classNames(
        tabsClassList.element('panel'),
        css({
          flexGrow: 1,
          outline: 'none',
          '&[data-focus-visible]': {
            boxShadow: `inset 0 0 0 ${tokenSchema.size.alias.focusRing} ${tokenSchema.color.alias.focusRing}`,
          },
        }),
        styleProps.className
      )}
    />
  );
}

export const TabPanel = forwardRef(TabPanelImpl);

function renderTabChildren(
  children: TabProps['children'],
  states: TabRenderProps
): ReactNode {
  let content =
    typeof children === 'function'
      ? (children as (states: TabRenderProps) => ReactNode)(states)
      : children;
  return isReactText(content) ? <Text>{content}</Text> : content;
}
