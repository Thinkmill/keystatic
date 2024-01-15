/** @jest-environment jsdom */
/** @jsxRuntime classic */
/** @jsx jsx */
import { expect, test } from '@jest/globals';
import { Transforms } from 'slate';
import { makeEditor, jsx } from '../tests/utils';

test('blockquote pasting', () => {
  const editor = makeEditor(
    <editor>
      <blockquote>
        <paragraph>
          <text>
            <anchor />a
          </text>
        </paragraph>
      </blockquote>
      <blockquote>
        <paragraph>
          <text>b</text>
        </paragraph>
      </blockquote>
      <blockquote>
        <paragraph>
          <text>c</text>
        </paragraph>
      </blockquote>
      <blockquote>
        <paragraph>
          <text>
            d<focus />
          </text>
        </paragraph>
      </blockquote>
      <paragraph>
        <text />
      </paragraph>
    </editor>
  );
  const fragment = editor.getFragment();
  Transforms.collapse(editor, { edge: 'end' });
  editor.insertFragment(fragment);
  expect(editor).toMatchInlineSnapshot(`
    <editor>
      <blockquote>
        <paragraph>
          <text>
            a
          </text>
        </paragraph>
      </blockquote>
      <blockquote>
        <paragraph>
          <text>
            b
          </text>
        </paragraph>
      </blockquote>
      <blockquote>
        <paragraph>
          <text>
            c
          </text>
        </paragraph>
      </blockquote>
      <blockquote>
        <paragraph>
          <text>
            da
          </text>
        </paragraph>
      </blockquote>
      <blockquote>
        <paragraph>
          <text>
            b
          </text>
        </paragraph>
      </blockquote>
      <blockquote>
        <paragraph>
          <text>
            c
          </text>
        </paragraph>
      </blockquote>
      <blockquote>
        <paragraph>
          <text>
            d
            <cursor />
          </text>
        </paragraph>
      </blockquote>
      <paragraph>
        <text />
      </paragraph>
    </editor>
  `);
});
