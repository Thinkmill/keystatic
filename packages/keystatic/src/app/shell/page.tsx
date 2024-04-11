import { useLocale } from '@react-aria/i18n';
import { createContext, PropsWithChildren, useContext, useRef } from 'react';

import { ActionButton } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { panelLeftOpenIcon } from '@keystar/ui/icon/icons/panelLeftOpenIcon';
import { panelLeftCloseIcon } from '@keystar/ui/icon/icons/panelLeftCloseIcon';
import { panelRightOpenIcon } from '@keystar/ui/icon/icons/panelRightOpenIcon';
import { panelRightCloseIcon } from '@keystar/ui/icon/icons/panelRightCloseIcon';
import { Box, BoxProps, Flex } from '@keystar/ui/layout';
import { css, tokenSchema, VoussoirTheme } from '@keystar/ui/style';

import { MAIN_PANEL_ID } from './constants';
import { ScrollView } from './primitives';
import { useSidebar } from './sidebar';

type PageContextValue = {
  containerWidth: keyof VoussoirTheme['size']['container'] | 'none';
};
const PageContext = createContext<PageContextValue>({
  containerWidth: 'medium',
});

export const PageRoot = ({
  children,
  containerWidth = 'medium',
}: PropsWithChildren<Partial<PageContextValue>>) => {
  return (
    <PageContext.Provider value={{ containerWidth }}>
      <Flex
        elementType="main"
        direction="column"
        id={MAIN_PANEL_ID}
        flex
        height="100%"
        // fix flexbox issues
        minHeight={0}
        minWidth={0}
      >
        {children}
      </Flex>
    </PageContext.Provider>
  );
};

export const PageHeader = ({ children }: PropsWithChildren) => {
  const sidebarState = useSidebar();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { direction } = useLocale();

  let icon = sidebarState.isOpen ? panelLeftCloseIcon : panelLeftOpenIcon;
  if (direction === 'rtl') {
    icon = sidebarState.isOpen ? panelRightCloseIcon : panelRightOpenIcon;
  }

  return (
    <Box borderBottom="muted" elementType="header" flexShrink={0}>
      <Flex
        alignItems="center"
        gap={{ mobile: 'small', tablet: 'regular' }}
        height={{ mobile: 'element.large', tablet: 'element.xlarge' }}
        paddingX={{ mobile: 'medium', tablet: 'xlarge', desktop: 'xxlarge' }}
      >
        <ActionButton
          prominence="low"
          aria-label="Open app navigation"
          aria-pressed={sidebarState.isOpen}
          isHidden={sidebarState.isOpen ? { above: 'tablet' } : undefined}
          onPress={sidebarState.toggle}
          ref={menuButtonRef}
          UNSAFE_className={css({
            marginInlineStart: `calc(${tokenSchema.size.space.regular} * -1)`,
          })}
        >
          <Icon src={icon} />
        </ActionButton>
        {children}
      </Flex>
    </Box>
  );
};

export const PageBody = ({
  children,
  isScrollable,
}: PropsWithChildren<{ isScrollable?: boolean }>) => {
  return (
    <ScrollView isDisabled={!isScrollable}>
      <PageContainer
        // padding on the container so descendants can use sticky positioning
        // with simple relative offsets
        paddingY="xxlarge"
      >
        {children}
      </PageContainer>
    </ScrollView>
  );
};

export const PageContainer = (props: BoxProps) => {
  const { containerWidth } = useContext(PageContext);
  const maxWidth =
    containerWidth === 'none'
      ? undefined
      : (`container.${containerWidth}` as const);

  return (
    <Box
      minHeight={0}
      minWidth={0}
      maxWidth={maxWidth}
      // marginX="auto"
      paddingX={{ mobile: 'medium', tablet: 'xlarge', desktop: 'xxlarge' }}
      {...props}
    />
  );
};
