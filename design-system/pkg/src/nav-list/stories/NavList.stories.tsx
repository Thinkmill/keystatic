import { Icon } from '@keystar/ui/icon';
import { homeIcon } from '@keystar/ui/icon/icons/homeIcon';
import { mailsIcon } from '@keystar/ui/icon/icons/mailsIcon';
import { tagIcon } from '@keystar/ui/icon/icons/tagIcon';
import { Box, Divider } from '@keystar/ui/layout';
import { Emoji, Text } from '@keystar/ui/typography';

import { NavList, NavGroup, NavItem } from '..';

export default {
  title: 'Components/NavList',
};

export const Default = () => (
  <NavList width="alias.singleLineWidth">
    <NavItem href="#">Item</NavItem>
  </NavList>
);

Default.story = {
  name: 'default',
};

export const Current = () => (
  <NavList width="alias.singleLineWidth">
    <NavItem href="#" aria-current="page">
      Current item
    </NavItem>
    <NavItem href="#">Other item</NavItem>
  </NavList>
);

Current.story = {
  name: 'current',
};

export const LongLabels = () => (
  <NavList width="alias.singleLineWidth">
    <NavItem href="#" aria-current="page">
      <Text>Labels should be concise, but may wrap when necessary</Text>
    </NavItem>
    <NavItem href="#">
      <Text truncate>User-generated labels may need to be truncated</Text>
    </NavItem>
  </NavList>
);

LongLabels.story = {
  name: 'long labels',
};

export const Icons = () => (
  <NavList width="alias.singleLineWidth">
    <NavItem href="#" aria-current="page">
      <Icon src={homeIcon} />
      <Text>Home</Text>
    </NavItem>
    <NavItem href="#">
      <Icon src={mailsIcon} />
      <Text>Orders</Text>
    </NavItem>
    <NavItem href="#">
      <Icon src={tagIcon} />
      <Text>Products</Text>
    </NavItem>
  </NavList>
);

Icons.story = {
  name: 'icons',
};

export const Dividers = () => (
  <NavList width="alias.singleLineWidth">
    <NavItem href="#">Top</NavItem>
    <Divider />
    <NavItem href="#" aria-current="page">
      Item 1A
    </NavItem>
    <NavItem href="#">Item 2A</NavItem>
    <NavItem href="#">Item 3A</NavItem>
    <Divider />
    <NavItem href="#">Item 1B</NavItem>
    <NavItem href="#">Item 2B</NavItem>
    <NavItem href="#">Item 3B</NavItem>
  </NavList>
);

Dividers.story = {
  name: 'dividers',
};

export const Groups = () => (
  <NavList width="alias.singleLineWidth">
    <NavItem href="#">Item outside above</NavItem>
    <NavGroup title="Text only group">
      <NavItem href="#" aria-current="page">
        Item 1A
      </NavItem>
      <NavItem href="#">Item 2A</NavItem>
      <NavItem href="#">Item 3A</NavItem>
    </NavGroup>
    <NavGroup title="Group with icons">
      <NavItem href="#">
        <Icon src={homeIcon} />
        <Text>Item 1B</Text>
      </NavItem>
      <NavItem href="#">
        <Icon src={mailsIcon} />
        <Text>Item 2B</Text>
      </NavItem>
      <NavItem href="#">
        <Icon src={tagIcon} />
        <Text>Item 3B</Text>
      </NavItem>
    </NavGroup>
    <NavItem href="#">Item outside below</NavItem>
  </NavList>
);

Groups.story = {
  name: 'groups',
};

export const Custom = () => (
  <NavList maxWidth="100%" UNSAFE_style={{ width: 360 }}>
    <NavItem href="#" aria-current="page">
      <Emoji symbol="🎨" />
      <Text flex>Custom item 1</Text>
    </NavItem>
    <NavItem href="#">
      <Emoji symbol="📚" />
      <Text flex>Custom item 2</Text>

      <Box
        backgroundColor="criticalEmphasis"
        borderRadius="full"
        UNSAFE_style={{ height: 8, width: 8 }}
      >
        <Text visuallyHidden>Danger</Text>
      </Box>
    </NavItem>
  </NavList>
);

Custom.story = {
  name: 'custom',
};
