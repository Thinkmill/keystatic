import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  expect,
  jest,
  describe,
  it,
} from '@jest/globals';
import userEvent from '@testing-library/user-event';

import { globeIcon } from '@keystar/ui/icon/icons/globeIcon';
import { Icon } from '@keystar/ui/icon';
import { Text } from '@keystar/ui/typography';
import {
  act,
  fireEvent,
  firePress,
  KEYS,
  renderWithProvider,
  within,
} from '#test-utils';

import { Item, Picker, Section } from '..';
import { FormEvent } from 'react';

// NOTE: skipped tests due to `userEvent.tab()` not working as expected
describe('picker/Picker', () => {
  let offsetWidth: jest.SpiedGetter<number>,
    offsetHeight: jest.SpiedGetter<number>;
  let onSelectionChange = jest.fn();

  beforeAll(function () {
    offsetWidth = jest
      .spyOn(window.HTMLElement.prototype, 'clientWidth', 'get')
      .mockImplementation(() => 1000);
    offsetHeight = jest
      .spyOn(window.HTMLElement.prototype, 'clientHeight', 'get')
      .mockImplementation(() => 1000);
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    jest.spyOn(window.screen, 'width', 'get').mockImplementation(() => 1024);
    jest.useFakeTimers();
  });

  afterAll(function () {
    offsetWidth.mockReset();
    offsetHeight.mockReset();
    jest.useRealTimers();
  });

  afterEach(() => {
    act(() => jest.runAllTimers());
  });

  it('renders correctly', function () {
    let { getAllByText, getByText, getByRole } = renderWithProvider(
      <Picker
        label="Test"
        data-testid="test"
        onSelectionChange={onSelectionChange}
      >
        <Item>One</Item>
        <Item>Two</Item>
        <Item>Three</Item>
      </Picker>
    );

    let select = getByRole('textbox', { hidden: true });
    expect(select).not.toBeDisabled();

    let picker = getByRole('button');
    expect(picker).toHaveAttribute('aria-haspopup', 'listbox');
    expect(picker).toHaveAttribute('data-testid', 'test');

    let label = getAllByText('Test')[0];
    let value = getByText('Select an option…');
    expect(label).toBeVisible();
    expect(value).toBeVisible();
  });

  describe('opening', function () {
    it('can be opened on mouse down', function () {
      let onOpenChange = jest.fn();
      let { getByRole, queryByRole } = renderWithProvider(
        <Picker label="Test" onOpenChange={onOpenChange}>
          <Item>One</Item>
          <Item>Two</Item>
          <Item>Three</Item>
        </Picker>
      );

      expect(queryByRole('listbox')).toBeNull();

      let picker = getByRole('button');
      // make sure to run through mousedown AND mouseup, like would really happen, otherwise a mouseup listener
      // sits around until the component is unmounted
      firePress(picker);
      act(() => jest.runAllTimers());

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(picker).toHaveAttribute('aria-expanded', 'true');
      expect(picker).toHaveAttribute('aria-controls', listbox.id);

      let items = within(listbox).getAllByRole('option');
      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent('One');
      expect(items[1]).toHaveTextContent('Two');
      expect(items[2]).toHaveTextContent('Three');

      expect(document.activeElement).toBe(listbox);
    });

    it('can be opened on touch up', function () {
      let onOpenChange = jest.fn();
      let { getByRole, queryByRole } = renderWithProvider(
        <Picker label="Test" onOpenChange={onOpenChange}>
          <Item>One</Item>
          <Item>Two</Item>
          <Item>Three</Item>
        </Picker>
      );

      expect(queryByRole('listbox')).toBeNull();

      let picker = getByRole('button');
      fireEvent.touchStart(picker, { targetTouches: [{ identifier: 1 }] });
      act(() => jest.runAllTimers());

      expect(queryByRole('listbox')).toBeNull();

      fireEvent.touchEnd(picker, {
        changedTouches: [{ identifier: 1, clientX: 0, clientY: 0 }],
      });
      act(() => jest.runAllTimers());

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(picker).toHaveAttribute('aria-expanded', 'true');
      expect(picker).toHaveAttribute('aria-controls', listbox.id);

      let items = within(listbox).getAllByRole('option');
      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent('One');
      expect(items[1]).toHaveTextContent('Two');
      expect(items[2]).toHaveTextContent('Three');

      expect(document.activeElement).toBe(listbox);
    });

    it('can be opened on Space key down', function () {
      let onOpenChange = jest.fn();
      let { getByRole, queryByRole } = renderWithProvider(
        <Picker label="Test" onOpenChange={onOpenChange}>
          <Item>One</Item>
          <Item>Two</Item>
          <Item>Three</Item>
        </Picker>
      );

      expect(queryByRole('listbox')).toBeNull();

      let picker = getByRole('button');
      fireEvent.keyDown(picker, KEYS.Space);
      fireEvent.keyUp(picker, KEYS.Space);
      act(() => jest.runAllTimers());

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(picker).toHaveAttribute('aria-expanded', 'true');
      expect(picker).toHaveAttribute('aria-controls', listbox.id);

      let items = within(listbox).getAllByRole('option');
      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent('One');
      expect(items[1]).toHaveTextContent('Two');
      expect(items[2]).toHaveTextContent('Three');

      expect(document.activeElement).toBe(items[0]);
    });

    it('can be opened on Enter key down', function () {
      let onOpenChange = jest.fn();
      let { getByRole, queryByRole } = renderWithProvider(
        <Picker label="Test" onOpenChange={onOpenChange}>
          <Item>One</Item>
          <Item>Two</Item>
          <Item>Three</Item>
        </Picker>
      );

      expect(queryByRole('listbox')).toBeNull();

      let picker = getByRole('button');
      fireEvent.keyDown(picker, KEYS.Enter);
      fireEvent.keyUp(picker, KEYS.Enter);
      act(() => jest.runAllTimers());

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(picker).toHaveAttribute('aria-expanded', 'true');
      expect(picker).toHaveAttribute('aria-controls', listbox.id);

      let items = within(listbox).getAllByRole('option');
      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent('One');
      expect(items[1]).toHaveTextContent('Two');
      expect(items[2]).toHaveTextContent('Three');

      expect(document.activeElement).toBe(items[0]);
    });

    it('can be opened on ArrowDown key down and auto focuses the first item', function () {
      let onOpenChange = jest.fn();
      let { getByRole, queryByRole } = renderWithProvider(
        <Picker label="Test" onOpenChange={onOpenChange}>
          <Item>One</Item>
          <Item>Two</Item>
          <Item>Three</Item>
        </Picker>
      );

      expect(queryByRole('listbox')).toBeNull();

      let picker = getByRole('button');
      fireEvent.keyDown(picker, KEYS.ArrowDown);
      fireEvent.keyUp(picker, KEYS.ArrowDown);
      act(() => jest.runAllTimers());

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(picker).toHaveAttribute('aria-expanded', 'true');
      expect(picker).toHaveAttribute('aria-controls', listbox.id);

      let items = within(listbox).getAllByRole('option');
      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent('One');
      expect(items[1]).toHaveTextContent('Two');
      expect(items[2]).toHaveTextContent('Three');

      expect(document.activeElement).toBe(items[0]);
    });

    it('can be opened on ArrowUp key down and auto focuses the last item', function () {
      let onOpenChange = jest.fn();
      let { getByRole, queryByRole } = renderWithProvider(
        <Picker label="Test" onOpenChange={onOpenChange}>
          <Item>One</Item>
          <Item>Two</Item>
          <Item>Three</Item>
        </Picker>
      );

      expect(queryByRole('listbox')).toBeNull();

      let picker = getByRole('button');
      fireEvent.keyDown(picker, KEYS.ArrowUp);
      fireEvent.keyUp(picker, KEYS.ArrowUp);
      act(() => jest.runAllTimers());

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(picker).toHaveAttribute('aria-expanded', 'true');
      expect(picker).toHaveAttribute('aria-controls', listbox.id);

      let items = within(listbox).getAllByRole('option');
      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent('One');
      expect(items[1]).toHaveTextContent('Two');
      expect(items[2]).toHaveTextContent('Three');

      expect(document.activeElement).toBe(items[2]);
    });

    it('supports controlled open state', function () {
      let onOpenChange = jest.fn();
      let { getByRole, getByLabelText } = renderWithProvider(
        <Picker label="Test" isOpen onOpenChange={onOpenChange}>
          <Item>One</Item>
          <Item>Two</Item>
          <Item>Three</Item>
        </Picker>
      );

      act(() => jest.runAllTimers());

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      expect(onOpenChange).not.toHaveBeenCalled();

      let picker = getByLabelText('Select an option…');
      expect(picker).toHaveAttribute('aria-expanded', 'true');
      expect(picker).toHaveAttribute('aria-controls', listbox.id);

      let items = within(listbox).getAllByRole('option');
      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent('One');
      expect(items[1]).toHaveTextContent('Two');
      expect(items[2]).toHaveTextContent('Three');

      expect(document.activeElement).toBe(listbox);
    });

    it('supports default open state', function () {
      let onOpenChange = jest.fn();
      let { getByRole, getByLabelText } = renderWithProvider(
        <Picker label="Test" defaultOpen onOpenChange={onOpenChange}>
          <Item>One</Item>
          <Item>Two</Item>
          <Item>Three</Item>
        </Picker>
      );

      act(() => jest.runAllTimers());

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      expect(onOpenChange).not.toHaveBeenCalled();

      let picker = getByLabelText('Select an option…');
      expect(picker).toHaveAttribute('aria-expanded', 'true');
      expect(picker).toHaveAttribute('aria-controls', listbox.id);

      let items = within(listbox).getAllByRole('option');
      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent('One');
      expect(items[1]).toHaveTextContent('Two');
      expect(items[2]).toHaveTextContent('Three');

      expect(document.activeElement).toBe(listbox);
    });
  });

  describe('closing', function () {
    it('can be closed by clicking on the button', function () {
      let onOpenChange = jest.fn();
      let { getByRole, queryByRole } = renderWithProvider(
        <Picker label="Test" onOpenChange={onOpenChange}>
          <Item>One</Item>
          <Item>Two</Item>
          <Item>Three</Item>
        </Picker>
      );

      expect(queryByRole('listbox')).toBeNull();

      let picker = getByRole('button');
      firePress(picker);
      act(() => jest.runAllTimers());

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(picker).toHaveAttribute('aria-expanded', 'true');
      expect(picker).toHaveAttribute('aria-controls', listbox.id);

      firePress(picker);
      act(() => jest.runAllTimers());

      expect(listbox).not.toBeInTheDocument();
      expect(picker).toHaveAttribute('aria-expanded', 'false');
      expect(picker).not.toHaveAttribute('aria-controls');
      expect(onOpenChange).toHaveBeenCalledTimes(2);
      expect(onOpenChange).toHaveBeenCalledWith(false);

      // run restore focus rAF
      act(() => jest.runAllTimers());
      expect(document.activeElement).toBe(picker);
    });

    it('can be closed by clicking outside', function () {
      let onOpenChange = jest.fn();
      let { getByRole, queryByRole } = renderWithProvider(
        <Picker label="Test" onOpenChange={onOpenChange}>
          <Item>One</Item>
          <Item>Two</Item>
          <Item>Three</Item>
        </Picker>
      );

      expect(queryByRole('listbox')).toBeNull();

      let picker = getByRole('button');
      firePress(picker);
      act(() => jest.runAllTimers());

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(picker).toHaveAttribute('aria-expanded', 'true');
      expect(picker).toHaveAttribute('aria-controls', listbox.id);

      firePress(document.body);
      act(() => jest.runAllTimers());

      expect(listbox).not.toBeInTheDocument();
      expect(picker).toHaveAttribute('aria-expanded', 'false');
      expect(picker).not.toHaveAttribute('aria-controls');
      expect(onOpenChange).toHaveBeenCalledTimes(2);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('can be closed by pressing the Escape key', function () {
      let onOpenChange = jest.fn();
      let { getByRole, queryByRole } = renderWithProvider(
        <Picker label="Test" onOpenChange={onOpenChange}>
          <Item>One</Item>
          <Item>Two</Item>
          <Item>Three</Item>
        </Picker>
      );

      expect(queryByRole('listbox')).toBeNull();

      let picker = getByRole('button');
      firePress(picker);
      act(() => jest.runAllTimers());

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(picker).toHaveAttribute('aria-expanded', 'true');
      expect(picker).toHaveAttribute('aria-controls', listbox.id);

      fireEvent.keyDown(listbox, KEYS.Escape);
      act(() => jest.runAllTimers());

      expect(listbox).not.toBeInTheDocument();
      expect(picker).toHaveAttribute('aria-expanded', 'false');
      expect(picker).not.toHaveAttribute('aria-controls');
      expect(onOpenChange).toHaveBeenCalledTimes(2);
      expect(onOpenChange).toHaveBeenCalledWith(false);

      // run restore focus rAF
      act(() => jest.runAllTimers());
      expect(document.activeElement).toBe(picker);
    });

    it('closes on blur', function () {
      let onOpenChange = jest.fn();
      let { getByRole, queryByRole } = renderWithProvider(
        <Picker label="Test" onOpenChange={onOpenChange}>
          <Item>One</Item>
          <Item>Two</Item>
          <Item>Three</Item>
        </Picker>
      );

      expect(queryByRole('listbox')).toBeNull();

      let picker = getByRole('button');
      firePress(picker);
      act(() => jest.runAllTimers());

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(picker).toHaveAttribute('aria-expanded', 'true');
      expect(picker).toHaveAttribute('aria-controls', listbox.id);

      act(() => {
        (document.activeElement as HTMLElement).blur();
      });
      act(() => jest.runAllTimers());
      act(() => jest.runAllTimers());

      expect(listbox).not.toBeInTheDocument();
      expect(picker).toHaveAttribute('aria-expanded', 'false');
      expect(picker).not.toHaveAttribute('aria-controls');
      expect(onOpenChange).toHaveBeenCalledTimes(2);
      expect(onOpenChange).toHaveBeenCalledWith(false);

      expect(document.activeElement).toBe(picker);
    });

    it('tabs to the next element after the trigger and closes the menu', function () {
      let onOpenChange = jest.fn();
      let { getByRole, getByTestId } = renderWithProvider(
        <>
          <input data-testid="before-input" />
          <Picker label="Test" onOpenChange={onOpenChange}>
            <Item>One</Item>
            <Item>Two</Item>
            <Item>Three</Item>
          </Picker>
          <input data-testid="after-input" />
        </>
      );

      let picker = getByRole('button');
      firePress(picker);
      act(() => jest.runAllTimers());

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(picker).toHaveAttribute('aria-expanded', 'true');
      expect(picker).toHaveAttribute('aria-controls', listbox.id);

      fireEvent.keyDown(document.activeElement as Element, { key: 'Tab' });
      act(() => jest.runAllTimers());

      expect(listbox).not.toBeInTheDocument();
      expect(picker).toHaveAttribute('aria-expanded', 'false');
      expect(picker).not.toHaveAttribute('aria-controls');
      expect(onOpenChange).toHaveBeenCalledTimes(2);
      expect(onOpenChange).toHaveBeenCalledWith(false);

      expect(document.activeElement).toBe(getByTestId('after-input'));
    });

    it('shift tabs to the previous element before the trigger and closes the menu', function () {
      let onOpenChange = jest.fn();
      let { getByRole, getByTestId } = renderWithProvider(
        <>
          <input data-testid="before-input" />
          <Picker label="Test" onOpenChange={onOpenChange}>
            <Item>One</Item>
            <Item>Two</Item>
            <Item>Three</Item>
          </Picker>
          <input data-testid="after-input" />
        </>
      );

      let picker = getByRole('button');
      firePress(picker);
      act(() => jest.runAllTimers());

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(picker).toHaveAttribute('aria-expanded', 'true');
      expect(picker).toHaveAttribute('aria-controls', listbox.id);

      fireEvent.keyDown(document.activeElement as Element, {
        key: 'Tab',
        shiftKey: true,
      });
      fireEvent.keyUp(document.activeElement as Element, {
        key: 'Tab',
        shiftKey: true,
      });
      act(() => jest.runAllTimers());

      expect(listbox).not.toBeInTheDocument();
      expect(picker).toHaveAttribute('aria-expanded', 'false');
      expect(picker).not.toHaveAttribute('aria-controls');
      expect(onOpenChange).toHaveBeenCalledTimes(2);
      expect(onOpenChange).toHaveBeenCalledWith(false);

      expect(document.activeElement).toBe(getByTestId('before-input'));
    });

    it('should have a hidden dismiss button for screen readers', async function () {
      let onOpenChange = jest.fn();
      let { getByRole, getAllByLabelText, getAllByRole } = renderWithProvider(
        <Picker
          label="Test"
          onSelectionChange={onSelectionChange}
          onOpenChange={onOpenChange}
        >
          <Item>One</Item>
          <Item>Two</Item>
          <Item>Three</Item>
        </Picker>
      );

      let picker = getByRole('button');
      firePress(picker);
      act(() => jest.runAllTimers());

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(picker).toHaveAttribute('aria-expanded', 'true');
      expect(picker).toHaveAttribute('aria-controls', listbox.id);

      expect(getAllByRole('button').length).toBe(2);
      let dismissButtons = getAllByLabelText('Dismiss');
      expect(dismissButtons.length).toBe(2);
      expect(dismissButtons[0]).toHaveAttribute('aria-label', 'Dismiss');
      expect(dismissButtons[1]).toHaveAttribute('aria-label', 'Dismiss');

      firePress(dismissButtons[0]);
      expect(onOpenChange).toHaveBeenCalledTimes(2);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      act(() => jest.runAllTimers());

      expect(listbox).not.toBeInTheDocument();
      expect(picker).toHaveAttribute('aria-expanded', 'false');
      expect(picker).not.toHaveAttribute('aria-controls');
      expect(onOpenChange).toHaveBeenCalledTimes(2);
      expect(onOpenChange).toHaveBeenCalledWith(false);

      // run restore focus rAF
      act(() => jest.runAllTimers());
      expect(document.activeElement).toBe(picker);
    });

    it('does not close in controlled open state', function () {
      let onOpenChange = jest.fn();
      let { getByRole, getByLabelText } = renderWithProvider(
        <Picker label="Test" isOpen onOpenChange={onOpenChange}>
          <Item>One</Item>
          <Item>Two</Item>
          <Item>Three</Item>
        </Picker>
      );

      act(() => jest.runAllTimers());

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      expect(onOpenChange).not.toHaveBeenCalled();

      let picker = getByLabelText('Select an option…');
      expect(picker).toHaveAttribute('aria-expanded', 'true');
      expect(picker).toHaveAttribute('aria-controls', listbox.id);

      fireEvent.keyDown(listbox, KEYS.Escape);
      fireEvent.keyUp(listbox, KEYS.Escape);
      act(() => jest.runAllTimers());

      expect(listbox).toBeVisible();
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('closes in default open state', function () {
      let onOpenChange = jest.fn();
      let { getByRole, getByLabelText } = renderWithProvider(
        <Picker label="Test" defaultOpen onOpenChange={onOpenChange}>
          <Item>One</Item>
          <Item>Two</Item>
          <Item>Three</Item>
        </Picker>
      );

      act(() => jest.runAllTimers());

      expect(getByRole('listbox')).toBeVisible();
      expect(onOpenChange).not.toHaveBeenCalled();

      let picker = getByLabelText('Select an option…');
      expect(picker).toHaveAttribute('aria-expanded', 'true');

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      expect(picker).toHaveAttribute('aria-controls', listbox.id);

      fireEvent.keyDown(listbox, KEYS.Escape);
      fireEvent.keyUp(listbox, KEYS.Escape);
      act(() => jest.runAllTimers());

      expect(listbox).not.toBeInTheDocument();
      expect(picker).toHaveAttribute('aria-expanded', 'false');
      expect(picker).not.toHaveAttribute('aria-controls');
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('labeling', function () {
    it('focuses on the picker when you click the label', function () {
      let { getAllByText, getByRole } = renderWithProvider(
        <Picker label="Test" onSelectionChange={onSelectionChange}>
          <Item>One</Item>
          <Item>Two</Item>
          <Item>Three</Item>
        </Picker>
      );

      let label = getAllByText('Test')[0];
      act(() => label.click());

      let picker = getByRole('button');
      expect(document.activeElement).toBe(picker);
    });

    it('supports labeling with a visible label', function () {
      let { getAllByText, getByText, getByRole } = renderWithProvider(
        <Picker label="Test" onSelectionChange={onSelectionChange}>
          <Item>One</Item>
          <Item>Two</Item>
          <Item>Three</Item>
        </Picker>
      );

      let picker = getByRole('button');
      expect(picker).toHaveAttribute('aria-haspopup', 'listbox');

      let label = getAllByText('Test')[0];
      let value = getByText('Select an option…');
      expect(label).toHaveAttribute('id');
      expect(value).toHaveAttribute('id');
      expect(picker).toHaveAttribute(
        'aria-labelledby',
        `${value.id} ${label.id}`
      );

      firePress(picker);
      act(() => jest.runAllTimers());

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      expect(listbox).toHaveAttribute('aria-labelledby', label.id);
    });

    it('supports labeling via aria-label', function () {
      let { getByText, getByRole } = renderWithProvider(
        <Picker aria-label="Test" onSelectionChange={onSelectionChange}>
          <Item>One</Item>
          <Item>Two</Item>
          <Item>Three</Item>
        </Picker>
      );

      let picker = getByRole('button');
      let value = getByText('Select an option…');
      expect(picker).toHaveAttribute('id');
      expect(value).toHaveAttribute('id');
      expect(picker).toHaveAttribute('aria-label', 'Test');
      expect(picker).toHaveAttribute(
        'aria-labelledby',
        `${value.id} ${picker.id}`
      );

      firePress(picker);
      act(() => jest.runAllTimers());

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      expect(listbox).toHaveAttribute('aria-labelledby', picker.id);
    });

    it('supports labeling via aria-labelledby', function () {
      let { getByText, getByRole } = renderWithProvider(
        <Picker aria-labelledby="foo" onSelectionChange={onSelectionChange}>
          <Item>One</Item>
          <Item>Two</Item>
          <Item>Three</Item>
        </Picker>
      );

      let picker = getByRole('button');
      let value = getByText('Select an option…');
      expect(picker).toHaveAttribute('id');
      expect(value).toHaveAttribute('id');
      expect(picker).toHaveAttribute('aria-labelledby', `${value.id} foo`);

      firePress(picker);
      act(() => jest.runAllTimers());

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      expect(listbox).toHaveAttribute('aria-labelledby', 'foo');
    });

    it('supports labeling via aria-label and aria-labelledby', function () {
      let { getByText, getByRole } = renderWithProvider(
        <Picker
          aria-label="Test"
          aria-labelledby="foo"
          onSelectionChange={onSelectionChange}
        >
          <Item>One</Item>
          <Item>Two</Item>
          <Item>Three</Item>
        </Picker>
      );

      let picker = getByRole('button');
      let value = getByText('Select an option…');
      expect(picker).toHaveAttribute('id');
      expect(value).toHaveAttribute('id');
      expect(picker).toHaveAttribute('aria-label', 'Test');
      expect(picker).toHaveAttribute(
        'aria-labelledby',
        `${value.id} ${picker.id} foo`
      );

      firePress(picker);
      act(() => jest.runAllTimers());

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      expect(listbox).toHaveAttribute('aria-labelledby', `${picker.id} foo`);
    });

    describe('isRequired', function () {
      it('supports labeling with a visible label that supplements the required state', function () {
        let { getByLabelText, getByText, getByRole } = renderWithProvider(
          <Picker
            label="Test 2"
            isRequired
            onSelectionChange={onSelectionChange}
          >
            <Item>One</Item>
            <Item>Two</Item>
            <Item>Three</Item>
          </Picker>
        );

        let picker = getByRole('button');
        expect(picker).toHaveAttribute('aria-haspopup', 'listbox');

        let span = getByLabelText('(required)');
        expect(span).toBeTruthy();

        let label = span.parentElement;
        let value = getByText('Select an option…');
        expect(label).toHaveAttribute('id');
        expect(value).toHaveAttribute('id');
        expect(picker).toHaveAttribute(
          'aria-labelledby',
          `${value.id} ${label?.id}`
        );

        firePress(picker);
        act(() => jest.runAllTimers());

        let listbox = getByRole('listbox');
        expect(listbox).toBeVisible();
        expect(listbox).toHaveAttribute('aria-labelledby', label?.id);
      });
    });

    describe('help text', function () {
      it('supports description', function () {
        let { getByText, getByRole } = renderWithProvider(
          <Picker
            label="Test"
            description="Please select an item."
            onSelectionChange={onSelectionChange}
          >
            <Item>One</Item>
            <Item>Two</Item>
            <Item>Three</Item>
          </Picker>
        );

        let picker = getByRole('button');
        let description = getByText('Please select an item.');
        expect(description).toHaveAttribute('id');
        expect(picker).toHaveAttribute('aria-describedby', `${description.id}`);
      });

      it('supports error message', function () {
        let { getByText, getByRole } = renderWithProvider(
          <Picker
            label="Test"
            errorMessage="Please select a valid item."
            validationState="invalid"
            onSelectionChange={onSelectionChange}
          >
            <Item>One</Item>
            <Item>Two</Item>
            <Item>Three</Item>
          </Picker>
        );

        let picker = getByRole('button');
        let errorMessage = getByText('Please select a valid item.');
        expect(errorMessage).toHaveAttribute('id');
        expect(picker).toHaveAttribute(
          'aria-describedby',
          `${errorMessage.id}`
        );
      });
    });
  });

  describe('selection', function () {
    it('can select items on press', function () {
      let { getByRole } = renderWithProvider(
        <Picker label="Test" onSelectionChange={onSelectionChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Picker>
      );

      let picker = getByRole('button');
      expect(picker).toHaveTextContent('Select an option…');
      firePress(picker);
      act(() => jest.runAllTimers());

      let listbox = getByRole('listbox');
      let items = within(listbox).getAllByRole('option');
      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent('One');
      expect(items[1]).toHaveTextContent('Two');
      expect(items[2]).toHaveTextContent('Three');

      expect(document.activeElement).toBe(listbox);

      firePress(items[2]);
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenLastCalledWith('three');
      act(() => jest.runAllTimers());
      expect(listbox).not.toBeInTheDocument();

      // run restore focus rAF
      act(() => jest.runAllTimers());
      expect(document.activeElement).toBe(picker);
      expect(picker).toHaveTextContent('Three');
    });

    it('can select items with falsy keys', function () {
      let { getByRole } = renderWithProvider(
        <Picker label="Test" onSelectionChange={onSelectionChange}>
          <Item key="">Empty</Item>
          <Item key={0}>Zero</Item>
          {/** @ts-expect-error */}
          <Item key={false}>False</Item>
        </Picker>
      );

      let picker = getByRole('button');
      expect(picker).toHaveTextContent('Select an option…');
      firePress(picker);
      act(() => jest.runAllTimers());

      let listbox = getByRole('listbox');
      let items = within(listbox).getAllByRole('option');
      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent('Empty');
      expect(items[1]).toHaveTextContent('Zero');
      expect(items[2]).toHaveTextContent('False');

      expect(document.activeElement).toBe(listbox);

      firePress(items[0]);
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenLastCalledWith('');
      act(() => jest.runAllTimers());
      expect(listbox).not.toBeInTheDocument();

      // run restore focus rAF
      act(() => jest.runAllTimers());
      expect(document.activeElement).toBe(picker);
      expect(picker).toHaveTextContent('Empty');

      firePress(picker);
      act(() => jest.runAllTimers());

      listbox = getByRole('listbox');
      let item1 = within(listbox).getByText('Zero');

      firePress(item1);
      expect(onSelectionChange).toHaveBeenCalledTimes(2);
      expect(onSelectionChange).toHaveBeenLastCalledWith('0');
      act(() => jest.runAllTimers());
      expect(listbox).not.toBeInTheDocument();

      // run restore focus rAF
      act(() => jest.runAllTimers());
      expect(document.activeElement).toBe(picker);
      expect(picker).toHaveTextContent('Zero');

      firePress(picker);
      act(() => jest.runAllTimers());

      listbox = getByRole('listbox');
      let item2 = within(listbox).getByText('False');

      firePress(item2);
      expect(onSelectionChange).toHaveBeenCalledTimes(3);
      expect(onSelectionChange).toHaveBeenLastCalledWith('false');
      act(() => jest.runAllTimers());
      expect(listbox).not.toBeInTheDocument();

      // run restore focus rAF
      act(() => jest.runAllTimers());
      expect(document.activeElement).toBe(picker);
      expect(picker).toHaveTextContent('False');
    });

    it('can select items with the Space key', function () {
      let { getByRole } = renderWithProvider(
        <Picker label="Test" onSelectionChange={onSelectionChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Picker>
      );

      let picker = getByRole('button');
      expect(picker).toHaveTextContent('Select an option…');
      firePress(picker);
      act(() => jest.runAllTimers());

      let listbox = getByRole('listbox');
      let items = within(listbox).getAllByRole('option');
      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent('One');
      expect(items[1]).toHaveTextContent('Two');
      expect(items[2]).toHaveTextContent('Three');

      expect(document.activeElement).toBe(listbox);

      fireEvent.keyDown(listbox, KEYS.ArrowDown);
      fireEvent.keyUp(listbox, KEYS.ArrowDown);
      expect(document.activeElement).toBe(items[0]);

      fireEvent.keyDown(listbox, KEYS.ArrowDown);
      fireEvent.keyUp(listbox, KEYS.ArrowDown);
      expect(document.activeElement).toBe(items[1]);

      fireEvent.keyDown(document.activeElement as Element, KEYS.Space);
      fireEvent.keyUp(document.activeElement as Element, KEYS.Space);
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenLastCalledWith('two');
      act(() => jest.runAllTimers());
      expect(listbox).not.toBeInTheDocument();

      // run restore focus rAF
      act(() => jest.runAllTimers());
      expect(document.activeElement).toBe(picker);
      expect(picker).toHaveTextContent('Two');
    });

    it('can select items with the Enter key', function () {
      let { getByRole } = renderWithProvider(
        <Picker label="Test" onSelectionChange={onSelectionChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Picker>
      );

      let picker = getByRole('button');
      expect(picker).toHaveTextContent('Select an option…');
      act(() => {
        picker.focus();
      });

      fireEvent.keyDown(picker, KEYS.ArrowUp);
      fireEvent.keyUp(picker, KEYS.ArrowUp);
      act(() => jest.runAllTimers());

      let listbox = getByRole('listbox');
      let items = within(listbox).getAllByRole('option');
      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent('One');
      expect(items[1]).toHaveTextContent('Two');
      expect(items[2]).toHaveTextContent('Three');

      expect(document.activeElement).toBe(items[2]);

      fireEvent.keyDown(listbox, KEYS.ArrowUp);
      fireEvent.keyUp(listbox, KEYS.ArrowUp);
      expect(document.activeElement).toBe(items[1]);

      fireEvent.keyDown(document.activeElement as Element, KEYS.Enter);
      fireEvent.keyUp(document.activeElement as Element, KEYS.Enter);
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenLastCalledWith('two');
      act(() => jest.runAllTimers());
      expect(listbox).not.toBeInTheDocument();

      // run restore focus rAF
      act(() => jest.runAllTimers());
      expect(document.activeElement).toBe(picker);
      expect(picker).toHaveTextContent('Two');
    });

    it('focuses items on hover', function () {
      let { getByRole } = renderWithProvider(
        <Picker label="Test" onSelectionChange={onSelectionChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Picker>
      );

      let picker = getByRole('button');
      expect(picker).toHaveTextContent('Select an option…');
      firePress(picker);
      act(() => jest.runAllTimers());

      let listbox = getByRole('listbox');
      let items = within(listbox).getAllByRole('option');
      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent('One');
      expect(items[1]).toHaveTextContent('Two');
      expect(items[2]).toHaveTextContent('Three');

      expect(document.activeElement).toBe(listbox);

      fireEvent.mouseEnter(items[1]);
      expect(document.activeElement).toBe(items[1]);

      fireEvent.keyDown(listbox, KEYS.ArrowDown);
      fireEvent.keyUp(listbox, KEYS.ArrowDown);
      expect(document.activeElement).toBe(items[2]);

      fireEvent.keyDown(document.activeElement as Element, KEYS.Enter);
      fireEvent.keyUp(document.activeElement as Element, KEYS.Enter);
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenLastCalledWith('three');
      act(() => jest.runAllTimers());
      expect(listbox).not.toBeInTheDocument();

      // run restore focus rAF
      act(() => jest.runAllTimers());
      expect(document.activeElement).toBe(picker);
      expect(picker).toHaveTextContent('Three');
    });

    it('does not clear selection on escape closing the listbox', function () {
      let onOpenChangeSpy = jest.fn();
      let { getAllByText, getByRole, queryByRole } = renderWithProvider(
        <Picker
          label="Test"
          onSelectionChange={onSelectionChange}
          onOpenChange={onOpenChangeSpy}
        >
          <Item>One</Item>
          <Item>Two</Item>
          <Item>Three</Item>
        </Picker>
      );

      let picker = getByRole('button');
      expect(picker).toHaveTextContent('Select an option…');
      expect(onOpenChangeSpy).toHaveBeenCalledTimes(0);
      firePress(picker);
      act(() => jest.runAllTimers());
      expect(onOpenChangeSpy).toHaveBeenCalledTimes(1);

      let listbox = getByRole('listbox');
      let label = getAllByText('Test')[0];
      expect(listbox).toBeVisible();
      expect(listbox).toHaveAttribute('aria-labelledby', label.id);

      let item1 = within(listbox).getByText('One');
      let item2 = within(listbox).getByText('Two');
      let item3 = within(listbox).getByText('Three');
      expect(item1).toBeTruthy();
      expect(item2).toBeTruthy();
      expect(item3).toBeTruthy();

      firePress(item3);
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      act(() => jest.runAllTimers());
      expect(onOpenChangeSpy).toHaveBeenCalledTimes(2);
      expect(queryByRole('listbox')).toBeNull();

      firePress(picker);
      act(() => jest.runAllTimers());
      expect(onOpenChangeSpy).toHaveBeenCalledTimes(3);

      listbox = getByRole('listbox');
      item1 = within(listbox).getByText('One');

      // act callback must return a Promise or undefined, so we return undefined here
      act(() => {
        fireEvent.keyDown(item1, KEYS.Escape);
      });
      expect(onSelectionChange).toHaveBeenCalledTimes(1); // still expecting it to have only been called once
      act(() => jest.runAllTimers());
      expect(onOpenChangeSpy).toHaveBeenCalledTimes(4);
      expect(queryByRole('listbox')).toBeNull();

      // run restore focus rAF
      act(() => jest.runAllTimers());
      expect(document.activeElement).toBe(picker);
      expect(picker).toHaveTextContent('Three');
    });

    it('supports controlled selection', function () {
      let { getByRole } = renderWithProvider(
        <Picker
          label="Test"
          selectedKey="two"
          onSelectionChange={onSelectionChange}
        >
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Picker>
      );

      let picker = getByRole('button');
      expect(picker).toHaveTextContent('Two');
      firePress(picker);
      act(() => jest.runAllTimers());

      let listbox = getByRole('listbox');
      let items = within(listbox).getAllByRole('option');
      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent('One');
      expect(items[1]).toHaveTextContent('Two');
      expect(items[2]).toHaveTextContent('Three');

      expect(document.activeElement).toBe(items[1]);
      expect(items[1]).toHaveAttribute('aria-selected', 'true');
      expect(within(items[1]).getByRole('img', { hidden: true })).toBeVisible(); // checkmark

      fireEvent.keyDown(listbox, KEYS.ArrowUp);
      fireEvent.keyUp(listbox, KEYS.ArrowUp);
      expect(document.activeElement).toBe(items[0]);

      fireEvent.keyDown(document.activeElement as Element, KEYS.Enter);
      fireEvent.keyUp(document.activeElement as Element, KEYS.Enter);
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenLastCalledWith('one');
      act(() => jest.runAllTimers());
      expect(listbox).not.toBeInTheDocument();

      // run restore focus rAF
      act(() => jest.runAllTimers());
      expect(document.activeElement).toBe(picker);
      expect(picker).toHaveTextContent('Two');
    });

    it('supports default selection', function () {
      let { getByRole } = renderWithProvider(
        <Picker
          label="Test"
          defaultSelectedKey="two"
          onSelectionChange={onSelectionChange}
        >
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Picker>
      );

      let picker = getByRole('button');
      expect(picker).toHaveTextContent('Two');
      firePress(picker);
      act(() => jest.runAllTimers());

      let listbox = getByRole('listbox');
      let items = within(listbox).getAllByRole('option');
      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent('One');
      expect(items[1]).toHaveTextContent('Two');
      expect(items[2]).toHaveTextContent('Three');

      expect(document.activeElement).toBe(items[1]);
      expect(items[1]).toHaveAttribute('aria-selected', 'true');
      expect(within(items[1]).getByRole('img', { hidden: true })).toBeVisible(); // checkmark

      fireEvent.keyDown(listbox, KEYS.ArrowUp);
      fireEvent.keyUp(listbox, KEYS.ArrowUp);
      expect(document.activeElement).toBe(items[0]);

      fireEvent.keyDown(document.activeElement as Element, KEYS.Enter);
      fireEvent.keyUp(document.activeElement as Element, KEYS.Enter);
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenLastCalledWith('one');
      act(() => jest.runAllTimers());
      expect(listbox).not.toBeInTheDocument();

      // run restore focus rAF
      act(() => jest.runAllTimers());
      expect(document.activeElement).toBe(picker);
      expect(picker).toHaveTextContent('One');
    });

    it('skips disabled items', function () {
      let { getByRole } = renderWithProvider(
        <Picker
          label="Test"
          onSelectionChange={onSelectionChange}
          disabledKeys={['two']}
        >
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Picker>
      );

      let picker = getByRole('button');
      expect(picker).toHaveTextContent('Select an option…');
      firePress(picker);
      act(() => jest.runAllTimers());

      let listbox = getByRole('listbox');
      let items = within(listbox).getAllByRole('option');
      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent('One');
      expect(items[1]).toHaveTextContent('Two');
      expect(items[2]).toHaveTextContent('Three');

      expect(document.activeElement).toBe(listbox);

      fireEvent.keyDown(listbox, KEYS.ArrowDown);
      fireEvent.keyUp(listbox, KEYS.ArrowDown);
      expect(document.activeElement).toBe(items[0]);
      expect(items[1]).toHaveAttribute('aria-disabled', 'true');

      fireEvent.keyDown(listbox, KEYS.ArrowDown);
      fireEvent.keyUp(listbox, KEYS.ArrowDown);
      expect(document.activeElement).toBe(items[2]);

      fireEvent.keyDown(document.activeElement as Element, KEYS.Enter);
      fireEvent.keyUp(document.activeElement as Element, KEYS.Enter);
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenLastCalledWith('three');
      act(() => jest.runAllTimers());
      expect(listbox).not.toBeInTheDocument();

      // run restore focus rAF
      act(() => jest.runAllTimers());
      expect(document.activeElement).toBe(picker);
      expect(picker).toHaveTextContent('Three');
    });

    it('supports sections and complex items', function () {
      let { getAllByRole, getByRole, getByText } = renderWithProvider(
        <Picker label="Test" onSelectionChange={onSelectionChange}>
          <Section title="Section 1">
            <Item textValue="Copy" key="copy">
              <Icon src={globeIcon} />
              <Text>Copy</Text>
            </Item>
            <Item textValue="Cut" key="cut">
              <Icon src={globeIcon} />
              <Text>Cut</Text>
            </Item>
            <Item textValue="Paste" key="paste">
              <Icon src={globeIcon} />
              <Text>Paste</Text>
            </Item>
          </Section>
          <Section title="Section 2">
            <Item textValue="Puppy" key="puppy">
              <Icon src={globeIcon} />
              <Text>Puppy</Text>
              <Text slot="description">
                Puppy description super long as well geez
              </Text>
            </Item>
            <Item
              textValue="Doggo with really really really long long long text"
              key="doggo"
            >
              <Icon src={globeIcon} />
              <Text>Doggo with really really really long long long text</Text>
            </Item>
            <Item textValue="Floof" key="floof">
              <Icon src={globeIcon} />
              <Text>Floof</Text>
            </Item>
          </Section>
        </Picker>
      );

      let picker = getByRole('button');
      expect(picker).toHaveTextContent('Select an option…');
      firePress(picker);
      act(() => jest.runAllTimers());

      let listbox = getByRole('listbox');
      let items = getAllByRole('option');
      expect(items.length).toBe(6);

      let groups = getAllByRole('group');
      expect(groups).toHaveLength(2);
      expect(groups[0]).toHaveAttribute(
        'aria-labelledby',
        getByText('Section 1').id
      );

      expect(items[0]).toHaveAttribute(
        'aria-labelledby',
        within(items[0]).getByText('Copy').id
      );
      expect(groups[0]).toContainElement(items[0]);
      expect(items[1]).toHaveAttribute(
        'aria-labelledby',
        within(items[1]).getByText('Cut').id
      );
      expect(groups[0]).toContainElement(items[1]);
      expect(items[2]).toHaveAttribute(
        'aria-labelledby',
        within(items[2]).getByText('Paste').id
      );
      expect(groups[0]).toContainElement(items[2]);
      expect(items[3]).toHaveAttribute(
        'aria-labelledby',
        within(items[3]).getByText('Puppy').id
      );
      expect(items[3]).toHaveAttribute(
        'aria-describedby',
        within(items[3]).getByText('Puppy description super long as well geez')
          .id
      );
      expect(groups[1]).toContainElement(items[3]);
      expect(items[4]).toHaveAttribute(
        'aria-labelledby',
        within(items[4]).getByText(
          'Doggo with really really really long long long text'
        ).id
      );
      expect(groups[1]).toContainElement(items[4]);
      expect(items[5]).toHaveAttribute(
        'aria-labelledby',
        within(items[5]).getByText('Floof').id
      );
      expect(groups[1]).toContainElement(items[5]);

      expect(getByText('Section 1')).toHaveAttribute('role', 'presentation');
      expect(groups[1]).toHaveAttribute(
        'aria-labelledby',
        getByText('Section 2').id
      );
      expect(getByText('Section 2')).toHaveAttribute('role', 'presentation');

      expect(document.activeElement).toBe(listbox);

      fireEvent.keyDown(listbox, KEYS.ArrowDown);
      fireEvent.keyUp(listbox, KEYS.ArrowDown);
      expect(document.activeElement).toBe(items[0]);

      fireEvent.keyDown(listbox, KEYS.ArrowDown);
      fireEvent.keyUp(listbox, KEYS.ArrowDown);
      expect(document.activeElement).toBe(items[1]);

      fireEvent.keyDown(document.activeElement as Element, KEYS.Enter);
      fireEvent.keyUp(document.activeElement as Element, KEYS.Enter);
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenLastCalledWith('cut');
      act(() => jest.runAllTimers());
      expect(listbox).not.toBeInTheDocument();

      // run restore focus rAF
      act(() => jest.runAllTimers());
      expect(document.activeElement).toBe(picker);
      expect(picker).toHaveTextContent('Cut');
      expect(getAllByRole('img', { hidden: true })).toHaveLength(2);

      // Open again
      firePress(picker);
      act(() => jest.runAllTimers());

      listbox = getByRole('listbox');
      items = within(listbox).getAllByRole('option', { hidden: true });
      expect(items.length).toBe(6);

      expect(document.activeElement).toBe(items[1]);
      expect(items[1]).toHaveAttribute('aria-selected', 'true');
      expect(
        within(items[1]).getAllByRole('img', { hidden: true })
      ).toHaveLength(2); // checkmark

      fireEvent.keyDown(listbox, KEYS.ArrowDown);
      fireEvent.keyUp(listbox, KEYS.ArrowDown);
      expect(document.activeElement).toBe(items[2]);

      fireEvent.keyDown(listbox, KEYS.ArrowDown);
      fireEvent.keyUp(listbox, KEYS.ArrowDown);
      expect(document.activeElement).toBe(items[3]);

      fireEvent.keyDown(document.activeElement as Element, KEYS.Enter);
      fireEvent.keyUp(document.activeElement as Element, KEYS.Enter);
      expect(onSelectionChange).toHaveBeenCalledTimes(2);
      expect(onSelectionChange).toHaveBeenLastCalledWith('puppy');
      act(() => jest.runAllTimers());
      expect(listbox).not.toBeInTheDocument();

      // run restore focus rAF
      act(() => jest.runAllTimers());
      expect(document.activeElement).toBe(picker);
      expect(picker).toHaveTextContent('Puppy');
      expect(getAllByRole('img', { hidden: true })).toHaveLength(2);
      expect(
        getByText('Puppy description super long as well geez')
      ).not.toBeVisible();
    });

    it('supports type to select', function () {
      let { getByRole } = renderWithProvider(
        <Picker label="Test" onSelectionChange={onSelectionChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
          <Item key="">None</Item>
        </Picker>
      );

      let picker = getByRole('button');
      act(() => {
        picker.focus();
      });
      expect(picker).toHaveTextContent('Select an option…');
      fireEvent.keyDown(picker, KEYS.ArrowDown);
      act(() => jest.runAllTimers());

      let listbox = getByRole('listbox');
      let items = within(listbox).getAllByRole('option');
      expect(items.length).toBe(4);
      expect(items[0]).toHaveTextContent('One');
      expect(items[1]).toHaveTextContent('Two');
      expect(items[2]).toHaveTextContent('Three');

      expect(document.activeElement).toBe(items[0]);

      fireEvent.keyDown(listbox, { key: 't' });
      fireEvent.keyUp(listbox, { key: 't' });
      expect(document.activeElement).toBe(items[1]);

      fireEvent.keyDown(listbox, { key: 'h' });
      fireEvent.keyUp(listbox, { key: 'h' });
      expect(document.activeElement).toBe(items[2]);

      fireEvent.keyDown(document.activeElement as Element, KEYS.Enter);
      fireEvent.keyUp(document.activeElement as Element, KEYS.Enter);
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenLastCalledWith('three');
      act(() => jest.runAllTimers());
      expect(listbox).not.toBeInTheDocument();

      // run restore focus rAF
      act(() => jest.runAllTimers());
      expect(document.activeElement).toBe(picker);
      expect(picker).toHaveTextContent('Three');

      act(() => jest.advanceTimersByTime(500));
      act(() => picker.focus());
      fireEvent.keyDown(picker, KEYS.ArrowDown);
      act(() => jest.runAllTimers());
      listbox = getByRole('listbox');
      items = within(listbox).getAllByRole('option');
      expect(document.activeElement).toBe(items[2]);
      fireEvent.keyDown(listbox, { key: 'n' });
      fireEvent.keyDown(document.activeElement as Element, KEYS.Enter);
      fireEvent.keyUp(document.activeElement as Element, KEYS.Enter);
      act(() => jest.runAllTimers());
      expect(listbox).not.toBeInTheDocument();
      expect(picker).toHaveTextContent('None');
      expect(onSelectionChange).toHaveBeenCalledTimes(2);
      expect(onSelectionChange).toHaveBeenLastCalledWith('');
    });

    it('does not deselect when pressing an already selected item', function () {
      let { getByRole } = renderWithProvider(
        <Picker
          label="Test"
          defaultSelectedKey="two"
          onSelectionChange={onSelectionChange}
        >
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Picker>
      );

      let picker = getByRole('button');
      expect(picker).toHaveTextContent('Two');
      firePress(picker);
      act(() => jest.runAllTimers());

      let listbox = getByRole('listbox');
      let items = within(listbox).getAllByRole('option');

      expect(document.activeElement).toBe(items[1]);

      firePress(items[1]);
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenCalledWith('two');
      act(() => jest.runAllTimers());
      expect(listbox).not.toBeInTheDocument();

      // run restore focus rAF
      act(() => jest.runAllTimers());
      expect(document.activeElement).toBe(picker);
      expect(picker).toHaveTextContent('Two');
    });

    it('move selection on Arrow-Left/Right', function () {
      let { getByRole } = renderWithProvider(
        <Picker label="Test" onSelectionChange={onSelectionChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Picker>
      );

      let picker = getByRole('button');
      act(() => {
        picker.focus();
      });
      expect(picker).toHaveTextContent('Select an option…');
      fireEvent.keyDown(picker, KEYS.ArrowLeft);
      act(() => jest.runAllTimers());
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(picker).toHaveTextContent('One');

      fireEvent.keyDown(picker, KEYS.ArrowLeft);
      expect(picker).toHaveTextContent('One');

      fireEvent.keyDown(picker, KEYS.ArrowRight);
      expect(onSelectionChange).toHaveBeenCalledTimes(2);
      expect(picker).toHaveTextContent('Two');

      fireEvent.keyDown(picker, KEYS.ArrowRight);
      expect(onSelectionChange).toHaveBeenCalledTimes(3);
      expect(picker).toHaveTextContent('Three');

      fireEvent.keyDown(picker, KEYS.ArrowRight);
      expect(onSelectionChange).toHaveBeenCalledTimes(3);
      expect(picker).toHaveTextContent('Three');

      fireEvent.keyDown(picker, KEYS.ArrowLeft);
      expect(onSelectionChange).toHaveBeenCalledTimes(4);
      expect(picker).toHaveTextContent('Two');

      fireEvent.keyDown(picker, KEYS.ArrowLeft);
      expect(onSelectionChange).toHaveBeenCalledTimes(5);
      expect(picker).toHaveTextContent('One');
    });
  });

  describe('type to select', function () {
    it('supports focusing items by typing letters in rapid succession without opening the menu', function () {
      let { getByRole } = renderWithProvider(
        <Picker label="Test" onSelectionChange={onSelectionChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Picker>
      );

      let picker = getByRole('button');
      act(() => {
        picker.focus();
      });
      expect(picker).toHaveTextContent('Select an option…');

      fireEvent.keyDown(picker, { key: 't' });
      fireEvent.keyUp(picker, { key: 't' });
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenLastCalledWith('two');
      expect(picker).toHaveTextContent('Two');

      fireEvent.keyDown(picker, { key: 'h' });
      fireEvent.keyUp(picker, { key: 'h' });
      expect(onSelectionChange).toHaveBeenCalledTimes(2);
      expect(onSelectionChange).toHaveBeenLastCalledWith('three');
      expect(picker).toHaveTextContent('Three');
    });

    it('resets the search text after a timeout', function () {
      let { getByRole } = renderWithProvider(
        <Picker label="Test" onSelectionChange={onSelectionChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Picker>
      );

      let picker = getByRole('button');
      act(() => {
        picker.focus();
      });
      expect(picker).toHaveTextContent('Select an option…');

      fireEvent.keyDown(picker, { key: 't' });
      fireEvent.keyUp(picker, { key: 't' });
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenLastCalledWith('two');
      expect(picker).toHaveTextContent('Two');

      act(() => {
        jest.runAllTimers();
      });

      fireEvent.keyDown(picker, { key: 'h' });
      fireEvent.keyUp(picker, { key: 'h' });
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(picker).toHaveTextContent('Two');
    });

    it('wraps around when no items past the current one match', function () {
      let { getByRole } = renderWithProvider(
        <Picker label="Test" onSelectionChange={onSelectionChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Picker>
      );

      let picker = getByRole('button');
      act(() => {
        picker.focus();
      });
      expect(picker).toHaveTextContent('Select an option…');

      fireEvent.keyDown(picker, { key: 't' });
      fireEvent.keyUp(picker, { key: 't' });
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenLastCalledWith('two');
      expect(picker).toHaveTextContent('Two');

      act(() => {
        jest.runAllTimers();
      });

      fireEvent.keyDown(picker, { key: 'o' });
      fireEvent.keyUp(picker, { key: 'o' });
      expect(onSelectionChange).toHaveBeenCalledTimes(2);
      expect(picker).toHaveTextContent('One');
    });
  });

  describe('async loading', function () {
    it('should display a spinner while loading', function () {
      let { getByRole, rerender } = renderWithProvider(
        <Picker label="Test" items={[]} isLoading>
          {() => <Item>foo</Item>}
        </Picker>
      );

      let picker = getByRole('button');
      let progressbar = within(picker).getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-label', 'Loading…');
      expect(progressbar).not.toHaveAttribute('aria-valuenow');

      rerender(
        <Picker label="Test" items={[]}>
          {() => <Item>bar</Item>}
        </Picker>
      );

      expect(progressbar).not.toBeInTheDocument();
    });

    it('should display a spinner inside the listbox when loading more', function () {
      let items = [{ name: 'Foo' }, { name: 'Bar' }];
      let { getByRole, rerender } = renderWithProvider(
        <Picker label="Test" items={items} isLoading>
          {item => <Item key={item.name}>{item.name}</Item>}
        </Picker>
      );

      let picker = getByRole('button');
      firePress(picker);
      act(() => jest.runAllTimers());

      let listbox = getByRole('listbox');
      let options = within(listbox).getAllByRole('option');
      expect(options.length).toBe(3);

      let progressbar = within(options[2]).getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-label', 'Loading more…');
      expect(progressbar).not.toHaveAttribute('aria-valuenow');

      rerender(
        <Picker label="Test" items={items}>
          {item => <Item key={item.name}>{item.name}</Item>}
        </Picker>
      );

      options = within(listbox).getAllByRole('option');
      expect(options.length).toBe(2);
      expect(progressbar).not.toBeInTheDocument();
    });
  });

  describe('disabled', function () {
    it('disables the hidden select when isDisabled is true', function () {
      let { getByRole } = renderWithProvider(
        <Picker isDisabled label="Test" onSelectionChange={onSelectionChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Picker>
      );

      let select = getByRole('textbox', { hidden: true });

      expect(select).toBeDisabled();
    });

    it('does not open on mouse down when isDisabled is true', function () {
      let onOpenChange = jest.fn();
      let { getByRole, queryByRole } = renderWithProvider(
        <Picker isDisabled label="Test" onOpenChange={onOpenChange}>
          <Item>One</Item>
          <Item>Two</Item>
          <Item>Three</Item>
        </Picker>
      );

      expect(queryByRole('listbox')).toBeNull();

      let picker = getByRole('button');
      firePress(picker);
      act(() => jest.runAllTimers());

      expect(queryByRole('listbox')).toBeNull();

      expect(onOpenChange).toHaveBeenCalledTimes(0);

      expect(picker).toHaveAttribute('aria-expanded', 'false');
      expect(document.activeElement).not.toBe(picker);
    });

    it('does not open on Space key press when isDisabled is true', function () {
      let onOpenChange = jest.fn();
      let { getByRole, queryByRole } = renderWithProvider(
        <Picker isDisabled label="Test" onOpenChange={onOpenChange}>
          <Item>One</Item>
          <Item>Two</Item>
          <Item>Three</Item>
        </Picker>
      );

      expect(queryByRole('listbox')).toBeNull();

      let picker = getByRole('button');
      fireEvent.keyDown(picker, KEYS.Space);
      fireEvent.keyUp(picker, KEYS.Space);
      act(() => jest.runAllTimers());

      expect(queryByRole('listbox')).toBeNull();

      expect(onOpenChange).toHaveBeenCalledTimes(0);

      expect(picker).toHaveAttribute('aria-expanded', 'false');
      expect(document.activeElement).not.toBe(picker);
    });
  });

  describe('focus', function () {
    let focusSpies: Record<string, jest.SpiedFunction<() => void>>;

    beforeEach(() => {
      focusSpies = {
        onFocus: jest.fn(),
        onFocusChange: jest.fn(),
        onBlur: jest.fn(),
      };
    });

    it('supports autofocus', function () {
      let { getByRole } = renderWithProvider(
        <Picker label="Test" {...focusSpies} autoFocus>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
          <Item key="">None</Item>
        </Picker>
      );

      let picker = getByRole('button');
      expect(document.activeElement).toBe(picker);
      expect(focusSpies.onFocus).toHaveBeenCalled();
      expect(focusSpies.onFocusChange).toHaveBeenCalledWith(true);
    });

    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('calls onBlur and onFocus for the closed Picker', function () {
      let { getByTestId } = renderWithProvider(
        <>
          <button data-testid="before" />
          <Picker data-testid="picker" label="Test" {...focusSpies} autoFocus>
            <Item key="one">One</Item>
            <Item key="two">Two</Item>
            <Item key="three">Three</Item>
            <Item key="">None</Item>
          </Picker>
          <button data-testid="after" />
        </>
      );
      let beforeBtn = getByTestId('before');
      let afterBtn = getByTestId('after');
      let picker = getByTestId('picker');
      expect(document.activeElement).toBe(picker);
      expect(focusSpies.onFocus).toHaveBeenCalledTimes(1);
      expect(focusSpies.onFocusChange).toHaveBeenCalledTimes(1);
      expect(focusSpies.onFocusChange).toHaveBeenNthCalledWith(1, true);

      userEvent.tab();
      expect(document.activeElement).toBe(afterBtn);
      expect(focusSpies.onBlur).toHaveBeenCalledTimes(1);
      expect(focusSpies.onFocusChange).toHaveBeenCalledTimes(2);
      expect(focusSpies.onFocusChange).toHaveBeenNthCalledWith(2, false);

      userEvent.tab({ shift: true });
      expect(focusSpies.onFocus).toHaveBeenCalledTimes(2);
      expect(focusSpies.onFocusChange).toHaveBeenNthCalledWith(3, true);

      userEvent.tab({ shift: true });
      expect(focusSpies.onBlur).toHaveBeenCalledTimes(2);
      expect(focusSpies.onFocusChange).toHaveBeenNthCalledWith(4, false);
      expect(document.activeElement).toBe(beforeBtn);
    });

    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('calls onBlur and onFocus for the open Picker', function () {
      let { getByRole, getByTestId } = renderWithProvider(
        <>
          <button data-testid="before" />
          <Picker data-testid="picker" label="Test" {...focusSpies} autoFocus>
            <Item key="one">One</Item>
            <Item key="two">Two</Item>
            <Item key="three">Three</Item>
            <Item key="">None</Item>
          </Picker>
          <button data-testid="after" />
        </>
      );
      let beforeBtn = getByTestId('before');
      let afterBtn = getByTestId('after');
      let picker = getByTestId('picker');

      fireEvent.keyDown(picker, KEYS.ArrowDown);
      fireEvent.keyUp(picker, KEYS.ArrowDown);
      act(() => jest.runAllTimers());

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      let items = within(listbox).getAllByRole('option');
      expect(document.activeElement).toBe(items[0]);

      userEvent.tab();
      act(() => jest.runAllTimers());
      expect(document.activeElement).toBe(afterBtn);
      expect(focusSpies.onBlur).toHaveBeenCalledTimes(1);

      userEvent.tab({ shift: true });
      expect(focusSpies.onFocus).toHaveBeenCalledTimes(2);
      expect(focusSpies.onFocusChange).toHaveBeenNthCalledWith(1, true);
      expect(focusSpies.onFocusChange).toHaveBeenNthCalledWith(2, false);
      expect(focusSpies.onFocusChange).toHaveBeenNthCalledWith(3, true);

      fireEvent.keyDown(picker, KEYS.ArrowDown);
      fireEvent.keyUp(picker, KEYS.ArrowDown);
      act(() => jest.runAllTimers());
      listbox = getByRole('listbox');
      items = within(listbox).getAllByRole('option');
      expect(document.activeElement).toBe(items[0]);

      userEvent.tab({ shift: true });
      act(() => jest.runAllTimers());
      expect(focusSpies.onBlur).toHaveBeenCalledTimes(2);
      expect(focusSpies.onFocusChange).toHaveBeenNthCalledWith(4, false);

      expect(document.activeElement).toBe(beforeBtn);
    });

    it('does not call blur when an item is selected', function () {
      let otherButtonFocus = jest.fn();
      let { getByRole, getByTestId } = renderWithProvider(
        <>
          <button data-testid="before" onFocus={otherButtonFocus} />
          <Picker data-testid="picker" label="Test" {...focusSpies} autoFocus>
            <Item key="one">One</Item>
            <Item key="two">Two</Item>
            <Item key="three">Three</Item>
            <Item key="">None</Item>
          </Picker>
          <button data-testid="after" onFocus={otherButtonFocus} />
        </>
      );
      let picker = getByTestId('picker');
      expect(focusSpies.onFocus).toHaveBeenCalledTimes(1);
      expect(focusSpies.onFocusChange).toHaveBeenCalledTimes(1);
      expect(focusSpies.onFocusChange).toHaveBeenCalledWith(true);
      fireEvent.keyDown(picker, KEYS.ArrowDown);
      fireEvent.keyUp(picker, KEYS.ArrowDown);
      act(() => jest.runAllTimers());

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      let items = within(listbox).getAllByRole('option');
      expect(document.activeElement).toBe(items[0]);
      fireEvent.keyDown(document.activeElement as Element, KEYS.Enter);
      fireEvent.keyUp(document.activeElement as Element, KEYS.Enter);
      expect(focusSpies.onFocus).toHaveBeenCalledTimes(1);
      expect(focusSpies.onFocusChange).toHaveBeenCalledTimes(1);
      expect(focusSpies.onFocusChange).toHaveBeenCalledWith(true);

      expect(focusSpies.onBlur).not.toHaveBeenCalled();
      expect(otherButtonFocus).not.toHaveBeenCalled();
    });
  });

  describe('form', function () {
    it('Should submit empty option by default', function () {
      let value;
      let onSubmit = jest.fn((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let formData = new FormData(e.currentTarget);
        value = Object.fromEntries(formData).picker;
      });
      let { getByTestId } = renderWithProvider(
        <form data-testid="form" onSubmit={onSubmit}>
          <Picker name="picker" label="Test" autoFocus>
            <Item key="one">One</Item>
            <Item key="two">Two</Item>
            <Item key="three">Three</Item>
          </Picker>
          <button type="submit" data-testid="submit">
            submit
          </button>
        </form>
      );
      fireEvent.submit(getByTestId('form'));
      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(value).toEqual('');
    });

    it('Should submit default option', function () {
      let value;
      let onSubmit = jest.fn((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let formData = new FormData(e.currentTarget);
        value = Object.fromEntries(formData).picker;
      });
      let { getByTestId } = renderWithProvider(
        <form data-testid="form" onSubmit={onSubmit}>
          <Picker defaultSelectedKey="one" name="picker" label="Test" autoFocus>
            <Item key="one">One</Item>
            <Item key="two">Two</Item>
            <Item key="three">Three</Item>
          </Picker>
          <button type="submit" data-testid="submit">
            submit
          </button>
        </form>
      );
      fireEvent.submit(getByTestId('form'));
      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(value).toEqual('one');
    });
  });
});
