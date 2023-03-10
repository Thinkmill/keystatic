import '@testing-library/jest-dom';

import { render } from '@testing-library/react';

import { Emoji } from '../src';

describe('typography/Emoji', () => {
  it('should render a hidden image, when no label is provided', () => {
    const { getByRole } = render(<Emoji symbol="๐" />);

    expect(getByRole('img', { hidden: true })).toHaveTextContent('๐');
  });

  it('should have an accessible name, when a label is provided', () => {
    const label = 'A wedge-shaped or tapered stone used to construct an arch.';
    const { getByRole } = render(<Emoji symbol="๐งฑ" label={label} />);

    expect(getByRole('img')).toHaveAccessibleName(label);
  });

  it('should pass on consumer props', () => {
    const { getByTestId } = render(
      <Emoji symbol="๐งช" data-testid="typography-emoji" id="consumer-id" />
    );

    expect(getByTestId('typography-emoji')).toHaveAttribute(
      'id',
      'consumer-id'
    );
  });
});
