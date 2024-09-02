import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import userEvent from '@testing-library/user-event';
import { ReactNode, useState } from 'react';

import { Button } from '@keystar/ui/button';
import {
  act,
  fireEvent,
  firePress,
  renderWithProvider,
  within,
} from '#test-utils';

import { Toaster, ToastOptions, toastQueue } from '..';
import { clearToastQueue } from '../Toaster';
import { ToastValue } from '../types';

function RenderToastButton(
  props: ToastOptions & Pick<Partial<ToastValue>, 'tone'> = { tone: 'neutral' }
) {
  return (
    <Button
      onPress={() =>
        toastQueue[props.tone || 'neutral']('Toast is default', props)
      }
    >
      Show Default Toast
    </Button>
  );
}

function renderComponent(contents: ReactNode) {
  return renderWithProvider(
    <>
      <Toaster />
      {contents}
    </>
  );
}

function fireAnimationEnd(alert: HTMLElement) {
  let e = new Event('animationend', { bubbles: true, cancelable: false });
  // @ts-expect-error
  e.animationName = 'fade-out';
  fireEvent(alert, e);
}

describe('toast/Toast', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeAll(() => {
    user = userEvent.setup({ delay: null });
  });
  beforeEach(() => {
    jest.useFakeTimers();
    clearToastQueue();
  });

  afterEach(() => {
    act(() => jest.runAllTimers());
  });

  it('renders a button that triggers a toast', async () => {
    let { getByRole, queryByRole } = renderComponent(<RenderToastButton />);
    let button = getByRole('button');

    expect(queryByRole('alertdialog')).toBeNull();
    expect(queryByRole('alert')).toBeNull();
    await user.click(button);

    act(() => jest.advanceTimersByTime(100));

    let region = getByRole('region');
    expect(region).toHaveAttribute('aria-label', '1 notification.');

    let toast = getByRole('alertdialog');
    let alert = within(toast).getByRole('alert');
    expect(toast).toBeVisible();
    expect(alert).toBeVisible();

    button = within(toast).getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Close');
    await user.click(button);

    fireAnimationEnd(alert);
    expect(queryByRole('alertdialog')).toBeNull();
    expect(queryByRole('alert')).toBeNull();
  });

  it('should label icon by tone', async () => {
    let { getByRole } = renderComponent(<RenderToastButton tone="positive" />);
    let button = getByRole('button');
    await user.click(button);

    let toast = getByRole('alertdialog');
    let alert = within(toast).getByRole('alert');
    let icon = within(alert).getByRole('img');
    expect(icon).toHaveAttribute('aria-label', 'Success');
    let title = within(alert).getByText('Toast is default').parentElement!; // content is wrapped
    expect(toast).toHaveAttribute('aria-labelledby', `${title.id}`);
  });

  it('removes a toast via timeout', () => {
    let { getByRole, queryByRole } = renderComponent(
      <RenderToastButton timeout={5000} />
    );
    let button = getByRole('button');

    firePress(button);

    let toast = getByRole('alertdialog');
    expect(toast).toBeVisible();

    act(() => jest.advanceTimersByTime(1000));
    expect(toast).not.toHaveAttribute('data-animation', 'exiting');

    act(() => jest.advanceTimersByTime(5000));
    expect(toast).toHaveAttribute('data-animation', 'exiting');

    fireAnimationEnd(toast);
    expect(queryByRole('alertdialog')).toBeNull();
  });

  it('pauses timers when hovering', async () => {
    let { getByRole, queryByRole } = renderComponent(
      <RenderToastButton timeout={5000} />
    );
    let button = getByRole('button');

    await user.click(button);

    let toast = getByRole('alertdialog');
    expect(toast).toBeVisible();

    act(() => jest.advanceTimersByTime(1000));
    await user.hover(toast);

    act(() => jest.advanceTimersByTime(7000));
    expect(toast).not.toHaveAttribute('data-animation', 'exiting');

    await user.unhover(toast);

    act(() => jest.advanceTimersByTime(4000));
    expect(toast).toHaveAttribute('data-animation', 'exiting');

    fireAnimationEnd(toast);
    expect(queryByRole('alertdialog')).toBeNull();
  });

  it('pauses timers when focusing', async () => {
    let { getByRole, queryByRole } = renderComponent(
      <RenderToastButton timeout={5000} />
    );
    let button = getByRole('button');

    await user.click(button);

    let toast = getByRole('alertdialog');
    expect(toast).toBeVisible();

    act(() => jest.advanceTimersByTime(1000));
    act(() => within(toast).getByRole('button').focus());

    act(() => jest.advanceTimersByTime(7000));
    expect(toast).not.toHaveAttribute('data-animation', 'exiting');

    act(() => within(toast).getByRole('button').blur());

    act(() => jest.advanceTimersByTime(4000));
    expect(toast).toHaveAttribute('data-animation', 'exiting');

    fireAnimationEnd(toast);
    expect(queryByRole('alertdialog')).toBeNull();
  });

  it('renders a toast with an action', async () => {
    let onAction = jest.fn();
    let onClose = jest.fn();
    let { getByRole, queryByRole } = renderComponent(
      <RenderToastButton
        actionLabel="Action"
        onAction={onAction}
        onClose={onClose}
      />
    );
    let button = getByRole('button');

    expect(queryByRole('alertdialog')).toBeNull();
    await user.click(button);

    act(() => jest.advanceTimersByTime(100));
    let toast = getByRole('alertdialog');
    let alert = within(toast).getByRole('alert');
    expect(toast).toBeVisible();
    expect(alert).toBeVisible();

    let buttons = within(alert).getAllByRole('button');
    expect(buttons[0]).toHaveTextContent('Action');
    await user.click(buttons[0]);

    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes toast on action', async () => {
    let onAction = jest.fn();
    let onClose = jest.fn();
    let { getByRole, queryByRole } = renderComponent(
      <RenderToastButton
        actionLabel="Action"
        onAction={onAction}
        onClose={onClose}
        shouldCloseOnAction
      />
    );
    let button = getByRole('button');

    expect(queryByRole('alertdialog')).toBeNull();
    await user.click(button);

    act(() => jest.advanceTimersByTime(100));
    let toast = getByRole('alertdialog');
    let alert = within(toast).getByRole('alert');
    expect(toast).toBeVisible();
    expect(alert).toBeVisible();

    let buttons = within(toast).getAllByRole('button');
    expect(buttons[0]).toHaveTextContent('Action');
    await user.click(buttons[0]);

    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);

    expect(toast).toHaveAttribute('data-animation', 'exiting');
    fireAnimationEnd(toast);
    expect(queryByRole('alertdialog')).toBeNull();
  });

  it('prioritizes toasts based on tone', async () => {
    function ToastPriorites(props = {}) {
      return (
        <div>
          <Button onPress={() => toastQueue.info('Info', props)}>Info</Button>
          <Button onPress={() => toastQueue.critical('Error', props)}>
            Error
          </Button>
        </div>
      );
    }

    let { getByRole, getAllByRole, queryByRole } = renderComponent(
      <ToastPriorites />
    );
    let buttons = getAllByRole('button');

    // show info toast first. error toast should supersede it.

    expect(queryByRole('alertdialog')).toBeNull();
    await user.click(buttons[0]);

    let toast = getByRole('alertdialog');
    expect(toast).toBeVisible();
    expect(toast).toHaveTextContent('Info');

    await user.click(buttons[1]);
    fireAnimationEnd(toast);

    toast = getByRole('alertdialog');
    expect(toast).toHaveTextContent('Error');

    await user.click(within(toast).getByRole('button'));
    fireAnimationEnd(toast);

    toast = getByRole('alertdialog');
    expect(toast).toHaveTextContent('Info');

    await user.click(within(toast).getByRole('button'));
    fireAnimationEnd(toast);
    expect(queryByRole('alertdialog')).toBeNull();

    // again, but with error toast first.

    await user.click(buttons[1]);
    toast = getByRole('alertdialog');
    expect(toast).toHaveTextContent('Error');

    await user.click(buttons[0]);
    toast = getByRole('alertdialog');
    expect(toast).toHaveTextContent('Error');

    await user.click(within(toast).getByRole('button'));
    fireAnimationEnd(toast);

    toast = getByRole('alertdialog');
    expect(toast).toHaveTextContent('Info');

    await user.click(within(toast).getByRole('button'));
    fireAnimationEnd(toast);
    expect(queryByRole('alertdialog')).toBeNull();
  });

  it('can focus toast region using F6', async () => {
    let { getByRole } = renderComponent(<RenderToastButton timeout={5000} />);
    let button = getByRole('button');

    await user.click(button);

    let toast = getByRole('alertdialog');
    expect(toast).toBeVisible();

    expect(document.activeElement).toBe(button);
    fireEvent.keyDown(button, { key: 'F6' });
    fireEvent.keyUp(button, { key: 'F6' });

    let region = getByRole('region');
    expect(document.activeElement).toBe(region);
  });

  it('should restore focus when a toast exits', async () => {
    let { getByRole, queryByRole } = renderComponent(<RenderToastButton />);
    let button = getByRole('button');

    await user.click(button);

    let toast = getByRole('alertdialog');
    let closeButton = within(toast).getByRole('button');

    await user.click(closeButton);
    fireAnimationEnd(toast);
    expect(queryByRole('alertdialog')).toBeNull();
    expect(button).toHaveFocus();
  });

  it('should move focus to the next available toast, when closed', async () => {
    let { getByRole, queryByRole } = renderComponent(<RenderToastButton />);
    let button = getByRole('button');

    await user.click(button);
    await user.click(button);

    let toast = getByRole('alertdialog');
    let closeButton = within(toast).getByRole('button');
    await user.click(closeButton);
    fireAnimationEnd(toast);

    // next toast
    toast = getByRole('alertdialog');
    expect(document.activeElement).toBe(toast);
    closeButton = within(toast).getByRole('button');
    await user.click(closeButton);
    fireAnimationEnd(toast);

    expect(queryByRole('alertdialog')).toBeNull();
    expect(document.activeElement).toBe(button);
  });

  it('should support programmatically closing toasts', async () => {
    function ToastToggle() {
      let [close, setClose] = useState<(() => void) | null>(null);

      return (
        <Button
          onPress={() =>
            close
              ? // @ts-ignore
                setClose(close())
              : setClose(() => toastQueue.positive('Toast is done!'))
          }
        >
          {close ? 'Hide' : 'Show'} toast
        </Button>
      );
    }

    let { getByRole, queryByRole } = renderComponent(<ToastToggle />);
    let button = getByRole('button');

    await user.click(button);

    let toast = getByRole('alert');
    expect(toast).toBeVisible();

    await user.click(button);
    fireAnimationEnd(toast);
    expect(queryByRole('alert')).toBeNull();
  });

  it('should only render one Toaster', async () => {
    let { getByRole, getAllByRole, rerender } = renderWithProvider(
      <>
        <Toaster key="first" />
        <Toaster key="second" />
        <RenderToastButton />
      </>
    );

    let button = getByRole('button');
    await user.click(button);

    expect(getAllByRole('region')).toHaveLength(1);
    expect(getAllByRole('alertdialog')).toHaveLength(1);

    rerender(
      <>
        <Toaster key="second" />
        <RenderToastButton />
      </>
    );

    expect(getAllByRole('region')).toHaveLength(1);
    expect(getAllByRole('alertdialog')).toHaveLength(1);

    rerender(
      <>
        <Toaster key="first" />
        <RenderToastButton />
      </>
    );

    expect(getAllByRole('region')).toHaveLength(1);
    expect(getAllByRole('alertdialog')).toHaveLength(1);

    rerender(
      <>
        <Toaster key="first" />
        <Toaster key="second" />
        <RenderToastButton />
      </>
    );

    expect(getAllByRole('region')).toHaveLength(1);
    expect(getAllByRole('alertdialog')).toHaveLength(1);
  });

  it('should support custom aria-label', () => {
    let { getByRole } = renderWithProvider(
      <>
        <Toaster aria-label="Toasts" />
        <RenderToastButton />
      </>
    );

    let button = getByRole('button');
    firePress(button);

    let region = getByRole('region');
    expect(region).toHaveAttribute('aria-label', 'Toasts');
  });
});
