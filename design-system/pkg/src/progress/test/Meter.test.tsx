import { expect, jest, describe, it } from '@jest/globals';
import { render } from '@testing-library/react';

import { Meter } from '..';

describe('progress/Meter', function () {
  it('handles defaults', function () {
    let { getByLabelText, getByRole } = render(<Meter label="Meter" />);
    let progressBar = getByRole('meter');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
    expect(progressBar).toHaveAttribute('aria-valuetext', '0%');

    let byLabel = getByLabelText('Meter');
    expect(progressBar).toEqual(byLabel);
  });

  it('updates attributes by value', function () {
    let { getByRole } = render(<Meter value={30} label="Meter" />);
    let progressBar = getByRole('meter');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    expect(progressBar).toHaveAttribute('aria-valuenow', '30');
    expect(progressBar).toHaveAttribute('aria-valuetext', '30%');
  });

  it('clamps values', function () {
    let { getByRole, rerender } = render(<Meter value={-15} label="Below" />);

    expect(getByRole('meter')).toHaveAttribute('aria-valuenow', '0');
    expect(getByRole('meter')).toHaveAttribute('aria-valuetext', '0%');

    rerender(<Meter value={150} label="Above" />);

    expect(getByRole('meter')).toHaveAttribute('aria-valuenow', '100');
    expect(getByRole('meter')).toHaveAttribute('aria-valuetext', '100%');
  });

  it('handles negative values', () => {
    let { getByRole } = render(
      <Meter value={0} minValue={-5} maxValue={5} label="Meter" />
    );
    let progressBar = getByRole('meter');
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
    expect(progressBar).toHaveAttribute('aria-valuetext', '50%');
  });

  it('warns user if no aria-label is provided', () => {
    let spyWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Meter value={25} />);
    expect(spyWarn).toHaveBeenCalledWith(
      'Warning: If you do not provide a visible label via children, you must specify an aria-label or aria-labelledby attribute for accessibility.'
    );
  });

  it('supports custom DOM props', function () {
    let { queryByTestId } = render(<Meter label="Meter" data-testid="test" />);
    expect(queryByTestId('test')).toBeTruthy();
  });
});
