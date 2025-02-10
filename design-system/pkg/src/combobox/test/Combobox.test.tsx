import userEvent from '@testing-library/user-event';
import { forwardRef } from 'react';
import { beforeAll, expect, vi, describe, it } from 'vitest';

import { act, fireEvent, firePress, renderWithProvider } from '#test-utils';

import { Combobox, Item } from '..';

let onSelectionChange = vi.fn();
let onOpenChange = vi.fn();
let onInputChange = vi.fn();
let onFocus = vi.fn();
let onBlur = vi.fn();

let defaultProps = {
  label: 'Test',
  onSelectionChange,
  onOpenChange,
  onInputChange,
  onFocus,
  onBlur,
};

const ExampleCombobox = forwardRef((props = {}, ref: any) => (
  <Combobox ref={ref} {...defaultProps} {...props}>
    <Item key="one">Item one</Item>
    <Item key="two">Item two</Item>
    <Item key="three">Item three</Item>
  </Combobox>
));

function renderCombobox(props = {}) {
  return renderWithProvider(<ExampleCombobox {...props} />);
}

describe('combobox/Combobox', () => {
  beforeAll(function () {
    vi.spyOn(
      window.HTMLElement.prototype,
      'clientWidth',
      'get'
    ).mockImplementation(() => 1000);
    vi.spyOn(
      window.HTMLElement.prototype,
      'clientHeight',
      'get'
    ).mockImplementation(() => 1000);
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    vi.spyOn(window.screen, 'width', 'get').mockImplementation(() => 1024);
    vi.useFakeTimers();
  });

  it('renders correctly', function () {
    let { getByRole, getByText } = renderCombobox();

    let combobox = getByRole('combobox');
    expect(combobox).toHaveAttribute('autoCorrect', 'off');
    expect(combobox).toHaveAttribute('spellCheck', 'false');
    expect(combobox).toHaveAttribute('autoComplete', 'off');

    let button = getByRole('button');
    expect(button).toHaveAttribute('aria-haspopup', 'listbox');

    let label = getByText('Test');
    expect(label).toBeVisible();
  });

  it('propagates the name attribute', function () {
    let { getByRole } = renderCombobox({ name: 'test name' });

    let combobox = getByRole('combobox');
    expect(combobox).toHaveAttribute('name', 'test name');
  });

  it('can be disabled', function () {
    let user = userEvent.setup();
    let { getByRole, queryByRole } = renderCombobox({ isDisabled: true });

    let combobox = getByRole('combobox');
    user.type(combobox, 'One');
    act(() => {
      vi.runAllTimers();
    });

    expect(queryByRole('listbox')).toBeNull();
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(onFocus).not.toHaveBeenCalled();

    act(() => {
      fireEvent.keyDown(combobox, { key: 'ArrowDown', code: 40, charCode: 40 });
      fireEvent.keyUp(combobox, { key: 'ArrowDown', code: 40, charCode: 40 });
      vi.runAllTimers();
    });

    expect(queryByRole('listbox')).toBeNull();
    expect(onOpenChange).not.toHaveBeenCalled();

    let button = getByRole('button');
    act(() => {
      firePress(button);
      vi.runAllTimers();
    });

    expect(queryByRole('listbox')).toBeNull();
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(onInputChange).not.toHaveBeenCalled();
  });

  it('can be readonly', function () {
    let user = userEvent.setup();
    let { getByRole, queryByRole } = renderCombobox({
      isReadOnly: true,
      defaultInputValue: 'default input value',
    });

    let combobox = getByRole('combobox') as HTMLInputElement;
    act(() => {
      combobox.focus();
    });
    user.type(combobox, 'One');

    expect(queryByRole('listbox')).toBeNull();
    expect(combobox.value).toBe('default input value');
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(onFocus).toHaveBeenCalled();

    fireEvent.keyDown(combobox, { key: 'ArrowDown', code: 40, charCode: 40 });
    fireEvent.keyUp(combobox, { key: 'ArrowDown', code: 40, charCode: 40 });
    act(() => {
      vi.runAllTimers();
    });

    expect(queryByRole('listbox')).toBeNull();
    expect(onOpenChange).not.toHaveBeenCalled();

    let button = getByRole('button');
    act(() => {
      firePress(button);
      vi.runAllTimers();
    });

    expect(queryByRole('listbox')).toBeNull();
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(onInputChange).not.toHaveBeenCalled();
  });
});
