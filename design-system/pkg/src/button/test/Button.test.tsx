import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestProvider } from '@keystar/ui/core';
import { ReactElement } from 'react';
import { expect, jest, describe, it } from '@jest/globals';

import { Button } from '..';

describe('button/Button', () => {
  it('should show a button with expected text', () => {
    const { getByRole } = renderWithProvider(<Button>Test Button</Button>);

    expect(getByRole('button')).toHaveTextContent('Test Button');
  });

  it('should trigger button onPress function', async () => {
    const onPress = jest.fn();
    const { getByRole } = renderWithProvider(
      <Button onPress={onPress}>Test Button</Button>
    );
    const button = getByRole('button');

    await userEvent.click(button);

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

// TODO: move somewhere common
function renderWithProvider(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: TestProvider, ...options });
}
