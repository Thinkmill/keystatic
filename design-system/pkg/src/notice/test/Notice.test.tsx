import { expect, it, describe } from '@jest/globals';
import { render } from '@testing-library/react';

import { Content } from '@keystar/ui/slots';
import { Heading, Text } from '@keystar/ui/typography';

import { Notice } from '..';

describe('notice/Notice', () => {
  it('is described by the content', () => {
    const { getByRole } = render(<Notice>The message content</Notice>);
    expect(getByRole('status')).toHaveAccessibleDescription(
      'The message content'
    );
  });
  it('is labelled by the heading, when provided', () => {
    const { getByRole } = render(
      <Notice tone="critical">
        <Heading>The heading content</Heading>
        <Content>
          <Text>The message content</Text>
        </Content>
      </Notice>
    );
    expect(getByRole('alert')).toHaveAccessibleName('The heading content');
  });
});
