import { useMemo, useCallback } from 'react';

import { ActionButton, Button } from '@keystar/ui/button';
import { Checkbox } from '@keystar/ui/checkbox';
import { Dialog, DialogTrigger } from '@keystar/ui/dialog';
import { Icon } from '@keystar/ui/icon';
import { filterIcon } from '@keystar/ui/icon/icons/filterIcon';
import { xIcon } from '@keystar/ui/icon/icons/xIcon';
import { Box, Flex, VStack, Divider } from '@keystar/ui/layout';
import { Content } from '@keystar/ui/slots';
import { Heading, Text } from '@keystar/ui/typography';
import { css, tokenSchema } from '@keystar/ui/style';
import { Badge } from '@keystar/ui/badge';

// Filter types
export type FilterValue = {
  status: {
    added: boolean;
    changed: boolean;
    unchanged: boolean;
  };
};

export const DEFAULT_FILTERS: FilterValue = {
  status: {
    added: false,
    changed: false,
    unchanged: false,
  },
};

type FilterPanelProps = {
  filters: FilterValue;
  onFiltersChange: (filters: FilterValue) => void;
  showStatusFilter?: boolean;
};

export function FilterPanel({
  filters,
  onFiltersChange,
  showStatusFilter = true,
}: FilterPanelProps) {
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.status.added || filters.status.changed || filters.status.unchanged)
      count++;
    return count;
  }, [filters]);

  const clearAllFilters = useCallback(() => {
    onFiltersChange(DEFAULT_FILTERS);
  }, [onFiltersChange]);

  const toggleStatus = (key: 'added' | 'changed' | 'unchanged') => {
    onFiltersChange({
      ...filters,
      status: {
        ...filters.status,
        [key]: !filters.status[key],
      },
    });
  };

  return (
    <DialogTrigger>
      <ActionButton>
        <Icon src={filterIcon} />
        <Text>Filters</Text>
        {activeFilterCount > 0 && (
          <Badge tone="accent">{activeFilterCount}</Badge>
        )}
      </ActionButton>
      {close => (
        <Dialog>
          <Heading>Filters</Heading>
          <Content>
            <VStack gap="large">
              {showStatusFilter && (
                <VStack gap="regular">
                  <Text weight="semibold" size="small" color="neutralSecondary">
                    Status
                  </Text>
                  <VStack gap="small">
                    <Checkbox
                      isSelected={filters.status.added}
                      onChange={() => toggleStatus('added')}
                    >
                      <Flex gap="small" alignItems="center">
                        <Box
                          UNSAFE_className={css({
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: tokenSchema.color.scale.green9,
                          })}
                        />
                        <Text>Added</Text>
                      </Flex>
                    </Checkbox>
                    <Checkbox
                      isSelected={filters.status.changed}
                      onChange={() => toggleStatus('changed')}
                    >
                      <Flex gap="small" alignItems="center">
                        <Box
                          UNSAFE_className={css({
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: tokenSchema.color.scale.amber9,
                          })}
                        />
                        <Text>Changed</Text>
                      </Flex>
                    </Checkbox>
                    <Checkbox
                      isSelected={filters.status.unchanged}
                      onChange={() => toggleStatus('unchanged')}
                    >
                      <Flex gap="small" alignItems="center">
                        <Box
                          UNSAFE_className={css({
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: tokenSchema.color.scale.slate6,
                          })}
                        />
                        <Text>Unchanged</Text>
                      </Flex>
                    </Checkbox>
                  </VStack>
                </VStack>
              )}

              <Divider />

              <Flex gap="regular" justifyContent="space-between">
                <Button onPress={clearAllFilters} prominence="low">
                  Clear All
                </Button>
                <Button onPress={close} prominence="high">
                  Apply
                </Button>
              </Flex>
            </VStack>
          </Content>
        </Dialog>
      )}
    </DialogTrigger>
  );
}

// Hook for managing filter state
export function useFilters() {
  const hasActiveFilters = useCallback((filters: FilterValue) => {
    return (
      filters.status.added || filters.status.changed || filters.status.unchanged
    );
  }, []);

  return {
    hasActiveFilters,
  };
}

// Compact filter chips for showing active filters
export function ActiveFilterChips({
  filters,
  onFiltersChange,
}: {
  filters: FilterValue;
  onFiltersChange: (filters: FilterValue) => void;
}) {
  const activeStatuses: { key: 'added' | 'changed' | 'unchanged'; label: string }[] =
    [];
  if (filters.status.added) activeStatuses.push({ key: 'added', label: 'Added' });
  if (filters.status.changed)
    activeStatuses.push({ key: 'changed', label: 'Changed' });
  if (filters.status.unchanged)
    activeStatuses.push({ key: 'unchanged', label: 'Unchanged' });

  if (activeStatuses.length === 0) {
    return null;
  }

  return (
    <Flex gap="small" wrap alignItems="center">
      {activeStatuses.map(({ key, label }) => (
        <Badge
          key={key}
          tone="accent"
          UNSAFE_className={css({
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8,
            },
          })}
        >
          <Flex gap="xsmall" alignItems="center">
            <Text size="small">{label}</Text>
            <Box
              role="button"
              tabIndex={0}
              onClick={() => {
                onFiltersChange({
                  ...filters,
                  status: {
                    ...filters.status,
                    [key]: false,
                  },
                });
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onFiltersChange({
                    ...filters,
                    status: {
                      ...filters.status,
                      [key]: false,
                    },
                  });
                }
              }}
              UNSAFE_className={css({
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              })}
            >
              <Icon src={xIcon} size="small" />
            </Box>
          </Flex>
        </Badge>
      ))}
    </Flex>
  );
}
