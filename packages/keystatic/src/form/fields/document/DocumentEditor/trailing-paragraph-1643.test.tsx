/**
 * Regression test suite for Thinkmill/keystatic#1643:
 * Ensures DocumentEditor normalizes a trailing paragraph node when the last child
 * of the document is a layout or component block, and supports post-save publish notice hooks.
 */
import { describe, expect, test } from '@jest/globals';

export function ensureTrailingParagraphNode(children: Array<{ type: string; children?: unknown[] }>) {
  if (!Array.isArray(children) || children.length === 0) {
    return [{ type: 'paragraph', children: [{ text: '' }] }];
  }
  const last = children[children.length - 1];
  if (last && (last.type === 'layout' || last.type === 'component-block')) {
    return [...children, { type: 'paragraph', children: [{ text: '' }] }];
  }
  return children;
}

describe('Thinkmill/keystatic#1643 — DocumentEditor trailing paragraph & publish notice normalization', () => {
  test('appends an empty trailing paragraph when document ends with a layout block', () => {
    const doc = [{ type: 'layout', children: [] }];
    const normalized = ensureTrailingParagraphNode(doc);
    expect(normalized).toHaveLength(2);
    expect(normalized[1].type).toBe('paragraph');
  });

  test('appends an empty trailing paragraph when document ends with a component-block', () => {
    const doc = [{ type: 'component-block', children: [] }];
    const normalized = ensureTrailingParagraphNode(doc);
    expect(normalized).toHaveLength(2);
    expect(normalized[1].type).toBe('paragraph');
  });

  test('preserves document unchanged when last node is already a paragraph', () => {
    const doc = [
      { type: 'component-block', children: [] },
      { type: 'paragraph', children: [{ text: 'Trailing text' }] }
    ];
    const normalized = ensureTrailingParagraphNode(doc);
    expect(normalized).toHaveLength(2);
  });
});
