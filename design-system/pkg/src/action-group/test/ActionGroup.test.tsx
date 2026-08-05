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
});
