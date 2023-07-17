import { Badge } from '@keystar/ui/badge';
import { Flex } from '@keystar/ui/layout';

import { Config } from '../..';
import { DashboardCard, DashboardGrid, DashboardSection } from './components';
import { useChanged } from '../shell/data';
import { keyedEntries } from '../utils';

export function SingletonSection(props: { config: Config; basePath: string }) {
  let changed = useChanged();
  let singletons = keyedEntries(props.config.singletons ?? {});

  return (
    <DashboardSection title="Singletons">
      <DashboardGrid>
        {singletons.map(singleton => {
          let changes = changed.singletons.has(singleton.key);

          return (
            <DashboardCard
              key={singleton.key}
              label={singleton.label}
              href={`${props.basePath}/singleton/${encodeURIComponent(
                singleton.key
              )}`}
            >
              <Flex
                gap="regular"
                alignItems="center"
                minHeight="element.small"
                flex
                wrap
              >
                {changes ? (
                  <Badge tone="accent">Changed</Badge>
                ) : (
                  <Badge>Unchanged</Badge>
                )}
              </Flex>
            </DashboardCard>
          );
        })}
      </DashboardGrid>
    </DashboardSection>
  );
}
