import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { KeystarProvider } from '@keystar/ui/core';
import { LocalConflictNotice } from './local-conflict-notice';

function renderNotice(props: {
  heading?: string;
  reason: string;
  onReload: () => Promise<void>;
}) {
  return render(
    <KeystarProvider>
      <LocalConflictNotice {...props} />
    </KeystarProvider>
  );
}

describe('LocalConflictNotice', () => {
  test('renders conflict reason and reloads when Reload latest is pressed', async () => {
    const user = userEvent.setup();
    let resolveReload!: () => void;
    const onReload = vi.fn(
      () =>
        new Promise<void>(resolve => {
          resolveReload = resolve;
        })
    );

    renderNotice({
      reason: 'This entry has changed on disk since it was opened.',
      onReload,
    });

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Save conflict')).toBeInTheDocument();
    expect(
      screen.getByText('This entry has changed on disk since it was opened.')
    ).toBeInTheDocument();

    const button = screen.getByRole('button', { name: 'Reload latest' });
    await user.click(button);

    expect(onReload).toHaveBeenCalledTimes(1);
    expect(button).toBeDisabled();

    resolveReload();
    await waitFor(() => {
      expect(button).toBeEnabled();
    });
  });

  test('renders custom heading and surfaces reload failure message', async () => {
    const user = userEvent.setup();
    const onReload = vi.fn(async () => {
      throw new Error('Failed to fetch tree');
    });

    renderNotice({
      heading: 'Delete conflict',
      reason: 'Modified in another tab.',
      onReload,
    });

    expect(screen.getByText('Delete conflict')).toBeInTheDocument();

    const button = screen.getByRole('button', { name: 'Reload latest' });
    await user.click(button);

    expect(await screen.findByText('Failed to fetch tree')).toBeInTheDocument();
    expect(button).toBeEnabled();
  });
});
