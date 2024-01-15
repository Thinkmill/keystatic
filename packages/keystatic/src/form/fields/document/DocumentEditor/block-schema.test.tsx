/** @jest-environment jsdom */
/** @jsxRuntime classic */
/** @jsx jsx */
import { expect, test } from '@jest/globals';
import { jsx, makeEditor } from './tests/utils';

test('multiple elements in the wrong position have their order maintained', () => {
  const layouts = Array.from('abcd').map(char => (
    <layout layout={[1]}>
      <layout-area>
        <paragraph>
          <text>{char}</text>
        </paragraph>
      </layout-area>
    </layout>
  ));
  const editor = makeEditor(
    <editor>
      <blockquote>{layouts}</blockquote>
      <paragraph>
        <text />
      </paragraph>
    </editor>,
    { normalization: 'normalize' }
  );
  expect(editor).toEqualEditor(
    makeEditor(
      <editor>
        <blockquote>
          <paragraph>
            <text />
          </paragraph>
        </blockquote>
        {layouts}
        <paragraph>
          <text />
        </paragraph>
      </editor>
    )
  );
});
