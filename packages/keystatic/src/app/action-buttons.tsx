import { Key, useState } from 'react';
import { MenuTrigger, Menu, Item } from '@keystar/ui/menu';
import { ActionButton } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { Text } from '@keystar/ui/typography';
import { toastQueue } from '@keystar/ui/toast';
import { zapIcon } from '@keystar/ui/icon/icons/zapIcon';
import { Tooltip, TooltipTrigger } from '@keystar/ui/tooltip';

import type { Action, StorageInfo } from '../hooks';
import { buildActionContext } from '../hooks';

type ActionButtonsProps = {
  actions: Action[];
  collection?: string;
  singleton?: string;
  slug?: string;
  data: Record<string, unknown>;
  storage: StorageInfo;
  onUpdate: (data: Partial<Record<string, unknown>>) => Promise<void>;
};

export function ActionButtons(props: ActionButtonsProps) {
  const { actions, collection, singleton, slug, data, storage, onUpdate } =
    props;
  const [isRunning, setIsRunning] = useState(false);

  if (actions.length === 0) return null;

  const menuItems = actions.map((action, index) => ({
    key: `action-${index}`,
    label: action.label,
    description: action.description,
  }));

  return (
    <MenuTrigger>
      <TooltipTrigger>
        <ActionButton prominence="low" isDisabled={isRunning}>
          <Icon src={zapIcon} />
        </ActionButton>
        <Tooltip>Actions</Tooltip>
      </TooltipTrigger>
      <Menu
        items={menuItems}
        onAction={(key: Key) => {
          const index = menuItems.findIndex(i => i.key === key);
          if (index < 0) return;
          const action = actions[index];

          setIsRunning(true);

          const ctx = buildActionContext({
            collection,
            singleton,
            slug,
            data,
            storage,
            update: onUpdate,
          });

          action
            .handler(ctx)
            .then(result => {
              if (result && 'message' in result) {
                toastQueue.positive(result.message, { timeout: 5000 });
              }
              if (result && 'error' in result) {
                toastQueue.critical(result.error, { timeout: 5000 });
              }
            })
            .catch(err => {
              toastQueue.critical(`Action failed: ${err.message}`, {
                timeout: 5000,
              });
            })
            .finally(() => {
              setIsRunning(false);
            });
        }}
      >
        {(item: (typeof menuItems)[number]) => (
          <Item key={item.key} textValue={item.label}>
            <Text>{item.label}</Text>
            {item.description && (
              <Text slot="description">{item.description}</Text>
            )}
          </Item>
        )}
      </Menu>
    </MenuTrigger>
  );
}
