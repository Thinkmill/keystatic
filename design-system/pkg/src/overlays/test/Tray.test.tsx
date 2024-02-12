import {
  OverlayTriggerProps,
  useOverlayTriggerState,
} from '@react-stately/overlays';
import { expect, jest, describe, it } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { TestProvider } from '@keystar/ui/core';

import { Tray, TrayProps } from '..';

describe('overlays/Tray', () => {
  it('should render nothing with falsy isOpen', () => {
    let { queryByRole } = render(
      <TestTray>
        <div role="dialog">contents</div>
      </TestTray>
    );

    expect(queryByRole('dialog')).toBeNull();
    expect(document.documentElement).not.toHaveStyle('overflow: hidden');
  });

  it('should render when isOpen is true', async () => {
    let { getByRole } = render(
      <TestTray isOpen>
        <div role="dialog">contents</div>
      </TestTray>
    );

    // wait for animation
    await waitFor(() => {
      expect(getByRole('dialog')).toBeVisible();
    });

    expect(getByRole('dialog')).toBeVisible();
    expect(document.documentElement).toHaveStyle('overflow: hidden');
  });

  it('hides the tray when pressing the escape key', async () => {
    let onOpenChange = jest.fn();
    let { getByRole } = render(
      <TestTray isOpen onOpenChange={onOpenChange}>
        <div role="dialog">contents</div>
      </TestTray>
    );

    // wait for animation
    await waitFor(() => {
      expect(getByRole('dialog')).toBeVisible();
    });

    fireEvent.keyDown(getByRole('dialog'), { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledTimes(1);
  });

  it('hides the tray when clicking outside', async () => {
    let onOpenChange = jest.fn();
    let { getByRole } = render(
      <TestTray isOpen onOpenChange={onOpenChange}>
        <div role="dialog">contents</div>
      </TestTray>
    );

    // wait for animation
    await waitFor(() => {
      expect(getByRole('dialog')).toBeVisible();
    });

    fireEvent.mouseDown(document.body);
    fireEvent.mouseUp(document.body);
    expect(onOpenChange).toHaveBeenCalledTimes(1);
  });
});

function TestTray(props: OverlayTriggerProps & Omit<TrayProps, 'state'>) {
  let state = useOverlayTriggerState(props);
  return (
    <TestProvider>
      <Tray {...props} state={state} />
    </TestProvider>
  );
}
