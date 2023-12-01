import { useCallback, useMemo } from 'react';

import { ActionButton } from '@keystar/ui/button';
import { Dialog, DialogTrigger } from '@keystar/ui/dialog';
import { Icon } from '@keystar/ui/icon';
import { imageIcon } from '@keystar/ui/icon/icons/imageIcon';
import { typeIcon } from '@keystar/ui/icon/icons/typeIcon';
import { HStack } from '@keystar/ui/layout';
import { Content, SlotProvider } from '@keystar/ui/slots';
import { Heading, Kbd, Prose, Text } from '@keystar/ui/typography';

import { getUploadedFileObject } from '../../image/ui';
import { useEditorDispatchCommand } from './editor-view';
import { readFileAsDataUrl } from './images';

export function EditorFooter() {
  const runCommand = useEditorDispatchCommand();
  const handleImagePress = useCallback(async () => {
    const file = await getUploadedFileObject('image/*');
    if (!file) return;
    const src = await readFileAsDataUrl(file);
    runCommand((state, dispatch) => {
      if (dispatch) {
        dispatch(
          state.tr.replaceSelectionWith(
            state.schema.nodes.image.createChecked({
              src,
              filename: file.name,
            })
          )
        );
      }
      return true;
    });
  }, [runCommand]);

  const slots = useMemo(
    () => ({ icon: { size: 'small' }, text: { size: 'small' } }) as const,
    []
  );

  return (
    <HStack gap="small" margin="small">
      <DialogTrigger isDismissable>
        <ActionButton prominence="low">
          <SlotProvider slots={slots}>
            <Icon src={typeIcon} />
            <Text>Markdown support</Text>
          </SlotProvider>
        </ActionButton>
        <MarkdownDialog />
      </DialogTrigger>
      <ActionButton prominence="low" onPress={handleImagePress}>
        <SlotProvider slots={slots}>
          <Icon src={imageIcon} />
          <Text>Paste, drop, or click to add images</Text>
        </SlotProvider>
      </ActionButton>
    </HStack>
  );
}

function MarkdownDialog() {
  return (
    <Dialog size="large">
      <Heading>Basic writing and formatting syntax</Heading>
      <Content>
        <Prose size="regular">
          <p>
            Markdown is a way to style text; it is intended to be as
            easy-to-read and easy-to-write as is feasible.
          </p>

          <h3>Headings</h3>
          <p>
            To create a heading, add one to six <code>#</code> symbols before
            your heading text. The number of <code>#</code> you use will
            determine the hierarchy level and typeface size of the heading.
          </p>
          <pre>
            <code>{`# A first-level heading\n## A second-level heading\n### A third-level heading`}</code>
          </pre>

          <h3>Styling text</h3>
          <p>
            You can indicate emphasis with bold, italic, or strikethrough text.
          </p>
          <table>
            <thead>
              <tr>
                <th scope="col">Style</th>
                <th scope="col">Syntax</th>
                <th scope="col">Shortcut</th>
                <th scope="col">Example</th>
                <th scope="col">Output</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Bold</td>
                <td>
                  <code>** **</code>
                </td>
                <td>
                  <Kbd meta trim={false}>
                    B
                  </Kbd>
                </td>
                <td>
                  <code>**This is bold text**</code>
                </td>
                <td>
                  <strong>This is bold text</strong>
                </td>
              </tr>
              <tr>
                <td>Italic</td>
                <td>
                  <code>_ _</code>
                </td>
                <td>
                  <Kbd meta trim={false}>
                    I
                  </Kbd>
                </td>
                <td>
                  <code>_This text is italicized_</code>
                </td>
                <td>
                  <em>This text is italicized</em>
                </td>
              </tr>
              <tr>
                <td>Strikethrough</td>
                <td>
                  <code>~~ ~~</code>
                </td>
                <td>None</td>
                <td>
                  <code>~~This was mistaken text~~</code>
                </td>
                <td>
                  <del>This was mistaken text</del>
                </td>
              </tr>
              <tr>
                <td>Nested&nbsp;emphasis</td>
                <td>
                  <code>**&nbsp;**</code> and <code>_&nbsp;_</code>
                </td>
                <td>None</td>
                <td>
                  <code>**This text is _extremely_ important**</code>
                </td>
                <td>
                  <strong>
                    This text is <em>extremely</em> important
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>

          <h3>Lists</h3>
          <p>
            You can make an unordered (bulleted) list by preceding one or more
            lines of text with <kbd>-</kbd>, or <kbd>*</kbd>.
          </p>
          <pre>
            <code>{`- Red\n- Green\n- Blue`}</code>
          </pre>

          <p>To order your list, precede each line with a number.</p>
          <pre>
            <code>{`1. Red\n1. Green\n1. Blue`}</code>
          </pre>

          <h3>Quoting text</h3>
          <p>
            You can quote text with a <kbd>{'>'}</kbd>.
          </p>
          <pre>
            <code>{`Text that is not a quote\n\n> Text that is a quote`}</code>
          </pre>

          <h3>Quoting code</h3>
          <p>
            You can call out code or a command within a sentence with single
            backticks <kbd>{'`'}</kbd>. The text within the backticks will not
            be formatted.
          </p>
          <pre>
            <code>{`Use \`npm create @keystatic@latest\` to start editing static files today.`}</code>
          </pre>

          <p>
            To format code or text into its own distinct block, use triple
            backticks <kbd>{'```'}</kbd>.
          </p>
          <pre>
            <code>{`Keystatic project expects an exported config.

\`\`\`
import { config } from '@keystatic/core'

export default config({
  ...
})
\`\`\``}</code>
          </pre>
        </Prose>
      </Content>
    </Dialog>
  );
}
