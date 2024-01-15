import { expect, describe, it } from '@jest/globals';

import { globeIcon } from '@keystar/ui/icon/icons/globeIcon';
import { Icon } from '@keystar/ui/icon';
import { renderWithProvider } from '#test-utils';

import { Badge } from '..';

describe('badge/Badge', () => {
  it('renders', () => {
    const { queryByText } = renderWithProvider(<Badge>Test</Badge>);

    expect(queryByText('Test')).toBeTruthy();
  });

  it('renders children', () => {
    const { getByRole } = renderWithProvider(
      <Badge>
        <Icon src={globeIcon} />
      </Badge>
    );

    expect(getByRole('img', { hidden: true })).toBeTruthy();
  });

  it('accepts dom props', () => {
    const { getByTestId } = renderWithProvider(
      <Badge data-testid="foo" id="bar">
        Test
      </Badge>
    );

    expect(getByTestId('foo')).toHaveAttribute('id', 'bar');
  });
});
