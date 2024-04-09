import {
  OverlayTriggerProps,
  useOverlayTriggerState,
} from '@react-stately/overlays';
import { expect, jest, describe, it } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { TestProvider } from '@keystar/ui/core';
import { useRef } from 'react';

import { Popover, PopoverProps } from '..';

describe('overlays/Popover', () => {
  it('should render nothing with falsy isOpen', () => {
    let { queryByRole } = render(
      <TestPopover>
        <div role="dialog">contents</div>
      </TestPopover>
    );

    expect(queryByRole('dialog')).toBeNull();
    expect(document.documentElement).not.toHaveStyle('overflow: hidden');
  });

  it('should render when isOpen is true', async () => {
    let { getByRole } = render(
      <TestPopover isOpen>
        <div role="dialog">contents</div>
      </TestPopover>
    );

    // wait for animation
    await waitFor(() => {
      expect(getByRole('dialog')).toBeVisible();
    });

    expect(getByRole('dialog')).toBeVisible();
  });

  it('hides the popover when pressing the escape key', async () => {
    let onOpenChange = jest.fn();
    let { getByRole } = render(
      <TestPopover isOpen onOpenChange={onOpenChange}>
        <div role="dialog">contents</div>
      </TestPopover>
    );

    // wait for animation
    await waitFor(() => {
      expect(getByRole('dialog')).toBeVisible();
    });

    fireEvent.keyDown(getByRole('dialog'), { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledTimes(1);
  });

  it('hides the popover when clicking outside', async () => {
    let onOpenChange = jest.fn();
    let { getByRole } = render(
      <TestPopover isOpen onOpenChange={onOpenChange}>
        <div role="dialog">contents</div>
      </TestPopover>
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

function TestPopover(
  props: OverlayTriggerProps & Omit<PopoverProps, 'state' | 'triggerRef'>
) {
  let ref = useRef(null);
  let state = useOverlayTriggerState(props);
  return (
    <TestProvider>
      <Popover {...props} state={state} triggerRef={ref} />
    </TestProvider>
  );
}
