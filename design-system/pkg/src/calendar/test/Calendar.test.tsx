import '@testing-library/jest-dom';

import { renderWithProvider } from '#test-utils';

import { Calendar } from '../index';
import { CalendarDate } from '@internationalized/date';

describe('calendar/Calendar', () => {
  it('renders a calendar with a defaultValue', () => {
    let { getByLabelText, getByRole, getAllByRole } = renderWithProvider(
      <Calendar defaultValue={new CalendarDate(2019, 6, 5)} />
    );

    let heading = getByRole('heading');
    expect(heading).toHaveTextContent('June 2019');

    let gridCells = getAllByRole('gridcell').filter(
      cell => cell.getAttribute('aria-disabled') !== 'true'
    );
    expect(gridCells.length).toBe(30);

    let selectedDate = getByLabelText('Selected', { exact: false });
    expect(selectedDate.parentElement).toHaveAttribute('role', 'gridcell');
    expect(selectedDate.parentElement).toHaveAttribute('aria-selected', 'true');
    expect(selectedDate).toHaveAttribute(
      'aria-label',
      'Wednesday, June 5, 2019 selected'
    );
  });
});
