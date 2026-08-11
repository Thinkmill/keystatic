import { render, RenderOptions } from '@testing-library/react';
import { TestProvider } from '@keystar/ui/core';
import { expect, describe, it } from '@jest/globals';

import { globeIcon } from '@keystar/ui/icon/icons/globeIcon';
import { Icon } from '@keystar/ui/icon';
import { createRef, ReactElement } from 'react';

import { Tooltip, TooltipTrigger } from '..';
import { Button } from '@keystar/ui/button';

describe('tooltip/Tooltip', () => {
  it('renders', () => {
    let { getByRole } = renderWithProvider(
      <TooltipTrigger defaultOpen>
        <Button aria-label="trigger" />
        <Tooltip>This is a tooltip</Tooltip>
      </TooltipTrigger>
    );
    let tooltip = getByRole('tooltip');
    expect(tooltip).toHaveAttribute('role', 'tooltip');
    expect(tooltip).toHaveTextContent('This is a tooltip');
  });

  it('renders children', () => {
    const { getByRole } = renderWithProvider(
      <TooltipTrigger defaultOpen>
        <Button aria-label="trigger" />
        <Tooltip>
          <Icon src={globeIcon} />
        </Tooltip>
      </TooltipTrigger>
    );

    expect(getByRole('img', { hidden: true })).toBeTruthy();
  });

  it('supports a ref', () => {
    let ref = createRef<HTMLDivElement>();
    let { getByRole } = renderWithProvider(
      <TooltipTrigger defaultOpen>
        <Button aria-label="trigger" />
        <Tooltip ref={ref}>This is a tooltip</Tooltip>
      </TooltipTrigger>
    );
    let tooltip = getByRole('tooltip');
    expect(ref.current).toBe(tooltip);
  });

  it('accepts dom props', () => {
    const { getByTestId } = renderWithProvider(
      <TooltipTrigger defaultOpen>
        <Button aria-label="trigger" />
        <Tooltip data-testid="foo" id="bar">
          Test
        </Tooltip>
      </TooltipTrigger>
    );

    expect(getByTestId('foo')).toHaveAttribute('id', 'bar');
  });
});

// TODO: move somewhere common
function renderWithProvider(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: TestProvider, ...options });
}
