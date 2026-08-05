import {
  expect,
  describe,
  it,
  jest,
  beforeAll,
  afterAll,
  afterEach,
} from '@jest/globals';

import { Button } from '@keystar/ui/button';
import { useDragAndDrop } from '@keystar/ui/drag-and-drop';
import {
  act,
  fireEvent,
  firePress,
  renderWithProvider,
  within,
} from '#test-utils';

import {
  ListView,
  ListViewCollection,
  ListViewItem,
  ListViewLoadMoreItem,
} from '..';

describe('list-view/ListView', () => {
  let offsetWidth: jest.SpiedGetter<number>,
    offsetHeight: jest.SpiedGetter<number>,
    scrollHeight: jest.SpiedGetter<number>;
  let items = [
    { key: 'foo', label: 'Foo' },
    { key: 'bar', label: 'Bar' },
    { key: 'baz', label: 'Baz' },
  ];

  let manyItems: { id: number; label: string }[] = [];
  for (let i = 1; i <= 100; i++) {
    manyItems.push({ id: i, label: 'Foo ' + i });
  }

  beforeAll(function () {
    global.IntersectionObserver = jest.fn(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      takeRecords: jest.fn(),
      unobserve: jest.fn(),
    })) as unknown as typeof IntersectionObserver;
    offsetWidth = jest
      .spyOn(window.HTMLElement.prototype, 'clientWidth', 'get')
      .mockImplementation(() => 1000);
    offsetHeight = jest
      .spyOn(window.HTMLElement.prototype, 'clientHeight', 'get')
      .mockImplementation(() => 1000);
    scrollHeight = jest
      .spyOn(window.HTMLElement.prototype, 'scrollHeight', 'get')
      .mockImplementation(() => 40);
    jest.useFakeTimers();
  });

  afterEach(function () {
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
    fireEvent.keyUp(document.activeElement!, { key: 'Escape' });
    jest.clearAllMocks();
  });

  afterAll(function () {
    offsetWidth.mockReset();
    offsetHeight.mockReset();
    scrollHeight.mockReset();
  });

  let render = (children: any) => {
    let tree = renderWithProvider(children);
    // Allow for Virtualizer layout to update
    act(() => {
      jest.runAllTimers();
    });
    return tree;
  };

  let renderList = (props = {}) => {
    return render(
      <ListView items={items} aria-label="List" {...props}>
        {item => (
          <ListViewItem textValue={item.label}>{item.label}</ListViewItem>
        )}
      </ListView>
    );
  };

  let renderListWithFocusables = (props = {}) => {
    return render(
      <ListView items={items} aria-label="List" {...props}>
        {item => (
          <ListViewItem textValue={item.label}>
            {item.label}
            <Button>button1 {item.label}</Button>
            <Button>button2 {item.label}</Button>
          </ListViewItem>
        )}
      </ListView>
    );
  };

  let getRow = (tree: any, text: string) => {
    // Find by text, then go up to the element with the row role.
    let el = tree.getByText(text);
    while (el && !/row/.test(el.getAttribute('role'))) {
      el = el.parentElement;
    }

    return el;
  };

  it('renders a static listview', function () {
    let { getByRole, getAllByRole } = render(
      <ListView aria-label="List" data-testid="test">
        <ListViewItem>Foo</ListViewItem>
        <ListViewItem>Bar</ListViewItem>
        <ListViewItem>Baz</ListViewItem>
      </ListView>
    );

    let grid = getByRole('grid');
    expect(grid).toBeVisible();
    expect(grid).toHaveAttribute('aria-label', 'List');
    expect(grid).toHaveAttribute('data-testid', 'test');
    expect(grid).toHaveAttribute('aria-rowcount', '3');
    expect(grid).toHaveAttribute('aria-colcount', '1');

    let rows = getAllByRole('row');
    expect(rows).toHaveLength(3);
    expect(rows[0]).toHaveAttribute('aria-rowindex', '1');
    expect(rows[1]).toHaveAttribute('aria-rowindex', '2');
    expect(rows[2]).toHaveAttribute('aria-rowindex', '3');

    let gridCells = within(rows[0]).getAllByRole('gridcell');
    expect(gridCells).toHaveLength(1);
    expect(gridCells[0]).toHaveTextContent('Foo');
    expect(gridCells[0]).toHaveAttribute('aria-colindex', '1');
  });

  it('renders a dynamic listview', function () {
    let items = [
      { key: 'foo', label: 'Foo' },
      { key: 'bar', label: 'Bar' },
      { key: 'baz', label: 'Baz' },
    ];
    let { getByRole, getAllByRole } = render(
      <ListView items={items} aria-label="List">
        {item => <ListViewItem textValue={item.key}>{item.label}</ListViewItem>}
      </ListView>
    );

    let grid = getByRole('grid');
    expect(grid).toBeVisible();
    expect(grid).toHaveAttribute('aria-label', 'List');
    expect(grid).toHaveAttribute('aria-rowcount', '3');
    expect(grid).toHaveAttribute('aria-colcount', '1');

    let rows = getAllByRole('row');
    expect(rows).toHaveLength(3);
    expect(rows[0]).toHaveAttribute('aria-rowindex', '1');
    expect(rows[1]).toHaveAttribute('aria-rowindex', '2');
    expect(rows[2]).toHaveAttribute('aria-rowindex', '3');

    let gridCells = within(rows[0]).getAllByRole('gridcell');
    expect(gridCells).toHaveLength(1);
    expect(gridCells[0]).toHaveTextContent('Foo');
    expect(gridCells[0]).toHaveAttribute('aria-colindex', '1');
  });

  it('renders a loading row without requiring a load-more callback', function () {
    let tree = render(
      <ListView aria-label="List">
        <ListViewCollection items={items}>
          {item => (
            <ListViewItem id={item.key} textValue={item.label}>
              {item.label}
            </ListViewItem>
          )}
        </ListViewCollection>
        <ListViewLoadMoreItem isLoading />
      </ListView>
    );
    expect(tree.getAllByRole('row')).toHaveLength(4);
    expect(tree.getByRole('progressbar')).toHaveAttribute(
      'aria-label',
      'Loading more…'
    );
  });

  it('uses the public RAC drag-and-drop hook bundle', function () {
    function DraggableList() {
      let result = useDragAndDrop({
        getItems: keys => [...keys].map(key => ({ 'text/plain': String(key) })),
        onReorder: jest.fn(),
      });
      return (
        <ListView
          items={items}
          aria-label="Draggable list"
          dragAndDropHooks={result.dragAndDropHooks}
        >
          {item => (
            <ListViewItem textValue={item.label}>{item.label}</ListViewItem>
          )}
        </ListView>
      );
    }

    let tree = render(<DraggableList />);
    expect(tree.getAllByRole('button')).toHaveLength(3);
  });

  it('renders a falsy ids', function () {
    let items = [
      { id: 0, label: 'Foo' },
      { id: 1, label: 'Bar' },
    ];
    let { getByRole, getAllByRole } = render(
      <ListView items={items} aria-label="List">
        {item => (
          <ListViewItem textValue={item.label}>{item.label}</ListViewItem>
        )}
      </ListView>
    );

    let grid = getByRole('grid');
    expect(grid).toBeVisible();

    let rows = getAllByRole('row');
    expect(rows).toHaveLength(2);

    let gridCells = within(rows[0]).getAllByRole('gridcell');
    expect(gridCells).toHaveLength(1);
    expect(gridCells[0]).toHaveTextContent('Foo');
  });

  it('maps highlight selection style to replace behavior', function () {
    let tree = renderList({
      selectionMode: 'single',
      selectionStyle: 'highlight',
    });
    let rows = tree.getAllByRole('row');

    expect(tree.queryByRole('checkbox')).toBeNull();
    firePress(rows[0]);
    expect(rows[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('should retain focus on the pressed child', function () {
    let tree = renderListWithFocusables();
    let button = within(getRow(tree, 'Foo')).getAllByRole('button')[1];
    // Browsers focus buttons natively on pointer down. React Aria's modern
    // usePress no longer emulates this behavior for synthetic test events.
    act(() => button.focus());
    firePress(button);
    expect(document.activeElement).toBe(button);
  });

  it('should focus the row if the cell is pressed', function () {
    let tree = renderList({ selectionMode: 'single' });
    let cell = within(getRow(tree, 'Bar')).getByRole('gridcell');
    // Simulate the browser's native focus step before the synthetic press.
    act(() => getRow(tree, 'Bar').focus());
    firePress(cell);
    act(() => {
      jest.runAllTimers();
    });
    expect(document.activeElement).toBe(getRow(tree, 'Bar'));
  });

  it('should have an aria-label on the row for the row text content', function () {
    let tree = renderList();
    expect(getRow(tree, 'Foo')).toHaveAttribute('aria-label', 'Foo');
    expect(getRow(tree, 'Bar')).toHaveAttribute('aria-label', 'Bar');
    expect(getRow(tree, 'Baz')).toHaveAttribute('aria-label', 'Baz');
  });

  it('prefers an explicit aria-label over textValue', function () {
    let tree = render(
      <ListView aria-label="List">
        <ListViewItem textValue="Delete">Delete</ListViewItem>
        <ListViewItem aria-label="Delete file permanently" textValue="Delete">
          Delete
        </ListViewItem>
      </ListView>
    );
    expect(tree.getAllByRole('row')[1]).toHaveAttribute(
      'aria-label',
      'Delete file permanently'
    );
  });

  it('centers the empty state', function () {
    let tree = render(
      <ListView
        items={[] as { id: string }[]}
        aria-label="List"
        renderEmptyState={() => <div>Empty</div>}
      >
        {item => <ListViewItem>{item.id}</ListViewItem>}
      </ListView>
    );
    let wrapper = tree.getByText('Empty').parentElement;
    expect(wrapper).toHaveStyle({
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
    });
  });

  it('should label the checkboxes with the row label', function () {
    let tree = renderList({ selectionMode: 'single' });
    let rows = tree.getAllByRole('row');
    for (let row of rows) {
      let checkbox = within(row).getByRole('checkbox');
      expect(checkbox).toHaveAttribute(
        'aria-labelledby',
        `${checkbox.id} ${row.id}`
      );
    }
  });

  it('should disable nested elements when row is disabled', function () {
    let tree = renderListWithFocusables({
      disabledKeys: ['foo'],
      selectionMode: 'multiple',
    });
    let row = getRow(tree, 'Foo');
    expect(row).toHaveAttribute('aria-disabled', 'true');
    expect(row).not.toHaveAttribute('aria-selected');
    expect(within(row).getByRole('checkbox')).toHaveAttribute('disabled');

    let buttons = within(row).getAllByRole('button');
    expect(buttons[0]).toHaveAttribute('disabled');
    expect(buttons[1]).toHaveAttribute('disabled');

    row = getRow(tree, 'Bar');
    expect(row).not.toHaveAttribute('aria-disabled', 'true');
    expect(row).toHaveAttribute('aria-selected', 'false');
    expect(within(row).getByRole('checkbox')).not.toHaveAttribute('disabled');

    buttons = within(row).getAllByRole('button');
    expect(buttons[0]).not.toHaveAttribute('disabled');
    expect(buttons[1]).not.toHaveAttribute('disabled');
  });
});
