/** @jest-environment jsdom */
/** @jsxRuntime classic */
/** @jsx jsx */
import { expect, test } from '@jest/globals';
import { jsx, renderEditor } from './utils';

test('enter selects the focused slash-menu item', async () => {
  const { rendered, state, user } = renderEditor(
    <doc>
      <paragraph>
        <cursor />
      </paragraph>
    </doc>
  );

  await user.keyboard('/');
  await rendered.findByRole('listbox', { name: 'Insert menu' });
  await user.keyboard('{Enter}');

  expect(state()).toEqual(
    <doc>
      <blockquote>
        <paragraph>
          <cursor />
        </paragraph>
      </blockquote>
    </doc>
  );
});
