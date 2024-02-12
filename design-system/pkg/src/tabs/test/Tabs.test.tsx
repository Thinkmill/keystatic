import userEvent from '@testing-library/user-event';
import {
  expect,
  it,
  describe,
  afterAll,
  afterEach,
  beforeAll,
  jest,
} from '@jest/globals';

import {
  act,
  fireEvent,
  firePress,
  renderWithProvider,
  waitFor,
  within,
} from '#test-utils';

import { Item, TabList, TabPanels, Tabs, TabsProps } from '..';

let defaultItems = [
  { name: 'Tab 1', children: 'Tab 1 body' },
  { name: '', children: 'Tab 2 body' },
  { name: 'Tab 3', children: 'Tab 3 body' },
];

// FIXME: The `items` prop of `Tabs` should infer the type of the items for both
// the TabList and TabPanels components. Not sure how to do this.
type TabItem = (typeof defaultItems)[0];

function renderComponent<T>(
  props: Partial<TabsProps<T>> = {},
  itemProps?: any
) {
  return renderWithProvider(
    <Tabs aria-label="Tab Sample" {...props} items={defaultItems}>
      <TabList>
        {(item: TabItem) => (
          <Item
            {...itemProps}
            key={item.name}
            title={item.name || item.children}
          />
        )}
      </TabList>
      <TabPanels>
        {(item: TabItem) => (
          <Item key={item.name} title={item.name}>
            {item.children}
          </Item>
        )}
      </TabPanels>
    </Tabs>
  );
}

describe('tabs/Tabs', function () {
  let onSelectionChange = jest.fn();

  beforeAll(function () {
    jest
      .spyOn(window.HTMLElement.prototype, 'clientWidth', 'get')
      .mockImplementation(() => 1000);
    jest
      .spyOn(window.HTMLElement.prototype, 'clientHeight', 'get')
      .mockImplementation(() => 1000);
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    act(() => jest.runAllTimers());
  });

  afterAll(function () {
    jest.restoreAllMocks();
  });

  it('renders properly', function () {
    let container = renderComponent();
    let tablist = container.getByRole('tablist');
    expect(tablist).toBeTruthy();

    expect(tablist).toHaveAttribute('aria-orientation', 'horizontal');

    let tabs = within(tablist).getAllByRole('tab');
    expect(tabs.length).toBe(3);

    for (let tab of tabs) {
      expect(tab).toHaveAttribute('tabindex');
      expect(tab).toHaveAttribute('aria-selected');
      let isSelected = tab.getAttribute('aria-selected') === 'true';
      if (isSelected) {
        expect(tab).toHaveAttribute('aria-controls');
        let tabpanel = document.getElementById(
          tab.getAttribute('aria-controls')!
        );
        expect(tabpanel).toBeTruthy();
        expect(tabpanel).toHaveAttribute('aria-labelledby', tab.id);
        expect(tabpanel).toHaveAttribute('role', 'tabpanel');
        expect(tabpanel).toHaveTextContent(defaultItems[0].children);
      }
    }
  });

  it('allows user to change tab item select via left/right arrow keys with horizontal tabs', function () {
    let container = renderComponent({ orientation: 'horizontal' });
    let tablist = container.getByRole('tablist');
    let tabs = within(tablist).getAllByRole('tab');
    let selectedItem = tabs[0];

    expect(tablist).toHaveAttribute('aria-orientation', 'horizontal');

    expect(selectedItem).toHaveAttribute('aria-selected', 'true');
    act(() => {
      selectedItem.focus();
    });
    fireEvent.keyDown(selectedItem, {
      key: 'ArrowRight',
      code: 39,
      charCode: 39,
    });
    let nextSelectedItem = tabs[1];
    expect(nextSelectedItem).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(nextSelectedItem, {
      key: 'ArrowLeft',
      code: 37,
      charCode: 37,
    });
    expect(selectedItem).toHaveAttribute('aria-selected', 'true');

    /** Doesn't change selection because it's horizontal tabs. */
    // fireEvent.keyDown(selectedItem, { key: 'ArrowUp', code: 38, charCode: 38 });
    // expect(selectedItem).toHaveAttribute('aria-selected', 'true');
    // fireEvent.keyDown(selectedItem, {
    //   key: 'ArrowDown',
    //   code: 40,
    //   charCode: 40,
    // });
    // expect(selectedItem).toHaveAttribute('aria-selected', 'true');
  });

  it('allows user to change tab item select via up/down arrow keys with vertical tabs', function () {
    let container = renderComponent({ orientation: 'vertical' });
    let tablist = container.getByRole('tablist');
    let tabs = within(tablist).getAllByRole('tab');
    let selectedItem = tabs[0];
    act(() => {
      selectedItem.focus();
    });

    expect(tablist).toHaveAttribute('aria-orientation', 'vertical');

    /** Doesn't change selection because it's vertical tabs. */
    // expect(selectedItem).toHaveAttribute('aria-selected', 'true');
    // fireEvent.keyDown(selectedItem, {
    //   key: 'ArrowRight',
    //   code: 39,
    //   charCode: 39,
    // });
    // expect(selectedItem).toHaveAttribute('aria-selected', 'true');
    // fireEvent.keyDown(selectedItem, {
    //   key: 'ArrowLeft',
    //   code: 37,
    //   charCode: 37,
    // });
    // expect(selectedItem).toHaveAttribute('aria-selected', 'true');

    let nextSelectedItem = tabs[1];
    fireEvent.keyDown(selectedItem, {
      key: 'ArrowDown',
      code: 40,
      charCode: 40,
    });
    expect(nextSelectedItem).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(nextSelectedItem, {
      key: 'ArrowUp',
      code: 38,
      charCode: 38,
    });
    expect(selectedItem).toHaveAttribute('aria-selected', 'true');
  });

  it('wraps focus from first to last/last to first item', function () {
    let container = renderComponent({ orientation: 'horizontal' });
    let tablist = container.getByRole('tablist');
    let tabs = within(tablist).getAllByRole('tab');
    let firstItem = tabs[0];
    act(() => {
      firstItem.focus();
    });

    expect(tablist).toHaveAttribute('aria-orientation', 'horizontal');

    expect(firstItem).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(firstItem, { key: 'ArrowLeft', code: 37, charCode: 37 });
    let lastItem = tabs[tabs.length - 1];
    expect(lastItem).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(lastItem, { key: 'ArrowRight', code: 39, charCode: 39 });
    expect(firstItem).toHaveAttribute('aria-selected', 'true');
  });

  it('select last item via end key / select first item via home key', function () {
    let container = renderComponent({ orientation: 'vertical' });
    let tablist = container.getByRole('tablist');
    let tabs = within(tablist).getAllByRole('tab');
    let firstItem = tabs[0];
    act(() => {
      firstItem.focus();
    });

    expect(tablist).toHaveAttribute('aria-orientation', 'vertical');

    expect(firstItem).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(firstItem, { key: 'End', code: 35, charCode: 35 });
    let lastItem = tabs[tabs.length - 1];
    expect(lastItem).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(lastItem, { key: 'Home', code: 36, charCode: 36 });
    expect(firstItem).toHaveAttribute('aria-selected', 'true');
  });

  it('supports using click to change tab', function () {
    let container = renderComponent({
      defaultSelectedKey: defaultItems[0].name,
      onSelectionChange,
    });
    let tablist = container.getByRole('tablist');
    let tabs = within(tablist).getAllByRole('tab');
    let firstItem = tabs[0];
    expect(firstItem).toHaveAttribute('aria-selected', 'true');

    let secondItem = tabs[1];
    firePress(secondItem);
    expect(secondItem).toHaveAttribute('aria-selected', 'true');
    expect(secondItem).toHaveAttribute('aria-controls');
    let tabpanel = document.getElementById(
      secondItem.getAttribute('aria-controls')!
    );
    expect(tabpanel).toBeTruthy();
    expect(tabpanel).toHaveAttribute('aria-labelledby', secondItem.id);
    expect(tabpanel).toHaveAttribute('role', 'tabpanel');
    expect(tabpanel).toHaveTextContent(defaultItems[1].children);
    expect(onSelectionChange).toHaveBeenCalledTimes(1);
  });

  it('should focus the selected tab when tabbing in for the first time', async function () {
    let { getAllByRole } = renderComponent({
      defaultSelectedKey: defaultItems[1].name,
    });
    userEvent.tab();

    let tabs = getAllByRole('tab');
    await waitFor(() => {
      expect(document.activeElement).toBe(tabs[1]);
    });
  });

  it('should not focus any tabs when isDisabled tabbing in for the first time', async function () {
    let { getByRole } = renderComponent({
      defaultSelectedKey: defaultItems[1].name,
      isDisabled: true,
    });
    userEvent.tab();

    let tabpanel = getByRole('tabpanel');
    await waitFor(() => {
      expect(document.activeElement).toBe(tabpanel);
    });
  });

  it('disabled tabs cannot be keyboard navigated to', async function () {
    let { getAllByRole } = renderComponent({
      defaultSelectedKey: defaultItems[0].name,
      disabledKeys: [defaultItems[1].name],
      onSelectionChange,
    });
    userEvent.tab();

    let tabs = getAllByRole('tab');
    await waitFor(() => {
      expect(document.activeElement).toBe(tabs[0]);
    });
    fireEvent.keyDown(tabs[1], { key: 'ArrowRight' });
    fireEvent.keyUp(tabs[1], { key: 'ArrowRight' });
    expect(onSelectionChange).toHaveBeenCalledWith(defaultItems[2].name);
  });

  it('disabled tabs cannot be pressed', async function () {
    let { getAllByRole } = renderComponent({
      defaultSelectedKey: defaultItems[0].name,
      disabledKeys: [defaultItems[1].name],
      onSelectionChange,
    });
    userEvent.tab();

    let tabs = getAllByRole('tab');
    await waitFor(() => {
      expect(document.activeElement).toBe(tabs[0]);
    });
    userEvent.click(tabs[1]);
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it('finds the first non-disabled tab if the currently selected one is removed', async function () {
    let { getAllByRole, rerender } = renderComponent({
      disabledKeys: [defaultItems[0].name],
      onSelectionChange,
      items: defaultItems,
    });
    userEvent.tab();

    let tabs = getAllByRole('tab');
    await waitFor(() => {
      expect(document.activeElement).toBe(tabs[1]);
    });
    fireEvent.keyDown(tabs[1], { key: 'ArrowRight' });
    fireEvent.keyUp(tabs[1], { key: 'ArrowRight' });
    expect(onSelectionChange).toHaveBeenCalledWith(defaultItems[2].name);

    rerender(
      <Tabs
        aria-label="Tab Example"
        disabledKeys={[defaultItems[0].name]}
        onSelectionChange={onSelectionChange}
        items={defaultItems.slice(0, 1)}
      >
        <TabList>
          {(item: TabItem) => (
            <Item key={item.name} title={item.name || item.children}>
              {item.children}
            </Item>
          )}
        </TabList>
        <TabPanels>
          {(item: TabItem) => (
            <Item key={item.name} title={item.name}>
              {item.children}
            </Item>
          )}
        </TabPanels>
      </Tabs>
    );
    expect(onSelectionChange).toHaveBeenCalledWith(defaultItems[1].name);
  });

  it('selects first tab if all tabs are disabled', async function () {
    let { getAllByRole, getByRole } = renderComponent({
      disabledKeys: defaultItems.map(item => item.name),
      onSelectionChange,
      items: defaultItems,
    });
    userEvent.tab();

    let tabs = getAllByRole('tab');
    let tabpanel = getByRole('tabpanel');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(onSelectionChange).toHaveBeenCalledWith(defaultItems[0].name);
    await waitFor(() => {
      expect(document.activeElement).toBe(tabpanel);
    });
  });

  it('tabpanel should have tabIndex=0 only when there are no focusable elements', async function () {
    let { getByRole, getAllByRole } = renderWithProvider(
      <Tabs aria-label="Tab Example" maxWidth="scale.5000">
        <TabList>
          <Item>Tab 1</Item>
          <Item>Tab 2</Item>
        </TabList>
        <TabPanels>
          <Item>
            <input />
          </Item>
          <Item>
            <input disabled />
          </Item>
        </TabPanels>
      </Tabs>
    );

    let tabpanel = getByRole('tabpanel');
    await waitFor(() => expect(tabpanel).not.toHaveAttribute('tabindex'));

    let tabs = getAllByRole('tab');
    firePress(tabs[1]);
    tabpanel = getByRole('tabpanel');

    await waitFor(() => expect(tabpanel).toHaveAttribute('tabindex', '0'));

    firePress(tabs[0]);
    tabpanel = getByRole('tabpanel');

    await waitFor(() => expect(tabpanel).not.toHaveAttribute('tabindex'));
  });

  it('TabPanel children do not share values between panels', () => {
    let { getByDisplayValue, getAllByRole, getByTestId } = renderWithProvider(
      <Tabs aria-label="Tab Example" maxWidth="scale.5000">
        <TabList>
          <Item>Tab 1</Item>
          <Item>Tab 2</Item>
        </TabList>
        <TabPanels>
          <Item>
            <input data-testid="panel1_input" />
          </Item>
          <Item>
            <input disabled data-testid="panel2_input" />
          </Item>
        </TabPanels>
      </Tabs>
    );

    let tabPanelInput = getByTestId('panel1_input') as HTMLInputElement;
    expect(tabPanelInput.value).toBe('');
    tabPanelInput.value = 'A String';
    expect(getByDisplayValue('A String')).toBeTruthy();

    let tabs = getAllByRole('tab');
    firePress(tabs[1]);

    tabPanelInput = getByTestId('panel2_input') as HTMLInputElement;
    expect(tabPanelInput.value).toBe('');
  });

  it('supports custom props for parent tabs element', function () {
    let { getByTestId } = renderComponent({ 'data-testid': 'tabs1' } as any);
    let tabs = getByTestId('tabs1');
    expect(tabs).toBeInTheDocument();
  });

  it('supports custom props for tab items', function () {
    let { getAllByTestId } = renderComponent(
      {},
      {
        'data-testid': 'tabItems',
        'data-instance-id': 'instance-id',
        id: 'id-1',
      }
    );
    let tabItems = getAllByTestId('tabItems');
    expect(tabItems).toHaveLength(3);
    for (let tabItem of tabItems) {
      expect(tabItem).toHaveAttribute('data-instance-id', 'instance-id');
      expect(tabItem).not.toHaveAttribute('id', 'id-1');
      expect(tabItem).toBeInTheDocument();
    }
  });

  it('fires onSelectionChange when clicking on the current tab', function () {
    let container = renderComponent({
      defaultSelectedKey: defaultItems[0].name,
      onSelectionChange,
    });
    let tablist = container.getByRole('tablist');
    let tabs = within(tablist).getAllByRole('tab');
    let firstItem = tabs[0];
    expect(firstItem).toHaveAttribute('aria-selected', 'true');

    firePress(firstItem);
    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    expect(onSelectionChange).toHaveBeenCalledWith(defaultItems[0].name);
  });

  it('updates the tab index of the selected tab if programatically changed', function () {
    let Example = (props: any) => (
      <Tabs
        aria-label="Test Tabs"
        items={defaultItems}
        selectedKey={props.selectedKey}
      >
        <TabList>
          {(item: TabItem) => (
            <Item key={item.name} title={item.name || item.children}>
              {item.children}
            </Item>
          )}
        </TabList>
        <TabPanels>
          {(item: TabItem) => <Item key={item.name}>{item.children}</Item>}
        </TabPanels>
      </Tabs>
    );
    let { getAllByRole, rerender } = renderWithProvider(
      <Example selectedKey="Tab 3" />
    );

    let tabs = getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('tabindex', '-1');
    expect(tabs[1]).toHaveAttribute('tabindex', '-1');
    expect(tabs[2]).toHaveAttribute('tabindex', '0');

    rerender(<Example selectedKey="Tab 1" />);
    tabs = getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('tabindex', '0');
    expect(tabs[1]).toHaveAttribute('tabindex', '-1');
    expect(tabs[2]).toHaveAttribute('tabindex', '-1');
  });
});
