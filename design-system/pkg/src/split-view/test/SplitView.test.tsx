import '@testing-library/jest-dom';

import { renderWithProvider } from '#test-utils';

import {
  SplitPanePrimary,
  SplitPaneSecondary,
  SplitView,
  SplitViewProps,
} from '../index';

function renderSplitView(props: Partial<SplitViewProps> = {}) {
  return renderWithProvider(
    <SplitView defaultSize={200} minSize={100} maxSize={400} {...props}>
      <SplitPanePrimary>Primary</SplitPanePrimary>
      <SplitPaneSecondary>Secondary</SplitPaneSecondary>
    </SplitView>
  );
}

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
});
