import userEvent from '@testing-library/user-event';
import { expect, it, describe, jest } from '@jest/globals';

import { renderWithProvider } from '#test-utils';

import {
  SplitPanePrimary,
  SplitPaneSecondary,
  SplitView,
  SplitViewProps,
} from '../index';

const DEFAULT_SIZE = 200;
const MIN_SIZE = 100;
const MAX_SIZE = 400;
const STEP = Math.round((MAX_SIZE - MIN_SIZE) / 10);
function renderSplitView(props: Partial<SplitViewProps> = {}) {
  return renderWithProvider(
    <SplitView
      defaultSize={DEFAULT_SIZE}
      minSize={MIN_SIZE}
      maxSize={MAX_SIZE}
      {...props}
    >
      <SplitPanePrimary>Primary</SplitPanePrimary>
      <SplitPaneSecondary>Secondary</SplitPaneSecondary>
    </SplitView>
  );
}

// NOTE: This is a very basic test suite. It does not include tests for the
// resize drag behavior, which is probably better suited to something like
// Cypress or Playwright.
describe('split-view/SplitView', () => {
  it('renders', () => {
    const { getByText, getByRole } = renderSplitView();

    expect(getByText('Primary')).toBeVisible();
    expect(getByRole('separator')).toBeVisible();
    expect(getByText('Secondary')).toBeVisible();
  });

  it('accepts dom props', () => {
    const { getByTestId } = renderSplitView({
      // @ts-ignore
      'data-testid': 'foo',
      id: 'bar',
    });

    expect(getByTestId('foo')).toHaveAttribute('id', 'bar');
  });

  it('is collapsible', () => {
    const { getByText, getByRole } = renderSplitView({ isCollapsed: true });

    expect(getByText('Primary')).not.toBeVisible();
    expect(getByRole('separator', { hidden: true })).toBeVisible();
    expect(getByText('Secondary')).toBeVisible();
  });

  it('supports keyboard resize', async function () {
    let onResize = jest.fn();
    let user = userEvent.setup();
    let id = 'test';
    const { getByRole } = renderSplitView({ id, onResize });
    const resizeHandle = getByRole('separator');

    expect(resizeHandle).toHaveAttribute('aria-valuemax', '100');
    expect(resizeHandle).toHaveAttribute('aria-valuemin', '0');
    expect(resizeHandle).toHaveAttribute(
      'aria-valuenow',
      Math.round(
        ((DEFAULT_SIZE - MIN_SIZE) / (MAX_SIZE - MIN_SIZE)) * 100
      ).toString()
    );

    await user.tab();
    expect(resizeHandle).toHaveFocus();

    await user.keyboard('[ArrowRight]');
    expect(onResize).toHaveBeenCalledWith(DEFAULT_SIZE + STEP);
    await user.keyboard('[ArrowRight]');
    expect(onResize).toHaveBeenCalledWith(DEFAULT_SIZE + STEP * 2);
    await user.keyboard('[ArrowLeft]');
    expect(onResize).toHaveBeenCalledWith(DEFAULT_SIZE + STEP);
    await user.keyboard('[End]');
    expect(onResize).toHaveBeenCalledWith(MAX_SIZE);
    await user.keyboard('[Home]');
    expect(onResize).toHaveBeenCalledWith(MIN_SIZE);
  });
});
