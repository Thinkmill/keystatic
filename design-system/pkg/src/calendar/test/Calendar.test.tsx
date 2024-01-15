import { CalendarDate, isWeekend } from '@internationalized/date';
import {
  afterEach,
  beforeAll,
  expect,
  jest,
  describe,
  it,
} from '@jest/globals';

import { act, fireEvent, firePress, renderWithProvider } from '#test-utils';

import { Calendar } from '../index';
import { useLocale } from '@react-aria/i18n';

const tmInceptionDate = new CalendarDate(2013, 9, 4);
const keyCodes = {
  Enter: 13,
  ' ': 32,
  PageUp: 33,
  PageDown: 34,
  End: 35,
  Home: 36,
  ArrowLeft: 37,
  ArrowUp: 38,
  ArrowRight: 39,
  ArrowDown: 40,
};

describe('calendar/Calendar', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    act(() => {
      jest.runAllTimers();
    });
  });

  it('renders a calendar with a defaultValue', () => {
    let { getByLabelText, getByRole, getAllByRole } = renderWithProvider(
      <Calendar defaultValue={tmInceptionDate} />
    );

    let heading = getByRole('heading');
    expect(heading).toHaveTextContent('September 2013');

    let gridCells = getAllByRole('gridcell').filter(
      cell => cell.getAttribute('aria-disabled') !== 'true'
    );
    expect(gridCells.length).toBe(30);

    let selectedDate = getByLabelText('Selected', { exact: false });
    expect(selectedDate.parentElement).toHaveAttribute('role', 'gridcell');
    expect(selectedDate.parentElement).toHaveAttribute('aria-selected', 'true');
    expect(selectedDate).toHaveAttribute(
      'aria-label',
      'Wednesday, September 4, 2013 selected'
    );
  });
  it('renders a calendar with a value', () => {
    let { getByLabelText, getByRole, getAllByRole } = renderWithProvider(
      <Calendar value={tmInceptionDate} />
    );

    let heading = getByRole('heading');
    expect(heading).toHaveTextContent('September 2013');

    let gridCells = getAllByRole('gridcell').filter(
      cell => cell.getAttribute('aria-disabled') !== 'true'
    );
    expect(gridCells.length).toBe(30);

    let selectedDate = getByLabelText('Selected', { exact: false });
    expect(selectedDate.parentElement).toHaveAttribute('role', 'gridcell');
    expect(selectedDate.parentElement).toHaveAttribute('aria-selected', 'true');
    expect(selectedDate).toHaveAttribute(
      'aria-label',
      'Wednesday, September 4, 2013 selected'
    );
  });

  it('focuses the selected date if `autoFocus` is set', () => {
    let { getByLabelText, getByRole } = renderWithProvider(
      <Calendar autoFocus value={tmInceptionDate} />
    );
    let cell = getByLabelText('selected', { exact: false });

    let grid = getByRole('grid');
    expect(cell.parentElement).toHaveAttribute('role', 'gridcell');
    expect(cell.parentElement).toHaveAttribute('aria-selected', 'true');
    expect(cell).toHaveFocus();
    expect(grid).not.toHaveAttribute('aria-activedescendant');
  });

  it('selects a date with the keyboard', () => {
    let onChange = jest.fn();
    let { getByLabelText, getByRole } = renderWithProvider(
      <Calendar
        defaultValue={new CalendarDate(2023, 6, 5)}
        autoFocus
        onChange={onChange}
      />
    );

    let grid = getByRole('grid');
    let selectedDate = getByLabelText('selected', { exact: false });
    expect(selectedDate.textContent).toBe('5');

    // Select a new date
    fireEvent.keyDown(grid, {
      key: 'ArrowLeft',
      keyCode: keyCodes.ArrowLeft,
    });
    fireEvent.keyDown(grid, { key: 'Enter', keyCode: keyCodes.Enter });
    selectedDate = getByLabelText('selected', { exact: false });
    expect(selectedDate.textContent).toBe('4');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toEqual(new CalendarDate(2023, 6, 4));

    fireEvent.keyDown(grid, {
      key: 'ArrowLeft',
      keyCode: keyCodes.ArrowLeft,
    });
    fireEvent.keyDown(grid, { key: ' ', keyCode: keyCodes[' '] });
    selectedDate = getByLabelText('selected', { exact: false });
    expect(selectedDate.textContent).toBe('3');
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange.mock.calls[1][0]).toEqual(new CalendarDate(2023, 6, 3));
  });
  it('selects a date on click', () => {
    let onChange = jest.fn();
    let { getByLabelText, getByText } = renderWithProvider(
      <Calendar
        defaultValue={new CalendarDate(2023, 6, 5)}
        onChange={onChange}
      />
    );

    let newDate = getByText('17');
    firePress(newDate);

    let selectedDate = getByLabelText('selected', { exact: false });
    expect(selectedDate.textContent).toBe('17');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toEqual(new CalendarDate(2023, 6, 17));
  });
  it('does not select a date on click if outside the valid date range', () => {
    let onChange = jest.fn();
    let { getByLabelText } = renderWithProvider(
      <Calendar
        onChange={onChange}
        defaultValue={new CalendarDate(2023, 2, 8)}
        minValue={new CalendarDate(2023, 2, 5)}
        maxValue={new CalendarDate(2023, 2, 15)}
      />
    );

    firePress(getByLabelText('Friday, February 3, 2023'));

    let selectedDate = getByLabelText('selected', { exact: false });
    expect(selectedDate.textContent).toBe('8');
    expect(onChange).not.toHaveBeenCalled();

    firePress(getByLabelText('Friday, February 17, 2023'));

    selectedDate = getByLabelText('selected', { exact: false });
    expect(selectedDate.textContent).toBe('8');
    expect(onChange).not.toHaveBeenCalled();

    firePress(getByLabelText('Sunday, February 5, 2023, First available date'));

    selectedDate = getByLabelText('selected', { exact: false });
    expect(selectedDate.textContent).toBe('5');
    expect(onChange).toHaveBeenCalledTimes(1);

    firePress(
      getByLabelText('Wednesday, February 15, 2023, Last available date')
    );

    selectedDate = getByLabelText('selected', { exact: false });
    expect(selectedDate.textContent).toBe('15');
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('marks selection as invalid using isDateUnavailable', () => {
    function Example() {
      let { locale } = useLocale();
      return (
        <Calendar
          defaultValue={new CalendarDate(2022, 3, 5)}
          isDateUnavailable={date => isWeekend(date, locale)}
        />
      );
    }

    let { getByRole } = renderWithProvider(<Example />);

    let cell = getByRole('button', {
      name: 'Saturday, March 5, 2022 selected',
    });
    expect(cell).toHaveAttribute('aria-invalid', 'true');
    expect(cell.parentElement).toHaveAttribute('aria-selected', 'true');
    expect(cell.parentElement).toHaveAttribute('aria-invalid', 'true');
  });
});
