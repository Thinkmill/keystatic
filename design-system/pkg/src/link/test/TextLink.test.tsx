import { expect, describe, it, jest } from '@jest/globals';

import { fireEvent, render } from '@testing-library/react';

import { TextLink } from '..';

describe('navigation/TextLink', () => {
  it('should render an anchor when "href" provided', () => {
    const { getByRole } = render(
      <TextLink href="https://keystonejs.com/" rel="noreferrer noopener">
        Link text
      </TextLink>
    );

    expect(getByRole('link')).toHaveTextContent('Link text');
    expect(getByRole('link')).toHaveAttribute(
      'href',
      'https://keystonejs.com/'
    );
    expect(getByRole('link')).toHaveAttribute('rel', 'noreferrer noopener');
  });

  it('should render a button when no "href" provided', () => {
    const { getByRole } = render(<TextLink id="button-id">Link text</TextLink>);

    expect(getByRole('button')).toHaveTextContent('Link text');
    expect(getByRole('button')).toHaveAttribute('id', 'button-id');
  });

  it('supports custom data attributes', () => {
    let { queryByTestId } = render(
      <TextLink href="#" data-testid="test">
        Link text
      </TextLink>
    );
    let link = queryByTestId('test');
    expect(link).toBeTruthy();
  });

  it('omits invalid and junk attributes', () => {
    let { getByRole } = render(
      <TextLink
        href="#"
        // @ts-ignore
        foo="bar"
        role="checkbox"
        aria-checked="true"
      >
        Link text
      </TextLink>
    );

    expect(getByRole('link')).not.toHaveAttribute('foo', 'bar');
    expect(getByRole('link')).not.toHaveAttribute('aria-checked');
  });

  it('supports press handler', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <TextLink href="#" onPress={onPress}>
        Link text
      </TextLink>
    );

    fireEvent.click(getByRole('link'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
