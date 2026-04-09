import { useLocalizedStringFormatter } from '@react-aria/i18n';

import { Avatar } from '@keystar/ui/avatar';
import { Box, Flex, Grid, VStack, Divider } from '@keystar/ui/layout';
import { TextLink } from '@keystar/ui/link';
import { css, tokenSchema } from '@keystar/ui/style';
import { Heading, Text } from '@keystar/ui/typography';

import { Config } from '../../config';

import l10nMessages from '../l10n';
import { useCloudInfo } from '../shell/data';
import { PageBody, PageHeader, PageRoot } from '../shell/page';
import { useViewer } from '../shell/viewer-data';

import { BranchSection } from './BranchSection';
import { DashboardCards } from './DashboardCards';
import { StatsCards } from './StatsCards';
import { ActivityFeed } from './ActivityFeed';
import { QuickActions } from './QuickActions';
import { isLocalConfig } from '../utils';

export function DashboardPage(props: { config: Config; basePath: string }) {
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const viewer = useViewer();
  const cloudInfo = useCloudInfo();

  const user = viewer
    ? { name: viewer.name ?? viewer.login, avatarUrl: viewer.avatarUrl }
    : cloudInfo?.user;

  return (
    <PageRoot containerWidth="large">
      <PageHeader>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          gap="regular"
          UNSAFE_className={css({
            flexWrap: 'wrap',
            rowGap: tokenSchema.size.space.medium,
          })}
        >
          <Heading
            elementType="h1"
            id="page-title"
            size="small"
            UNSAFE_style={{ lineHeight: 1.5 }}
          >
            {stringFormatter.format('dashboard')}
          </Heading>
          <QuickActions />
        </Flex>
      </PageHeader>
      <PageBody isScrollable>
        <Flex direction="column" gap="xxlarge">
          <DashboardHero user={user} manageAccount={!!cloudInfo} />

          {/* Stats Overview */}
          <StatsCards />

          {!isLocalConfig(props.config) && <BranchSection />}

          {/* Section divider with label */}
          <Flex alignItems="center" gap="large">
            <Divider flex />
            <Text size="small" color="neutralTertiary" weight="semibold">
              CONTENT
            </Text>
            <Divider flex />
          </Flex>

          {/* Main Content Grid */}
          <Grid
            columns={{ mobile: '1fr', tablet: '1fr 1fr', desktop: '2fr 1fr' }}
            gap="xxlarge"
          >
            {/* Collections Section */}
            <Box>
              <DashboardCards />
            </Box>

            {/* Activity Feed */}
            <Box>
              <ActivityFeed maxItems={8} />
            </Box>
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
  const eyebrow = user ? 'Content Hub' : 'Local Content Studio';
  const description = user
    ? 'Pick a collection to edit, review pending changes, or create new content.'
    : 'You are running in local mode. Create and edit content directly in your repository.';

  return (
    <Box
      borderRadius="large"
      overflow="hidden"
      UNSAFE_className={css({
        position: 'relative',
        border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.muted}`,
        background: `linear-gradient(135deg, ${tokenSchema.color.background.surface} 0%, ${tokenSchema.color.background.canvas} 100%)`,
        boxShadow: `0 8px 32px ${tokenSchema.color.shadow.muted}, 0 0 0 1px ${tokenSchema.color.border.muted}`,

        '::before': {
          content: '""',
          position: 'absolute',
          inset: '-30% 30% 20% -30%',
          backgroundImage: `radial-gradient(circle at center, ${tokenSchema.color.scale.indigo5}, transparent 65%)`,
          opacity: 0.5,
          pointerEvents: 'none',
          animation: 'pulse 8s ease-in-out infinite',
        },
        '::after': {
          content: '""',
          position: 'absolute',
          inset: '40% -25% -35% 40%',
          backgroundImage: `radial-gradient(circle at center, ${tokenSchema.color.scale.cyan6}, transparent 70%)`,
          opacity: 0.35,
          pointerEvents: 'none',
          animation: 'pulse 6s ease-in-out infinite reverse',
        },
        '@keyframes pulse': {
          '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
          '50%': { opacity: 0.6, transform: 'scale(1.05)' },
        },
      })}
    >
      <Flex
        alignItems="center"
        gap="xlarge"
        position="relative"
        zIndex={1}
        paddingX={{ mobile: 'large', tablet: 'xxlarge' }}
        paddingY={{ mobile: 'xlarge', tablet: 'xxlarge' }}
      >
        <Box
          UNSAFE_className={css({
            padding: tokenSchema.size.space.small,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${tokenSchema.color.scale.indigo4}, ${tokenSchema.color.scale.cyan4})`,
            boxShadow: `0 8px 24px ${tokenSchema.color.shadow.emphasis}`,
          })}
        >
          <Avatar src={user?.avatarUrl} name={displayName} size="large" />
        </Box>
        <VStack gap="medium">
          <Text
            size="small"
            color="accent"
            weight="bold"
            UNSAFE_className={css({
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              lineHeight: 1.5,
            })}
          >
            {eyebrow}
          </Text>
          <Heading
            size="large"
            elementType="p"
            UNSAFE_style={{
              fontWeight: tokenSchema.typography.fontWeight.bold,
              lineHeight: 1.3,
            }}
          >
            Welcome back, {displayName}
          </Heading>
          <Text
            color="neutralSecondary"
            size="regular"
            UNSAFE_style={{ lineHeight: 1.7, maxWidth: '600px' }}
          >
            {description}
          </Text>
          {manageAccount && user && (
            <Box paddingTop="small">
              <TextLink href="https://keystatic.cloud/account">
                Manage Account →
              </TextLink>
            </Box>
          )}
        </VStack>
      </Flex>
    </Box>
  );
}
