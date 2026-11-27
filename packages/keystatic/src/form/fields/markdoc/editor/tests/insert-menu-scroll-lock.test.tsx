/** @vitest-environment jsdom */
import { KeystarProvider } from '@keystar/ui/core';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Editor as SlateEditor, Transforms } from 'slate';
import { Slate } from 'slate-react';
import { describe, expect, test, vi } from 'vitest';
import ResizeObserver from 'resize-observer-polyfill';

import { config, fields } from '../../../../..';
import { ConfigContext } from '../../../../../app/shell/context';
import { ScrollView } from '../../../../../app/shell/primitives';
import { block } from '../../../../../content-components';
import { component as blockComponent } from '../../../../api';
import { createGetPreviewProps } from '../../../../preview-props';
import { BlocksFieldInput } from '../../../blocks/ui';
import {
  createDocumentEditor,
  DocumentEditorEditable,
} from '../../../document/DocumentEditor';
import { defaultDocumentFeatures } from '../../../document/DocumentEditor/tests/utils';
import { ToolbarStateProvider } from '../../../document/DocumentEditor/toolbar-state';
import { editorOptionsToConfig } from '../../config';
import { createEditorState } from '../editor-state';
import { Editor } from '../index';
import { createEditorSchema } from '../schema';

globalThis.ResizeObserver = ResizeObserver;

if (!document.elementFromPoint) {
  document.elementFromPoint = () => null;
}

const emptyRect: Omit<DOMRect, 'toJSON'> = {
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
  x: 0,
  y: 0,
};

if (!Range.prototype.getClientRects) {
  Range.prototype.getClientRects = () => [] as unknown as DOMRectList;
}
if (!Range.prototype.getBoundingClientRect) {
  Range.prototype.getBoundingClientRect = () => ({
    ...emptyRect,
    toJSON: () => emptyRect,
  });
}

const _config = config({ storage: { kind: 'cloud' } });

function dispatchWheel(target: Element, deltaY: number) {
  const event = new WheelEvent('wheel', {
    bubbles: true,
    cancelable: true,
    deltaY,
  });
  target.dispatchEvent(event);
  return event;
}

function mockScrollable(el: HTMLElement) {
  Object.defineProperty(el, 'clientHeight', {
    configurable: true,
    value: 300,
  });
  Object.defineProperty(el, 'scrollHeight', {
    configurable: true,
    value: 1200,
  });
  el.scrollTop = 180;
}

describe('Component selection menus lock background scroll', () => {
  test('Markdoc / component insert menu locks background ScrollView wheel scroll while keeping editor focus', async () => {
    const schema = createEditorSchema(
      editorOptionsToConfig({}),
      {
        callout: block({
          label: 'Callout',
          schema: {
            title: fields.text({ label: 'Title' }),
          },
        }),
      },
      false
    );
    const initialDoc = schema.schema.nodes.doc.createAndFill()!;

    function Harness() {
      const [state, setState] = useState(() => createEditorState(initialDoc));
      return (
        <ConfigContext.Provider value={_config}>
          <KeystarProvider>
            <div data-testid="scroll-host">
              <ScrollView>
                <Editor value={state} onChange={setState} />
              </ScrollView>
            </div>
          </KeystarProvider>
        </ConfigContext.Provider>
      );
    }

    const user = userEvent.setup();
    render(<Harness />);

    const scrollView = screen
      .getByTestId('scroll-host')
      .querySelector('[data-scrollable="true"]') as HTMLElement;
    expect(scrollView).toBeTruthy();
    mockScrollable(scrollView);

    expect(dispatchWheel(scrollView, 60).defaultPrevented).toBe(false);

    const textbox = screen.getByRole('textbox');
    await user.click(textbox);
    await user.keyboard('/');

    const listbox = await screen.findByRole('listbox', { name: 'Insert menu' });
    expect(listbox).toBeInTheDocument();
    expect(textbox.contains(document.activeElement)).toBe(true);
    expect(document.documentElement.style.overflow).not.toBe('hidden');
    expect(dispatchWheel(scrollView, 60).defaultPrevented).toBe(true);

    await user.keyboard('cal');
    expect(screen.getByRole('option', { name: /Callout/i })).toBeVisible();
    expect(dispatchWheel(scrollView, 60).defaultPrevented).toBe(true);

    await user.keyboard('{Escape}');
    expect(
      screen.queryByRole('listbox', { name: 'Insert menu' })
    ).not.toBeInTheDocument();
    expect(dispatchWheel(scrollView, 60).defaultPrevented).toBe(false);
  }, 15000);

  test('Blocks field Add component menu locks background ScrollView wheel scroll while open', async () => {
    const blocksSchema = fields.blocks(
      {
        callout: {
          label: 'Callout',
          schema: fields.object({ title: fields.text({ label: 'Title' }) }),
        },
        hero: {
          label: 'Hero',
          schema: fields.object({ heading: fields.text({ label: 'Heading' }) }),
        },
      },
      { label: 'Blocks' }
    );

    const onChange = vi.fn();
    const getPreviewProps = createGetPreviewProps(
      blocksSchema,
      onChange,
      () => ({
        kind: 'error',
        message: 'not a child field',
      })
    );
    const previewProps = getPreviewProps([]) as any;

    const user = userEvent.setup();
    render(
      <KeystarProvider>
        <div data-testid="scroll-host">
          <ScrollView>
            <BlocksFieldInput {...previewProps} autoFocus={false} />
          </ScrollView>
        </div>
      </KeystarProvider>
    );

    const scrollView = screen
      .getByTestId('scroll-host')
      .querySelector('[data-scrollable="true"]') as HTMLElement;
    mockScrollable(scrollView);

    expect(dispatchWheel(scrollView, 60).defaultPrevented).toBe(false);

    await user.click(screen.getByRole('button', { name: 'Add' }));
    const menu = await screen.findByRole('menu');
    expect(menu).toBeVisible();
    expect(dispatchWheel(scrollView, 60).defaultPrevented).toBe(true);

    await user.keyboard('{Escape}');
    expect(dispatchWheel(scrollView, 60).defaultPrevented).toBe(false);
  });

  test('DocumentEditor / insert menu locks background ScrollView wheel scroll while open', async () => {
    const componentBlocks = {
      callout: blockComponent({
        label: 'Callout',
        preview: () => null,
        schema: {},
      }),
    };
    const editor = createDocumentEditor(
      defaultDocumentFeatures,
      componentBlocks
    );

    function DocumentHarness() {
      const [value, setValue] = useState([
        { type: 'paragraph', children: [{ text: '' }] },
      ]);
      return (
        <KeystarProvider>
          <div data-testid="scroll-host">
            <ScrollView>
              <Slate
                editor={editor}
                value={value as any}
                onChange={setValue as any}
              >
                <ToolbarStateProvider
                  componentBlocks={componentBlocks}
                  editorDocumentFeatures={defaultDocumentFeatures}
                >
                  <DocumentEditorEditable scrollSelectionIntoView={() => {}} />
                </ToolbarStateProvider>
              </Slate>
            </ScrollView>
          </div>
        </KeystarProvider>
      );
    }

    render(<DocumentHarness />);

    const scrollView = screen
      .getByTestId('scroll-host')
      .querySelector('[data-scrollable="true"]') as HTMLElement;
    mockScrollable(scrollView);

    expect(dispatchWheel(scrollView, 60).defaultPrevented).toBe(false);

    act(() => {
      Transforms.select(editor, { path: [0, 0], offset: 0 });
      editor.insertText('/');
    });

    const listbox = await screen.findByRole('listbox');
    expect(listbox).toBeVisible();
    expect(dispatchWheel(scrollView, 60).defaultPrevented).toBe(true);

    act(() => {
      SlateEditor.removeMark(editor, 'insertMenu');
      Transforms.unsetNodes(editor, 'insertMenu', {
        at: [],
        match: node => 'insertMenu' in node,
      });
      Transforms.delete(editor, {
        at: { path: [0, 0], offset: 0 },
        distance: 1,
      });
    });
    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(dispatchWheel(scrollView, 60).defaultPrevented).toBe(false);
    });
  });
});
