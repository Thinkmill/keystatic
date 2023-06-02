/** @jest-environment jsdom */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, renderEditor } from '../utils';

test('pasting a url on some text wraps the text with a link', async () => {
  const { state, user } = renderEditor(
    <doc>
      <paragraph>
        <text>
          blah <anchor />
          blah
          <head /> blah
        </text>
      </paragraph>
    </doc>
  );
  await user.paste('https://keystonejs.com');
  expect(state()).toMatchInlineSnapshot(`
    <doc>
      <paragraph>
        <text>
          blah 
        </text>
        <link
          @@isInline={true}
          href="https://keystonejs.com"
        >
          <text>
            <anchor />
            blah
            <head />
          </text>
        </link>
        <text>
           blah
        </text>
      </paragraph>
    </doc>
  `);
});

test('pasting a url on a selection spanning multiple blocks replaces the selection with the url', async () => {
  const { state, user } = renderEditor(
    <doc>
      <paragraph>
        <text>
          start should still exist <anchor />
          blah blah
        </text>
      </paragraph>
      <paragraph>
        <text>
          blah blah
          <head /> end should still exist
        </text>
      </paragraph>
    </doc>
  );
  await user.paste('https://keystonejs.com');
  expect(editor).toMatchInlineSnapshot(`
    <doc>
      <paragraph>
        <text>
          start should still exist 
        </text>
        <link
          @@isInline={true}
          href="https://keystonejs.com"
        >
          <text>
            https://keystonejs.com
            <cursor />
          </text>
        </link>
        <text>
           end should still exist
        </text>
      </paragraph>
    </doc>
  `);
});

test('pasting a url on a selection with a link inside replaces the selection with the url', async () => {
  const { state, user } = renderEditor(
    <doc>
      <paragraph>
        <text>
          start should still exist <anchor />
          should{' '}
        </text>
        <text link={{ href: 'https://keystonejs.com/docs', title: '' }}>
          be
        </text>
        <text>
          replaced
          <head /> end should still exist
        </text>
      </paragraph>
    </doc>
  );
  await user.paste('https://keystonejs.com');
  expect(state()).toMatchInlineSnapshot(`
    <doc>
      <paragraph>
        <text>
          start should still exist 
        </text>
        <link
          @@isInline={true}
          href="https://keystonejs.com"
        >
          <text>
            https://keystonejs.com
            <cursor />
          </text>
        </link>
        <text>
           end should still exist
        </text>
      </paragraph>
    </doc>
  `);
});
