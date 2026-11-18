import { Badge } from '@keystar/ui/badge';
import { ActionButton } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { plusIcon } from '@keystar/ui/icon/icons/plusIcon';
import { Divider, Flex } from '@keystar/ui/layout';
import { Text } from '@keystar/ui/typography';

import { ItemOrGroup, useNavItems } from '../useNavItems';
import type { KeystaticStringFormatter } from '../l10n/default-formatter';
import { useLocalizedString } from '../shell/i18n';
import {
  DashboardCard,
  DashboardGrid,
  DashboardSection,
  FILL_COLS,
} from './components';

export function DashboardCards() {
  const navItems = useNavItems();
  const stringFormatter = useLocalizedString();
  const hasSections = navItems.some(item => 'children' in item);
  const items = navItems.map(item => renderItemOrGroup(item, stringFormatter));

  return hasSections ? (
    <>{items}</>
  ) : (
    <DashboardSection title={stringFormatter.format('content')}>
      <DashboardGrid>{items}</DashboardGrid>
    </DashboardSection>
  );
}

let dividerCount = 0;
function renderItemOrGroup(
  itemOrGroup: ItemOrGroup,
  stringFormatter: KeystaticStringFormatter
) {
  if (itemOrGroup.isDivider) {
    return (
      <Flex key={dividerCount++} gridColumn={FILL_COLS}>
        <Divider
          alignSelf="center"
          size="medium"
          width="alias.singleLineWidth"
        />
      </Flex>
    );
  }

  if (itemOrGroup.children) {
    return (
      <DashboardSection key={itemOrGroup.title} title={itemOrGroup.title}>
        <DashboardGrid>
          {itemOrGroup.children.map(child =>
            renderItemOrGroup(child, stringFormatter)
          )}
        </DashboardGrid>
      </DashboardSection>
    );
  }

  let changeElement = (() => {
    if (!itemOrGroup.changed) {
      return undefined;
    }

    return typeof itemOrGroup.changed === 'number' ? (
      <Badge tone="accent" marginStart="auto">
        {stringFormatter.format('changeCount', {
          count: itemOrGroup.changed,
        })}
      </Badge>
    ) : (
      <Badge tone="accent">{stringFormatter.format('changed')}</Badge>
    );
  })();

  let endElement = (() => {
    // entry counts are only available for collections
    if (typeof itemOrGroup.entryCount !== 'number') {
      return changeElement;
    }

    return (
      <Flex gap="medium" alignItems="center">
        {changeElement}
        <ActionButton
          aria-label={stringFormatter.format('add')}
          href={`${itemOrGroup.href}/create`}
        >
          <Icon src={plusIcon} />
        </ActionButton>
      </Flex>
    );
  })();

  return (
    <DashboardCard
      label={itemOrGroup.label}
      key={itemOrGroup.key}
      href={itemOrGroup.href}
      endElement={endElement}
    >
      {typeof itemOrGroup.entryCount === 'number' ? (
        <Text color="neutralSecondary">
          {stringFormatter.format('entryCount', {
            count: itemOrGroup.entryCount,
          })}
        </Text>
      ) : null}
    </DashboardCard>
  );
}
