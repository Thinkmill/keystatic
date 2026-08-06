import { describe, expect, it, jest } from '@jest/globals';

import { Button } from '@keystar/ui/button';
import { firePress, renderWithProvider } from '#test-utils';

import { Dialog, DialogTrigger } from '..';

describe('dialog/DialogTrigger', () => {
  it('opens and closes a modal through RAC state', () => {
    let onOpenChange = jest.fn();
    let tree = renderWithProvider(
      <DialogTrigger onOpenChange={onOpenChange}>
        <Button>Open dialog</Button>
        {close => (
          <Dialog aria-label="Example dialog">
            <Button onPress={close}>Close dialog</Button>
          </Dialog>
        )}
      </DialogTrigger>
    );

    firePress(tree.getByRole('button', { name: 'Open dialog' }));
    expect(tree.getByRole('dialog', { name: 'Example dialog' })).toBeVisible();

    firePress(tree.getByRole('button', { name: 'Close dialog' }));
    expect(
      tree.queryByRole('dialog', { name: 'Example dialog' })
    ).not.toBeInTheDocument();
    expect(onOpenChange).toHaveBeenNthCalledWith(1, true);
    expect(onOpenChange).toHaveBeenNthCalledWith(2, false);
  });

  it('supports a controlled popover dialog', () => {
    let tree = renderWithProvider(
      <DialogTrigger type="popover" isOpen>
        <Button>Popover trigger</Button>
        <Dialog aria-label="Popover dialog">Popover contents</Dialog>
      </DialogTrigger>
    );

    expect(tree.getByRole('dialog', { name: 'Popover dialog' })).toBeVisible();
  });
});
