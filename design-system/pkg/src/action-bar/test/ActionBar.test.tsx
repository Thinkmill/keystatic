import {
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { act, renderWithProvider, within } from '#test-utils';

import { ListExample } from '../stories/ListExample';

// jest.mock('@react-aria/live-announcer');

describe('action-bar/ActionBar', () => {
  let user: ReturnType<typeof userEvent.setup>;
  beforeAll(() => {
    user = userEvent.setup({ delay: null });
    jest
      .spyOn(window.HTMLElement.prototype, 'clientWidth', 'get')
      .mockImplementation(() => 1000);
    jest
      .spyOn(window.HTMLElement.prototype, 'clientHeight', 'get')
      .mockImplementation(() => 500);
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => jest.runAllTimers());
  });

  it('should open when there are selected items', async () => {
    let tree = renderWithProvider(<ListExample />);
    act(() => jest.runAllTimers());

    let grid = tree.getByRole('grid');
    let rows = within(grid).getAllByRole('row');

    expect(tree.queryByRole('toolbar')).toBeNull();
    await user.click(rows[1]);

    // FIXME: get this mock working
    // expect(announce).toHaveBeenCalledWith('Actions available.');

    let toolbar = tree.getByRole('toolbar');
    expect(toolbar).toHaveAttribute('aria-label', 'Actions');

    let buttons = within(toolbar).getAllByRole('button');
    expect(buttons).toHaveLength(3);

    expect(tree.getByText('1 selected')).toBeInTheDocument();

    let clearButton = tree.getByLabelText('Clear selection');
    expect(clearButton.tagName).toBe('BUTTON');
  });

  it('should update the selected count when selecting more items', async () => {
    let tree = renderWithProvider(<ListExample />);
    act(() => jest.runAllTimers());

    let grid = tree.getByRole('grid');
    let rows = within(grid).getAllByRole('row');

    await user.click(rows[1]);

    let selectedCount = tree.getByText('1 selected');

    await user.click(rows[2]);
    expect(selectedCount).toHaveTextContent('2 selected');
  });

  it('should close and restore focus when pressing the clear button', async () => {
    let tree = renderWithProvider(<ListExample />);
    act(() => jest.runAllTimers());

    let grid = tree.getByRole('grid');
    let rows = within(grid).getAllByRole('row');
    let checkbox = within(rows[1]).getByRole('checkbox');

    await user.click(checkbox);
    act(() => jest.runAllTimers());
    expect(document.activeElement).toBe(checkbox);

    let clearButton = tree.getByLabelText('Clear selection');

    await user.click(clearButton);
    act(() => jest.runAllTimers());
    act(() => jest.runAllTimers());

    expect(tree.queryByRole('toolbar')).toBeNull();
    expect(document.activeElement).toBe(checkbox.closest('[role="row"]'));
  });

  it('should close when pressing the escape key', async () => {
    let tree = renderWithProvider(<ListExample />);
    act(() => jest.runAllTimers());

    let table = tree.getByRole('grid');
    let rows = within(table).getAllByRole('row');
    let checkbox = within(rows[1]).getByRole('checkbox');

    await user.click(checkbox);
    act(() => jest.runAllTimers());
    expect(document.activeElement).toBe(checkbox);

    let toolbar = tree.getByRole('toolbar');
    act(() => within(toolbar).getAllByRole('button')[0].focus());

    await user.keyboard('{Escape}');
    act(() => jest.runAllTimers());
    act(() => jest.runAllTimers());

    expect(tree.queryByRole('toolbar')).toBeNull();
    expect(document.activeElement).toBe(checkbox.closest('[role="row"]'));
  });

  it('should fire onAction when clicking on an action', async () => {
    let onAction = jest.fn();
    let tree = renderWithProvider(<ListExample onAction={onAction} />);
    act(() => jest.runAllTimers());

    let grid = tree.getByRole('grid');
    let rows = within(grid).getAllByRole('row');

    await user.click(rows[1]);

    let toolbar = tree.getByRole('toolbar');
    await user.click(within(toolbar).getAllByRole('button')[0]);

    expect(onAction).toHaveBeenCalledWith('edit');
  });
});
