import '@testing-library/jest-dom/jest-globals';
import userEvent from '@testing-library/user-event';
import {
  act,
  fireEvent,
  render,
  waitFor,
  RenderOptions,
} from '@testing-library/react';
import { createRef, ReactElement } from 'react';
import {
  expect,
  it,
  describe,
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  jest,
} from '@jest/globals';

import { Button } from '@keystar/ui/button';
import { TestProvider } from '@keystar/ui/core';

import { Tooltip, TooltipTrigger } from '..';
import { MOUSE_REST_TIMEOUT } from '../TooltipTrigger';

const LEAVE_TIMEOUT = 320;

// NOTE: skipped tests have something to do with mouse events and timers...
describe('tooltip/TooltipTrigger', () => {
  let onOpenChange = jest.fn();
  let user: ReturnType<typeof userEvent.setup>;

  beforeAll(() => {
    user = userEvent.setup({ delay: null });
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    // by firing an event at the beginning of each test, we can put ourselves into
    // keyboard modality for the test
    fireEvent.keyDown(document.body, { key: 'Tab' });
    fireEvent.keyUp(document.body, { key: 'Tab' });
  });

  afterEach(() => {
    onOpenChange.mockClear();
    // there's global state, so we need to make sure to run out the cooldown for
    // every test
    act(() => {
      jest.runAllTimers();
    });
  });

  describe('immediate', () => {
    it('opens for focus', async () => {
      let { getByRole, queryByRole, getByLabelText } = renderWithProvider(
        <TooltipTrigger onOpenChange={onOpenChange} delay={0}>
          <Button aria-label="trigger" />
          <Tooltip>Helpful information.</Tooltip>
        </TooltipTrigger>
      );
      expect(queryByRole('tooltip')).toBeNull();

      let button = getByLabelText('trigger');
      act(() => {
        button.focus();
      });
      expect(onOpenChange).toHaveBeenCalledWith(true);
      let tooltip = getByRole('tooltip');
      await waitFor(() => {
        expect(tooltip).toBeVisible();
      });
      act(() => {
        button.blur();
      });
      expect(onOpenChange).toHaveBeenCalledTimes(2);
      expect(onOpenChange).toHaveBeenCalledWith(false);
      act(() => {
        jest.advanceTimersByTime(LEAVE_TIMEOUT);
      });
      expect(onOpenChange).toHaveBeenCalledTimes(2);
      expect(tooltip).not.toBeInTheDocument();
    });

    it('opens for hover', async () => {
      let { getByRole, getByLabelText } = renderWithProvider(
        <TooltipTrigger onOpenChange={onOpenChange} delay={0}>
          <Button aria-label="trigger" />
          <Tooltip>Helpful information.</Tooltip>
        </TooltipTrigger>
      );
      await user.click(document.body);

      let button = getByLabelText('trigger');
      await user.hover(button);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      let tooltip = getByRole('tooltip');
      expect(tooltip).toBeVisible();
      await user.unhover(button);
      act(() => {
        jest.advanceTimersByTime(LEAVE_TIMEOUT);
      });
      expect(tooltip).toBeVisible();
      act(() => {
        jest.advanceTimersByTime(LEAVE_TIMEOUT);
      });
      expect(onOpenChange).toHaveBeenCalledTimes(2);
      expect(onOpenChange).toHaveBeenCalledWith(false);
      act(() => {
        jest.advanceTimersByTime(LEAVE_TIMEOUT);
      });
      expect(onOpenChange).toHaveBeenCalledTimes(2);
      expect(tooltip).not.toBeInTheDocument();
    });

    it('if hovered and focused, will hide if hover leaves', async () => {
      let { getByRole, getByLabelText } = renderWithProvider(
        <TooltipTrigger onOpenChange={onOpenChange} delay={0}>
          <Button aria-label="trigger" />
          <Tooltip>Helpful information.</Tooltip>
        </TooltipTrigger>
      );

      let button = getByLabelText('trigger');
      // add focus
      act(() => {
        button.focus();
      });
      expect(onOpenChange).toHaveBeenCalledWith(true);
      let tooltip = getByRole('tooltip');
      await waitFor(() => {
        expect(tooltip).toBeVisible();
      });
      // add hover
      fireEvent.mouseEnter(button);
      fireEvent.mouseMove(button);
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      act(() => {
        jest.runAllTimers();
      });
      expect(tooltip).toBeVisible();

      // remove hover
      fireEvent.mouseLeave(button);
      act(() => {
        jest.runAllTimers();
      });
      expect(onOpenChange).toHaveBeenCalledTimes(2);
      act(() => {
        jest.runAllTimers();
      });
      expect(tooltip).not.toBeInTheDocument();

      // remove focus
      act(() => {
        button.blur();
      });
      expect(onOpenChange).toHaveBeenCalledTimes(2);
      expect(onOpenChange).toHaveBeenCalledWith(false);
      act(() => {
        jest.advanceTimersByTime(LEAVE_TIMEOUT);
      });
      expect(tooltip).not.toBeInTheDocument();
    });

    it('if hovered and focused, will hide if focus leaves', async () => {
      let { getByRole, getByLabelText } = renderWithProvider(
        <TooltipTrigger onOpenChange={onOpenChange} delay={0}>
          <Button aria-label="trigger" />
          <Tooltip>Helpful information.</Tooltip>
        </TooltipTrigger>
      );

      let button = getByLabelText('trigger');
      // add focus
      act(() => {
        button.focus();
      });
      expect(onOpenChange).toHaveBeenCalledWith(true);
      let tooltip = getByRole('tooltip');
      await waitFor(() => {
        expect(tooltip).toBeVisible();
      });
      // add hover
      fireEvent.mouseEnter(button);
      fireEvent.mouseMove(button);
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      act(() => {
        jest.runAllTimers();
      });
      expect(tooltip).toBeVisible();

      // remove focus
      act(() => {
        button.blur();
      });
      expect(onOpenChange).toHaveBeenCalledTimes(2);
      act(() => {
        jest.runAllTimers();
      });
      expect(tooltip).not.toBeInTheDocument();

      // remove hover
      fireEvent.mouseLeave(button);
      expect(onOpenChange).toHaveBeenCalledTimes(2);
      expect(onOpenChange).toHaveBeenCalledWith(false);
      act(() => {
        jest.advanceTimersByTime(LEAVE_TIMEOUT);
      });
      expect(tooltip).not.toBeInTheDocument();
    });

    it('can be keyboard force closed', async () => {
      let { queryByRole, getByRole, getByLabelText } = renderWithProvider(
        <TooltipTrigger onOpenChange={onOpenChange} delay={0}>
          <Button aria-label="trigger" />
          <Tooltip>Helpful information.</Tooltip>
        </TooltipTrigger>
      );

      let button = getByLabelText('trigger');
      act(() => {
        button.focus();
      });
      expect(onOpenChange).toHaveBeenCalledWith(true);
      let tooltip = getByRole('tooltip');
      await waitFor(() => {
        expect(tooltip).toBeVisible();
      });
      fireEvent.keyDown(document.activeElement as Element, { key: 'Escape' });
      fireEvent.keyUp(document.activeElement as Element, { key: 'Escape' });
      expect(onOpenChange).toHaveBeenCalledWith(false);
      act(() => {
        jest.advanceTimersByTime(LEAVE_TIMEOUT);
      });
      expect(tooltip).not.toBeInTheDocument();
      act(() => {
        button.blur();
      });
      act(() => {
        jest.runAllTimers();
      });
      expect(queryByRole('tooltip')).toBeNull();
    });

    it('can be keyboard force closed from anywhere', async () => {
      let { getByRole, queryByRole, getByLabelText } = renderWithProvider(
        <>
          <TooltipTrigger onOpenChange={onOpenChange} delay={0}>
            <Button aria-label="trigger" />
            <Tooltip>Helpful information.</Tooltip>
          </TooltipTrigger>
          <input type="text" />
        </>
      );
      fireEvent.mouseDown(document.body);
      fireEvent.mouseUp(document.body);

      let button = getByLabelText('trigger');
      let input = getByRole('textbox');
      act(() => {
        input.focus();
      });
      fireEvent.mouseEnter(button);
      fireEvent.mouseMove(button);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      let tooltip = getByRole('tooltip');
      await waitFor(() => {
        expect(tooltip).toBeVisible();
      });
      fireEvent.keyDown(document.activeElement as Element, { key: 'Escape' });
      fireEvent.keyUp(document.activeElement as Element, { key: 'Escape' });
      expect(onOpenChange).toHaveBeenCalledWith(false);
      act(() => {
        jest.advanceTimersByTime(LEAVE_TIMEOUT);
      });
      expect(tooltip).not.toBeInTheDocument();
      act(() => {
        input.blur();
      });
      fireEvent.mouseLeave(button);
      act(() => {
        jest.runAllTimers();
      });
      expect(queryByRole('tooltip')).toBeNull();
    });

    it('is closed if the trigger is clicked', async () => {
      let { getByRole, queryByRole, getByLabelText } = renderWithProvider(
        <TooltipTrigger onOpenChange={onOpenChange} delay={0}>
          <Button aria-label="trigger" />
          <Tooltip>Helpful information.</Tooltip>
        </TooltipTrigger>
      );
      await user.click(document.body);

      let button = getByLabelText('trigger');
      await user.hover(button);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      let tooltip = getByRole('tooltip');
      await waitFor(() => {
        expect(tooltip).toBeVisible();
      });
      await user.click(button);
      expect(onOpenChange).toHaveBeenCalledWith(false);
      act(() => {
        jest.advanceTimersByTime(LEAVE_TIMEOUT);
      });
      expect(tooltip).not.toBeInTheDocument();
      act(() => {
        button.blur();
      });
      act(() => {
        jest.runAllTimers();
      });
      expect(queryByRole('tooltip')).toBeNull();
    });
  });

  it('is closed if the trigger is clicked with the keyboard', async () => {
    let { getByRole, queryByRole, getByLabelText } = renderWithProvider(
      <TooltipTrigger onOpenChange={onOpenChange} delay={0}>
        <Button aria-label="trigger" />
        <Tooltip>Helpful information.</Tooltip>
      </TooltipTrigger>
    );

    let button = getByLabelText('trigger');
    act(() => {
      button.focus();
    });
    expect(onOpenChange).toHaveBeenCalledWith(true);
    let tooltip = getByRole('tooltip');
    await waitFor(() => {
      expect(tooltip).toBeVisible();
    });

    fireEvent.keyDown(button, { key: 'Enter' });
    fireEvent.keyUp(button, { key: 'Enter' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    act(() => {
      jest.advanceTimersByTime(LEAVE_TIMEOUT);
    });
    expect(tooltip).not.toBeInTheDocument();
    act(() => {
      button.blur();
    });
    act(() => {
      jest.runAllTimers();
    });
    expect(queryByRole('tooltip')).toBeNull();
  });

  describe('delay', () => {
    it('opens immediately for focus', async () => {
      let { getByRole, getByLabelText } = renderWithProvider(
        <TooltipTrigger onOpenChange={onOpenChange}>
          <Button aria-label="trigger" />
          <Tooltip>Helpful information.</Tooltip>
        </TooltipTrigger>
      );

      let button = getByLabelText('trigger');
      act(() => {
        button.focus();
      });
      expect(onOpenChange).toHaveBeenCalled();
      let tooltip = getByRole('tooltip');
      await waitFor(() => {
        expect(tooltip).toBeVisible();
      });
      act(() => {
        button.blur();
      });
      expect(onOpenChange).toHaveBeenCalledWith(false);
      act(() => {
        jest.advanceTimersByTime(LEAVE_TIMEOUT);
      });
      expect(tooltip).not.toBeInTheDocument();
    });

    // can't get this to work with timers
    // eslint-disable-next-line jest/no-commented-out-tests
    // it('opens for hover', async () => {
    //   let { getByRole, getByLabelText } = renderWithProvider(
    //     <TooltipTrigger onOpenChange={onOpenChange}>
    //       <Button aria-label="trigger" />
    //       <Tooltip>Helpful information.</Tooltip>
    //     </TooltipTrigger>
    //   );
    //   fireEvent.mouseDown(document.body);
    //   fireEvent.mouseUp(document.body);

    //   let button = getByLabelText('trigger');
    //   fireEvent.mouseEnter(button);
    //   fireEvent.mouseMove(button);
    //   let tooltip = getByRole('tooltip');
    //   await waitFor(() => {
    //     expect(tooltip).toBeVisible();
    //   });
    //   fireEvent.mouseLeave(button);
    //   act(() => {
    //     jest.advanceTimersByTime(LEAVE_TIMEOUT);
    //   });
    //   expect(tooltip).toBeVisible();
    //   act(() => {
    //     jest.advanceTimersByTime(LEAVE_TIMEOUT);
    //   });
    //   expect(onOpenChange).toHaveBeenCalledWith(false);
    //   act(() => {
    //     jest.advanceTimersByTime(LEAVE_TIMEOUT);
    //   });
    //   expect(tooltip).not.toBeInTheDocument();
    // });

    it('never opens if blurred before it opens', () => {
      let { queryByRole, getByLabelText } = renderWithProvider(
        <TooltipTrigger onOpenChange={onOpenChange}>
          <Button aria-label="trigger" />
          <Tooltip>Helpful information.</Tooltip>
        </TooltipTrigger>
      );

      let button = getByLabelText('trigger');
      fireEvent.mouseEnter(button);
      fireEvent.mouseMove(button);
      expect(onOpenChange).not.toHaveBeenCalled();
      expect(queryByRole('tooltip')).toBeNull();
      // run half way through the timers and see if it's appeared
      act(() => {
        jest.advanceTimersByTime(MOUSE_REST_TIMEOUT / 2);
      });
      expect(onOpenChange).not.toHaveBeenCalled();
      expect(queryByRole('tooltip')).toBeNull();
      fireEvent.mouseLeave(button);
      expect(onOpenChange).not.toHaveBeenCalled();
      act(() => {
        jest.runAllTimers();
      });
      expect(queryByRole('tooltip')).toBeNull();
    });

    it('opens for focus even if the delay was already in process', async () => {
      let { getByRole, queryByRole, getByLabelText } = renderWithProvider(
        <TooltipTrigger onOpenChange={onOpenChange}>
          <Button aria-label="trigger" />
          <Tooltip>Helpful information.</Tooltip>
        </TooltipTrigger>
      );

      let button = getByLabelText('trigger');
      fireEvent.mouseEnter(button);
      fireEvent.mouseMove(button);
      expect(queryByRole('tooltip')).toBeNull();
      // run half way through the timers and see if it's appeared
      act(() => {
        jest.advanceTimersByTime(MOUSE_REST_TIMEOUT / 2);
      });
      expect(queryByRole('tooltip')).toBeNull();
      // halfway through, now add a focus
      // trigger modality to keyboard first
      fireEvent.keyDown(document.body, { key: 'Tab' });
      fireEvent.keyUp(document.body, { key: 'Tab' });
      act(() => {
        button.focus();
      });
      expect(onOpenChange).toHaveBeenCalledWith(true);
      let tooltip = getByRole('tooltip');
      await waitFor(() => {
        expect(tooltip).toBeVisible();
      });
      // finish the full amount of time started by hover
      act(() => {
        jest.advanceTimersByTime(MOUSE_REST_TIMEOUT / 2);
      });
      expect(tooltip).toBeVisible();
      act(() => {
        button.blur();
      });
      fireEvent.mouseLeave(button);
      act(() => {
        jest.advanceTimersByTime(LEAVE_TIMEOUT);
      });
      expect(tooltip).not.toBeInTheDocument();
    });
  });

  it('supports a ref on the Tooltip', () => {
    let ref = createRef<HTMLDivElement>();
    let { getByRole } = renderWithProvider(
      <TooltipTrigger>
        <Button>Trigger</Button>
        <Tooltip ref={ref}>Helpful information.</Tooltip>
      </TooltipTrigger>
    );

    let button = getByRole('button');
    act(() => {
      button.focus();
    });

    let tooltip = getByRole('tooltip');
    expect(ref.current).toBe(tooltip);
  });

  describe('overlay properties', () => {
    it('can be controlled open', async () => {
      let { getByRole, getByLabelText } = renderWithProvider(
        <TooltipTrigger isOpen delay={0} onOpenChange={onOpenChange}>
          <Button aria-label="trigger" />
          <Tooltip>Helpful information.</Tooltip>
        </TooltipTrigger>
      );
      expect(onOpenChange).not.toHaveBeenCalled();
      let tooltip = getByRole('tooltip');
      await waitFor(() => {
        expect(tooltip).toBeVisible();
      });

      let button = getByLabelText('trigger');
      act(() => {
        button.focus();
      });
      expect(onOpenChange).not.toHaveBeenCalled();
      expect(tooltip).toBeVisible();
      act(() => {
        button.blur();
      });
      expect(onOpenChange).toHaveBeenCalledWith(false);
      act(() => {
        jest.advanceTimersByTime(LEAVE_TIMEOUT);
      });
      expect(tooltip).toBeVisible();
    });

    it('can be controlled hidden', () => {
      let { queryByRole, getByLabelText } = renderWithProvider(
        <TooltipTrigger isOpen={false} delay={0} onOpenChange={onOpenChange}>
          <Button aria-label="trigger" />
          <Tooltip>Helpful information.</Tooltip>
        </TooltipTrigger>
      );
      expect(onOpenChange).not.toHaveBeenCalled();
      expect(queryByRole('tooltip')).toBeNull();

      let button = getByLabelText('trigger');
      act(() => {
        button.focus();
      });
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(queryByRole('tooltip')).toBeNull();
      act(() => {
        button.blur();
      });
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      act(() => {
        jest.advanceTimersByTime(LEAVE_TIMEOUT);
      });
      expect(queryByRole('tooltip')).toBeNull();
    });

    it('can be uncontrolled open', async () => {
      let { getByRole, getByLabelText } = renderWithProvider(
        <TooltipTrigger defaultOpen delay={0}>
          <Button aria-label="trigger" />
          <Tooltip>Helpful information.</Tooltip>
        </TooltipTrigger>
      );
      let tooltip = getByRole('tooltip');
      await waitFor(() => {
        expect(tooltip).toBeVisible();
      });

      let button = getByLabelText('trigger');
      act(() => {
        button.focus();
      });
      expect(tooltip).toBeVisible();
      act(() => {
        button.blur();
      });
      act(() => {
        jest.advanceTimersByTime(LEAVE_TIMEOUT);
      });
      expect(tooltip).not.toBeInTheDocument();
    });
  });

  describe('disabled', () => {
    it('can be disabled from the TooltipTrigger component', () => {
      let { queryByRole, getByLabelText } = renderWithProvider(
        <TooltipTrigger isDisabled delay={0}>
          <Button aria-label="trigger" />
          <Tooltip>Helpful information.</Tooltip>
        </TooltipTrigger>
      );
      let button = getByLabelText('trigger');
      fireEvent.mouseEnter(button);
      fireEvent.mouseMove(button);

      expect(queryByRole('tooltip')).toBeNull();
      fireEvent.mouseLeave(button);
    });

    it('can be disabled from the trigger element', () => {
      let { queryByRole, getByLabelText } = renderWithProvider(
        <TooltipTrigger delay={0}>
          <Button aria-label="trigger" isDisabled />
          <Tooltip>Helpful information.</Tooltip>
        </TooltipTrigger>
      );
      let button = getByLabelText('trigger');
      fireEvent.mouseEnter(button);
      fireEvent.mouseMove(button);

      expect(queryByRole('tooltip')).toBeNull();
      fireEvent.mouseLeave(button);
    });
  });

  describe('accessibility', () => {
    it('has a trigger described by the tooltip when open', () => {
      let { getByRole, getByLabelText } = renderWithProvider(
        <TooltipTrigger delay={0}>
          <Button aria-label="trigger" />
          <Tooltip>Helpful information.</Tooltip>
        </TooltipTrigger>
      );
      fireEvent.mouseMove(document.body);
      let button = getByLabelText('trigger');
      expect(button).not.toHaveAttribute('aria-describedBy');
      fireEvent.mouseEnter(button);
      fireEvent.mouseMove(button);
      let tooltip = getByRole('tooltip');
      expect(button).toHaveAttribute('aria-describedBy', tooltip.id);
      fireEvent.mouseLeave(button);
      act(jest.runAllTimers);
      expect(button).not.toHaveAttribute('aria-describedBy');
    });
  });

  describe('trigger = focus', () => {
    it('will open for focus', async () => {
      let { getByRole, getByLabelText } = renderWithProvider(
        <TooltipTrigger delay={0} trigger="focus">
          <Button aria-label="trigger" />
          <Tooltip>Helpful information.</Tooltip>
        </TooltipTrigger>
      );

      let button = getByLabelText('trigger');
      act(() => {
        button.focus();
      });
      let tooltip = getByRole('tooltip');
      await waitFor(() => {
        expect(tooltip).toBeVisible();
      });

      // won't close if the mouse hovers and leaves
      fireEvent.mouseEnter(button);
      fireEvent.mouseMove(button);
      fireEvent.mouseLeave(button);
      expect(tooltip).toBeVisible();
      act(() => {
        button.blur();
      });
      act(() => {
        jest.advanceTimersByTime(LEAVE_TIMEOUT);
      });

      expect(tooltip).not.toBeInTheDocument();
    });

    it('will not open for hover', () => {
      let { queryByRole, getByLabelText } = renderWithProvider(
        <TooltipTrigger delay={0} trigger="focus">
          <Button aria-label="trigger" />
          <Tooltip>Helpful information.</Tooltip>
        </TooltipTrigger>
      );
      fireEvent.mouseMove(document.body);
      let button = getByLabelText('trigger');
      fireEvent.mouseEnter(button);
      fireEvent.mouseMove(button);
      expect(queryByRole('tooltip')).toBeNull();
    });
  });
});

// TODO: move somewhere common
function renderWithProvider(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: TestProvider, ...options });
}
