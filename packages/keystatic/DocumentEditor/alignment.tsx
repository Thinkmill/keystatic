import { Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

import { Item } from '@voussoir/action-group';
import { ActionButton } from '@voussoir/button';
import { alignLeftIcon } from '@voussoir/icon/icons/alignLeftIcon';
import { alignRightIcon } from '@voussoir/icon/icons/alignRightIcon';
import { alignCenterIcon } from '@voussoir/icon/icons/alignCenterIcon';
import { chevronDownIcon } from '@voussoir/icon/icons/chevronDownIcon';
import { Icon } from '@voussoir/icon';
import { Menu, MenuTrigger } from '@voussoir/menu';
import { TooltipTrigger, Tooltip } from '@voussoir/tooltip';
import { Text } from '@voussoir/typography';

import { DocumentFeatures } from './document-features';
import { useToolbarState } from './toolbar-state';
import { useMemo } from 'react';

const values = {
  start: {
    key: 'start',
    label: 'Align Start',
    icon: <Icon src={alignLeftIcon} />,
  },
  center: {
    key: 'center',
    label: 'Align Center',
    icon: <Icon src={alignCenterIcon} />,
  },
  end: {
    key: 'end',
    label: 'Align End',
    icon: <Icon src={alignRightIcon} />,
  },
};

export const TextAlignMenu = ({
  alignment,
}: {
  alignment: DocumentFeatures['formatting']['alignment'];
}) => {
  const toolbarState = useToolbarState();
  const items = useMemo(
    () => [
      values.start,
      ...(Object.keys(alignment) as Array<keyof typeof alignment>).map(
        x => values[x]
      ),
    ],
    [alignment]
  );
  return useMemo(
    () => (
      <MenuTrigger>
        <TooltipTrigger>
          <ActionButton prominence="low">
            {values[toolbarState.alignment.selected].icon}
            <Icon src={chevronDownIcon} />
          </ActionButton>
          <Tooltip>
            <Text>Text Alignment</Text>
          </Tooltip>
        </TooltipTrigger>
        <Menu
          selectionMode="single"
          selectedKeys={[toolbarState.alignment.selected]}
          items={items}
          onAction={key => {
            if (key === 'start') {
              Transforms.unsetNodes(toolbarState.editor, 'textAlign', {
                match: node =>
                  node.type === 'paragraph' || node.type === 'heading',
              });
            } else {
              Transforms.setNodes(
                toolbarState.editor,
                { textAlign: key as 'center' | 'end' },
                {
                  match: node =>
                    node.type === 'paragraph' || node.type === 'heading',
                }
              );
            }
            ReactEditor.focus(toolbarState.editor);
          }}
        >
          {item => {
            return (
              <Item key={item.key} textValue={item.label}>
                <Text>{item.label}</Text>
                {item.icon}
              </Item>
            );
          }}
        </Menu>
      </MenuTrigger>
    ),
    [items, toolbarState.alignment.selected, toolbarState.editor]
  );
};
