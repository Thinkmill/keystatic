import '@testing-library/jest-dom';
import { render, RenderOptions } from '@testing-library/react';
import { TestProvider } from '@voussoir/core';

import { globeIcon } from '@voussoir/icon/icons/globeIcon';
import { Icon } from '@voussoir/icon';
import { createRef, ReactElement } from 'react';

import { Tooltip } from '../src';

describe('tooltip/Tooltip', () => {
  it('renders', () => {
    let { getByRole } = render(<Tooltip>This is a tooltip</Tooltip>);
    let tooltip = getByRole('tooltip');
    expect(tooltip).toHaveAttribute('role', 'tooltip');
    expect(tooltip).toHaveTextContent('This is a tooltip');
  });

  it('renders children', () => {
    const { getByRole } = renderWithProvider(
      <Tooltip>
        <Icon src={globeIcon} />
      </Tooltip>
    );

    expect(getByRole('img', { hidden: true })).toBeTruthy();
  });

  it('supports a ref', () => {
    let ref = createRef<HTMLDivElement>();
    let { getByRole } = render(<Tooltip ref={ref}>This is a tooltip</Tooltip>);
    let tooltip = getByRole('tooltip');
    expect(ref.current).toBe(tooltip);
  });

  it('accepts dom props', () => {
    const { getByTestId } = renderWithProvider(
      <Tooltip data-testid="foo" id="bar">
        Test
      </Tooltip>
    );

    expect(getByTestId('foo')).toHaveAttribute('id', 'bar');
  });
});

// TODO: move somewhere common
function renderWithProvider(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: TestProvider, ...options });
}
