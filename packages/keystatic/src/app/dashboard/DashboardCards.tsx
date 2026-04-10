import { Badge } from '@keystar/ui/badge';
import { ActionButton } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { plusIcon } from '@keystar/ui/icon/icons/plusIcon';
import { Divider, Flex } from '@keystar/ui/layout';
import { Text } from '@keystar/ui/typography';

import { ItemOrGroup, useNavItems } from '../useNavItems';
import { pluralize } from '../pluralize';
import {
  DashboardCard,
  DashboardGrid,
  DashboardSection,
  FILL_COLS,
} from './components';

export function DashboardCards() {
  const navItems = useNavItems();
  const hasSections = navItems.some(item => 'children' in item);
  let dividerCount = 0;
  const items = navItems.map(item => renderItemOrGroup(item, () => dividerCount++));

  return hasSections ? (
    <>{items}</>
  ) : (
    <DashboardSection title="Content">
      <DashboardGrid>{items}</DashboardGrid>
    </DashboardSection>
  );
}

function renderItemOrGroup(
  itemOrGroup: ItemOrGroup,
  getNextDividerCount: () => number
) {
  if (itemOrGroup.isDivider) {
    return (
      <Flex key={`divider-${getNextDividerCount()}`} gridColumn={FILL_COLS}>
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
      <DashboardSection
        key={itemOrGroup.title}
        title={itemOrGroup.title}
        endElement={
          itemOrGroup.createHref ? (
            <ActionButton
              aria-label={`Create in ${itemOrGroup.title}`}
              href={itemOrGroup.createHref}
            >
              <Icon src={plusIcon} />
            </ActionButton>
          ) : undefined
        }
      >
        <DashboardGrid>
          {itemOrGroup.children.map(child =>
            renderItemOrGroup(child, getNextDividerCount)
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
        {pluralize(itemOrGroup.changed, {
          singular: 'change',
          plural: 'changes',
        })}
      </Badge>
    ) : (
      <Badge tone="accent">Changed</Badge>
    );
  })();

  let endElement = (() => {
    if (
      typeof itemOrGroup.entryCount !== 'number' ||
      itemOrGroup.itemKind !== 'collection'
    ) {
      return changeElement;
    }

    return (
      <Flex gap="medium" alignItems="center">
        {changeElement}
        <ActionButton aria-label="Add" href={`${itemOrGroup.href}/create`}>
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
      {itemOrGroup.itemKind === 'action' ? (
        <Text
          color="neutralSecondary"
          size="small"
          UNSAFE_style={{ lineHeight: '1.7' }}
        >
          Open the standalone page builder.
        </Text>
      ) : typeof itemOrGroup.entryCount === 'number' ? (
        <Text
          color="neutralSecondary"
          size="small"
          UNSAFE_style={{ lineHeight: '1.7' }}
        >
          {pluralize(itemOrGroup.entryCount, {
            singular: 'entry',
            plural: 'entries',
          })}
        </Text>
      ) : null}
    </DashboardCard>
  );
}
