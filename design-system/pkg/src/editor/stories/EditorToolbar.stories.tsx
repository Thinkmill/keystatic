import { Icon } from '@keystar/ui/icon';
import { boldIcon } from '@keystar/ui/icon/icons/boldIcon';
import { code2Icon } from '@keystar/ui/icon/icons/code2Icon';
import { fileCodeIcon } from '@keystar/ui/icon/icons/fileCodeIcon';
import { indentIcon } from '@keystar/ui/icon/icons/indentIcon';
import { italicIcon } from '@keystar/ui/icon/icons/italicIcon';
import { strikethroughIcon } from '@keystar/ui/icon/icons/strikethroughIcon';
import { linkIcon } from '@keystar/ui/icon/icons/linkIcon';
import { listIcon } from '@keystar/ui/icon/icons/listIcon';
import { listOrderedIcon } from '@keystar/ui/icon/icons/listOrderedIcon';
import { Flex } from '@keystar/ui/layout';
import { TooltipTrigger, Tooltip } from '@keystar/ui/tooltip';
import { Kbd, Text } from '@keystar/ui/typography';
import { useState } from 'react';

import {
  EditorToolbar,
  EditorToolbarButton,
  EditorToolbarGroup,
  EditorToolbarItem,
  EditorToolbarSeparator,
} from '..';

export default {
  title: 'Editor/Toolbar',
};

export const Default = () => {
  let [visible, setVisible] = useState(true);
  return (
    <Flex direction="column" gap="large" alignItems="start">
      <button onClick={() => setVisible(b => !b)}>before</button>
      <EditorToolbar aria-label="Formatting options">
        <EditorToolbarGroup
          selectionMode="multiple"
          aria-label="Text formatting"
        >
          <EditorToolbarItem value="bold" aria-label="bold">
            <Icon src={boldIcon} />
          </EditorToolbarItem>
          <EditorToolbarItem value="italic" aria-label="italic">
            <Icon src={italicIcon} />
          </EditorToolbarItem>
          <EditorToolbarItem
            value="strikethrough"
            aria-label="strikethrough"
            isDisabled={visible}
          >
            <Icon src={strikethroughIcon} />
          </EditorToolbarItem>
        </EditorToolbarGroup>

        <EditorToolbarSeparator />

        <EditorToolbarButton aria-label="link">
          <Icon src={linkIcon} />
        </EditorToolbarButton>

        <EditorToolbarSeparator />

        <EditorToolbarGroup selectionMode="single" aria-label="Lists">
          <EditorToolbarItem value="bulleted" aria-label="bulleted list">
            <Icon src={listIcon} />
          </EditorToolbarItem>
          <EditorToolbarItem value="numbered" aria-label="numbered list">
            <Icon src={listOrderedIcon} />
          </EditorToolbarItem>
        </EditorToolbarGroup>

        <EditorToolbarSeparator />

        <EditorToolbarButton aria-label="Blockquote">
          <Icon src={indentIcon} />
        </EditorToolbarButton>

        <EditorToolbarSeparator />

        <EditorToolbarGroup selectionMode="single" aria-label="Code formatting">
          <EditorToolbarItem value="code" aria-label="Code">
            <Icon src={code2Icon} />
          </EditorToolbarItem>
          <EditorToolbarItem value="code-block" aria-label="Code block">
            <Icon src={fileCodeIcon} />
          </EditorToolbarItem>
        </EditorToolbarGroup>
      </EditorToolbar>
      <button>after</button>
    </Flex>
  );
};

Default.story = {
  name: 'default',
};

export const Tooltips = () => {
  let [visible, setVisible] = useState(true);
  return (
    <Flex direction="column" gap="large" alignItems="start">
      <button onClick={() => setVisible(b => !b)}>before</button>
      <EditorToolbar aria-label="Formatting options">
        <EditorToolbarGroup
          selectionMode="multiple"
          aria-label="Text formatting"
        >
          <TooltipTrigger>
            <EditorToolbarItem value="bold" aria-label="bold">
              <Icon src={boldIcon} />
            </EditorToolbarItem>
            <Tooltip>
              <Text>Bold</Text>
              <Kbd meta>B</Kbd>
            </Tooltip>
          </TooltipTrigger>
          <TooltipTrigger>
            <EditorToolbarItem value="italic" aria-label="italic">
              <Icon src={italicIcon} />
            </EditorToolbarItem>
            <Tooltip>
              <Text>Italic</Text>
              <Kbd meta>I</Kbd>
            </Tooltip>
          </TooltipTrigger>
          <TooltipTrigger>
            <EditorToolbarItem
              value="strikethrough"
              aria-label="strikethrough"
              isDisabled={visible}
            >
              <Icon src={strikethroughIcon} />
            </EditorToolbarItem>
            <Tooltip>Strikethrough</Tooltip>
          </TooltipTrigger>
        </EditorToolbarGroup>

        <EditorToolbarSeparator />

        <TooltipTrigger>
          <EditorToolbarButton aria-label="link">
            <Icon src={linkIcon} />
          </EditorToolbarButton>
          <Tooltip>
            <Text>Link</Text>
            <Kbd meta>K</Kbd>
          </Tooltip>
        </TooltipTrigger>

        <EditorToolbarSeparator />

        <EditorToolbarGroup selectionMode="single" aria-label="Lists">
          <TooltipTrigger>
            <EditorToolbarItem value="bulleted" aria-label="bulleted list">
              <Icon src={listIcon} />
            </EditorToolbarItem>
            <Tooltip>
              <Text>Bulleted list</Text>
              <Kbd meta shift>
                8
              </Kbd>
            </Tooltip>
          </TooltipTrigger>
          <TooltipTrigger>
            <EditorToolbarItem value="numbered" aria-label="numbered list">
              <Icon src={listOrderedIcon} />
            </EditorToolbarItem>
            <Tooltip>
              <Text>Numbered list</Text>
              <Kbd meta shift>
                7
              </Kbd>
            </Tooltip>
          </TooltipTrigger>
        </EditorToolbarGroup>

        <EditorToolbarSeparator />

        <TooltipTrigger>
          <EditorToolbarButton aria-label="Blockquote">
            <Icon src={indentIcon} />
          </EditorToolbarButton>
          <Tooltip>Blockquote</Tooltip>
        </TooltipTrigger>

        <EditorToolbarSeparator />

        <EditorToolbarGroup selectionMode="single" aria-label="Code formatting">
          <TooltipTrigger>
            <EditorToolbarItem value="code" aria-label="Code">
              <Icon src={code2Icon} />
            </EditorToolbarItem>
            <Tooltip>Code</Tooltip>
          </TooltipTrigger>
          <TooltipTrigger>
            <EditorToolbarItem value="code-block" aria-label="Code block">
              <Icon src={fileCodeIcon} />
            </EditorToolbarItem>
            <Tooltip>Code block</Tooltip>
          </TooltipTrigger>
        </EditorToolbarGroup>
      </EditorToolbar>
      <button>after</button>
    </Flex>
  );
};

Tooltips.story = {
  name: 'tooltips',
};
