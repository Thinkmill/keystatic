import '@testing-library/jest-dom';

import { renderWithProvider } from '@voussoir/test-utils';

import { DateField } from '../src';

describe('date-time/DateField', () => {
  it('renders', () => {
    let { getAllByRole, getByText } = renderWithProvider(
      <DateField label="Date" />
    );

    let label = getByText('Date');

    let combobox = getAllByRole('group')[0];
    expect(combobox).toHaveAttribute('aria-labelledby', label.id);

    let segments = getAllByRole('spinbutton');
    for (let segment of segments) {
      expect(segment).toHaveAttribute('id');
      let segmentId = segment.getAttribute('id');
      expect(segment).toHaveAttribute(
        'aria-labelledby',
        `${label.id} ${segmentId}`
      );
    }
  });
});
