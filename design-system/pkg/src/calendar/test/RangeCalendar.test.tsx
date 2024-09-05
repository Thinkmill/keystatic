import { CalendarDate } from '@internationalized/date';
import {
  afterEach,
  beforeAll,
  expect,
  jest,
  describe,
  it,
} from '@jest/globals';

import { act, fireEvent, renderWithProvider } from '#test-utils';

import { RangeCalendar } from '../index';
import { RangeValue } from '@react-types/shared';

describe('calendar/RangeCalendar', () => {
  // let user = userEvent.setup();

  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    act(() => {
      jest.runAllTimers();
    });
  });

  it('renders a calendar with a defaultValue', () => {
    let { getAllByLabelText, getByRole, getAllByRole } = renderWithProvider(
      <RangeCalendar
        defaultValue={{
          start: new CalendarDate(2019, 6, 5),
          end: new CalendarDate(2019, 6, 10),
        }}
      />
    );
    let heading = getByRole('heading');
    expect(heading).toHaveTextContent('June 2019');

    let gridCells = getAllByRole('gridcell').filter(
      cell => cell.getAttribute('aria-disabled') !== 'true'
    );
    expect(gridCells.length).toBe(30);

    let selectedDates = getAllByLabelText('Selected', { exact: false });
    let labels = [
      'Selected Range: Wednesday, June 5 to Monday, June 10, 2019, Wednesday, June 5, 2019 selected',
      'Thursday, June 6, 2019 selected',
      'Friday, June 7, 2019 selected',
      'Saturday, June 8, 2019 selected',
      'Sunday, June 9, 2019 selected',
      'Selected Range: Wednesday, June 5 to Monday, June 10, 2019, Monday, June 10, 2019 selected',
    ];
    expect(selectedDates.length).toBe(6);

    let i = 0;
    for (let cell of selectedDates) {
      expect(cell.parentElement).toHaveAttribute('role', 'gridcell');
      expect(cell.parentElement).toHaveAttribute('aria-selected', 'true');
      expect(cell).toHaveAttribute('aria-label', labels[i++]);
    }
  });
  it('renders a calendar with a value', () => {
    let { getAllByLabelText, getByRole, getAllByRole } = renderWithProvider(
      <RangeCalendar
        value={{
          start: new CalendarDate(2019, 6, 5),
          end: new CalendarDate(2019, 6, 10),
        }}
      />
    );
    let heading = getByRole('heading');
    expect(heading).toHaveTextContent('June 2019');

    let gridCells = getAllByRole('gridcell').filter(
      cell => cell.getAttribute('aria-disabled') !== 'true'
    );
    expect(gridCells.length).toBe(30);

    let selectedDates = getAllByLabelText('Selected', { exact: false });
    let labels = [
      'Selected Range: Wednesday, June 5 to Monday, June 10, 2019, Wednesday, June 5, 2019 selected',
      'Thursday, June 6, 2019 selected',
      'Friday, June 7, 2019 selected',
      'Saturday, June 8, 2019 selected',
      'Sunday, June 9, 2019 selected',
      'Selected Range: Wednesday, June 5 to Monday, June 10, 2019, Monday, June 10, 2019 selected',
    ];
    expect(selectedDates.length).toBe(6);

    let i = 0;
    for (let cell of selectedDates) {
      expect(cell.parentElement).toHaveAttribute('role', 'gridcell');
      expect(cell.parentElement).toHaveAttribute('aria-selected', 'true');
      expect(cell).toHaveAttribute('aria-label', labels[i++]);
    }
  });

  it('focuses the selected date if `autoFocus` is set', () => {
    let { getAllByLabelText, getByRole } = renderWithProvider(
      <RangeCalendar
        autoFocus
        value={{
          start: new CalendarDate(2019, 6, 5),
          end: new CalendarDate(2019, 6, 10),
        }}
      />
    );
    let cells = getAllByLabelText('selected', { exact: false });
    let grid = getByRole('grid');

    expect(cells[0].parentElement).toHaveAttribute('role', 'gridcell');
    expect(cells[0].parentElement).toHaveAttribute('aria-selected', 'true');
    expect(cells[0]).toHaveFocus();
    expect(grid).not.toHaveAttribute('aria-activedescendant');
  });

  it('should show selected dates across multiple months', () => {
    let { getByRole, getByLabelText, getAllByLabelText, getAllByRole } =
      renderWithProvider(
        <RangeCalendar
          value={{
            start: new CalendarDate(2019, 6, 20),
            end: new CalendarDate(2019, 7, 10),
          }}
        />
      );

    let heading = getByRole('heading');
    expect(heading).toHaveTextContent('June 2019');

    let gridCells = getAllByRole('gridcell').filter(
      cell => cell.getAttribute('aria-disabled') !== 'true'
    );
    expect(gridCells.length).toBe(30);

    let selected = getAllByLabelText('selected', { exact: false }).filter(
      cell => cell.getAttribute('aria-disabled') !== 'true'
    );
    expect(selected.length).toBe(11);
    let juneLabels = [
      'Selected Range: Thursday, June 20 to Wednesday, July 10, 2019, Thursday, June 20, 2019 selected',
      'Friday, June 21, 2019 selected',
      'Saturday, June 22, 2019 selected',
      'Sunday, June 23, 2019 selected',
      'Monday, June 24, 2019 selected',
      'Tuesday, June 25, 2019 selected',
      'Wednesday, June 26, 2019 selected',
      'Thursday, June 27, 2019 selected',
      'Friday, June 28, 2019 selected',
      'Saturday, June 29, 2019 selected',
      'Sunday, June 30, 2019 selected',
    ];

    let i = 0;
    for (let cell of selected) {
      expect(cell.parentElement).toHaveAttribute('aria-selected', 'true');
      expect(cell).toHaveAttribute('aria-label', juneLabels[i++]);
    }

    let nextButton = getAllByLabelText('Next')[0];
    fireEvent.click(nextButton);

    selected = getAllByLabelText('selected', { exact: false }).filter(
      cell => cell.getAttribute('aria-disabled') !== 'true'
    );
    expect(selected.length).toBe(10);
    let julyLabels = [
      'Monday, July 1, 2019 selected',
      'Tuesday, July 2, 2019 selected',
      'Wednesday, July 3, 2019 selected',
      'Thursday, July 4, 2019 selected',
      'Friday, July 5, 2019 selected',
      'Saturday, July 6, 2019 selected',
      'Sunday, July 7, 2019 selected',
      'Monday, July 8, 2019 selected',
      'Tuesday, July 9, 2019 selected',
      'Selected Range: Thursday, June 20 to Wednesday, July 10, 2019, Wednesday, July 10, 2019 selected',
    ];

    i = 0;
    for (let cell of selected) {
      expect(cell.parentElement).toHaveAttribute('aria-selected', 'true');
      expect(cell).toHaveAttribute('aria-label', julyLabels[i++]);
    }

    expect(heading).toHaveTextContent('July 2019');
    gridCells = getAllByRole('gridcell').filter(
      cell => cell.getAttribute('aria-disabled') !== 'true'
    );
    expect(gridCells.length).toBe(31);

    expect(nextButton).toHaveFocus();

    let prevButton = getByLabelText('Previous');
    fireEvent.click(prevButton);

    expect(heading).toHaveTextContent('June 2019');
    gridCells = getAllByRole('gridcell').filter(
      cell => cell.getAttribute('aria-disabled') !== 'true'
    );
    expect(gridCells.length).toBe(30);

    selected = getAllByLabelText('selected', { exact: false }).filter(
      cell => cell.getAttribute('aria-disabled') !== 'true'
    );
    expect(selected.length).toBe(11);
    i = 0;
    for (let cell of selected) {
      expect(cell.parentElement).toHaveAttribute('aria-selected', 'true');
      expect(cell).toHaveAttribute('aria-label', juneLabels[i++]);
    }

    expect(prevButton).toHaveFocus();
  });

  // TODO: selects a range with the keyboard

  it('selects a range by clicking with the mouse', () => {
    let onChange = jest.fn<(value: RangeValue<CalendarDate> | null) => void>();
    let { getAllByLabelText, getByText } = renderWithProvider(
      <RangeCalendar
        defaultValue={{
          start: new CalendarDate(2019, 6, 5),
          end: new CalendarDate(2019, 6, 10),
        }}
        onChange={onChange}
      />
    );

    fireEvent.click(getByText('17'));

    let selectedDates = getAllByLabelText('selected', { exact: false });
    expect(selectedDates[0].textContent).toBe('17');
    expect(selectedDates[selectedDates.length - 1].textContent).toBe('17');
    expect(onChange).toHaveBeenCalledTimes(0);

    // hovering updates the highlighted dates
    fireEvent.pointerEnter(getByText('10'));
    selectedDates = getAllByLabelText('selected', { exact: false });
    expect(selectedDates[0].textContent).toBe('10');
    expect(selectedDates[selectedDates.length - 1].textContent).toBe('17');
    expect(onChange).toHaveBeenCalledTimes(0);

    fireEvent.click(getByText('7'));

    selectedDates = getAllByLabelText('selected', { exact: false });
    expect(selectedDates[0].textContent).toBe('7'); // uncontrolled
    expect(selectedDates[selectedDates.length - 1].textContent).toBe('17');
    expect(onChange).toHaveBeenCalledTimes(1);

    let result = onChange.mock.calls[0][0];
    if (!result) {
      throw new Error('Expected a result');
    }
    let { start, end } = result;
    expect(start).toEqual(new CalendarDate(2019, 6, 7));
    expect(end).toEqual(new CalendarDate(2019, 6, 17));
  });
  it('selects a range by dragging with the mouse', () => {
    let onChange = jest.fn<(value: RangeValue<CalendarDate> | null) => void>();
    let { getAllByLabelText, getByText } = renderWithProvider(
      <RangeCalendar
        defaultValue={{
          start: new CalendarDate(2019, 6, 5),
          end: new CalendarDate(2019, 6, 10),
        }}
        onChange={onChange}
      />
    );
    fireEvent.mouseDown(getByText('17'), { detail: 1 });

    let selectedDates = getAllByLabelText('selected', { exact: false });
    expect(selectedDates[0].textContent).toBe('17');
    expect(selectedDates[selectedDates.length - 1].textContent).toBe('17');
    expect(onChange).toHaveBeenCalledTimes(0);

    // dragging updates the highlighted dates
    fireEvent.pointerEnter(getByText('18'));
    selectedDates = getAllByLabelText('selected', { exact: false });
    expect(selectedDates[0].textContent).toBe('17');
    expect(selectedDates[selectedDates.length - 1].textContent).toBe('18');
    expect(onChange).toHaveBeenCalledTimes(0);

    fireEvent.pointerEnter(getByText('23'));
    selectedDates = getAllByLabelText('selected', { exact: false });
    expect(selectedDates[0].textContent).toBe('17');
    expect(selectedDates[selectedDates.length - 1].textContent).toBe('23');
    expect(onChange).toHaveBeenCalledTimes(0);

    fireEvent.mouseUp(getByText('23'), { detail: 1 });

    selectedDates = getAllByLabelText('selected', { exact: false });
    expect(selectedDates[0].textContent).toBe('17');
    expect(selectedDates[selectedDates.length - 1].textContent).toBe('23');
    expect(onChange).toHaveBeenCalledTimes(1);

    let result = onChange.mock.calls[0][0];
    if (!result) {
      throw new Error('Expected a result');
    }
    let { start, end } = result;
    expect(start).toEqual(new CalendarDate(2019, 6, 17));
    expect(end).toEqual(new CalendarDate(2019, 6, 23));
  });
});
