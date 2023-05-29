import { storiesOf } from '@voussoir/storybook';

import { Icon } from '@voussoir/icon';
import { boldIcon } from '@voussoir/icon/icons/boldIcon';
import { code2Icon } from '@voussoir/icon/icons/code2Icon';
import { fileCodeIcon } from '@voussoir/icon/icons/fileCodeIcon';
import { indentIcon } from '@voussoir/icon/icons/indentIcon';
import { italicIcon } from '@voussoir/icon/icons/italicIcon';
import { strikethroughIcon } from '@voussoir/icon/icons/strikethroughIcon';
import { linkIcon } from '@voussoir/icon/icons/linkIcon';
import { listIcon } from '@voussoir/icon/icons/listIcon';
import { listOrderedIcon } from '@voussoir/icon/icons/listOrderedIcon';
import { TooltipTrigger, Tooltip } from '@voussoir/tooltip';

import {
  EditorToolbar,
  EditorToolbarButton,
  EditorToolbarGroup,
  EditorToolbarItem,
  EditorToolbarSeparator,
} from '../src';
import { Kbd, Text } from '@voussoir/typography';

storiesOf('Editor/Toolbar', module).add('default', () => {
  return (
    <>
      {/* <button>before</button> */}
      <EditorToolbar aria-label="Formatting options">
        <EditorToolbarGroup
          selectionMode="multiple"
          aria-label="Text formatting"
        >
          <TooltipTrigger>
            <EditorToolbarItem value="bold" aria-label="bold" isDisabled>
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
            <EditorToolbarItem value="strikethrough" aria-label="strikethrough">
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
      {/* <button>after</button> */}
    </>
  );
});
