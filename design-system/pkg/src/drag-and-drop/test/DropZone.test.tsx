import userEvent from '@testing-library/user-event';
import React from 'react';
import {
  afterEach,
  beforeAll,
  beforeEach,
  expect,
  jest,
  describe,
  it,
} from '@jest/globals';

import {
  ClipboardEvent,
  DataTransfer,
  DataTransferItem,
  DragEvent,
  act,
  fireEvent,
  pointerMap,
  render,
  renderWithProvider,
} from '#test-utils';

import { Button, buttonClassList } from '@keystar/ui/button';
import { TextLink } from '@keystar/ui/link';
import { Text } from '@keystar/ui/typography';

import { DropZone, FileTrigger, dropZoneClassList } from '../index';
import { Draggable } from './examples';
import { DropEvent } from '@react-types/shared';

describe('drag-and-drop/DropZone', () => {
  let user: ReturnType<typeof userEvent.setup>;
  beforeAll(() => {
    user = userEvent.setup({ delay: null, pointerMap });
  });

  it('should render a dropzone', () => {
    let { getByTestId } = render(
      <DropZone data-testid="foo">
        <Text slot="label">Test</Text>
      </DropZone>
    );
    let dropzone = getByTestId('foo');
    expect(dropzone).toHaveClass(dropZoneClassList.element('root'));
  });

  it('should render a dropzone with custom class', () => {
    let { getByTestId } = render(
      <DropZone data-testid="foo" UNSAFE_className="test">
        <Text slot="label">Test</Text>
      </DropZone>
    );
    let dropzone = getByTestId('foo');
    expect(dropzone).toHaveClass('test');
  });

  it('should support DOM props', () => {
    let { getByTestId } = render(
      <DropZone data-testid="foo" data-foo="bar">
        <Text slot="label">Test</Text>
      </DropZone>
    );
    let dropzone = getByTestId('foo');
    expect(dropzone).toHaveAttribute('data-foo', 'bar');
  });

  it('should support focus ring', async () => {
    let { getByTestId, getByRole } = render(
      <DropZone data-testid="foo">
        <Text slot="label">Test</Text>
      </DropZone>
    );
    let dropzone = getByTestId('foo');
    let button = getByRole('button');

    expect(dropzone).not.toHaveAttribute('data-focus-visible');

    await user.tab();
    expect(document.activeElement).toBe(button);
    expect(dropzone).toHaveAttribute('data-focus-visible', 'true');

    await user.tab();
    expect(dropzone).not.toHaveAttribute('data-focus-visible');
  });

  it('should apply correct default aria-labelledby', () => {
    let { getByRole, getByText } = render(
      <DropZone className="test">
        <Text slot="label">Test</Text>
      </DropZone>
    );
    let text = getByText('Test');
    let div = getByText('DropZone');
    let button = getByRole('button');
    expect(button).toHaveAttribute('aria-labelledby', `${div.id} ${text.id}`);
  });

  it('should allow custom aria-label', () => {
    let { getAllByRole, getByText } = render(
      <DropZone data-testid="foo" aria-label="test aria-label">
        <FileTrigger>
          <TextLink>Upload</TextLink>
        </FileTrigger>
      </DropZone>
    );
    let button = getAllByRole('button')[0];
    let div = getByText('test aria-label');
    expect(button).toHaveAttribute('aria-labelledby', `${div.id}`);
  });

  it('should render FileTrigger as a child', () => {
    let { getByTestId } = renderWithProvider(
      <DropZone>
        <FileTrigger>
          <Button data-testid="foo">Upload</Button>
        </FileTrigger>
      </DropZone>
    );

    let button = getByTestId('foo');
    expect(button).toHaveClass(buttonClassList.element('root'));
  });

  it('should attach a ref to the dropzone if provided as a prop', () => {
    let ref = React.createRef<HTMLDivElement>();
    let { getByTestId } = renderWithProvider(
      <DropZone data-testid="foo" ref={ref}>
        <FileTrigger>
          <Button>Upload</Button>
        </FileTrigger>
      </DropZone>
    );

    let dropzone = getByTestId('foo');
    expect(ref.current).toEqual(dropzone);
  });

  describe('drag and drop', function () {
    beforeEach(() => {
      jest
        .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
        // @ts-ignore
        .mockImplementation(() => ({
          left: 0,
          top: 0,
          x: 0,
          y: 0,
          width: 100,
          height: 50,
        }));

      jest.useFakeTimers();
    });

    afterEach(() => {
      act(() => jest.runAllTimers());
    });

    let onDragStart = jest.fn();
    let onDragMove = jest.fn();
    let onDragEnd = jest.fn();
    let onDropEnter = jest.fn();
    let onDropMove = jest.fn();
    let onDrop = jest.fn<(event: DropEvent) => void>();

    describe('via mouse', function () {
      it('should support data attribute drop-target', async () => {
        let tree = render(
          <>
            <Draggable
              onDragStart={onDragStart}
              onDragMove={onDragMove}
              onDragEnd={onDragEnd}
            />
            <DropZone
              data-testid="foo"
              onDropEnter={onDropEnter}
              onDrop={onDrop}
              onDropMove={onDropMove}
            >
              <Text slot="label">Test</Text>
            </DropZone>
          </>
        );
        let dropzone = tree.getByTestId('foo');
        let draggable = tree.getByText('Drag me');
        expect(draggable).toHaveAttribute('draggable', 'true');
        expect(draggable).toHaveAttribute('data-dragging', 'false');
        expect(dropzone).not.toHaveAttribute('data-drop-target');

        let dataTransfer = new DataTransfer();
        fireEvent(
          draggable,
          new DragEvent('dragstart', { dataTransfer, clientX: 0, clientY: 0 })
        );
        // @ts-ignore
        expect(dataTransfer.dropEffect).toBe('none');
        // @ts-ignore
        expect(dataTransfer.effectAllowed).toBe('all');
        // @ts-ignore
        expect([...dataTransfer.items]).toEqual([
          new DataTransferItem('text/plain', 'hello world'),
        ]);
        // @ts-ignore
        expect(dataTransfer._dragImage).toBeUndefined();

        act(() => jest.runAllTimers());
        expect(draggable).toHaveAttribute('data-dragging', 'true');

        expect(onDragStart).toHaveBeenCalledTimes(1);
        expect(onDragStart).toHaveBeenCalledWith({
          type: 'dragstart',
          x: 0,
          y: 0,
        });

        fireEvent(
          draggable,
          new DragEvent('drag', { dataTransfer, clientX: 1, clientY: 1 })
        );
        expect(onDragMove).toHaveBeenCalledTimes(1);
        expect(onDragMove).toHaveBeenCalledWith({
          type: 'dragmove',
          x: 1,
          y: 1,
        });

        fireEvent(
          dropzone,
          new DragEvent('dragenter', { dataTransfer, clientX: 1, clientY: 1 })
        );
        expect(onDropEnter).toHaveBeenCalledTimes(1);
        expect(onDropEnter).toHaveBeenCalledWith({
          type: 'dropenter',
          x: 1,
          y: 1,
        });

        // @ts-ignore
        expect(dataTransfer.dropEffect).toBe('move');
        expect(dropzone).toHaveAttribute('data-drop-target', 'true');

        fireEvent(
          dropzone,
          new DragEvent('dragover', { dataTransfer, clientX: 2, clientY: 2 })
        );
        expect(onDropMove).toHaveBeenCalledTimes(1);
        expect(onDropMove).toHaveBeenCalledWith({
          type: 'dropmove',
          x: 2,
          y: 2,
        });

        // @ts-ignore
        expect(dataTransfer.dropEffect).toBe('move');
        expect(dropzone).toHaveAttribute('data-drop-target', 'true');

        fireEvent(
          dropzone,
          new DragEvent('drop', { dataTransfer, clientX: 2, clientY: 2 })
        );
        act(() => jest.runAllTimers());
        expect(onDrop).toHaveBeenCalledTimes(1);
        expect(onDrop).toHaveBeenCalledWith({
          type: 'drop',
          x: 2,
          y: 2,
          dropOperation: 'move',
          items: [
            {
              kind: 'text',
              types: new Set(['text/plain']),
              getText: expect.any(Function),
            },
          ],
        });
        const item = onDrop.mock.calls[0][0].items[0];

        expect(item.kind === 'text' && (await item.getText('text/plain'))).toBe(
          'hello world'
        );

        fireEvent(
          draggable,
          new DragEvent('dragend', { dataTransfer, clientX: 2, clientY: 2 })
        );
        expect(onDragEnd).toHaveBeenCalledTimes(1);
        expect(onDragEnd).toHaveBeenCalledWith({
          type: 'dragend',
          x: 2,
          y: 2,
          dropOperation: 'move',
        });

        expect(dropzone).not.toHaveAttribute('data-drop-target');
      });
    });

    describe('via keyboard', function () {
      afterEach(() => {
        fireEvent.keyDown(document.body, { key: 'Escape' });
        fireEvent.keyUp(document.body, { key: 'Escape' });
      });

      it('should allow drag and drop', async function () {
        let tree = render(
          <>
            <Draggable
              onDragStart={onDragStart}
              onDragMove={onDragMove}
              onDragEnd={onDragEnd}
            />
            <DropZone
              data-testid="foo"
              onDropEnter={onDropEnter}
              onDrop={onDrop}
              onDropMove={onDropMove}
            >
              <Text slot="label">Test</Text>
            </DropZone>
          </>
        );

        let dropzone = tree.getByTestId('foo');
        let button = tree.getAllByRole('button')[1];
        let draggable = tree.getByText('Drag me');

        expect(draggable).toHaveAttribute('draggable', 'true');

        await user.tab();
        fireEvent.keyDown(draggable, { key: 'Enter' });
        fireEvent.keyUp(draggable, { key: 'Enter' });

        expect(onDragStart).toHaveBeenCalledTimes(1);
        expect(onDragStart).toHaveBeenCalledWith({
          type: 'dragstart',
          x: 50,
          y: 25,
        });

        act(() => jest.runAllTimers());
        expect(document.activeElement).toBe(button);
        fireEvent.keyDown(dropzone, { key: 'Enter' });
        fireEvent.keyUp(dropzone, { key: 'Enter' });

        expect(onDrop).toHaveBeenCalledTimes(1);
        const item = onDrop.mock.calls[0][0].items[0];
        expect(item.kind === 'text' && (await item.getText('text/plain'))).toBe(
          'hello world'
        );

        expect(onDragEnd).toHaveBeenCalledTimes(1);
        expect(onDragEnd).toHaveBeenCalledWith({
          type: 'dragend',
          x: 50,
          y: 25,
          dropOperation: 'move',
        });

        expect(dropzone).not.toHaveAttribute('data-drop-target');
      });
    });
  });

  describe('useClipboard', () => {
    it('should be able to paste items into the dropzone', async () => {
      let onDrop = jest.fn<(event: DropEvent) => void>();

      let tree = render(
        <>
          <DropZone onDrop={onDrop}>
            <Text slot="label">Test</Text>
          </DropZone>
        </>
      );
      let button = tree.getByRole('button');

      let clipboardData = new DataTransfer();
      await user.tab();
      expect(document.activeElement).toBe(button);

      // @ts-ignore
      clipboardData.items.add('hello world', 'text/plain');

      let allowDefaultPaste = fireEvent(
        button,
        new ClipboardEvent('beforepaste', { clipboardData })
      );
      expect(allowDefaultPaste).toBe(false);

      fireEvent(button, new ClipboardEvent('paste', { clipboardData }));

      expect(onDrop).toHaveBeenCalledTimes(1);
      expect(onDrop).toHaveBeenCalledWith({
        type: 'drop',
        x: 0,
        y: 0,
        dropOperation: 'copy',
        items: expect.any(Array),
      });

      const item = onDrop.mock.calls[0][0].items[0];
      expect(item.kind === 'text' && (await item.getText('text/plain'))).toBe(
        'hello world'
      );
    });
  });
});
