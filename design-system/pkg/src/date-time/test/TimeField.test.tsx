import { Time } from '@internationalized/date';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { afterEach, expect, jest, describe, it } from '@jest/globals';

import { act, fireEvent, renderWithProvider } from '#test-utils';

import { TimeField } from '..';

describe('date-time/TimeField', () => {
  it('should be labellable', () => {
    let { getAllByRole, getByText } = renderWithProvider(
      <TimeField label="Time" />
    );

    let label = getByText('Time');

    let group = getAllByRole('group')[0];
    expect(group).toHaveAttribute('aria-labelledby', label.id);

    let segments = getAllByRole('spinbutton');
    for (let segment of segments) {
      expect(segment).toHaveAttribute('id');
      let segmentId = segment.getAttribute('id');
      expect(segment).toHaveAttribute(
        'aria-labelledby',
        `${segmentId} ${label.id}`
      );
    }
  });
  it('should include a value description', function () {
    let { getByRole, getAllByRole } = renderWithProvider(
      <TimeField label="Date" value={new Time(14, 45)} />
    );

    let group = getByRole('group');
    expect(group).toHaveAttribute('aria-describedby');

    let describedBy = group.getAttribute('aria-describedby');
    let description = describedBy!
      .split(' ')
      .map(d => {
        let el = document.getElementById(d);
        return el ? el.textContent : null;
      })
      .join(' ');
    expect(description).toBe('Selected Time: 2:45 PM');

    let segments = getAllByRole('spinbutton');
    expect(segments[0]).toHaveAttribute(
      'aria-describedby',
      group.getAttribute('aria-describedby')
    );

    for (let segment of segments.slice(1)) {
      expect(segment).not.toHaveAttribute('aria-describedby');
    }
  });
  it('should pass through data attributes', function () {
    let { getByTestId } = renderWithProvider(
      <TimeField label="Time" data-testid="foo" />
    );
    expect(getByTestId('foo')).toHaveAttribute('role', 'group');
  });
  it('should support focusing via a ref', function () {
    let ref = createRef<HTMLDivElement>();
    let { getAllByRole } = renderWithProvider(
      <TimeField label="Time" ref={ref} />
    );
    expect(ref.current).toHaveProperty('focus');

    act(() => ref.current?.focus());
    expect(document.activeElement).toBe(getAllByRole('spinbutton')[0]);
  });
  it('should support autoFocus', function () {
    let { getAllByRole } = renderWithProvider(
      <TimeField label="Time" autoFocus />
    );
    expect(document.activeElement).toBe(getAllByRole('spinbutton')[0]);
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

    it('should focus field and switching segments via tab does not change focus', async function () {
      let { getAllByRole } = renderWithProvider(
        <TimeField
          label="Time"
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

      await userEvent.tab();
      expect(segments[1]).toHaveFocus();
      expect(onBlurSpy).not.toHaveBeenCalled();
      expect(onFocusChangeSpy).toHaveBeenCalledTimes(1);
      expect(onFocusSpy).toHaveBeenCalledTimes(1);
    });

    it('should call blur when focus leaves', async function () {
      let { getAllByRole } = renderWithProvider(
        <TimeField
          label="Time"
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

      await userEvent.tab();
      expect(segments[1]).toHaveFocus();

      await userEvent.tab();
      expect(segments[2]).toHaveFocus();
      expect(onBlurSpy).toHaveBeenCalledTimes(0);

      await userEvent.tab();
      expect(onBlurSpy).toHaveBeenCalledTimes(1);
      expect(onFocusChangeSpy).toHaveBeenCalledTimes(2);
      expect(onFocusSpy).toHaveBeenCalledTimes(1);
    });

    it('should trigger right arrow key event for segment navigation', async function () {
      let { getAllByRole } = renderWithProvider(
        <TimeField label="Time" onKeyDown={onKeyDownSpy} onKeyUp={onKeyUpSpy} />
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
  });
});
