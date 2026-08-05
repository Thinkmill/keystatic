import {
  act,
  fireEvent,
  firePress,
  renderWithProvider,
  within,
} from '#test-utils';
import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import {
  Picker,
  PickerCollection,
  PickerHeader,
  PickerItem,
  PickerLoadMoreItem,
  PickerSection,
} from '..';

describe('picker/Picker', () => {
  let clientWidth: jest.SpiedGetter<number>;
  let clientHeight: jest.SpiedGetter<number>;

  beforeAll(() => {
    clientWidth = jest
      .spyOn(window.HTMLElement.prototype, 'clientWidth', 'get')
      .mockImplementation(() => 1000);
    clientHeight = jest
      .spyOn(window.HTMLElement.prototype, 'clientHeight', 'get')
      .mockImplementation(() => 1000);
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    global.IntersectionObserver = jest.fn(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      takeRecords: jest.fn(),
      unobserve: jest.fn(),
    })) as unknown as typeof IntersectionObserver;
    jest.useFakeTimers();
  });

  afterAll(() => {
    clientWidth.mockRestore();
    clientHeight.mockRestore();
    jest.useRealTimers();
  });

  function openPicker(result: ReturnType<typeof renderWithProvider>) {
    let button = result.getByRole('button');
    fireEvent.keyDown(button, { key: 'ArrowDown' });
    act(() => jest.runAllTimers());
    return result.getByRole('listbox');
  }

  it('renders a static collection and selects an item', () => {
    let onChange = jest.fn();
    let result = renderWithProvider(
      <Picker label="Animal" onChange={onChange}>
        <PickerItem id="echidna">Echidna</PickerItem>
        <PickerItem id="quokka">Quokka</PickerItem>
      </Picker>
    );

    let button = result.getByRole('button');
    expect(button).toHaveAttribute('aria-haspopup', 'listbox');
    expect(button).toHaveTextContent('Select an option…');

    let listbox = openPicker(result);
    let options = within(listbox).getAllByRole('option');
    expect(options).toHaveLength(2);
    firePress(options[1]);
    act(() => jest.runAllTimers());

    expect(onChange).toHaveBeenCalledWith('quokka');
    expect(button).toHaveTextContent('Quokka');
    expect(result.queryByRole('listbox')).toBeNull();
  });

  it('renders a dynamic collection', () => {
    let items = [
      { id: 1, name: 'Echidna' },
      { id: 2, name: 'Quokka' },
    ];
    let result = renderWithProvider(
      <Picker label="Animal" items={items}>
        {item => <PickerItem>{item.name}</PickerItem>}
      </Picker>
    );

    let options = within(openPicker(result)).getAllByRole('option');
    expect(options).toHaveLength(2);
    expect(options[1]).toHaveTextContent('Quokka');
  });

  it('renders explicit sections and nested collections', () => {
    let sections = [
      {
        id: 'marsupials',
        name: 'Marsupials',
        children: [
          { id: 'bilby', name: 'Bilby' },
          { id: 'quokka', name: 'Quokka' },
        ],
      },
      {
        id: 'other',
        name: 'Other',
        children: [{ id: 'echidna', name: 'Echidna' }],
      },
    ];
    let result = renderWithProvider(
      <Picker label="Animal" items={sections}>
        {section => (
          <PickerSection id={section.id}>
            <PickerHeader>{section.name}</PickerHeader>
            <PickerCollection items={section.children}>
              {item => <PickerItem>{item.name}</PickerItem>}
            </PickerCollection>
          </PickerSection>
        )}
      </Picker>
    );

    let listbox = openPicker(result);
    expect(within(listbox).getAllByRole('group')).toHaveLength(2);
    expect(within(listbox).getAllByRole('option')).toHaveLength(3);
    expect(within(listbox).getByText('Marsupials')).toBeVisible();
  });

  it('supports keyboard opening and selection', () => {
    let onChange = jest.fn();
    let result = renderWithProvider(
      <Picker label="Animal" onChange={onChange}>
        <PickerItem id="echidna">Echidna</PickerItem>
        <PickerItem id="quokka">Quokka</PickerItem>
      </Picker>
    );
    let button = result.getByRole('button');

    fireEvent.keyDown(button, { key: 'ArrowDown' });
    act(() => jest.runAllTimers());
    let options = within(result.getByRole('listbox')).getAllByRole('option');
    expect(document.activeElement).toBe(options[0]);
    fireEvent.keyDown(options[0], { key: 'ArrowDown' });
    fireEvent.keyDown(options[1], { key: 'Enter' });
    act(() => jest.runAllTimers());

    expect(onChange).toHaveBeenCalledWith('quokka');
  });

  it('forwards field state and native form props', () => {
    let result = renderWithProvider(
      <Picker
        label="Animal"
        name="animal"
        isDisabled
        isRequired
        description="Choose an animal"
      >
        <PickerItem id="echidna">Echidna</PickerItem>
      </Picker>
    );

    expect(result.getByRole('button')).toBeDisabled();
    expect(result.getByText('Choose an animal')).toBeVisible();
    let select = result.getByRole('combobox', { hidden: true });
    expect(select).toHaveAttribute('name', 'animal');
    expect(select).toBeRequired();
  });

  it('renders an explicit loading item', () => {
    let result = renderWithProvider(
      <Picker label="Animal">
        <PickerItem id="echidna">Echidna</PickerItem>
        <PickerLoadMoreItem isLoading />
      </Picker>
    );

    openPicker(result);
    expect(result.getByRole('progressbar')).toHaveAttribute(
      'aria-label',
      'Loading more…'
    );
  });
});
