import '@testing-library/jest-dom';
import { renderWithProvider } from '@voussoir/test-utils';

import { Combobox, Item } from '../src';

describe('combobox/Combobox', () => {
  it('renders', () => {
    const { queryByText } = renderWithProvider(
      <Combobox label="Combobox">
        <Item key="one">Item one</Item>
        <Item key="two">Item two</Item>
        <Item key="three">Item three</Item>
      </Combobox>
    );

    expect(queryByText('Item one')).toBeTruthy();
  });
});
