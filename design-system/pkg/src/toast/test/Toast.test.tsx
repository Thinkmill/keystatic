import '@testing-library/jest-dom';
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
  beforeEach(() => {
    jest.useFakeTimers();
    clearToastQueue();
  });

  afterEach(() => {
    act(() => jest.runAllTimers());
  });

  it('renders a button that triggers a toast', () => {
    let { getByRole, queryByRole } = renderComponent(<RenderToastButton />);
    let button = getByRole('button');

    expect(queryByRole('alert')).toBeNull();
    firePress(button);

    let region = getByRole('region');
    expect(region).toHaveAttribute('aria-label', 'Notifications');

    let alert = getByRole('alert');
    expect(alert).toBeVisible();

    button = within(alert).getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Close');
    firePress(button);

    fireAnimationEnd(alert);
    expect(queryByRole('alert')).toBeNull();
  });

  it('should label icon by tone', () => {
    let { getByRole } = renderComponent(<RenderToastButton tone="positive" />);
    let button = getByRole('button');
    firePress(button);

    let alert = getByRole('alert');
    let icon = within(alert).getByRole('img');
    expect(icon).toHaveAttribute('aria-label', 'Success');
  });

  it('removes a toast via timeout', () => {
    let { getByRole, queryByRole } = renderComponent(
      <RenderToastButton timeout={5000} />
    );
    let button = getByRole('button');

    firePress(button);

    let toast = getByRole('alert');
    expect(toast).toBeVisible();

    act(() => jest.advanceTimersByTime(1000));
    expect(toast).not.toHaveAttribute('data-animation', 'exiting');

    act(() => jest.advanceTimersByTime(5000));
    expect(toast).toHaveAttribute('data-animation', 'exiting');

    fireAnimationEnd(toast);
    expect(queryByRole('alert')).toBeNull();
  });

  // TODO: Can't get this working + it sometimes takes down the other tests...
  // it('pauses timers when hovering', () => {
  //   let { getByRole, queryByRole } = renderComponent(
  //     <RenderToastButton timeout={5000} />
  //   );
  //   let button = getByRole('button');

  //   firePress(button);

  //   let toast = getByRole('alert');
  //   expect(toast).toBeVisible();

  //   act(() => {
  //     jest.advanceTimersByTime(1000);
  //   });
  //   act(() => {
  //     userEvent.hover(toast);
  //   });

  //   act(() => {
  //     jest.advanceTimersByTime(7000);
  //   });
  //   expect(toast).not.toHaveAttribute('data-animation', 'exiting');

  //   act(() => {
  //     userEvent.unhover(toast);
  //   });

  //   act(() => {
  //     jest.advanceTimersByTime(4000);
  //   });
  //   expect(toast).toHaveAttribute('data-animation', 'exiting');

  //   fireAnimationEnd(toast);
  //   expect(queryByRole('alert')).toBeNull();
  // });

  it('pauses timers when focusing', () => {
    let { getByRole, queryByRole } = renderComponent(
      <RenderToastButton timeout={5000} />
    );
    let button = getByRole('button');

    firePress(button);

    let toast = getByRole('alert');
    expect(toast).toBeVisible();

    act(() => jest.advanceTimersByTime(1000));
    act(() => within(toast).getByRole('button').focus());

    act(() => jest.advanceTimersByTime(7000));
    expect(toast).not.toHaveAttribute('data-animation', 'exiting');

    act(() => within(toast).getByRole('button').blur());

    act(() => jest.advanceTimersByTime(4000));
    expect(toast).toHaveAttribute('data-animation', 'exiting');

    fireAnimationEnd(toast);
    expect(queryByRole('alert')).toBeNull();
  });

  it('renders a toast with an action', () => {
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

    expect(queryByRole('alert')).toBeNull();
    firePress(button);

    let alert = getByRole('alert');
    expect(alert).toBeVisible();

    let buttons = within(alert).getAllByRole('button');
    expect(buttons[0]).toHaveTextContent('Action');
    firePress(buttons[0]);

    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes toast on action', () => {
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

    expect(queryByRole('alert')).toBeNull();
    firePress(button);

    let alert = getByRole('alert');
    expect(alert).toBeVisible();

    let buttons = within(alert).getAllByRole('button');
    expect(buttons[0]).toHaveTextContent('Action');
    firePress(buttons[0]);

    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);

    expect(alert).toHaveAttribute('data-animation', 'exiting');
    fireAnimationEnd(alert);
    expect(queryByRole('alert')).toBeNull();
  });

  it('prioritizes toasts based on tone', () => {
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

    expect(queryByRole('alert')).toBeNull();
    firePress(buttons[0]);

    let alert = getByRole('alert');
    expect(alert).toBeVisible();
    expect(alert).toHaveTextContent('Info');

    firePress(buttons[1]);
    fireAnimationEnd(alert);

    alert = getByRole('alert');
    expect(alert).toHaveTextContent('Error');

    firePress(within(alert).getByRole('button'));
    fireAnimationEnd(alert);

    alert = getByRole('alert');
    expect(alert).toHaveTextContent('Info');

    firePress(within(alert).getByRole('button'));
    fireAnimationEnd(alert);
    expect(queryByRole('alert')).toBeNull();

    // again, but with error toast first.

    firePress(buttons[1]);
    alert = getByRole('alert');
    expect(alert).toHaveTextContent('Error');

    firePress(buttons[0]);
    alert = getByRole('alert');
    expect(alert).toHaveTextContent('Error');

    firePress(within(alert).getByRole('button'));
    fireAnimationEnd(alert);

    alert = getByRole('alert');
    expect(alert).toHaveTextContent('Info');

    firePress(within(alert).getByRole('button'));
    fireAnimationEnd(alert);
    expect(queryByRole('alert')).toBeNull();
  });

  it('can focus toast region using F6', () => {
    let { getByRole } = renderComponent(<RenderToastButton timeout={5000} />);
    let button = getByRole('button');

    firePress(button);

    let toast = getByRole('alert');
    expect(toast).toBeVisible();

    expect(document.activeElement).toBe(button);
    fireEvent.keyDown(button, { key: 'F6' });
    fireEvent.keyUp(button, { key: 'F6' });

    let region = getByRole('region');
    expect(document.activeElement).toBe(region);
  });

  it('should restore focus when a toast exits', () => {
    let { getByRole, queryByRole } = renderComponent(<RenderToastButton />);
    let button = getByRole('button');

    firePress(button);

    let toast = getByRole('alert');
    let closeButton = within(toast).getByRole('button');
    act(() => closeButton.focus());

    firePress(closeButton);
    fireAnimationEnd(toast);
    expect(queryByRole('alert')).toBeNull();
    expect(document.activeElement).toBe(button);
  });

  it('should move focus to container when a toast exits and there are more', () => {
    let { getByRole, queryByRole } = renderComponent(<RenderToastButton />);
    let button = getByRole('button');

    firePress(button);
    firePress(button);

    let toast = getByRole('alert');
    let closeButton = within(toast).getByRole('button');
    firePress(closeButton);
    fireAnimationEnd(toast);

    expect(document.activeElement).toBe(getByRole('region'));

    toast = getByRole('alert');
    closeButton = within(toast).getByRole('button');
    firePress(closeButton);
    fireAnimationEnd(toast);

    expect(queryByRole('alert')).toBeNull();
    expect(document.activeElement).toBe(button);
  });

  it('should support programmatically closing toasts', () => {
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

    firePress(button);

    let toast = getByRole('alert');
    expect(toast).toBeVisible();

    firePress(button);
    fireAnimationEnd(toast);
    expect(queryByRole('alert')).toBeNull();
  });

  it('should only render one Toaster', () => {
    let { getByRole, getAllByRole, rerender } = renderWithProvider(
      <>
        <Toaster key="first" />
        <Toaster key="second" />
        <RenderToastButton />
      </>
    );

    let button = getByRole('button');
    firePress(button);

    expect(getAllByRole('region')).toHaveLength(1);
    expect(getAllByRole('alert')).toHaveLength(1);

    rerender(
      <>
        <Toaster key="second" />
        <RenderToastButton />
      </>
    );

    expect(getAllByRole('region')).toHaveLength(1);
    expect(getAllByRole('alert')).toHaveLength(1);

    rerender(
      <>
        <Toaster key="first" />
        <RenderToastButton />
      </>
    );

    expect(getAllByRole('region')).toHaveLength(1);
    expect(getAllByRole('alert')).toHaveLength(1);

    rerender(
      <>
        <Toaster key="first" />
        <Toaster key="second" />
        <RenderToastButton />
      </>
    );

    expect(getAllByRole('region')).toHaveLength(1);
    expect(getAllByRole('alert')).toHaveLength(1);
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
