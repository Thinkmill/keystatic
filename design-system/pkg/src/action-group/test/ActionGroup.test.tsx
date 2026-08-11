import { firePress, renderWithProvider } from '#test-utils';

import { ActionGroup, ActionGroupItem } from '..';
import { expect, describe, it, jest } from '@jest/globals';
import { Text } from '@keystar/ui/typography';

describe('action-group/ActionGroup', () => {
  it('renders', () => {
    const { getByRole, getAllByRole } = renderWithProvider(
      <ActionGroup data-testid="test-id">
        <ActionGroupItem id="one">Child one</ActionGroupItem>
        <ActionGroupItem id="two">Child two</ActionGroupItem>
      </ActionGroup>
    );

    expect(getByRole('toolbar')).toBeTruthy();
    expect(getAllByRole('button')).toHaveLength(2);
  });

  it('supports actions and selection without collection state adapters', () => {
    let onAction = jest.fn();
    let onSelectionChange = jest.fn();
    let result = renderWithProvider(
      <ActionGroup
        aria-label="Formatting"
        selectionMode="multiple"
        onAction={onAction}
        onSelectionChange={onSelectionChange}
      >
        <ActionGroupItem id="bold">Bold</ActionGroupItem>
        <ActionGroupItem id="italic">Italic</ActionGroupItem>
      </ActionGroup>
    );

    firePress(result.getByRole('button', { name: 'Bold' }));
    expect(onAction).toHaveBeenCalledWith('bold');
    expect(onSelectionChange).toHaveBeenCalledWith(new Set(['bold']));
    expect(result.getByRole('button', { name: 'Bold' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });

  it('keeps hidden labels accessible', () => {
    let result = renderWithProvider(
      <ActionGroup aria-label="Formatting" buttonLabelBehavior="hide">
        <ActionGroupItem id="bold" textValue="Bold">
          <span aria-hidden>icon</span>
          <Text>Bold</Text>
        </ActionGroupItem>
      </ActionGroup>
    );

    expect(result.getByRole('button', { name: 'Bold' })).toBeVisible();
  });

  it('keeps disabled actions disabled after collapsing into the menu', () => {
    let bounds = jest
      .spyOn(window.HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue(new DOMRect(0, 0, 40, 40));
    let originalResizeObserver = global.ResizeObserver;
    global.ResizeObserver = class {
      constructor(private callback: ResizeObserverCallback) {}
      observe() {
        this.callback([], this as unknown as ResizeObserver);
      }
      disconnect() {}
      unobserve() {}
    } as typeof ResizeObserver;
    let onAction = jest.fn();
    let consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    try {
      let result = renderWithProvider(
        <ActionGroup
          aria-label="Actions"
          disabledKeys={['delete']}
          items={[{ id: 'delete' }]}
          overflowMode="collapse"
          onAction={onAction}
        >
          {item => <ActionGroupItem id={item.id}>Delete</ActionGroupItem>}
        </ActionGroup>
      );

      firePress(result.getByRole('button', { name: 'More actions' }));
      let deleteAction = result.getByRole('menuitem', { name: 'Delete' });
      expect(deleteAction).toHaveAttribute('aria-disabled', 'true');
      firePress(deleteAction);
      expect(onAction).not.toHaveBeenCalled();
      expect(
        consoleError.mock.calls.some(args =>
          args.some(
            arg =>
              typeof arg === 'string' &&
              arg.includes(
                'Each child in a list should have a unique "key" prop'
              )
          )
        )
      ).toBe(false);
    } finally {
      bounds.mockRestore();
      consoleError.mockRestore();
      global.ResizeObserver = originalResizeObserver;
    }
  });
});
