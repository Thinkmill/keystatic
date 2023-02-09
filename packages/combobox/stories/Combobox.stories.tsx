import { storiesOf } from '@storybook/react';

import { Combobox, Item } from '../src';

storiesOf('Components/Combobox', module).add('default', () => (
  <Combobox label="Combobox">
    <Item key="one">Item one</Item>
    <Item key="two">Item two</Item>
    <Item key="three">Item three</Item>
  </Combobox>
));
