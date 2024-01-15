import { CalendarDate, CalendarDateTime } from '@internationalized/date';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { afterEach, expect, jest, describe, it } from '@jest/globals';

import {
  act,
  fireEvent,
  firePress,
  renderWithProvider,
  waitFor,
} from '#test-utils';

import { DateRangePicker } from '..';

function getTextValue(el: HTMLElement): string {
  if (el.attributes.getNamedItem('aria-hidden')?.value === 'true') {
    return '';
  }

  return [...el.childNodes]
    .map(el =>
      el.nodeType === 3 ? el.textContent : getTextValue(el as HTMLElement)
    )
    .join('');
}
describe('date-time/DateRangePicker', () => {
  it('should render a rangepicker with a specified date', function () {
    let { getAllByRole } = renderWithProvider(
      <DateRangePicker
        label="Date"
        value={{
          start: new CalendarDate(2023, 2, 3),
          end: new CalendarDate(2023, 5, 6),
        }}
      />
    );

    let group = getAllByRole('group')[0];
    expect(group).toBeVisible();
    expect(group).not.toHaveAttribute('aria-disabled');
    expect(group).not.toHaveAttribute('aria-invalid');

    let segments = getAllByRole('spinbutton');
    expect(segments.length).toBe(6);

    expect(getTextValue(segments[0])).toBe('2');
    expect(segments[0].getAttribute('aria-label')).toBe('month, Start Date, ');
    expect(segments[0].getAttribute('aria-valuenow')).toBe('2');
    expect(segments[0].getAttribute('aria-valuetext')).toBe('2 – February');
    expect(segments[0].getAttribute('aria-valuemin')).toBe('1');
    expect(segments[0].getAttribute('aria-valuemax')).toBe('12');

    expect(getTextValue(segments[1])).toBe('3');
    expect(segments[1].getAttribute('aria-label')).toBe('day, Start Date, ');
    expect(segments[1].getAttribute('aria-valuenow')).toBe('3');
    expect(segments[1].getAttribute('aria-valuetext')).toBe('3');
    expect(segments[1].getAttribute('aria-valuemin')).toBe('1');
    expect(segments[1].getAttribute('aria-valuemax')).toBe('28');

    expect(getTextValue(segments[2])).toBe('2023');
    expect(segments[2].getAttribute('aria-label')).toBe('year, Start Date, ');
    expect(segments[2].getAttribute('aria-valuenow')).toBe('2023');
    expect(segments[2].getAttribute('aria-valuetext')).toBe('2023');
    expect(segments[2].getAttribute('aria-valuemin')).toBe('1');
    expect(segments[2].getAttribute('aria-valuemax')).toBe('9999');

    expect(getTextValue(segments[3])).toBe('5');
    expect(segments[3].getAttribute('aria-label')).toBe('month, End Date, ');
    expect(segments[3].getAttribute('aria-valuenow')).toBe('5');
    expect(segments[3].getAttribute('aria-valuetext')).toBe('5 – May');
    expect(segments[3].getAttribute('aria-valuemin')).toBe('1');
    expect(segments[3].getAttribute('aria-valuemax')).toBe('12');

    expect(getTextValue(segments[4])).toBe('6');
    expect(segments[4].getAttribute('aria-label')).toBe('day, End Date, ');
    expect(segments[4].getAttribute('aria-valuenow')).toBe('6');
    expect(segments[4].getAttribute('aria-valuetext')).toBe('6');
    expect(segments[4].getAttribute('aria-valuemin')).toBe('1');
    expect(segments[4].getAttribute('aria-valuemax')).toBe('31');

    expect(getTextValue(segments[5])).toBe('2023');
    expect(segments[5].getAttribute('aria-label')).toBe('year, End Date, ');
    expect(segments[5].getAttribute('aria-valuenow')).toBe('2023');
    expect(segments[5].getAttribute('aria-valuetext')).toBe('2023');
    expect(segments[5].getAttribute('aria-valuemin')).toBe('1');
    expect(segments[5].getAttribute('aria-valuemax')).toBe('9999');
  });

  it('should render a rangepicker with granularity="second"', function () {
    let { getAllByRole } = renderWithProvider(
      <DateRangePicker
        label="Date"
        granularity="second"
        value={{
          start: new CalendarDateTime(2023, 2, 3),
          end: new CalendarDateTime(2023, 5, 6),
        }}
      />
    );

    let group = getAllByRole('group')[0];
    expect(group).toBeVisible();
    expect(group).not.toHaveAttribute('aria-disabled');
    expect(group).not.toHaveAttribute('aria-invalid');

    let segments = getAllByRole('spinbutton');
    expect(segments.length).toBe(14);

    expect(getTextValue(segments[0])).toBe('2');
    expect(segments[0].getAttribute('aria-label')).toBe('month, Start Date, ');
    expect(segments[0].getAttribute('aria-valuenow')).toBe('2');
    expect(segments[0].getAttribute('aria-valuetext')).toBe('2 – February');
    expect(segments[0].getAttribute('aria-valuemin')).toBe('1');
    expect(segments[0].getAttribute('aria-valuemax')).toBe('12');

    expect(getTextValue(segments[1])).toBe('3');
    expect(segments[1].getAttribute('aria-label')).toBe('day, Start Date, ');
    expect(segments[1].getAttribute('aria-valuenow')).toBe('3');
    expect(segments[1].getAttribute('aria-valuetext')).toBe('3');
    expect(segments[1].getAttribute('aria-valuemin')).toBe('1');
    expect(segments[1].getAttribute('aria-valuemax')).toBe('28');

    expect(getTextValue(segments[2])).toBe('2023');
    expect(segments[2].getAttribute('aria-label')).toBe('year, Start Date, ');
    expect(segments[2].getAttribute('aria-valuenow')).toBe('2023');
    expect(segments[2].getAttribute('aria-valuetext')).toBe('2023');
    expect(segments[2].getAttribute('aria-valuemin')).toBe('1');
    expect(segments[2].getAttribute('aria-valuemax')).toBe('9999');

    expect(getTextValue(segments[3])).toBe('12');
    expect(segments[3].getAttribute('aria-label')).toBe('hour, Start Date, ');
    expect(segments[3].getAttribute('aria-valuenow')).toBe('0');
    expect(segments[3].getAttribute('aria-valuetext')).toBe('12 AM');
    expect(segments[3].getAttribute('aria-valuemin')).toBe('0');
    expect(segments[3].getAttribute('aria-valuemax')).toBe('11');

    expect(getTextValue(segments[4])).toBe('00');
    expect(segments[4].getAttribute('aria-label')).toBe('minute, Start Date, ');
    expect(segments[4].getAttribute('aria-valuenow')).toBe('0');
    expect(segments[4].getAttribute('aria-valuetext')).toBe('00');
    expect(segments[4].getAttribute('aria-valuemin')).toBe('0');
    expect(segments[4].getAttribute('aria-valuemax')).toBe('59');

    expect(getTextValue(segments[5])).toBe('00');
    expect(segments[5].getAttribute('aria-label')).toBe('second, Start Date, ');
    expect(segments[5].getAttribute('aria-valuenow')).toBe('0');
    expect(segments[5].getAttribute('aria-valuetext')).toBe('00');
    expect(segments[5].getAttribute('aria-valuemin')).toBe('0');
    expect(segments[5].getAttribute('aria-valuemax')).toBe('59');

    expect(getTextValue(segments[6])).toBe('AM');
    expect(segments[6].getAttribute('aria-label')).toBe('AM/PM, Start Date, ');
    expect(segments[6].getAttribute('aria-valuetext')).toBe('AM');

    expect(getTextValue(segments[7])).toBe('5');
    expect(segments[7].getAttribute('aria-label')).toBe('month, End Date, ');
    expect(segments[7].getAttribute('aria-valuenow')).toBe('5');
    expect(segments[7].getAttribute('aria-valuetext')).toBe('5 – May');
    expect(segments[7].getAttribute('aria-valuemin')).toBe('1');
    expect(segments[7].getAttribute('aria-valuemax')).toBe('12');

    expect(getTextValue(segments[8])).toBe('6');
    expect(segments[8].getAttribute('aria-label')).toBe('day, End Date, ');
    expect(segments[8].getAttribute('aria-valuenow')).toBe('6');
    expect(segments[8].getAttribute('aria-valuetext')).toBe('6');
    expect(segments[8].getAttribute('aria-valuemin')).toBe('1');
    expect(segments[8].getAttribute('aria-valuemax')).toBe('31');

    expect(getTextValue(segments[9])).toBe('2023');
    expect(segments[9].getAttribute('aria-label')).toBe('year, End Date, ');
    expect(segments[9].getAttribute('aria-valuenow')).toBe('2023');
    expect(segments[9].getAttribute('aria-valuetext')).toBe('2023');
    expect(segments[9].getAttribute('aria-valuemin')).toBe('1');
    expect(segments[9].getAttribute('aria-valuemax')).toBe('9999');

    expect(getTextValue(segments[10])).toBe('12');
    expect(segments[10].getAttribute('aria-label')).toBe('hour, End Date, ');
    expect(segments[10].getAttribute('aria-valuenow')).toBe('0');
    expect(segments[10].getAttribute('aria-valuetext')).toBe('12 AM');
    expect(segments[10].getAttribute('aria-valuemin')).toBe('0');
    expect(segments[10].getAttribute('aria-valuemax')).toBe('11');

    expect(getTextValue(segments[11])).toBe('00');
    expect(segments[11].getAttribute('aria-label')).toBe('minute, End Date, ');
    expect(segments[11].getAttribute('aria-valuenow')).toBe('0');
    expect(segments[11].getAttribute('aria-valuetext')).toBe('00');
    expect(segments[11].getAttribute('aria-valuemin')).toBe('0');
    expect(segments[11].getAttribute('aria-valuemax')).toBe('59');

    expect(getTextValue(segments[12])).toBe('00');
    expect(segments[12].getAttribute('aria-label')).toBe('second, End Date, ');
    expect(segments[12].getAttribute('aria-valuenow')).toBe('0');
    expect(segments[12].getAttribute('aria-valuetext')).toBe('00');
    expect(segments[12].getAttribute('aria-valuemin')).toBe('0');
    expect(segments[12].getAttribute('aria-valuemax')).toBe('59');

    expect(getTextValue(segments[13])).toBe('AM');
    expect(segments[13].getAttribute('aria-label')).toBe('AM/PM, End Date, ');
    expect(segments[13].getAttribute('aria-valuetext')).toBe('AM');
  });

  it('should support focusing via a ref', function () {
    let ref = createRef<HTMLDivElement>();
    let { getAllByRole } = renderWithProvider(
      <DateRangePicker label="Date" ref={ref} />
    );
    expect(ref.current).toHaveProperty('focus');

    act(() => ref.current?.focus());
    expect(document.activeElement).toBe(getAllByRole('spinbutton')[0]);
  });

  it('should support autoFocus', function () {
    let { getAllByRole } = renderWithProvider(
      <DateRangePicker label="Date" autoFocus />
    );
    expect(document.activeElement).toBe(getAllByRole('spinbutton')[0]);
  });

  it('should pass through data attributes', function () {
    let { getByTestId } = renderWithProvider(
      <DateRangePicker label="Date" data-testid="foo" />
    );
    expect(getByTestId('foo')).toHaveAttribute('role', 'group');
  });

  describe('events', function () {
    let onBlurSpy = jest.fn();
    let onFocusChangeSpy = jest.fn();
    let onFocusSpy = jest.fn();
    let onKeyDownSpy = jest.fn();
    let onKeyUpSpy = jest.fn();

    afterEach(() => {
      onBlurSpy.mockClear();
      onFocusChangeSpy.mockClear();
      onFocusSpy.mockClear();
      onKeyDownSpy.mockClear();
      onKeyUpSpy.mockClear();
    });

    it('should focus field, move a segment, and open popover and does not blur', async function () {
      let { getByRole, getAllByRole } = renderWithProvider(
        <DateRangePicker
          label="Date"
          onBlur={onBlurSpy}
          onFocus={onFocusSpy}
          onFocusChange={onFocusChangeSpy}
        />
      );
      let segments = getAllByRole('spinbutton');
      let button = getByRole('button');

      expect(onBlurSpy).not.toHaveBeenCalled();
      expect(onFocusChangeSpy).not.toHaveBeenCalled();
      expect(onFocusSpy).not.toHaveBeenCalled();

      await userEvent.tab();
      expect(segments[0]).toHaveFocus();
      expect(onBlurSpy).not.toHaveBeenCalled();
      expect(onFocusChangeSpy).toHaveBeenCalledTimes(1);
      expect(onFocusSpy).toHaveBeenCalledTimes(1);

      await userEvent.tab();
      expect(segments[1]).toHaveFocus();
      expect(onBlurSpy).not.toHaveBeenCalled();
      expect(onFocusChangeSpy).toHaveBeenCalledTimes(1);
      expect(onFocusSpy).toHaveBeenCalledTimes(1);

      firePress(button);
      await waitFor(() => {
        expect(getByRole('dialog')).toBeVisible();
      });

      expect(onBlurSpy).not.toHaveBeenCalled();
      expect(onFocusChangeSpy).toHaveBeenCalledTimes(1);
      expect(onFocusSpy).toHaveBeenCalledTimes(1);
    });

    it('should focus field and leave to blur', async function () {
      let { getAllByRole } = renderWithProvider(
        <DateRangePicker
          label="Date"
          onBlur={onBlurSpy}
          onFocus={onFocusSpy}
          onFocusChange={onFocusChangeSpy}
        />
      );
      let segments = getAllByRole('spinbutton');

      expect(onBlurSpy).not.toHaveBeenCalled();
      expect(onFocusChangeSpy).not.toHaveBeenCalled();
      expect(onFocusSpy).not.toHaveBeenCalled();

      await userEvent.tab();
      expect(segments[0]).toHaveFocus();
      expect(onBlurSpy).not.toHaveBeenCalled();
      expect(onFocusChangeSpy).toHaveBeenCalledTimes(1);
      expect(onFocusSpy).toHaveBeenCalledTimes(1);

      await userEvent.click(document.body);
      expect(document.body).toHaveFocus();
      expect(onBlurSpy).toHaveBeenCalledTimes(1);
      expect(onFocusChangeSpy).toHaveBeenCalledTimes(2);
      expect(onFocusSpy).toHaveBeenCalledTimes(1);
    });

    it('should open popover and call picker onFocus', async function () {
      let { getByRole } = renderWithProvider(
        <DateRangePicker
          label="Date"
          onBlur={onBlurSpy}
          onFocus={onFocusSpy}
          onFocusChange={onFocusChangeSpy}
        />
      );
      let button = getByRole('button');

      expect(onBlurSpy).not.toHaveBeenCalled();
      expect(onFocusChangeSpy).not.toHaveBeenCalled();
      expect(onFocusSpy).not.toHaveBeenCalled();

      firePress(button);
      await waitFor(() => {
        expect(getByRole('dialog')).toBeVisible();
      });
      expect(onBlurSpy).not.toHaveBeenCalled();
      expect(onFocusChangeSpy).toHaveBeenCalledTimes(1);
      expect(onFocusSpy).toHaveBeenCalledTimes(1);
    });

    it('should open and close popover and only call blur when focus leaves picker', async function () {
      let { getByRole } = renderWithProvider(
        <DateRangePicker
          label="Date"
          onBlur={onBlurSpy}
          onFocus={onFocusSpy}
          onFocusChange={onFocusChangeSpy}
        />
      );
      let button = getByRole('button');

      expect(onBlurSpy).not.toHaveBeenCalled();
      expect(onFocusChangeSpy).not.toHaveBeenCalled();
      expect(onFocusSpy).not.toHaveBeenCalled();

      firePress(button);
      let dialog = getByRole('dialog');
      await waitFor(() => {
        expect(dialog).toBeVisible();
      });
      expect(onBlurSpy).not.toHaveBeenCalled();
      expect(onFocusChangeSpy).toHaveBeenCalledTimes(1);
      expect(onFocusSpy).toHaveBeenCalledTimes(1);

      fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
      fireEvent.keyUp(document.activeElement!, { key: 'Escape' });

      await waitFor(() => {
        expect(button).toHaveFocus();
      });

      expect(dialog).not.toBeVisible();
      expect(onBlurSpy).not.toHaveBeenCalled();
      expect(onFocusChangeSpy).toHaveBeenCalledTimes(1);
      expect(onFocusSpy).toHaveBeenCalledTimes(1);

      await userEvent.tab();
      expect(document.body).toHaveFocus();
      expect(onBlurSpy).toHaveBeenCalledTimes(1);
      expect(onFocusChangeSpy).toHaveBeenCalledTimes(2);
      expect(onFocusSpy).toHaveBeenCalledTimes(1);
    });

    it('should trigger right arrow key event for segment navigation', async function () {
      let { getAllByRole } = renderWithProvider(
        <DateRangePicker
          label="Date"
          onKeyDown={onKeyDownSpy}
          onKeyUp={onKeyUpSpy}
        />
      );
      let segments = getAllByRole('spinbutton');

      expect(onKeyDownSpy).not.toHaveBeenCalled();
      expect(onKeyUpSpy).not.toHaveBeenCalled();

      await userEvent.tab();
      expect(segments[0]).toHaveFocus();
      expect(onKeyDownSpy).not.toHaveBeenCalled();
      expect(onKeyUpSpy).toHaveBeenCalledTimes(1);

      fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
      fireEvent.keyUp(document.activeElement!, { key: 'ArrowRight' });
      expect(segments[1]).toHaveFocus();
      expect(onKeyDownSpy).toHaveBeenCalledTimes(1);
      expect(onKeyUpSpy).toHaveBeenCalledTimes(2);
    });

    it('should trigger key event in popover and focus/blur/key events are not called', async function () {
      let { getByRole } = renderWithProvider(
        <DateRangePicker
          label="Date"
          onBlur={onBlurSpy}
          onFocus={onFocusSpy}
          onFocusChange={onFocusChangeSpy}
          onKeyDown={onKeyDownSpy}
          onKeyUp={onKeyUpSpy}
        />
      );
      let button = getByRole('button');

      expect(onKeyDownSpy).not.toHaveBeenCalled();
      expect(onKeyUpSpy).not.toHaveBeenCalled();
      expect(onBlurSpy).not.toHaveBeenCalled();
      expect(onFocusChangeSpy).not.toHaveBeenCalled();
      expect(onFocusSpy).not.toHaveBeenCalled();

      firePress(button);

      await waitFor(() => {
        expect(getByRole('dialog')).toBeVisible();
      });
      expect(onBlurSpy).not.toHaveBeenCalled();
      expect(onFocusChangeSpy).toHaveBeenCalledTimes(1);
      expect(onFocusSpy).toHaveBeenCalledTimes(1);

      fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
      fireEvent.keyUp(document.activeElement!, { key: 'ArrowRight' });
      expect(onKeyDownSpy).toHaveBeenCalledTimes(0);
      expect(onKeyUpSpy).toHaveBeenCalledTimes(0);
      expect(onBlurSpy).not.toHaveBeenCalled();
      expect(onFocusChangeSpy).toHaveBeenCalledTimes(1);
      expect(onFocusSpy).toHaveBeenCalledTimes(1);
    });
  });
});
