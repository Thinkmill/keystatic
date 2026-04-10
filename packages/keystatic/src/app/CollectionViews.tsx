import { useMemo } from 'react';

import { Icon } from '@keystar/ui/icon';
import { diffIcon } from '@keystar/ui/icon/icons/diffIcon';
import { plusSquareIcon } from '@keystar/ui/icon/icons/plusSquareIcon';
import { dotSquareIcon } from '@keystar/ui/icon/icons/dotSquareIcon';
import { Box, Flex, Grid } from '@keystar/ui/layout';
import { Text, Heading } from '@keystar/ui/typography';
import { css, tokenSchema } from '@keystar/ui/style';
import { Checkbox } from '@keystar/ui/checkbox';
import { Selection, Key } from '@react-types/shared';

type CollectionEntry = {
  name: string;
  status: string;
  sha: string;
  data?: Record<string, unknown>;
};

type GridViewProps = {
  items: CollectionEntry[];
  basePath: string;
  collection: string;
  selectedKeys: Selection;
  onSelectionChange: (keys: Selection) => void;
  columns?: { key: string; label: string }[];
};

const statusColors: Record<string, string> = {
  Added: tokenSchema.color.scale.green9,
  Changed: tokenSchema.color.scale.amber9,
  Unchanged: tokenSchema.color.scale.slate6,
};

const statusIcons: Record<string, any> = {
  Added: plusSquareIcon,
  Changed: diffIcon,
  Unchanged: dotSquareIcon,
};

// Card component for grid view - compact fixed height
function CollectionCard({
  item,
  href,
  isSelected,
  onSelect,
}: {
  item: CollectionEntry;
  href: string;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <a
      href={href}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <Box
        UNSAFE_className={css({
          border: `2px solid ${isSelected ? tokenSchema.color.border.accent : tokenSchema.color.border.neutral}`,
          borderRadius: tokenSchema.size.radius.medium,
          padding: tokenSchema.size.space.regular,
          height: '100px',
          backgroundColor: isSelected
            ? tokenSchema.color.background.accentEmphasis
            : tokenSchema.color.background.surface,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          '&:hover': {
            borderColor: tokenSchema.color.border.accent,
            transform: 'translateY(-2px)',
            boxShadow: `0 4px 12px ${tokenSchema.color.shadow.regular}`,
          },
        })}
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="small" truncate UNSAFE_style={{ flex: 1 }}>
            {item.name}
          </Heading>
          <Box
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onSelect();
            }}
          >
            <Checkbox
              isSelected={isSelected}
              onChange={onSelect}
              aria-label={`Select ${item.name}`}
            />
          </Box>
        </Flex>

        <Flex justifyContent="space-between" alignItems="center">
          <Flex gap="xsmall" alignItems="center">
            <Box
              UNSAFE_className={css({
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: statusColors[item.status] || statusColors.Unchanged,
              })}
            />
            <Text size="small" color="neutralSecondary">
              {item.status}
            </Text>
          </Flex>
          <Icon src={statusIcons[item.status] || statusIcons.Unchanged} size="small" color="neutralSecondary" />
        </Flex>
      </Box>
    </a>
  );
}

export function CollectionGridView({
  items,
  basePath,
  collection,
  selectedKeys,
  onSelectionChange,
}: GridViewProps) {
  const selectedSet = useMemo(() => {
    if (selectedKeys === 'all') return new Set(items.map(i => i.name));
    return selectedKeys as Set<Key>;
  }, [selectedKeys, items]);

  const toggleSelection = (key: string) => {
    const newSet = new Set(selectedSet);
    if (newSet.has(key)) {
      newSet.delete(key);
    } else {
      newSet.add(key);
    }
    onSelectionChange(newSet as Selection);
  };

  return (
    <Grid
      columns={{ mobile: 'repeat(2, 1fr)', tablet: 'repeat(3, 1fr)', desktop: 'repeat(4, 1fr)' }}
      gap="regular"
      padding="large"
    >
      {items.map(item => (
        <CollectionCard
          key={item.name}
          item={item}
          href={`${basePath}/collection/${encodeURIComponent(collection)}/item/${encodeURIComponent(item.name)}`}
          isSelected={selectedSet.has(item.name)}
          onSelect={() => toggleSelection(item.name)}
        />
      ))}
    </Grid>
  );
}
