import '@testing-library/jest-dom';
import { renderWithProvider } from '@voussoir/test-utils';

import {
  EditorToolbar,
  EditorToolbarGroup,
  EditorToolbarItem,
  EditorToolbarButton,
} from '../src';

describe('editor/EditorToolbar', () => {
  it('renders', () => {
    const { getByRole, getAllByRole } = renderWithProvider(
      <EditorToolbar aria-label="Formatting options">
        <EditorToolbarGroup
          selectionMode="multiple"
          aria-label="Text formatting"
        >
          <EditorToolbarItem value="bold">bold</EditorToolbarItem>
          <EditorToolbarItem value="italic">italic</EditorToolbarItem>
          <EditorToolbarItem value="strikethrough" isDisabled>
            strikethrough
          </EditorToolbarItem>
        </EditorToolbarGroup>

        <EditorToolbarButton>link</EditorToolbarButton>
      </EditorToolbar>
    );

    expect(getByRole('toolbar')).toBeTruthy();
    expect(getAllByRole('button')).toHaveLength(4);
  });
});
