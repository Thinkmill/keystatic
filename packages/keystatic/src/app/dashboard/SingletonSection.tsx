import { Badge } from '@keystar/ui/badge';

import { Config } from '../../config';
import { useChanged } from '../shell/data';
import { keyedEntries } from '../utils';
import { DashboardCard, DashboardGrid, DashboardSection } from './components';

export function SingletonSection(props: { config: Config; basePath: string }) {
  let changed = useChanged();
  let singletons = keyedEntries(props.config.singletons ?? {});

  if (singletons.length === 0) {
    return null;
  }

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
              endElement={
                changes ? (
                  <Badge tone="accent">Changed</Badge>
                ) : (
                  <Badge>Unchanged</Badge>
                )
              }
            />
          );
        })}
      </DashboardGrid>
    </DashboardSection>
  );
}
