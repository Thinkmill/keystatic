import { useEffect } from 'react';
import { useLocalizedStringFormatter } from '@react-aria/i18n';

import { Avatar } from '@keystar/ui/avatar';
import { Box, Flex, Grid, VStack } from '@keystar/ui/layout';
import { TextLink } from '@keystar/ui/link';
import { css, tokenSchema } from '@keystar/ui/style';
import { Heading, Text } from '@keystar/ui/typography';

import { Config } from '../../config';

import l10nMessages from '../l10n';
import { useCloudInfo } from '../shell/data';
import { PageBody, PageHeader, PageRoot } from '../shell/page';
import { useViewer } from '../shell/viewer-data';
import { isLocalConfig } from '../utils';
import { useRecentItems } from '../shell/navigation-history';

import { ActivityFeed } from './ActivityFeed';
import { BranchSection } from './BranchSection';
import { DashboardCards } from './DashboardCards';
import { QuickActions } from './QuickActions';
import { StatsCards } from './StatsCards';

export function DashboardPage(props: { config: Config; basePath: string }) {
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const viewer = useViewer();
  const cloudInfo = useCloudInfo();
  const { addRecentItem } = useRecentItems();

  useEffect(() => {
    addRecentItem({
      type: 'singleton',
      key: 'dashboard',
      label: 'Dashboard',
      href: props.basePath,
    });
  }, [addRecentItem, props.basePath]);

  const user = viewer
    ? { name: viewer.name ?? viewer.login, avatarUrl: viewer.avatarUrl }
    : cloudInfo?.user;

  return (
    <PageRoot containerWidth="large">
      <PageHeader>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          gap="regular"
          width="100%"
          wrap
        >
          <VStack gap="xsmall">
            <Heading elementType="h1" id="page-title" size="small">
              {stringFormatter.format('dashboard')}
            </Heading>
            <Text color="neutralSecondary" size="small">
              Manage content, follow recent changes, and jump back into editing.
            </Text>
          </VStack>
          <QuickActions />
        </Flex>
      </PageHeader>
      <PageBody isScrollable>
        <Flex direction="column" gap="xlarge">
          <DashboardHero user={user} manageAccount={!!cloudInfo} />
          <StatsCards />
          {!isLocalConfig(props.config) && <BranchSection />}
          <Grid columns={{ mobile: '1fr', tablet: '1.55fr 1fr' }} gap="xlarge">
            <DashboardCards />
            <ActivityFeed maxItems={8} />
          </Grid>
        </Flex>
      </PageBody>
    </PageRoot>
  );
}

function DashboardHero({
  user,
  manageAccount,
}: {
  user?: { avatarUrl?: string; name: string };
  manageAccount: boolean;
}) {
  const displayName = user?.name ?? 'Creator';
  const eyebrow = user ? 'Content Studio' : 'Local Workspace';
  const description = user
    ? 'Everything you need to edit, review, and publish is collected here.'
    : 'You are working locally. Content edits save directly into your repository.';

  return (
    <Grid columns={{ mobile: '1fr', tablet: '1.6fr 1fr' }} gap="large">
      <Box
        borderRadius="large"
        padding={{ mobile: 'large', tablet: 'xlarge' }}
        UNSAFE_className={css({
          border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.neutral}`,
          background: `linear-gradient(135deg, ${tokenSchema.color.scale.indigo3} 0%, ${tokenSchema.color.background.surface} 55%, ${tokenSchema.color.scale.green3} 100%)`,
          boxShadow: `0 18px 34px ${tokenSchema.color.shadow.muted}`,
        })}
      >
        <Flex alignItems="center" gap="large" wrap>
          <Avatar src={user?.avatarUrl} name={displayName} size="large" />
          <VStack gap="small" minWidth={0}>
            <Text
              size="small"
              weight="semibold"
              color="accent"
              UNSAFE_className={css({
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              })}
            >
              {eyebrow}
            </Text>
            <Heading
              elementType="p"
              size="large"
              UNSAFE_style={{ lineHeight: 1.2 }}
            >
              Welcome back, {displayName}
            </Heading>
            <Text color="neutralSecondary" UNSAFE_style={{ lineHeight: 1.7 }}>
              {description}
            </Text>
            {manageAccount && user && (
              <TextLink href="https://keystatic.cloud/account">
                Manage account
              </TextLink>
            )}
          </VStack>
        </Flex>
      </Box>

      <Box
        borderRadius="large"
        padding={{ mobile: 'large', tablet: 'xlarge' }}
        UNSAFE_className={css({
          border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.neutral}`,
          backgroundColor: tokenSchema.color.background.surface,
          boxShadow: `0 14px 28px ${tokenSchema.color.shadow.muted}`,
        })}
      >
        <VStack gap="medium">
          <Text
            size="small"
            weight="semibold"
            color="neutralSecondary"
            UNSAFE_className={css({
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            })}
          >
            Focus today
          </Text>
          <Heading elementType="p" size="small">
            Pick a page, collection, or setting and keep the editing flow
            moving.
          </Heading>
          <Text color="neutralSecondary" size="small">
            The admin is tuned for quick jumps: use the sidebar, dashboard
            cards, or search with{' '}
            <Text elementType="span" weight="semibold">
              Ctrl K
            </Text>
            .
          </Text>
        </VStack>
      </Box>
    </Grid>
  );
}
