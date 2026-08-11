import { fireEvent, renderWithProvider } from '#test-utils';
import { beforeAll, describe, expect, it, jest } from '@jest/globals';

import {
  EditorAutocomplete,
  EditorListbox,
  EditorListboxItem,
  useEditorAutocompleteInputProps,
} from '..';

describe('editor/EditorListbox', () => {
  beforeAll(() => {
    jest
      .spyOn(window.HTMLElement.prototype, 'clientWidth', 'get')
      .mockImplementation(() => 1000);
    jest
      .spyOn(window.HTMLElement.prototype, 'clientHeight', 'get')
      .mockImplementation(() => 1000);
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  it('connects RAC autocomplete keyboard semantics to a contenteditable', () => {
    function EditorInput() {
      let inputProps = useEditorAutocompleteInputProps();
      return <div {...inputProps} contentEditable role="textbox" />;
    }

    function Example() {
      return (
        <EditorAutocomplete>
          <EditorInput />
          <EditorListbox aria-label="Insert block">
            <EditorListboxItem id="paragraph">Paragraph</EditorListboxItem>
            <EditorListboxItem id="heading">Heading</EditorListboxItem>
          </EditorListbox>
        </EditorAutocomplete>
      );
    }

    let result = renderWithProvider(<Example />);
    let editor = result.getByRole('textbox');
    let listbox = result.getByRole('listbox', { name: 'Insert block' });

    expect(editor).toHaveAttribute('aria-autocomplete', 'list');
    expect(editor).toHaveAttribute('aria-controls', listbox.id);
    fireEvent.keyDown(editor, { key: 'ArrowDown' });
    expect(editor).toHaveAttribute('aria-activedescendant');
  });
});
