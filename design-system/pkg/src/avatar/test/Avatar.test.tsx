import { describe, it, expect } from '@jest/globals';

import { render } from '#test-utils';

import { Avatar } from '..';

describe('avatar/Avatar', () => {
  it('renders an avatar image', () => {
    const { getByRole } = render(
      <Avatar src="https://i.pravatar.cc/128?u=avatar" />
    );
    expect(getByRole('img')).toBeInTheDocument();
  });

  describe('initials', () => {
    it('typical', () => {
      const { getByRole } = render(<Avatar name="John Smith" />);
      expect(getByRole('img')).toHaveTextContent('JS');
    });
    it('multi', () => {
      const { getByRole } = render(<Avatar name="John Anders Brendan Smith" />);
      expect(getByRole('img')).toHaveTextContent('JS');
    });
    it('single', () => {
      const { getByRole } = render(<Avatar name="John" />);
      expect(getByRole('img')).toHaveTextContent('J');
    });
    it('size=xsmall', () => {
      const { getByRole } = render(<Avatar name="John Smith" size="xsmall" />);
      expect(getByRole('img')).toHaveTextContent('J');
    });
  });

  it('supports alt text as aria-label', () => {
    const { getByLabelText } = render(
      <Avatar src="https://i.pravatar.cc/128?u=avatar" alt="Test avatar" />
    );
    expect(getByLabelText(/test avatar/i)).toBeInTheDocument();
  });

  it('supports custom class names', () => {
    const { getByRole } = render(
      <Avatar
        src="https://i.pravatar.cc/128?u=avatar"
        UNSAFE_className="some-class-name"
      />
    );
    expect(getByRole('img')).toHaveAttribute(
      'class',
      expect.stringContaining('some-class-name')
    );
  });

  it('supports style props', () => {
    const { getByRole } = render(
      <Avatar src="https://i.pravatar.cc/128?u=avatar" isHidden />
    );
    expect(getByRole('img', { hidden: true })).toBeInTheDocument();
  });

  it('supports custom DOM props', () => {
    const { getByTestId } = render(
      <Avatar
        src="https://i.pravatar.cc/128?u=avatar"
        data-testid="Test avatar"
      />
    );
    expect(getByTestId(/test avatar/i)).toBeInTheDocument();
  });
});
