import {
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { act, fireEvent, renderWithProvider } from '#test-utils';

import React from 'react';

import { Item, TagGroup } from '../index';

// TODO: revisit once keystone refurb is done
describe('tag/TagGroup', function () {
  let onRemoveSpy = jest.fn();

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runAllTimers();
    });
    jest.restoreAllMocks();
  });

  it('provides context for Tag component', function () {
    let { getAllByRole } = renderWithProvider(
      <TagGroup aria-label="tag group" onRemove={onRemoveSpy}>
        <Item aria-label="Tag 1">Tag 1</Item>
        <Item aria-label="Tag 2">Tag 2</Item>
        <Item aria-label="Tag 3">Tag 3</Item>
      </TagGroup>
    );

    let tags = getAllByRole('row');
    expect(tags.length).toBe(3);

    fireEvent.keyDown(tags[1], { key: 'Delete' });
    fireEvent.keyUp(tags[1], { key: 'Delete' });
    expect(onRemoveSpy).toHaveBeenCalledTimes(1);
  });

  it('has correct accessibility roles', () => {
    let { getByRole, getAllByRole } = renderWithProvider(
      <TagGroup aria-label="tag group">
        <Item aria-label="Tag 1">Tag 1</Item>
      </TagGroup>
    );

    let tagGroup = getByRole('grid');
    expect(tagGroup).toBeVisible();
    let tags = getAllByRole('row');
    let cells = getAllByRole('gridcell');
    expect(tags).toHaveLength(cells.length);
  });

  it('has correct tab index', () => {
    let { getAllByRole } = renderWithProvider(
      <TagGroup aria-label="tag group">
        <Item aria-label="Tag 1">Tag 1</Item>
      </TagGroup>
    );

    let tags = getAllByRole('row');
    expect(tags[0]).toHaveAttribute('tabIndex', '0');
  });
});
