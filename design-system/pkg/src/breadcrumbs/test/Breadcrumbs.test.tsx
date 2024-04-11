import { beforeEach, expect, describe, it, jest } from '@jest/globals';

import { Breadcrumbs, Item } from '..';
import { firePress, renderWithProvider, within } from '#test-utils';

describe('breadcrumbs/Breadcrumbs', () => {
  beforeEach(() => {
    // avoid issues when measuring the width of the breadcrumbs
    jest
      .spyOn(HTMLElement.prototype, 'offsetWidth', 'get')
      .mockImplementation(function () {
        // @ts-expect-error
        if (this instanceof HTMLUListElement) {
          return 500;
        }

        return 100;
      });
  });

  it('handles defaults', function () {
    let { getByLabelText } = renderWithProvider(
      <Breadcrumbs id="breadcrumbs-id" aria-label="breadcrumbs-test">
        <Item>Folder 1</Item>
      </Breadcrumbs>
    );

    let breadcrumbs = getByLabelText('breadcrumbs-test');
    expect(breadcrumbs).toHaveAttribute('id', 'breadcrumbs-id');
  });

  it('handles multiple items', () => {
    let { getByText } = renderWithProvider(
      <Breadcrumbs>
        <Item>Folder 1</Item>
        <Item>Folder 2</Item>
        <Item>Folder 3</Item>
      </Breadcrumbs>
    );
    let item1 = getByText('Folder 1');
    expect(item1.tabIndex).toBe(0);
    expect(item1).not.toHaveAttribute('aria-current');
    let item2 = getByText('Folder 2');
    expect(item2.tabIndex).toBe(0);
    expect(item2).not.toHaveAttribute('aria-current');
    let item3 = getByText('Folder 3');
    expect(item3.tabIndex).toBe(-1);
    expect(item3).toHaveAttribute('aria-current', 'page');
  });

  it('handles single item and showRoot', () => {
    let { getByText } = renderWithProvider(
      <Breadcrumbs showRoot>
        <Item key="Folder-1">Folder 1</Item>
      </Breadcrumbs>
    );
    let item = getByText('Folder 1');
    expect(item).toBeTruthy();
    expect(item.tabIndex).toBe(-1);
  });

  it('shows four items with no menu', () => {
    let { getByText, getByRole } = renderWithProvider(
      <Breadcrumbs>
        <Item>Folder 1</Item>
        <Item>Folder 2</Item>
        <Item>Folder 3</Item>
        <Item>Folder 4</Item>
      </Breadcrumbs>
    );
    let { children } = getByRole('list');
    expect(within(children[0] as HTMLElement).queryByRole('button')).toBeNull();
    expect(getByText('Folder 1')).toBeTruthy();
    expect(getByText('Folder 2')).toBeTruthy();
    expect(getByText('Folder 3')).toBeTruthy();
    expect(getByText('Folder 4')).toBeTruthy();
  });

  it('shows a maximum of 4 items', () => {
    let { getByText, getByRole } = renderWithProvider(
      <Breadcrumbs>
        <Item>Folder 1</Item>
        <Item>Folder 2</Item>
        <Item>Folder 3</Item>
        <Item>Folder 4</Item>
        <Item>Folder 5</Item>
      </Breadcrumbs>
    );
    let { children } = getByRole('list');
    expect(within(children[0] as HTMLElement).getByRole('button')).toBeTruthy();
    expect(() => getByText('Folder 1')).toThrow();
    expect(() => getByText('Folder 2')).toThrow();
    expect(getByText('Folder 3')).toBeTruthy();
    expect(getByText('Folder 4')).toBeTruthy();
    expect(getByText('Folder 5')).toBeTruthy();
  });

  it('shows a maximum of 4 items with showRoot', () => {
    let { getByText, getByRole } = renderWithProvider(
      <Breadcrumbs showRoot>
        <Item>Folder 1</Item>
        <Item>Folder 2</Item>
        <Item>Folder 3</Item>
        <Item>Folder 4</Item>
        <Item>Folder 5</Item>
      </Breadcrumbs>
    );
    let { children } = getByRole('list');
    expect(getByText('Folder 1')).toBeTruthy();
    expect(within(children[1] as HTMLElement).getByRole('button')).toBeTruthy();
    expect(() => getByText('Folder 2')).toThrow();
    expect(() => getByText('Folder 3')).toThrow();
    expect(getByText('Folder 4')).toBeTruthy();
    expect(getByText('Folder 5')).toBeTruthy();
  });

  it('handles isDisabled', () => {
    let { getByText } = renderWithProvider(
      <Breadcrumbs isDisabled>
        <Item>Folder 1</Item>
        <Item>Folder 2</Item>
      </Breadcrumbs>
    );

    let item1 = getByText('Folder 1');
    expect(item1).toHaveAttribute('aria-disabled', 'true');
    let item2 = getByText('Folder 2');
    expect(item2).toHaveAttribute('aria-disabled', 'true');
  });

  it('supports aria-label', function () {
    let { getByRole } = renderWithProvider(
      <Breadcrumbs aria-label="Test">
        <Item>Folder 1</Item>
      </Breadcrumbs>
    );
    let breadcrumbs = getByRole('navigation');
    expect(breadcrumbs).toHaveAttribute('aria-label', 'Test');
  });

  it('supports aria-labelledby', function () {
    let { getByRole } = renderWithProvider(
      <>
        <span id="test">Test</span>
        <Breadcrumbs aria-labelledby="test">
          <Item>Folder 1</Item>
        </Breadcrumbs>
      </>
    );
    let breadcrumbs = getByRole('navigation');
    expect(breadcrumbs).toHaveAttribute('aria-labelledby', 'test');
  });

  it('supports aria-describedby', function () {
    let { getByRole } = renderWithProvider(
      <>
        <span id="test">Test</span>
        <Breadcrumbs aria-describedby="test">
          <Item>Folder 1</Item>
        </Breadcrumbs>
      </>
    );
    let breadcrumbs = getByRole('navigation');
    expect(breadcrumbs).toHaveAttribute('aria-describedby', 'test');
  });

  it('supports custom props', function () {
    let { getByRole } = renderWithProvider(
      <Breadcrumbs data-testid="test">
        <Item>Folder 1</Item>
      </Breadcrumbs>
    );
    let breadcrumbs = getByRole('navigation');
    expect(breadcrumbs).toHaveAttribute('data-testid', 'test');
  });

  it('should support links', function () {
    let { getByRole, getAllByRole } = renderWithProvider(
      <Breadcrumbs>
        <Item href="https://example.com">Example.com</Item>
        <Item href="https://example.com/foo">Foo</Item>
        <Item href="https://example.com/foo/bar">Bar</Item>
        <Item href="https://example.com/foo/bar/baz">Baz</Item>
        <Item href="https://example.com/foo/bar/baz/qux">Qux</Item>
      </Breadcrumbs>
    );

    let links = getAllByRole('link');
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute('href', 'https://example.com/foo/bar');
    expect(links[1]).toHaveAttribute('href', 'https://example.com/foo/bar/baz');
    expect(links[2]).toHaveAttribute(
      'href',
      'https://example.com/foo/bar/baz/qux'
    );

    let menuButton = getByRole('button');
    firePress(menuButton);

    let menu = getByRole('menu');
    let items = within(menu).getAllByRole('menuitemradio');
    expect(items).toHaveLength(5);
    expect(items[0].tagName).toBe('A');
    expect(items[0]).toHaveAttribute('href', 'https://example.com');
  });
});
