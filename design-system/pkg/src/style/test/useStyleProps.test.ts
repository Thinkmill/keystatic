import { renderHook } from '@testing-library/react';
import { useStyleProps } from '@keystar/ui/style';

describe('style/useStyleProps', function () {
  it('should allow escape hatches', function () {
    let { result } = renderHook(() =>
      useStyleProps({
        UNSAFE_className: 'custom-class',
        UNSAFE_style: { color: 'red' },
      })
    );

    expect(result.current.className).toMatch(/custom-class/);
    expect(result.current.style).toMatchObject({ color: 'red' });
  });
});
