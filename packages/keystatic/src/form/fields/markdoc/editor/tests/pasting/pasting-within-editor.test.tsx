/** @jest-environment jsdom */
/** @jsxRuntime classic */
/** @jsx jsx */
import { renderEditor, jsx } from '../utils';

test('blockquote pasting', async () => {
  let dataTransfer;
  {
    const { user } = renderEditor(
      <doc>
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
              d<head />
            </text>
          </paragraph>
        </blockquote>
        <paragraph />
      </doc>
    );
    dataTransfer = await user.copy();
  }
  const { state, user } = renderEditor(
    <doc>
      <blockquote>
        <paragraph>
          <text>a</text>
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
            d<cursor />
          </text>
        </paragraph>
      </blockquote>
      <paragraph />
    </doc>
  );
  await user.paste(dataTransfer);
  expect(state()).toMatchInlineSnapshot(`
    <doc>
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
      <paragraph />
    </doc>
  `);
});
