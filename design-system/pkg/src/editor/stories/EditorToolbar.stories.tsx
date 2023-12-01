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
import { Key, useState } from 'react';

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
  return (
    <EditorToolbar aria-label="Formatting options">
      <EditorToolbarGroup aria-label="Text formatting">
        <EditorToolbarButton aria-label="bold">
          <Icon src={boldIcon} />
        </EditorToolbarButton>
        <EditorToolbarButton aria-label="italic">
          <Icon src={italicIcon} />
        </EditorToolbarButton>
        <EditorToolbarButton aria-label="strikethrough">
          <Icon src={strikethroughIcon} />
        </EditorToolbarButton>
      </EditorToolbarGroup>
    </EditorToolbar>
  );
};
Default.storyName = 'default';

function multiSelect<T>(key: T) {
  return (previous: T[]) => {
    if (previous.includes(key)) {
      return previous.filter(existingKey => existingKey !== key);
    } else {
      return previous.concat(key);
    }
  };
}
function singleSelect<T>(key: T) {
  return (previous: T | null) => {
    if (previous === key) {
      return null;
    } else {
      return key;
    }
  };
}

export const Groups = () => {
  let [inlineMarks, setInlineMarks] = useState<Key[]>([]);
  let [list, setList] = useState<Key | null>(null);
  let [code, setCode] = useState<Key | null>(null);

  return (
    <EditorToolbar aria-label="Formatting options">
      <EditorToolbarGroup
        selectionMode="multiple"
        aria-label="Text formatting"
        value={inlineMarks}
        onChange={key => setInlineMarks(multiSelect(key))}
      >
        <EditorToolbarItem value="bold" aria-label="bold">
          <Icon src={boldIcon} />
        </EditorToolbarItem>
        <EditorToolbarItem value="italic" aria-label="italic">
          <Icon src={italicIcon} />
        </EditorToolbarItem>
        <EditorToolbarItem value="strikethrough" aria-label="strikethrough">
          <Icon src={strikethroughIcon} />
        </EditorToolbarItem>
      </EditorToolbarGroup>

      <EditorToolbarSeparator />

      <EditorToolbarButton aria-label="link">
        <Icon src={linkIcon} />
      </EditorToolbarButton>

      <EditorToolbarSeparator />

      <EditorToolbarGroup
        selectionMode="single"
        aria-label="Lists"
        value={list}
        onChange={key => setList(singleSelect(key))}
      >
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

      <EditorToolbarGroup
        selectionMode="single"
        aria-label="Code formatting"
        value={code}
        onChange={key => setCode(singleSelect(key))}
      >
        <EditorToolbarItem value="code" aria-label="Code">
          <Icon src={code2Icon} />
        </EditorToolbarItem>
        <EditorToolbarItem value="code-block" aria-label="Code block">
          <Icon src={fileCodeIcon} />
        </EditorToolbarItem>
      </EditorToolbarGroup>
    </EditorToolbar>
  );
};
Groups.storyName = 'groups';

export const FocusStops = () => {
  let [disabledButton, setDisabledButton] = useState(false);
  return (
    <Flex direction="column" gap="large" alignItems="start">
      <button onClick={() => setDisabledButton(bool => !!bool)}>before</button>
      <EditorToolbar aria-label="Formatting options">
        <EditorToolbarGroup aria-label="Text formatting">
          <EditorToolbarButton aria-label="bold">
            <Icon src={boldIcon} />
          </EditorToolbarButton>
          <EditorToolbarButton aria-label="italic">
            <Icon src={italicIcon} />
          </EditorToolbarButton>
          <EditorToolbarButton
            aria-label="strikethrough"
            isDisabled={disabledButton}
          >
            <Icon src={strikethroughIcon} />
          </EditorToolbarButton>
        </EditorToolbarGroup>

        <EditorToolbarSeparator />

        <EditorToolbarButton aria-label="link">
          <Icon src={linkIcon} />
        </EditorToolbarButton>
      </EditorToolbar>
      <button>after</button>
    </Flex>
  );
};
FocusStops.storyName = 'focus stops';

export const Tooltips = () => {
  return (
    <EditorToolbar aria-label="Formatting options">
      <EditorToolbarGroup aria-label="Text formatting">
        <TooltipTrigger>
          <EditorToolbarButton aria-label="bold">
            <Icon src={boldIcon} />
          </EditorToolbarButton>
          <Tooltip>
            <Text>Bold</Text>
            <Kbd meta>B</Kbd>
          </Tooltip>
        </TooltipTrigger>
        <TooltipTrigger>
          <EditorToolbarButton aria-label="italic">
            <Icon src={italicIcon} />
          </EditorToolbarButton>
          <Tooltip>
            <Text>Italic</Text>
            <Kbd meta>I</Kbd>
          </Tooltip>
        </TooltipTrigger>
        <TooltipTrigger>
          <EditorToolbarButton aria-label="strikethrough">
            <Icon src={strikethroughIcon} />
          </EditorToolbarButton>
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

      <EditorToolbarGroup aria-label="Lists">
        <TooltipTrigger>
          <EditorToolbarButton aria-label="bulleted list">
            <Icon src={listIcon} />
          </EditorToolbarButton>
          <Tooltip>
            <Text>Bulleted list</Text>
            <Kbd meta shift>
              8
            </Kbd>
          </Tooltip>
        </TooltipTrigger>
        <TooltipTrigger>
          <EditorToolbarButton aria-label="numbered list">
            <Icon src={listOrderedIcon} />
          </EditorToolbarButton>
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
        <EditorToolbarButton aria-label="Blockquote" isDisabled>
          <Icon src={indentIcon} />
        </EditorToolbarButton>
        <Tooltip>Blockquote</Tooltip>
      </TooltipTrigger>

      <EditorToolbarSeparator />

      <EditorToolbarGroup aria-label="Code formatting">
        <TooltipTrigger>
          <EditorToolbarButton aria-label="Code" isSelected={false}>
            <Icon src={code2Icon} />
          </EditorToolbarButton>
          <Tooltip>Code</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger>
          <EditorToolbarButton aria-label="Code block">
            <Icon src={fileCodeIcon} />
          </EditorToolbarButton>
          <Tooltip>Code block</Tooltip>
        </TooltipTrigger>
      </EditorToolbarGroup>
    </EditorToolbar>
  );
};
Tooltips.storyName = 'tooltips';
