import { useMemo } from 'react';

import { Icon } from '@keystar/ui/icon';
import { alertCircleIcon } from '@keystar/ui/icon/icons/alertCircleIcon';
import { checkCircle2Icon } from '@keystar/ui/icon/icons/checkCircle2Icon';
import { editIcon } from '@keystar/ui/icon/icons/editIcon';
import { fileTextIcon } from '@keystar/ui/icon/icons/fileTextIcon';
import { Box, Flex, Grid, VStack } from '@keystar/ui/layout';
import { css, tokenSchema } from '@keystar/ui/style';
import { Heading, Text } from '@keystar/ui/typography';

import { useNavItems } from '../useNavItems';

type StatCardProps = {
  title: string;
  value: number | string;
  subtitle: string;
  icon: typeof fileTextIcon;
  tone: 'indigo' | 'green' | 'amber' | 'slate';
};

const toneMap = {
  indigo: {
    background: tokenSchema.color.scale.indigo3,
    foreground: tokenSchema.color.scale.indigo9,
  },
  green: {
    background: tokenSchema.color.scale.green3,
    foreground: tokenSchema.color.scale.green9,
  },
  amber: {
    background: tokenSchema.color.scale.amber3,
    foreground: tokenSchema.color.scale.amber9,
  },
  slate: {
    background: tokenSchema.color.scale.slate3,
    foreground: tokenSchema.color.scale.slate9,
  },
} as const;

function StatCard({ icon, subtitle, title, tone, value }: StatCardProps) {
  const colors = toneMap[tone];

  return (
    <Box
      borderRadius="large"
      padding={{ mobile: 'large', tablet: 'xlarge' }}
      UNSAFE_className={css({
        border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.neutral}`,
        backgroundColor: tokenSchema.color.background.surface,
        boxShadow: `0 14px 28px ${tokenSchema.color.shadow.muted}`,
      })}
    >
      <Flex alignItems="center" gap="large">
        <Box
          borderRadius="large"
          padding="regular"
          UNSAFE_className={css({
            backgroundColor: colors.background,
            color: colors.foreground,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          })}
        >
          <Icon src={icon} size="medium" />
        </Box>
        <VStack gap="xsmall" minWidth={0}>
          <Text color="neutralSecondary" size="small">
            {title}
          </Text>
          <Heading elementType="p" size="large">
            {value}
          </Heading>
          <Text color="neutralSecondary" size="small">
            {subtitle}
          </Text>
        </VStack>
      </Flex>
    </Box>
  );
}

export function StatsCards() {
  const navItems = useNavItems();

  const stats = useMemo(() => {
    let totalEntries = 0;
    let totalCollections = 0;
    let totalPages = 0;
    let totalSingletons = 0;
    let pendingChanges = 0;
    const hasStandalonePages = navItems.some(
      item => 'children' in item && item.children && item.title === 'Pages'
    );

    const processItem = (item: (typeof navItems)[0]) => {
      if ('children' in item && item.children) {
        item.children.forEach(child => {
          if (!('isDivider' in child) || !child.isDivider) {
            if (child.itemKind === 'collection') {
              totalEntries += child.entryCount ?? 0;
              totalCollections += 1;
            } else if (child.itemKind === 'page') {
              totalPages += 1;
            } else if (child.itemKind === 'singleton') {
              totalSingletons += 1;
            }
            if ('changed' in child && child.changed) {
              pendingChanges +=
                typeof child.changed === 'number' ? child.changed : 1;
            }
          }
        });
      } else if (!('isDivider' in item) || !item.isDivider) {
        if (item.itemKind === 'collection') {
          totalEntries += item.entryCount ?? 0;
          totalCollections += 1;
        } else if (item.itemKind === 'page') {
          totalPages += 1;
        } else if (item.itemKind === 'singleton') {
          totalSingletons += 1;
        }
        if ('changed' in item && item.changed) {
          pendingChanges += typeof item.changed === 'number' ? item.changed : 1;
        }
      }
    };

    navItems.forEach(processItem);

    return {
      hasStandalonePages,
      pendingChanges,
      totalCollections,
      totalEntries,
      totalPages,
      totalSingletons,
    };
  }, [navItems]);

  return (
    <Grid
      columns={{
        mobile: '1fr',
        tablet: 'repeat(2, 1fr)',
        desktop: 'repeat(4, 1fr)',
      }}
      gap="large"
    >
      <StatCard
        title="Pages"
        value={stats.totalPages}
        subtitle={
          stats.hasStandalonePages
            ? stats.totalPages > 0
              ? 'Independent sidebar-linked pages'
              : 'Create your first standalone page'
            : 'No standalone pages configured'
        }
        icon={editIcon}
        tone="indigo"
      />
      <StatCard
        title="Entries"
        value={stats.totalEntries}
        subtitle={`Across ${stats.totalCollections} collections`}
        icon={checkCircle2Icon}
        tone="green"
      />
      <StatCard
        title="Singletons"
        value={stats.totalSingletons}
        subtitle="Settings and reusable content groups"
        icon={editIcon}
        tone="slate"
      />
      <StatCard
        title="Pending changes"
        value={stats.pendingChanges}
        subtitle={
          stats.pendingChanges > 0
            ? 'Ready to review and save'
            : 'Everything is up to date'
        }
        icon={alertCircleIcon}
        tone="amber"
      />
    </Grid>
  );
}
