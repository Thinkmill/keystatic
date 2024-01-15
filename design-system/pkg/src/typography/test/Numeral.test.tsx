import { jest, expect, it, describe, beforeEach } from '@jest/globals';

import { render } from '@testing-library/react';

import { Numeral } from '..';
import { NumeralProps } from '../Numeral';

describe('typography/Numeral', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should insert comma delimeter between thousands', () => {
    const { container } = render(<Numeral value={1000000} />);
    expect(container.firstChild).toHaveTextContent('1,000,000');
  });

  describe('precision', () => {
    it('should support exact precision', () => {
      const { container } = render(<Numeral value={100} precision={4} />);
      expect(container.firstChild).toHaveTextContent('100.0000');
    });
    it('should round where appropriate', () => {
      const { container } = render(<Numeral value={100.789} precision={2} />);
      expect(container.firstChild).toHaveTextContent('100.79');
    });
    it('should support range precision', () => {
      const { rerender, container } = render(
        <Numeral value={100} precision={[0, 2]} />
      );
      expect(container.firstChild).toHaveTextContent('100');
      rerender(<Numeral value={100.123} precision={[0, 2]} />);
      expect(container.firstChild).toHaveTextContent('100.12');
    });
  });

  describe('prop validation', () => {
    it('should error when provided invalid prop combinations', () => {
      const spy = jest.spyOn(console, 'error');
      spy.mockImplementation(() => {});
      expect(() => r({ format: 'currency' })).toThrow(); // needs currency prop
      expect(() => r({ format: 'unit' })).toThrow(); // needs unit prop
      expect(() => r({ currency: 'USD', unit: 'meter' })).toThrow(); // cannot have both currency and unit
      expect(() => r({ format: 'percent', currency: 'USD' })).toThrow();
      expect(() => r({ format: 'percent', unit: 'meter' })).toThrow();
      spy.mockRestore();
    });
  });
});

function r(props: Partial<NumeralProps>) {
  return render(<Numeral value={100} {...props} />);
}
