import { Badge } from '@keystar/ui/badge';
import { ActionButton } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { plusIcon } from '@keystar/ui/icon/icons/plusIcon';
import { Flex } from '@keystar/ui/layout';
import { Text } from '@keystar/ui/typography';

import { Config } from '../..';
import { DashboardCard, DashboardGrid, DashboardSection } from './components';
import { useChanged } from '../shell/data';
import { useLocalizedString } from '../shell/i18n';
import { keyedEntries, pluralize } from '../utils';

export function CollectionSection(props: { config: Config; basePath: string }) {
  let localizedString = useLocalizedString();
  let changed = useChanged();
  let collections = keyedEntries(props.config.collections ?? {});

  return (
    <DashboardSection title="Collections">
      <DashboardGrid>
        {collections.map(collection => {
          let counts = changed.collections.get(collection.key);
          let totalCount = counts?.totalCount ?? 0;
          let changes = counts
            ? counts.added.size + counts.changed.size + counts.removed.size
            : 0;

          return (
            <DashboardCard
              key={collection.key}
              label={collection.label}
              href={`${props.basePath}/collection/${encodeURIComponent(
                collection.key
              )}`}
              endElement={
                <ActionButton
                  aria-label={localizedString.format('add')}
                  href={`${props.basePath}/collection/${encodeURIComponent(
                    collection.key
                  )}/create`}
                >
                  <Icon src={plusIcon} />
                </ActionButton>
              }
            >
              <Flex
                gap="regular"
                alignItems="center"
                minHeight="element.small"
                flex
                wrap
              >
                <Text>
                  {pluralize(totalCount, {
                    singular: 'entry',
                    plural: 'entries',
                  })}
                </Text>
                {changes > 0 && (
                  <Badge tone="accent">
                    {pluralize(changes, {
                      singular: 'change',
                      plural: 'changes',
                    })}
                  </Badge>
                )}
              </Flex>
            </DashboardCard>
          );
        })}
      </DashboardGrid>
    </DashboardSection>
  );
}
