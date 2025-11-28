'use client';
import { useLocale } from '@react-aria/i18n';
import {
  AnchorHTMLAttributes,
  HTMLAttributes,
  ReactNode,
  Fragment,
  useCallback,
  type JSX,
} from 'react';

import { Icon } from '@keystar/ui/icon';
import { chevronLeftIcon } from '@keystar/ui/icon/icons/chevronLeftIcon';
import { chevronRightIcon } from '@keystar/ui/icon/icons/chevronRightIcon';
import { Box, Flex } from '@keystar/ui/layout';
import { css, tokenSchema } from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';

import { HeadingEntry } from '../../utils/generate-toc';
import { ASIDE_WIDTH, HEADER_HEIGHT, SIDEBAR_WIDTH } from '../constants';
import { TocContextProvider, useTocContext } from './toc-context';

const MAIN_ID = 'docs-main';

export function DocsContent({
  children,
  toc,
}: {
  children: ReactNode;
  toc?: HeadingEntry[];
}): JSX.Element {
  const includeNavigation = toc !== undefined;
  // TODO: find a better solution for inline styles related to heading offsets
  return (
    <TocContextProvider value={toc || []}>
      <Flex
        elementType="main"
        flex
        minWidth={0}
        height="100%"
        width="100%"
        paddingStart={{ tablet: SIDEBAR_WIDTH }}
        paddingEnd={{ desktop: includeNavigation ? ASIDE_WIDTH : undefined }}
      >
        <Content id={MAIN_ID}>{children}</Content>

        {includeNavigation && <Aside />}
      </Flex>
    </TocContextProvider>
  );
}

type ElementProps = HTMLAttributes<HTMLDivElement>;

const Content = (props: ElementProps) => {
  return (
    <Flex
      direction="column"
      flex
      marginX="auto"
      marginTop={{ mobile: HEADER_HEIGHT, tablet: 'large' }}
      padding={{ mobile: 'large', tablet: 'xlarge' }}
      UNSAFE_style={{ maxWidth: 840, minWidth: 0 }}
    >
      {/* PROSE */}
      <Flex
        flex
        direction="column"
        gap="xlarge"
        // elementType="article"
        paddingBottom="xxlarge"
        {...props}
      />

      <Box borderTop="neutral" elementType="footer" paddingY="xxlarge">
        <Text size="small" color="neutralSecondary">
          &copy; {new Date().getFullYear()} @jossmac
        </Text>
      </Box>
    </Flex>
  );
};

const Aside = () => {
  return (
    <Box
      elementType="aside"
      isHidden={{ below: 'desktop' }}
      height="100%"
      insetEnd={0}
      overflow="hidden auto"
      padding="xlarge"
      position="fixed"
      UNSAFE_style={{ width: ASIDE_WIDTH }}
    >
      <Box marginTop="large">
        <TableOfContents />
      </Box>
    </Box>
  );
};

const TableOfContents = () => {
  const headingId = 'spark-toc-heading';

  return (
    <Flex direction="column" gap="large">
      <Text
        elementType="h4"
        id={headingId}
        color="neutralEmphasis"
        marginStart="medium"
        weight="bold"
      >
        On this page
      </Text>
      <nav aria-labelledby={headingId}>
        <HeadingList />
      </nav>
    </Flex>
  );
};

const HeadingList = () => {
  const { headings } = useTocContext();

  const headingMap = useCallback((heading: HeadingEntry) => {
    return (
      <Fragment key={heading.id}>
        <HeadingItem
          id={heading.id}
          level={heading.level}
          href={`#${heading.id}`}
        >
          {heading.title}
        </HeadingItem>
        {heading.items.length ? heading.items.map(headingMap) : null}
      </Fragment>
    );
  }, []);

  //  TODO: implement observer to highlight current anchor
  return <Box elementType="ul">{headings.map(headingMap)}</Box>;
};

type HeadingItemProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  Pick<HeadingEntry, 'id' | 'level'>;
const HeadingItem = ({
  // id,
  href,
  onClick,
  children,
  level,
}: HeadingItemProps) => {
  const isSubItem = level > 2;
  // const isActive = useIsActive(id);
  const { direction } = useLocale();
  const chevronEndIcon =
    direction === 'rtl' ? chevronLeftIcon : chevronRightIcon;

  return (
    <Box elementType="li" marginTop={isSubItem ? undefined : 'regular'}>
      <Flex
        elementType="a"
        href={href}
        onClick={onClick}
        // styles
        alignItems="center"
        borderRadius="small"
        gap="small"
        height="element.regular"
        paddingX="medium"
        position="relative"
        UNSAFE_className={css({
          outline: 0,

          '&:hover': {
            backgroundColor: tokenSchema.color.alias.backgroundHovered,
            color: tokenSchema.color.alias.foregroundHovered,
          },
          '&:active': {
            backgroundColor: tokenSchema.color.alias.backgroundPressed,
            color: tokenSchema.color.alias.foregroundPressed,
          },
          '&:focus-visible': {
            boxShadow: `0 0 0 ${tokenSchema.size.alias.focusRing} ${tokenSchema.color.alias.focusRing}`,
          },
        })}
      >
        {isSubItem && <Icon src={chevronEndIcon} size="small" />}
        <Text
          trim={false}
          color="inherit"
          size={isSubItem ? 'small' : undefined}
          weight={!isSubItem ? 'medium' : undefined}
        >
          {children}
        </Text>
      </Flex>
    </Box>
  );
};
