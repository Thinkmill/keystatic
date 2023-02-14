import { storiesOf } from '@voussoir/storybook';
import { Icon } from '@voussoir/icon';
import { homeIcon } from '@voussoir/icon/icons/homeIcon';
import { mailsIcon } from '@voussoir/icon/icons/mailsIcon';
import { tagIcon } from '@voussoir/icon/icons/tagIcon';
import { Box, Divider } from '@voussoir/layout';
import { Emoji, Text } from '@voussoir/typography';

import { NavList, NavGroup, NavItem } from '../src';

storiesOf('Components/NavList', module)
  .add('default', () => (
    <NavList width="size.alias.singleLineWidth">
      <NavItem href="#">Item</NavItem>
    </NavList>
  ))
  .add('current', () => (
    <NavList width="size.alias.singleLineWidth">
      <NavItem href="#" aria-current="page">
        Current item
      </NavItem>
      <NavItem href="#">Other item</NavItem>
    </NavList>
  ))
  .add('long labels', () => (
    <NavList width="size.alias.singleLineWidth">
      <NavItem href="#" aria-current="page">
        <Text>Labels should be concise, but may wrap when necessary</Text>
      </NavItem>
      <NavItem href="#">
        <Text truncate>User-generated labels may need to be truncated</Text>
      </NavItem>
    </NavList>
  ))
  .add('icons', () => (
    <NavList width="size.alias.singleLineWidth">
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
  ))
  .add('dividers', () => (
    <NavList width="size.alias.singleLineWidth">
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
  ))
  .add('groups', () => (
    <NavList width="size.alias.singleLineWidth">
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
  ))
  .add('custom', () => (
    <NavList width={360} maxWidth="100%">
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
          height={8}
          width={8}
        >
          <Text visuallyHidden>Danger</Text>
        </Box>
      </NavItem>
    </NavList>
  ));
