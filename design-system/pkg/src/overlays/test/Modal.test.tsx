import {
  OverlayTriggerProps,
  useOverlayTriggerState,
} from '@react-stately/overlays';
import { expect, it, describe, jest } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { TestProvider } from '@keystar/ui/core';

import { Modal, ModalProps } from '..';

describe('overlays/Modal', () => {
  it('should render nothing with falsy isOpen', () => {
    let { queryByRole } = render(
      <TestModal>
        <div role="dialog">contents</div>
      </TestModal>
    );

    expect(queryByRole('dialog')).toBeNull();
    expect(document.documentElement).not.toHaveStyle('overflow: hidden');
  });

  it('should render when isOpen is true', async () => {
    let { getByRole } = render(
      <TestModal isOpen>
        <div role="dialog">contents</div>
      </TestModal>
    );

    // wait for animation
    await waitFor(() => {
      expect(getByRole('dialog')).toBeVisible();
    });

    expect(getByRole('dialog')).toBeVisible();
    expect(document.documentElement).toHaveStyle('overflow: hidden');
  });

  it('hides the modal when pressing the escape key', async () => {
    let onOpenChange = jest.fn();
    let { getByRole } = render(
      <TestModal isOpen onOpenChange={onOpenChange}>
        <div role="dialog">contents</div>
      </TestModal>
    );

    // wait for animation
    await waitFor(() => {
      expect(getByRole('dialog')).toBeVisible();
    });

    fireEvent.keyDown(getByRole('dialog'), { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledTimes(1);
  });

  it("doesn't hide the modal when clicking outside by default", async () => {
    let onOpenChange = jest.fn();
    let { getByRole } = render(
      <TestModal isOpen onOpenChange={onOpenChange}>
        <div role="dialog">contents</div>
      </TestModal>
    );

    // wait for animation
    await waitFor(() => {
      expect(getByRole('dialog')).toBeVisible();
    });

    fireEvent.mouseUp(document.body);
    expect(onOpenChange).toHaveBeenCalledTimes(0);
  });

  it('hides the modal when clicking outside if isDismissible is true', async () => {
    let onOpenChange = jest.fn();
    let { getByRole } = render(
      <TestModal isOpen onOpenChange={onOpenChange} isDismissable>
        <div role="dialog">contents</div>
      </TestModal>
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

function TestModal(props: OverlayTriggerProps & Omit<ModalProps, 'state'>) {
  let state = useOverlayTriggerState(props);
  return (
    <TestProvider>
      <Modal {...props} state={state} />
    </TestProvider>
  );
}
