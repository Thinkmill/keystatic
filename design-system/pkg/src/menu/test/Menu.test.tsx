import { globeIcon } from '@keystar/ui/icon/icons/globeIcon';
import { Icon } from '@keystar/ui/icon';
import { act, fireEvent, firePress, KEYS, render, within } from '#test-utils';
import { Kbd, Text } from '@keystar/ui/typography';
import {
  expect,
  it,
  describe,
  jest,
  afterAll,
  afterEach,
  beforeAll,
} from '@jest/globals';

import { Item, Menu, MenuProps, Section } from '..';

describe('menu/Menu', () => {
  let offsetWidth: jest.SpiedGetter<number>,
    offsetHeight: jest.SpiedGetter<number>;
  let onSelectionChange = jest.fn<(val: any) => void>();

  beforeAll(function () {
    offsetWidth = jest
      .spyOn(window.HTMLElement.prototype, 'offsetWidth', 'get')
      .mockImplementation(() => 1000);
    offsetHeight = jest
      .spyOn(window.HTMLElement.prototype, 'offsetHeight', 'get')
      .mockImplementation(() => 1000);
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1);
    jest.useFakeTimers();
  });

  afterEach(() => {
    onSelectionChange.mockClear();
  });

  afterAll(function () {
    offsetWidth.mockReset();
    offsetHeight.mockReset();
  });

  it('renders', () => {
    let tree = renderComponent();
    let menu = tree.getByRole('menu');
    expect(menu).toBeTruthy();
    expect(menu).toHaveAttribute('aria-labelledby', 'label');

    let sections = within(menu).getAllByRole('group');
    expect(sections.length).toBe(2);

    for (let section of sections) {
      expect(section).toHaveAttribute('aria-labelledby');
      let heading = document.getElementById(
        section.getAttribute('aria-labelledby')!
      );
      expect(heading).toBeTruthy();
      expect(heading).toHaveAttribute('role', 'presentation');
    }

    let dividers = within(menu).getAllByRole('separator');
    expect(dividers.length).toBe(1);

    let items = within(menu).getAllByRole('menuitem');
    expect(items.length).toBe(5);
    for (let item of items) {
      expect(item).toHaveAttribute('tabindex');
      expect(item).not.toHaveAttribute('aria-disabled');
    }
    let item1 = within(menu).getByText('Foo');
    let item2 = within(menu).getByText('Bar');
    let item3 = within(menu).getByText('Baz');
    let item4 = within(menu).getByText('Blah');
    let item5 = within(menu).getByText('Bleh');

    expect(item1).toBeTruthy();
    expect(item2).toBeTruthy();
    expect(item3).toBeTruthy();
    expect(item4).toBeTruthy();
    expect(item5).toBeTruthy();
    expect(item3).toBeTruthy();
  });

  it('allows user to change menu item focus via up/down arrow keys', () => {
    let tree = renderComponent({ autoFocus: 'first' });
    let menu = tree.getByRole('menu');
    let menuItems = within(menu).getAllByRole('menuitem');
    let selectedItem = menuItems[0];
    expect(selectedItem).toBe(document.activeElement);
    fireEvent.keyDown(selectedItem, KEYS.ArrowDown);
    let nextSelectedItem = menuItems[1];
    expect(nextSelectedItem).toBe(document.activeElement);
    fireEvent.keyDown(nextSelectedItem, KEYS.ArrowUp);
    expect(selectedItem).toBe(document.activeElement);
  });

  it('wraps focus first<-->last if `shouldFocusWrap` is true', () => {
    let tree = renderComponent({ autoFocus: 'first', shouldFocusWrap: true });
    let menu = tree.getByRole('menu');
    let menuItems = within(menu).getAllByRole('menuitem');
    let firstItem = menuItems[0];
    expect(firstItem).toBe(document.activeElement);
    fireEvent.keyDown(firstItem, KEYS.ArrowUp);
    let lastItem = menuItems[menuItems.length - 1];
    expect(lastItem).toBe(document.activeElement);
    fireEvent.keyDown(lastItem, KEYS.ArrowDown);
    expect(firstItem).toBe(document.activeElement);
  });

  describe('supports single selection', function () {
    it('supports `defaultSelectedKeys` (uncontrolled)', () => {
      let tree = renderComponent({
        selectionMode: 'single',
        onSelectionChange,
        defaultSelectedKeys: ['Blah'],
        autoFocus: 'first',
      });
      // Check that correct menu item is selected by default
      let menu = tree.getByRole('menu');
      let menuItems = within(menu).getAllByRole('menuitemradio');
      let selectedItem = menuItems[3];
      expect(selectedItem).toBe(document.activeElement);
      expect(selectedItem).toHaveAttribute('aria-checked', 'true');
      expect(selectedItem).toHaveAttribute('tabindex', '-1');
      let itemText = within(selectedItem).getByText('Blah');
      expect(itemText).toBeTruthy();
      let checkmark: HTMLElement | null = within(selectedItem).getByRole(
        'img',
        { hidden: true }
      );
      expect(checkmark).toBeTruthy();

      // Select a different menu item via enter
      let nextSelectedItem = menuItems[4];
      fireEvent.keyDown(nextSelectedItem, KEYS.Enter);
      fireEvent.keyUp(nextSelectedItem, KEYS.Enter);
      expect(nextSelectedItem).toHaveAttribute('aria-checked', 'true');
      itemText = within(nextSelectedItem).getByText('Bleh');
      expect(itemText).toBeTruthy();
      checkmark = within(nextSelectedItem).getByRole('img', { hidden: true });
      expect(checkmark).toBeTruthy();

      // Make sure there is only a single checkmark in the entire menu
      let checkmarks = tree.getAllByRole('img', { hidden: true });
      expect(checkmarks.length).toBe(1);

      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange.mock.calls[0][0].has('Bleh')).toBeTruthy();
    });

    it('supports `selectedKeys` (controlled)', () => {
      let tree = renderComponent({
        selectionMode: 'single',
        onSelectionChange,
        selectedKeys: ['Blah'],
        autoFocus: 'first',
      });
      // Check that correct menu item is selected by default
      let menu = tree.getByRole('menu');
      let menuItems = within(menu).getAllByRole('menuitemradio');
      let selectedItem = menuItems[3];
      expect(selectedItem).toBe(document.activeElement);
      expect(selectedItem).toHaveAttribute('aria-checked', 'true');
      expect(selectedItem).toHaveAttribute('tabindex', '-1');
      let itemText = within(selectedItem).getByText('Blah');
      expect(itemText).toBeTruthy();
      let checkmark: HTMLElement | null = within(selectedItem).getByRole(
        'img',
        { hidden: true }
      );
      expect(checkmark).toBeTruthy();

      // Select a different menu item via enter
      let nextSelectedItem = menuItems[4];
      fireEvent.keyDown(nextSelectedItem, KEYS.Enter);
      fireEvent.keyUp(nextSelectedItem, KEYS.Enter);
      expect(nextSelectedItem).toHaveAttribute('aria-checked', 'false');
      expect(selectedItem).toHaveAttribute('aria-checked', 'true');
      checkmark = within(selectedItem).getByRole('img', { hidden: true });
      expect(checkmark).toBeTruthy();

      // Make sure there is only a single checkmark in the entire menu
      let checkmarks = tree.getAllByRole('img', { hidden: true });
      expect(checkmarks.length).toBe(1);

      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange.mock.calls[0][0].has('Bleh')).toBeTruthy();
    });

    it('supports using space key to change item selection', () => {
      let tree = renderComponent({
        selectionMode: 'single',
        onSelectionChange,
      });
      let menu = tree.getByRole('menu');
      let menuItems = within(menu).getAllByRole('menuitemradio');

      // Trigger a menu item via space
      let item = menuItems[4];
      fireEvent.keyDown(item, KEYS.Space);
      fireEvent.keyUp(item, KEYS.Space);
      expect(item).toHaveAttribute('aria-checked', 'true');
      let checkmark: HTMLElement | null = within(item).getByRole('img', {
        hidden: true,
      });
      expect(checkmark).toBeTruthy();

      // Make sure there is only a single checkmark in the entire menu
      let checkmarks = tree.getAllByRole('img', { hidden: true });
      expect(checkmarks.length).toBe(1);

      // Verify onSelectionChange is called
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange.mock.calls[0][0].has('Bleh')).toBeTruthy();
    });

    it('supports using click to change item selection', () => {
      let tree = renderComponent({
        selectionMode: 'single',
        onSelectionChange,
      });
      let menu = tree.getByRole('menu');
      let menuItems = within(menu).getAllByRole('menuitemradio');

      // Trigger a menu item via press
      let item = menuItems[4];
      firePress(item);
      expect(item).toHaveAttribute('aria-checked', 'true');
      let checkmark: HTMLElement | null = within(item).getByRole('img', {
        hidden: true,
      });
      expect(checkmark).toBeTruthy();

      // Make sure there is only a single checkmark in the entire menu
      let checkmarks = tree.getAllByRole('img', { hidden: true });
      expect(checkmarks.length).toBe(1);

      // Verify onSelectionChange is called
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange.mock.calls[0][0].has('Bleh')).toBeTruthy();
    });

    it('supports disabled items', () => {
      let tree = renderComponent({
        selectionMode: 'single',
        onSelectionChange,
        disabledKeys: ['Baz'],
      });
      let menu = tree.getByRole('menu');
      let menuItems = within(menu).getAllByRole('menuitemradio');

      // Attempt to trigger the disabled item
      let disabledItem = menuItems[2];
      firePress(disabledItem);
      expect(disabledItem).toHaveAttribute('aria-checked', 'false');
      expect(disabledItem).toHaveAttribute('aria-disabled', 'true');

      // Make sure there are no checkmarks
      let checkmarks = tree.queryAllByRole('img', { hidden: true });
      expect(checkmarks.length).toBe(0);

      // Verify onSelectionChange is not called
      expect(onSelectionChange).toHaveBeenCalledTimes(0);
    });
  });

  describe('supports multi selection', function () {
    it('supports selecting multiple items', function () {
      let tree = renderComponent({
        onSelectionChange,
        selectionMode: 'multiple',
      });
      let menu = tree.getByRole('menu');

      // Make sure nothing is checked by default
      let checkmarks = tree.queryAllByRole('img', { hidden: true });
      expect(checkmarks.length).toBe(0);

      let menuItems = within(menu).getAllByRole('menuitemcheckbox');
      let firstItem = menuItems[3];
      firePress(firstItem);
      expect(firstItem).toHaveAttribute('aria-checked', 'true');
      let checkmark: HTMLElement | null = within(firstItem).getByRole('img', {
        hidden: true,
      });
      expect(checkmark).toBeTruthy();

      // Select a different menu item
      let secondItem = menuItems[1];
      firePress(secondItem);
      expect(secondItem).toHaveAttribute('aria-checked', 'true');
      checkmark = within(secondItem).getByRole('img', { hidden: true });
      expect(checkmark).toBeTruthy();

      // Make sure there are multiple checkmark in the entire menu
      checkmarks = tree.getAllByRole('img', { hidden: true });
      expect(checkmarks.length).toBe(2);

      expect(onSelectionChange).toHaveBeenCalledTimes(2);
      expect(onSelectionChange.mock.calls[0][0].has('Blah')).toBeTruthy();
      expect(onSelectionChange.mock.calls[1][0].has('Bar')).toBeTruthy();
    });

    it('supports multiple `defaultSelectedKeys` (uncontrolled)', function () {
      let tree = renderComponent({
        onSelectionChange,
        selectionMode: 'multiple',
        defaultSelectedKeys: ['Foo', 'Bar'],
      });
      let menu = tree.getByRole('menu');

      // Make sure two items are checked by default
      let checkmarks = tree.getAllByRole('img', { hidden: true });
      expect(checkmarks.length).toBe(2);

      let menuItems = within(menu).getAllByRole('menuitemcheckbox');
      let firstItem = menuItems[0];
      let secondItem = menuItems[1];

      expect(firstItem).toHaveAttribute('aria-checked', 'true');
      expect(secondItem).toHaveAttribute('aria-checked', 'true');
      let itemText = within(firstItem).getByText('Foo');
      expect(itemText).toBeTruthy();
      itemText = within(secondItem).getByText('Bar');
      expect(itemText).toBeTruthy();
      let checkmark: HTMLElement | null = within(firstItem).getByRole('img', {
        hidden: true,
      });
      expect(checkmark).toBeTruthy();
      checkmark = within(secondItem).getByRole('img', { hidden: true });
      expect(checkmark).toBeTruthy();

      // Select a different menu item
      let thirdItem = menuItems[4];
      firePress(thirdItem);
      expect(thirdItem).toHaveAttribute('aria-checked', 'true');
      checkmark = within(thirdItem).getByRole('img', { hidden: true });
      expect(checkmark).toBeTruthy();

      // Make sure there are now three checkmarks
      checkmarks = tree.getAllByRole('img', { hidden: true });
      expect(checkmarks.length).toBe(3);

      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange.mock.calls[0][0].has('Bleh')).toBeTruthy();
      expect(onSelectionChange.mock.calls[0][0].has('Foo')).toBeTruthy();
      expect(onSelectionChange.mock.calls[0][0].has('Bar')).toBeTruthy();
    });

    it('supports multiple `selectedKeys` (controlled)', function () {
      let tree = renderComponent({
        onSelectionChange,
        selectionMode: 'multiple',
        selectedKeys: ['Foo', 'Bar'],
      });
      let menu = tree.getByRole('menu');

      // Make sure two items are checked by default
      let checkmarks = tree.getAllByRole('img', { hidden: true });
      expect(checkmarks.length).toBe(2);

      let menuItems = within(menu).getAllByRole('menuitemcheckbox');
      let firstItem = menuItems[0];
      let secondItem = menuItems[1];

      expect(firstItem).toHaveAttribute('aria-checked', 'true');
      expect(secondItem).toHaveAttribute('aria-checked', 'true');
      let itemText = within(firstItem).getByText('Foo');
      expect(itemText).toBeTruthy();
      itemText = within(secondItem).getByText('Bar');
      expect(itemText).toBeTruthy();
      let checkmark: HTMLElement | null = within(firstItem).getByRole('img', {
        hidden: true,
      });
      expect(checkmark).toBeTruthy();
      checkmark = within(secondItem).getByRole('img', { hidden: true });
      expect(checkmark).toBeTruthy();

      // Select a different menu item
      let thirdItem = menuItems[4];
      firePress(thirdItem);
      expect(thirdItem).toHaveAttribute('aria-checked', 'false');
      checkmark = within(thirdItem).queryByRole('img', { hidden: true });
      expect(checkmark).toBeNull();

      // Make sure there are still two checkmarks
      checkmarks = tree.getAllByRole('img', { hidden: true });
      expect(checkmarks.length).toBe(2);

      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange.mock.calls[0][0].has('Bleh')).toBeTruthy();
    });

    it('supports deselection', function () {
      let tree = renderComponent({
        onSelectionChange,
        selectionMode: 'multiple',
        defaultSelectedKeys: ['Foo', 'Bar'],
      });
      let menu = tree.getByRole('menu');

      // Make sure two items are checked by default
      let checkmarks = tree.getAllByRole('img', { hidden: true });
      expect(checkmarks.length).toBe(2);

      let menuItems = within(menu).getAllByRole('menuitemcheckbox');
      let firstItem = menuItems[0];
      let secondItem = menuItems[1];

      expect(firstItem).toHaveAttribute('aria-checked', 'true');
      expect(secondItem).toHaveAttribute('aria-checked', 'true');
      let itemText = within(firstItem).getByText('Foo');
      expect(itemText).toBeTruthy();
      itemText = within(secondItem).getByText('Bar');
      expect(itemText).toBeTruthy();
      let checkmark: HTMLElement | null = within(firstItem).getByRole('img', {
        hidden: true,
      });
      expect(checkmark).toBeTruthy();
      checkmark = within(secondItem).getByRole('img', { hidden: true });
      expect(checkmark).toBeTruthy();

      // Deselect the first item
      firePress(firstItem);
      expect(firstItem).toHaveAttribute('aria-checked', 'false');
      checkmark = within(firstItem).queryByRole('img', { hidden: true });
      expect(checkmark).toBeNull();

      // Make sure there only a single checkmark now
      checkmarks = tree.getAllByRole('img', { hidden: true });
      expect(checkmarks.length).toBe(1);

      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange.mock.calls[0][0].has('Bar')).toBeTruthy();
    });

    it('supports `disabledKeys`', function () {
      let tree = renderComponent({
        onSelectionChange,
        selectionMode: 'multiple',
        defaultSelectedKeys: ['Foo', 'Bar'],
        disabledKeys: ['Baz'],
      });
      let menu = tree.getByRole('menu');

      // Attempt to trigger disabled item
      let menuItems = within(menu).getAllByRole('menuitemcheckbox');
      let disabledItem = menuItems[2];
      firePress(disabledItem);

      expect(disabledItem).toHaveAttribute('aria-checked', 'false');
      expect(disabledItem).toHaveAttribute('aria-disabled', 'true');

      // Make sure that only two items are checked still
      let checkmarks = tree.getAllByRole('img', { hidden: true });
      expect(checkmarks.length).toBe(2);

      expect(onSelectionChange).toHaveBeenCalledTimes(0);
    });
  });

  describe('supports no selection', function () {
    it('prevents selection of any items', function () {
      let tree = renderComponent({ onSelectionChange, selectionMode: 'none' });
      let menu = tree.getByRole('menu');

      // Make sure nothing is checked by default
      let checkmarks = tree.queryAllByRole('img', { hidden: true });
      expect(checkmarks.length).toBe(0);

      // Attempt to select a variety of items via enter, space, and click
      let menuItems = within(menu).getAllByRole('menuitem');
      let firstItem = menuItems[3];
      let secondItem = menuItems[4];
      let thirdItem = menuItems[1];
      firePress(firstItem);
      fireEvent.keyDown(secondItem, KEYS.Space);
      fireEvent.keyDown(thirdItem, KEYS.Enter);
      expect(firstItem).not.toHaveAttribute('aria-checked', 'true');
      expect(secondItem).not.toHaveAttribute('aria-checked', 'true');
      expect(thirdItem).not.toHaveAttribute('aria-checked', 'true');

      // Make sure nothing is still checked
      checkmarks = tree.queryAllByRole('img', { hidden: true });
      expect(checkmarks.length).toBe(0);
      expect(onSelectionChange).toHaveBeenCalledTimes(0);
    });
  });

  describe('supports type to select', function () {
    it('supports focusing items by typing letters in rapid succession', function () {
      let tree = renderComponent({ autoFocus: 'first' });
      let menu = tree.getByRole('menu');
      let menuItems = within(menu).getAllByRole('menuitem');
      expect(document.activeElement).toBe(menuItems[0]);

      fireEvent.keyDown(menu, { key: 'B' });
      expect(document.activeElement).toBe(menuItems[1]);

      fireEvent.keyDown(menu, { key: 'L' });
      expect(document.activeElement).toBe(menuItems[3]);

      fireEvent.keyDown(menu, { key: 'E' });
      expect(document.activeElement).toBe(menuItems[4]);
    });

    it('resets the search text after a timeout', function () {
      let tree = renderComponent({ autoFocus: 'first' });
      let menu = tree.getByRole('menu');
      let menuItems = within(menu).getAllByRole('menuitem');
      expect(document.activeElement).toBe(menuItems[0]);

      fireEvent.keyDown(menu, { key: 'B' });
      expect(document.activeElement).toBe(menuItems[1]);

      act(() => {
        jest.runAllTimers();
      });

      fireEvent.keyDown(menu, { key: 'B' });
      expect(document.activeElement).toBe(menuItems[1]);
    });

    it('wraps around when no items past the current one match', function () {
      let tree = renderComponent({ autoFocus: 'first' });
      let menu = tree.getByRole('menu');
      let menuItems = within(menu).getAllByRole('menuitem');
      expect(document.activeElement).toBe(menuItems[0]);

      fireEvent.keyDown(menu, { key: 'B' });
      fireEvent.keyDown(menu, { key: 'L' });
      fireEvent.keyDown(menu, { key: 'E' });
      expect(document.activeElement).toBe(menuItems[4]);

      act(() => {
        jest.runAllTimers();
      });

      fireEvent.keyDown(menu, { key: 'B' });
      expect(document.activeElement).toBe(menuItems[4]);
    });
  });

  describe('supports `onAction`', function () {
    it('Menu with static list supports `onAction`', function () {
      let onAction = jest.fn();
      let onSelectionChange = jest.fn();
      let tree = render(
        <Menu
          aria-label="menu"
          onSelectionChange={onSelectionChange}
          onAction={onAction}
        >
          <Item key="One">One</Item>
          <Item key="Two">Two</Item>
          <Item key="Three">Three</Item>
        </Menu>
      );

      let menu = tree.getByRole('menu');

      let [item1, item2, item3] = [
        within(menu).getByText('One'),
        within(menu).getByText('Two'),
        within(menu).getByText('Three'),
      ];

      firePress(item1);
      expect(onAction).toHaveBeenCalledWith('One');
      expect(onAction).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenCalledTimes(0);

      firePress(item2);
      expect(onAction).toHaveBeenCalledWith('Two');
      expect(onAction).toHaveBeenCalledTimes(2);
      expect(onSelectionChange).toHaveBeenCalledTimes(0);

      firePress(item3);
      expect(onAction).toHaveBeenCalledWith('Three');
      expect(onAction).toHaveBeenCalledTimes(3);
      expect(onSelectionChange).toHaveBeenCalledTimes(0);
    });

    it('Menu with dynamic list supports `onAction`', function () {
      let onAction = jest.fn();
      let onSelectionChange = jest.fn();
      let flatItems = [{ name: 'One' }, { name: 'Two' }, { name: 'Three' }];
      let tree = render(
        <Menu
          aria-label="menu"
          onSelectionChange={onSelectionChange}
          items={flatItems}
          onAction={onAction}
        >
          {item => <Item key={item.name}>{item.name}</Item>}
        </Menu>
      );

      act(() => {
        jest.runAllTimers();
      });

      let menu = tree.getByRole('menu');

      let [item1, item2, item3] = [
        within(menu).getByText('One'),
        within(menu).getByText('Two'),
        within(menu).getByText('Three'),
      ];

      firePress(item1);
      expect(onAction).toHaveBeenCalledWith('One');
      expect(onAction).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenCalledTimes(0);

      firePress(item2);
      expect(onAction).toHaveBeenCalledWith('Two');
      expect(onAction).toHaveBeenCalledTimes(2);
      expect(onSelectionChange).toHaveBeenCalledTimes(0);

      firePress(item3);
      expect(onAction).toHaveBeenCalledWith('Three');
      expect(onAction).toHaveBeenCalledTimes(3);
      expect(onSelectionChange).toHaveBeenCalledTimes(0);
    });
  });

  it('supports complex menu items with `aria-labelledby` and `aria-describedby`', function () {
    let tree = render(
      <Menu aria-label="menu" selectionMode="none">
        <Item textValue="Label">
          <Icon src={globeIcon} />
          <Text>Label</Text>
          <Text slot="description">Description</Text>
          <Kbd meta>V</Kbd>
        </Item>
      </Menu>
    );

    let menu = tree.getByRole('menu');
    let menuItem = within(menu).getByRole('menuitem');
    let label = within(menu).getByText('Label');
    let description = within(menu).getByText('Description');
    let keyboard = within(menu).getByText((content, element) => {
      if (!element) {
        return false;
      }

      return element.textContent === 'Ctrl+V';
    });

    expect(menuItem).toHaveAttribute('aria-labelledby', label.id);
    expect(menuItem).toHaveAttribute(
      'aria-describedby',
      `${description.id} ${keyboard.id}`
    );
  });

  it('supports `aria-label` on sections and items', function () {
    let tree = render(
      <Menu aria-label="menu">
        <Section aria-label="Section">
          <Item aria-label="Item">
            <Icon src={globeIcon} />
          </Item>
        </Section>
      </Menu>
    );

    let menu = tree.getByRole('menu');
    let group = within(menu).getByRole('group');
    expect(group).toHaveAttribute('aria-label', 'Section');
    let menuItem = within(menu).getByRole('menuitem');
    expect(menuItem).toHaveAttribute('aria-label', 'Item');
    expect(menuItem).not.toHaveAttribute('aria-labelledby');
    expect(menuItem).not.toHaveAttribute('aria-describedby');
  });

  it('supports `aria-label`', function () {
    let tree = renderComponent({ 'aria-label': 'Test' });
    let menu = tree.getByRole('menu');
    expect(menu).toHaveAttribute('aria-label', 'Test');
  });

  it('warns user if no `aria-label` is provided', () => {
    let spyWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    renderComponent({ 'aria-labelledby': undefined });
    expect(spyWarn).toHaveBeenCalledWith(
      'An aria-label or aria-labelledby prop is required for accessibility.'
    );
  });

  it('supports custom data attributes', function () {
    // @ts-ignore data attributes are permitted on components, but aren't included in the type definition
    let tree = renderComponent({ 'data-testid': 'test' });
    let menu = tree.getByRole('menu');
    expect(menu).toHaveAttribute('data-testid', 'test');
  });
});

function renderComponent<T>(props: Partial<Omit<MenuProps<T>, 'items'>> = {}) {
  return render(
    <>
      <span id="label">Label</span>
      <Menu
        items={[
          {
            name: 'Heading 1',
            children: [{ name: 'Foo' }, { name: 'Bar' }, { name: 'Baz' }],
          },
          { name: 'Heading 2', children: [{ name: 'Blah' }, { name: 'Bleh' }] },
        ]}
        aria-labelledby="label"
        {...props}
      >
        {item => (
          <Section key={item.name} items={item.children} title={item.name}>
            {item => <Item key={item.name}>{item.name}</Item>}
          </Section>
        )}
      </Menu>
    </>
  );
}
