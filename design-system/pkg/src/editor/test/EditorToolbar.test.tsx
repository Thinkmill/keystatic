import { expect, describe, it } from '@jest/globals';
import { renderWithProvider } from '#test-utils';

import {
  EditorToolbar,
  EditorToolbarGroup,
  EditorToolbarItem,
  EditorToolbarButton,
  EditorToolbarSeparator,
} from '..';

describe('editor/EditorToolbar', () => {
  it('renders', () => {
    const { getByRole, getAllByRole } = renderWithProvider(
      <EditorToolbar aria-label="Formatting options">
        <EditorToolbarGroup
          disabledKeys={['strikethrough']}
          selectionMode="multiple"
          aria-label="Text formatting"
          value={['bold', 'italic']}
          onChange={() => {}}
        >
          <EditorToolbarItem value="bold">bold</EditorToolbarItem>
          <EditorToolbarItem value="italic">italic</EditorToolbarItem>
          <EditorToolbarItem value="strikethrough">
            strikethrough
          </EditorToolbarItem>
        </EditorToolbarGroup>

        <EditorToolbarSeparator />

        <EditorToolbarGroup
          selectionMode="single"
          aria-label="Lists"
          value="numbered"
          onChange={() => {}}
        >
          <EditorToolbarItem value="bulleted" aria-label="bulleted list">
            •
          </EditorToolbarItem>
          <EditorToolbarItem value="numbered" aria-label="numbered list">
            1.
          </EditorToolbarItem>
        </EditorToolbarGroup>

        <EditorToolbarButton>link</EditorToolbarButton>
      </EditorToolbar>
    );

    expect(getByRole('toolbar')).toHaveAttribute(
      'aria-label',
      'Formatting options'
    );
    expect(getAllByRole('radiogroup')).toHaveLength(1);

    let bold = getByRole('button', { name: 'bold' });
    let italic = getByRole('button', { name: 'italic' });
    let strikethrough = getByRole('button', { name: 'strikethrough' });
    expect(bold).toHaveAttribute('aria-pressed', 'true');
    expect(italic).toHaveAttribute('aria-pressed', 'true');
    expect(strikethrough).toHaveAttribute('aria-pressed', 'false');
    expect(strikethrough).toBeDisabled();

    let radios = getAllByRole('radio');
    expect(radios).toHaveLength(2);
    expect(radios[0]).not.toBeChecked();
    expect(radios[1]).toBeChecked();
  });
});
