import { useState } from 'react';
import { expect, describe, it } from 'vitest';
import { renderWithProvider } from '#test-utils';

import { EditorPopover } from '..';

function TestEditorPopover({ portal }: { portal?: boolean }) {
  const [reference, setReference] = useState<HTMLElement | null>(null);

  return (
    <>
      <div ref={setReference} />
      {reference && (
        <EditorPopover reference={reference} portal={portal}>
          <div>Menu content</div>
        </EditorPopover>
      )}
    </>
  );
}

describe('editor/EditorPopover', () => {
  it('stacks above the sticky editor toolbar when non-portaled', () => {
    const { getByRole } = renderWithProvider(
      <TestEditorPopover portal={false} />
    );

    const dialog = getByRole('dialog');
    expect(dialog).toHaveTextContent('Menu content');
    expect(Number(getComputedStyle(dialog).zIndex)).toBeGreaterThan(2);
  });

  it('sets z-index when portaled', () => {
    const { getByRole } = renderWithProvider(<TestEditorPopover />);

    const dialog = getByRole('dialog');
    expect(Number(getComputedStyle(dialog).zIndex)).toBeGreaterThan(2);
  });
});
