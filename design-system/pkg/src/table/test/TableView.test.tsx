import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, renderWithProvider, within } from '#test-utils';
import { useDragAndDrop } from '@keystar/ui/drag-and-drop';

import {
  Cell,
  Column,
  Row,
  TableBody,
  TableDragCell,
  TableDragColumn,
  TableHeader,
  TableLoadMoreItem,
  TableSelectionCell,
  TableSelectionColumn,
  TableView,
} from '..';

describe('table/TableView', () => {
  let clientWidth: jest.SpiedGetter<number>;
  let clientHeight: jest.SpiedGetter<number>;

  beforeAll(() => {
    global.IntersectionObserver = jest.fn(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      takeRecords: jest.fn(),
      unobserve: jest.fn(),
    })) as unknown as typeof IntersectionObserver;
    clientWidth = jest
      .spyOn(window.HTMLElement.prototype, 'clientWidth', 'get')
      .mockImplementation(() => 1000);
    clientHeight = jest
      .spyOn(window.HTMLElement.prototype, 'clientHeight', 'get')
      .mockImplementation(() => 1000);
    jest.useFakeTimers();
  });

  afterAll(() => {
    clientWidth.mockRestore();
    clientHeight.mockRestore();
    jest.useRealTimers();
  });

  function renderTable(
    props: {
      allowsResizing?: boolean;
      loadingState?: 'loadingMore';
      selectionMode?: 'multiple';
    } = {}
  ) {
    let { allowsResizing, loadingState, ...tableProps } = props;
    let result = renderWithProvider(
      <TableView aria-label="Files" {...tableProps}>
        <TableHeader>
          {tableProps.selectionMode && <TableSelectionColumn />}
          <Column id="name" isRowHeader allowsResizing={allowsResizing}>
            Name
          </Column>
          <Column id="size">Size</Column>
        </TableHeader>
        <TableBody>
          <Row id="one">
            {tableProps.selectionMode && <TableSelectionCell />}
            <Cell>One</Cell>
            <Cell>1 KB</Cell>
          </Row>
          <Row id="two">
            {tableProps.selectionMode && <TableSelectionCell />}
            <Cell>Two</Cell>
            <Cell>2 KB</Cell>
          </Row>
          {loadingState && <TableLoadMoreItem isLoading />}
        </TableBody>
      </TableView>
    );
    act(() => jest.runAllTimers());
    return result;
  }

  it('renders a static collection through the public virtualizer', () => {
    let result = renderTable();
    let table = result.getByRole('grid', { name: 'Files' });
    expect(within(table).getAllByRole('columnheader')).toHaveLength(2);
    expect(within(table).getAllByRole('row')).toHaveLength(3);
    expect(within(table).getByText('One')).toBeVisible();
    expect(within(table).getByText('2 KB')).toBeVisible();
  });

  it('renders a dynamic collection', () => {
    let items = [
      { id: 'one', name: 'One' },
      { id: 'two', name: 'Two' },
    ];
    let onAction = jest.fn();
    let result = renderWithProvider(
      <TableView aria-label="Dynamic files" onAction={onAction}>
        <TableHeader>
          <Column id="name" isRowHeader>
            Name
          </Column>
        </TableHeader>
        <TableBody items={items}>
          {item => (
            <Row id={item.id}>
              <Cell>{item.name}</Cell>
            </Row>
          )}
        </TableBody>
      </TableView>
    );
    act(() => jest.runAllTimers());
    expect(result.getAllByRole('row')).toHaveLength(3);
    expect(result.getByText('Two')).toBeVisible();
    fireEvent.click(result.getByText('Two'));
    expect(onAction).toHaveBeenCalledWith('two');
  });

  it('applies table typography to plain text content', () => {
    let result = renderTable();
    expect(result.getByText('Name').tagName).toBe('SPAN');
    expect(result.getByText('One').tagName).toBe('SPAN');
  });

  it('retains checkbox selection', () => {
    let result = renderTable({ selectionMode: 'multiple' });
    let rows = result.getAllByRole('row');
    let checkbox = within(rows[1]).getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(rows[1]).toHaveAttribute('aria-selected', 'true');
    expect(within(rows[0]).getByRole('checkbox')).toBePartiallyChecked();
  });

  it('renders a loading row without requiring a load-more callback', () => {
    let result = renderTable({ loadingState: 'loadingMore' });
    expect(result.getAllByRole('row')).toHaveLength(4);
    expect(result.getByRole('progressbar')).toHaveAttribute(
      'aria-label',
      'Loading more…'
    );
  });

  it('uses the public RAC resizable table layout', () => {
    let result = renderTable({ allowsResizing: true });
    expect(result.getByRole('slider')).toHaveAttribute(
      'aria-label',
      'Resize column'
    );
  });

  it('preserves hidden header behavior and column cosmetic attributes', () => {
    let result = renderWithProvider(
      <TableView aria-label="Actions" density="compact" overflowMode="wrap">
        <TableHeader>
          <Column id="action" align="end" hideHeader showDivider>
            Actions
          </Column>
          <Column id="name" isRowHeader>
            Name
          </Column>
        </TableHeader>
        <TableBody>
          <Row id="one">
            <Cell>Open</Cell>
            <Cell>One</Cell>
          </Row>
        </TableBody>
      </TableView>
    );
    act(() => jest.runAllTimers());
    let header = result.getAllByRole('columnheader')[0];
    expect(header).toHaveAttribute('data-align', 'end');
    expect(header).toHaveAttribute('data-density', 'compact');
    expect(header).toHaveAttribute('data-hide-header', 'true');
    expect(header).toHaveAttribute('data-overflow-mode', 'wrap');
    expect(header).toHaveAttribute('data-show-divider', 'true');
    expect(within(header).getByText('Actions')).toHaveStyle({
      position: 'absolute',
    });
    expect(header).toHaveAccessibleName('Actions');
  });

  it('accepts the public RAC drag-and-drop hook bundle', () => {
    function DraggableTable() {
      let { dragAndDropHooks } = useDragAndDrop({
        getItems: keys => [...keys].map(key => ({ 'text/plain': String(key) })),
        onReorder: jest.fn(),
      });
      return (
        <TableView
          aria-label="Draggable files"
          dragAndDropHooks={dragAndDropHooks}
        >
          <TableHeader>
            <TableDragColumn />
            <Column id="name" isRowHeader>
              Name
            </Column>
          </TableHeader>
          <TableBody>
            <Row id="one">
              <TableDragCell />
              <Cell>One</Cell>
            </Row>
          </TableBody>
        </TableView>
      );
    }

    let result = renderWithProvider(<DraggableTable />);
    act(() => jest.runAllTimers());
    expect(result.getByRole('button', { name: 'Drag' })).toBeVisible();
  });
});
