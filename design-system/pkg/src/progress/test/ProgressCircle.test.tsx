import { expect, it, describe, jest } from '@jest/globals';
import { render } from '@testing-library/react';

import { ProgressCircle } from '..';

describe('progress/ProgressCircle', function () {
  it('handles defaults', function () {
    let { getByRole } = render(<ProgressCircle aria-label="Progress circle" />);
    let progressBar = getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
    expect(progressBar).toHaveAttribute('aria-valuetext', '0%');
  });

  it('updates attributes by value', function () {
    let { getByRole } = render(
      <ProgressCircle value={30} aria-label="Progress circle" />
    );
    let progressBar = getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    expect(progressBar).toHaveAttribute('aria-valuenow', '30');
    expect(progressBar).toHaveAttribute('aria-valuetext', '30%');
  });

  it('clamps values', function () {
    let { getByRole, rerender } = render(
      <ProgressCircle value={-15} aria-label="Below" />
    );

    expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuetext', '0%');

    rerender(<ProgressCircle value={150} aria-label="Above" />);

    expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuetext', '100%');
  });

  it('handles negative values', () => {
    let { getByRole } = render(
      <ProgressCircle
        value={0}
        minValue={-5}
        maxValue={5}
        aria-label="Progress circle"
      />
    );
    let progressBar = getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
    expect(progressBar).toHaveAttribute('aria-valuetext', '50%');
  });

  it('warns user if no aria-label is provided', () => {
    let spyWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(<ProgressCircle value={25} />);
    expect(spyWarn).toHaveBeenCalledWith(
      'Warning: ProgressCircle requires an aria-label or aria-labelledby attribute for accessibility.'
    );
  });

  it('supports custom DOM props', function () {
    let { queryByTestId } = render(
      <ProgressCircle aria-label="Progress circle" data-testid="test" />
    );
    expect(queryByTestId('test')).toBeTruthy();
  });
});
