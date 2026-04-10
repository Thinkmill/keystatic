import { useMemo } from 'react';

import { ActionGroup, Item } from '@keystar/ui/action-group';
import { Icon } from '@keystar/ui/icon';
import { layoutGridIcon } from '@keystar/ui/icon/icons/layoutGridIcon';
import { tableIcon } from '@keystar/ui/icon/icons/tableIcon';
import { Tooltip, TooltipTrigger } from '@keystar/ui/tooltip';

export type ViewMode = 'table' | 'grid';

type ViewModeToggleProps = {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
};

export function ViewModeToggle({ value, onChange }: ViewModeToggleProps) {
  const items = useMemo(
    () => [
      { key: 'table', label: 'Table view', icon: tableIcon },
      { key: 'grid', label: 'Grid view', icon: layoutGridIcon },
    ],
    []
  );

  return (
    <ActionGroup
      aria-label="View mode"
      selectionMode="single"
      selectedKeys={[value]}
      onSelectionChange={keys => {
        const selected = [...keys][0] as ViewMode;
        if (selected) {
          onChange(selected);
        }
      }}
      density="compact"
    >
      {items.map(item => (
        <Item key={item.key} aria-label={item.label}>
          <TooltipTrigger>
            <Icon src={item.icon} />
            <Tooltip>{item.label}</Tooltip>
          </TooltipTrigger>
        </Item>
      ))}
    </ActionGroup>
  );
}
