import {
  jest,
  describe,
  it,
  expect,
  afterEach,
  beforeAll,
  afterAll,
} from '@jest/globals';
import {
  Item,
  Menu,
  MenuProps,
  MenuTrigger,
  MenuTriggerProps,
  Section,
} from '..';
import { Button, ButtonProps } from '@keystar/ui/button';
import { SelectionMode } from '@react-types/shared';
import { createRef } from 'react';
import {
  RenderResult,
  act,
  DEFAULT_LONG_PRESS_TIME,
  fireEvent,
  fireLongPress,
  firePress,
  fireTouch,
  installPointerEvent,
  render,
  renderWithProvider,
  within,
  KEYS,
  waitFor,
} from '#test-utils';

let triggerText = 'Menu Button';

let withSection = [
  {
    name: 'Heading 1',
    children: [{ name: 'Foo' }, { name: 'Bar' }, { name: 'Baz' }],
  },
];

describe('menu/MenuTrigger', () => {
  let offsetWidth: jest.SpiedGetter<number>,
    offsetHeight: jest.SpiedGetter<number>;
  let onOpenChange = jest.fn();
  let onSelect = jest.fn();
  let onSelectionChange = jest.fn();

  beforeAll(function () {
    offsetWidth = jest
      .spyOn(window.HTMLElement.prototype, 'offsetWidth', 'get')
      .mockImplementation(() => 1000);
    offsetHeight = jest
      .spyOn(window.HTMLElement.prototype, 'offsetHeight', 'get')
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
    onOpenChange.mockClear();
    onSelect.mockClear();
    onSelectionChange.mockClear();
  });

  function verifyMenuToggle(
    triggerProps = {},
    menuProps = {},
    triggerEvent: (triggerEl: HTMLElement, menuEl?: HTMLElement) => void
  ) {
    let tree = renderComponent(triggerProps, menuProps);
    let triggerButton = tree.getByRole('button');

    expect(onOpenChange).toHaveBeenCalledTimes(0);

    triggerEvent(triggerButton);
    act(() => {
      jest.runAllTimers();
    });

    let menu = tree.getByRole('menu');
    expect(menu).toBeTruthy();
    expect(menu).toHaveAttribute('aria-labelledby', triggerButton.id);

    let menuItem1 = within(menu).getByText('Foo');
    let menuItem2 = within(menu).getByText('Bar');
    let menuItem3 = within(menu).getByText('Baz');
    expect(menuItem1).toBeTruthy();
    expect(menuItem2).toBeTruthy();
    expect(menuItem3).toBeTruthy();

    expect(triggerButton).toHaveAttribute('aria-expanded', 'true');
    expect(triggerButton).toHaveAttribute('aria-controls', menu.id);

    expect(onOpenChange).toHaveBeenCalledTimes(1);

    triggerEvent(triggerButton, menu);
    act(() => {
      jest.runAllTimers();
    });
    expect(menu).not.toBeInTheDocument();

    expect(triggerButton).toHaveAttribute('aria-expanded', 'false');
    expect(onOpenChange).toHaveBeenCalledTimes(2);
  }

  it('has default behavior (button renders, menu is closed)', function () {
    let tree = renderComponent();
    let triggerButton = tree.getByRole('button');
    expect(triggerButton).toBeTruthy();
    expect(triggerButton).toHaveAttribute('aria-haspopup', 'true');

    let buttonText = within(triggerButton).getByText(triggerText);
    expect(buttonText).toBeTruthy();

    let menuItem = tree.queryByText('Foo');
    expect(menuItem).toBeFalsy();

    expect(triggerButton).toHaveAttribute('aria-expanded', 'false');
    expect(triggerButton).toHaveAttribute('type', 'button');
  });

  it('toggles the menu display on button click', function () {
    verifyMenuToggle({ onOpenChange }, {}, button => firePress(button));
  });

  // Enter and Space keypress tests are ommitted since useMenuTrigger doesn't have space and enter cases in it's key down
  // since usePress handles those cases

  it('can toggle the menu display via ArrowUp key', function () {
    verifyMenuToggle({ onOpenChange }, {}, (button, menu) => {
      if (!menu) {
        fireEvent.keyDown(button, KEYS.ArrowUp);
      } else {
        fireEvent.keyDown(menu, KEYS.Escape);
      }
    });
  });

  it('can toggle the menu display via ArrowDown key', function () {
    verifyMenuToggle({ onOpenChange }, {}, (button, menu) => {
      if (!menu) {
        fireEvent.keyDown(button, KEYS.ArrowDown);
      } else {
        fireEvent.keyDown(menu, KEYS.Escape);
      }
    });
  });

  it('supports `isOpen` (controlled)', function () {
    let tree = renderComponent({ onOpenChange, isOpen: true });
    act(() => {
      jest.runAllTimers();
    });
    expect(onOpenChange).toHaveBeenCalledTimes(0);

    let menu = tree.getByRole('menu');
    expect(menu).toBeTruthy();

    let triggerButton = tree.getByText('Menu Button');
    firePress(triggerButton);
    act(() => {
      jest.runAllTimers();
    });

    menu = tree.getByRole('menu');
    expect(menu).toBeTruthy();
    expect(onOpenChange).toHaveBeenCalledTimes(1);
  });

  it('supports `defaultOpen` (uncontrolled) ', function () {
    let tree = renderComponent({ onOpenChange, defaultOpen: true });
    act(() => {
      jest.runAllTimers();
    });
    expect(onOpenChange).toHaveBeenCalledTimes(0);

    let menu = tree.getByRole('menu');
    expect(menu).toBeTruthy();

    let triggerButton = tree.getByText('Menu Button');
    firePress(triggerButton);
    act(() => {
      jest.runAllTimers();
    });

    expect(menu).not.toBeInTheDocument();
    expect(onOpenChange).toHaveBeenCalledTimes(1);
  });

  it('does not trigger on disabled button', function () {
    let tree = renderComponent({}, {}, { isDisabled: true });
    let button = tree.getByRole('button');
    firePress(button);
    act(() => {
      jest.runAllTimers();
    });
    let menu = tree.queryByRole('menu');
    expect(menu).toBeNull();
    expect(onOpenChange).toHaveBeenCalledTimes(0);
  });

  describe('default focus behavior', function () {
    it('autofocuses the selected item on menu open', function () {
      let tree = renderComponent(
        {},
        { selectedKeys: ['Bar'], selectionMode: 'single' }
      );
      act(() => {
        jest.runAllTimers();
      });
      let button = tree.getByRole('button');
      firePress(button);
      act(() => {
        jest.runAllTimers();
      });
      let menu = tree.getByRole('menu');
      expect(menu).toBeTruthy();
      let menuItems = within(menu).getAllByRole('menuitemradio');
      let selectedItem = menuItems[1];
      expect(selectedItem).toBe(document.activeElement);
      firePress(button);
      act(() => {
        jest.runAllTimers();
      });

      expect(menu).not.toBeInTheDocument();
      act(() => {
        jest.runAllTimers();
      });

      // Opening menu via down arrow still autofocuses the selected item
      fireEvent.keyDown(button, KEYS.ArrowDown);
      fireEvent.keyUp(button, KEYS.ArrowDown);
      act(() => {
        jest.runAllTimers();
      });
      menu = tree.getByRole('menu');
      menuItems = within(menu).getAllByRole('menuitemradio');
      selectedItem = menuItems[1];
      expect(selectedItem).toBe(document.activeElement);
      firePress(button);
      act(() => {
        jest.runAllTimers();
      });
      expect(menu).not.toBeInTheDocument();

      // Opening menu via up arrow still autofocuses the selected item
      fireEvent.keyDown(button, KEYS.ArrowUp);
      menu = tree.getByRole('menu');
      menuItems = within(menu).getAllByRole('menuitemradio');
      selectedItem = menuItems[1];
      expect(selectedItem).toBe(document.activeElement);
    });

    it("focuses the last item on ArrowUp if there isn't a selected item", function () {
      let tree = renderComponent();
      let button = tree.getByRole('button');
      fireEvent.keyDown(button, KEYS.ArrowUp);
      let menu = tree.getByRole('menu');
      let menuItems = within(menu).getAllByRole('menuitem');
      let selectedItem = menuItems[menuItems.length - 1];
      expect(selectedItem).toBe(document.activeElement);
    });

    it("focuses the first item on ArrowDown if there isn't a selected item", function () {
      let tree = renderComponent();
      let button = tree.getByRole('button');
      fireEvent.keyDown(button, KEYS.ArrowDown);
      let menu = tree.getByRole('menu');
      let menuItems = within(menu).getAllByRole('menuitem');
      let selectedItem = menuItems[0];
      expect(selectedItem).toBe(document.activeElement);
    });

    it('moves focus via ArrowDown and ArrowUp', function () {
      let tree = renderWithProvider(
        <MenuTrigger>
          <Button>{triggerText}</Button>
          <Menu>
            <Item key="1">One</Item>
            <Item key="">Two</Item>
            <Item key="3">Three</Item>
          </Menu>
        </MenuTrigger>
      );

      let button = tree.getByRole('button');
      fireEvent.keyDown(button, KEYS.ArrowDown);
      let menu = tree.getByRole('menu');
      let menuItems = within(menu).getAllByRole('menuitem');
      let selectedItem = menuItems[0];
      expect(selectedItem).toBe(document.activeElement);

      fireEvent.keyDown(menu, KEYS.ArrowDown);
      expect(menuItems[1]).toBe(document.activeElement);

      fireEvent.keyDown(menu, KEYS.ArrowDown);
      expect(menuItems[2]).toBe(document.activeElement);

      fireEvent.keyDown(menu, KEYS.ArrowUp);
      expect(menuItems[1]).toBe(document.activeElement);
    });
  });

  describe('menu popover closing behavior', function () {
    let tree: RenderResult | null;
    afterEach(() => {
      if (tree) {
        tree.unmount();
      }
      tree = null;
    });

    function openAndTriggerMenuItem(
      tree: RenderResult,
      selectionMode: 'single' | 'multiple' | 'none',
      triggerEvent: (el: HTMLElement) => void
    ) {
      let triggerButton = tree.getByRole('button');
      act(() => firePress(triggerButton));
      act(() => jest.runAllTimers());

      let menu = tree.getByRole('menu');
      expect(menu).toBeTruthy();

      let menuItemRole = 'menuitem';
      if (selectionMode === 'single') {
        menuItemRole = 'menuitemradio';
      } else if (selectionMode === 'multiple') {
        menuItemRole = 'menuitemcheckbox';
      }

      let menuItems = within(menu).getAllByRole(menuItemRole);
      let itemToAction = menuItems[1];
      act(() => {
        triggerEvent(itemToAction);
      });
      act(() => {
        jest.runAllTimers();
      }); // FocusScope useLayoutEffect cleanup
      act(() => {
        jest.runAllTimers();
      }); // FocusScope raf
    }

    // Can't figure out why this isn't working for the v2 component
    it('closes the menu upon clicking escape key', function () {
      tree = renderComponent({ onOpenChange });
      let button = tree.getByRole('button');
      firePress(button);
      act(() => {
        jest.runAllTimers();
      });

      let menu = tree.getByRole('menu');
      expect(menu).toBeTruthy();
      fireEvent.keyDown(menu, KEYS.Escape);
      act(() => {
        jest.runAllTimers();
      }); // FocusScope useLayoutEffect cleanup
      act(() => {
        jest.runAllTimers();
      }); // FocusScope raf
      expect(menu).not.toBeInTheDocument();
      expect(document.activeElement).toBe(button);
    });

    // Can't figure out why this isn't working for the v2 component
    it('closes the menu upon clicking outside the menu', function () {
      tree = renderComponent({ onOpenChange });
      let button = tree.getByRole('button');
      firePress(button);
      act(() => {
        jest.runAllTimers();
      });

      let menu = tree.getByRole('menu');
      expect(menu).toBeTruthy();
      fireEvent.mouseDown(document.body);
      fireEvent.mouseUp(document.body);
      act(() => {
        jest.runAllTimers();
      }); // FocusScope useLayoutEffect cleanup
      act(() => {
        jest.runAllTimers();
      }); // FocusScope raf
      expect(menu).not.toBeInTheDocument();
      expect(document.activeElement).toBe(button);
    });

    it("doesn't close on menu item selection if closeOnSelect=false", function () {
      tree = renderComponent(
        { onOpenChange, closeOnSelect: false },
        { selectionMode: 'single', onSelectionChange }
      );
      expect(onOpenChange).toHaveBeenCalledTimes(0);
      let button = tree.getByRole('button');
      firePress(button);
      act(() => {
        jest.runAllTimers();
      });

      let menu = tree.getByRole('menu');
      expect(menu).toBeTruthy();
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenCalledTimes(0);

      let menuItem1 = within(menu).getByText('Foo');
      expect(menuItem1).toBeTruthy();
      firePress(menuItem1);

      expect(onSelectionChange).toHaveBeenCalledTimes(1);

      expect(menu).toBeInTheDocument();

      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(onOpenChange).toHaveBeenCalledTimes(1);
    });

    it("doesn't closes menu on item selection via ENTER press if closeOnSelect=false", function () {
      tree = renderComponent(
        { onOpenChange, closeOnSelect: false },
        { selectionMode: 'single', onSelectionChange }
      );
      expect(onOpenChange).toHaveBeenCalledTimes(0);
      let button = tree.getByRole('button');
      firePress(button);
      act(() => {
        jest.runAllTimers();
      });

      let menu = tree.getByRole('menu');
      expect(menu).toBeTruthy();
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenCalledTimes(0);

      let menuItem1 = within(menu).getByText('Foo');
      expect(menuItem1).toBeTruthy();
      fireEvent.keyDown(menuItem1, KEYS.Enter);
      fireEvent.keyUp(menuItem1, KEYS.Enter);
      act(() => {
        jest.runAllTimers();
      });
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(menu).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(onOpenChange).toHaveBeenCalledTimes(1);
    });

    it("doesn't close menu on item selection via mouse with multiple selection", function () {
      tree = renderComponent({}, { selectionMode: 'multiple' });
      openAndTriggerMenuItem(tree, 'multiple', item => firePress(item));

      let menu = tree.getByRole('menu');
      expect(menu).toBeTruthy();
    });

    it.each([
      [{ selectionMode: 'single' as const }],
      [{ selectionMode: 'multiple' as const }],
      [{ selectionMode: 'none' as const }],
    ])(
      'closes on menu item selection if toggled by mouse click, when %p',
      function (menuProps) {
        let closeOnSelect = menuProps.selectionMode === 'multiple' || undefined;
        tree = renderComponent({ closeOnSelect }, menuProps);
        openAndTriggerMenuItem(tree, menuProps.selectionMode, item =>
          firePress(item)
        );

        let menu = tree.queryByRole('menu');
        expect(menu).toBeNull();
        expect(document.activeElement).toBe(tree.getByRole('button'));
      }
    );

    it.each([
      [{ selectionMode: 'single' as const }],
      [{ selectionMode: 'multiple' as const }],
      [{ selectionMode: 'none' as const }],
    ])(
      'closes on menu item selection if toggled by ENTER key, when %p',
      function (menuProps) {
        tree = renderComponent({}, menuProps);
        openAndTriggerMenuItem(tree, menuProps.selectionMode, item =>
          fireEvent.keyDown(item, KEYS.Enter)
        );

        let menu = tree.queryByRole('menu');
        expect(menu).toBeNull();
        expect(document.activeElement).toBe(tree.getByRole('button'));
      }
    );

    it.each([
      [{ selectionMode: 'single' as const }],
      [{ selectionMode: 'multiple' as const }],
    ])(
      "doesn't close on menu item selection if toggled by SPACE key, when $name",
      function (menuProps) {
        tree = renderComponent({}, menuProps);
        openAndTriggerMenuItem(tree, menuProps.selectionMode, item =>
          fireEvent.keyDown(item, KEYS.Space)
        );

        let menu = tree.queryByRole('menu');
        expect(menu).toBeTruthy();
      }
    );

    it('closes on menu item selection if toggled by SPACE key, when selectionMode=none', function () {
      const selectionMode = 'none';
      tree = renderComponent({}, { selectionMode });
      openAndTriggerMenuItem(tree, selectionMode, item =>
        fireEvent.keyDown(item, KEYS.Space)
      );

      let menu = tree.queryByRole('menu');
      expect(menu).toBeNull();
      expect(document.activeElement).toBe(tree.getByRole('button'));
    });

    it('closes the menu when blurring the menu', function () {
      tree = renderComponent({ onOpenChange });
      expect(onOpenChange).toHaveBeenCalledTimes(0);
      let button = tree.getByRole('button');
      firePress(button);
      act(() => {
        jest.runAllTimers();
      });

      let menu = tree.getByRole('menu');
      expect(menu).toBeTruthy();
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(button).toHaveAttribute('aria-expanded', 'true');

      act(() => {
        (document.activeElement as HTMLElement)?.blur();
      });
      act(() => {
        jest.runAllTimers();
      });
      expect(menu).not.toBeInTheDocument();
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(onOpenChange).toHaveBeenCalledTimes(2);
    });

    it.each([
      [{ selectionMode: 'single' as const }],
      [{ selectionMode: 'multiple' as const }],
      [{ selectionMode: 'none' as const }],
    ])('ignores repeating keyboard events, when %p', function (menuProps) {
      tree = renderComponent({}, menuProps);
      openAndTriggerMenuItem(tree, menuProps.selectionMode, item =>
        fireEvent.keyDown(item, {
          key: 'Enter',
          code: 13,
          charCode: 13,
          repeat: true,
        })
      );

      let menu = tree.queryByRole('menu');
      expect(menu).toBeTruthy();
    });

    it('tabs to the next element after the trigger and closes the menu', function () {
      tree = renderWithProvider(
        <>
          <input data-testid="before-input" />
          <MenuTrigger onOpenChange={onOpenChange}>
            <Button>{triggerText}</Button>
            <Menu items={withSection}>
              {item => (
                <Section
                  key={item.name}
                  items={item.children}
                  title={item.name}
                >
                  {item => <Item key={item.name}>{item.name}</Item>}
                </Section>
              )}
            </Menu>
          </MenuTrigger>
          <input data-testid="after-input" />
        </>
      );

      let button = tree.getByRole('button');
      firePress(button);
      act(() => {
        jest.runAllTimers();
      });

      let menu = tree.getByRole('menu');
      expect(menu).toBeTruthy();
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(button).toHaveAttribute('aria-expanded', 'true');

      fireEvent.keyDown(document.activeElement!, { key: 'Tab' });
      act(() => {
        jest.runAllTimers();
      });

      expect(document.activeElement).toBe(tree.getByTestId('after-input'));

      expect(menu).not.toBeInTheDocument();
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(onOpenChange).toHaveBeenCalledTimes(2);
    });

    it('should have a hidden dismiss button for screen readers', function () {
      let { getByRole, getAllByLabelText } = renderWithProvider(
        <MenuTrigger onOpenChange={onOpenChange}>
          <Button>{triggerText}</Button>
          <Menu items={withSection}>
            {item => (
              <Section key={item.name} items={item.children} title={item.name}>
                {item => <Item key={item.name}>{item.name}</Item>}
              </Section>
            )}
          </Menu>
        </MenuTrigger>
      );

      let button = getByRole('button');
      act(() => {
        firePress(button);
      });
      act(() => jest.runAllTimers());

      let menu = getByRole('menu');
      expect(menu).toBeTruthy();
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(button).toHaveAttribute('aria-expanded', 'true');

      let buttons = getAllByLabelText('Dismiss');
      expect(buttons.length).toBe(2);

      act(() => {
        fireEvent.click(buttons[0]);
      });
      act(() => {
        jest.runAllTimers();
      }); // FocusScope useLayoutEffect cleanup
      act(() => {
        jest.runAllTimers();
      }); // FocusScope raf
      expect(onOpenChange).toHaveBeenCalledTimes(2);

      expect(menu).not.toBeInTheDocument();
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(onOpenChange).toHaveBeenCalledTimes(2);
      expect(document.activeElement).toBe(button);
    });

    it('should forward ref to the button', function () {
      let ref = createRef<HTMLElement>();
      let { getByRole } = renderWithProvider(
        <MenuTrigger ref={ref}>
          <Button>{triggerText}</Button>
          <Menu items={withSection}>
            {item => (
              <Section key={item.name} items={item.children} title={item.name}>
                {item => <Item key={item.name}>{item.name}</Item>}
              </Section>
            )}
          </Menu>
        </MenuTrigger>
      );

      expect(ref.current).toBe(getByRole('button'));
    });

    it('works with a ref on both the button and menu trigger', function () {
      let menuTriggerRef = createRef<HTMLElement>();
      let buttonRef = createRef<HTMLButtonElement>();
      let { getByRole } = renderWithProvider(
        <MenuTrigger ref={menuTriggerRef}>
          <Button ref={buttonRef}>{triggerText}</Button>
          <Menu items={withSection}>
            {item => (
              <Section key={item.name} items={item.children} title={item.name}>
                {item => <Item key={item.name}>{item.name}</Item>}
              </Section>
            )}
          </Menu>
        </MenuTrigger>
      );

      expect(menuTriggerRef.current).toBe(getByRole('button'));
      expect(buttonRef.current).toBe(getByRole('button'));
    });
  });

  it('should not show checkmarks if selectionMode not defined', function () {
    let { queryByRole } = render(
      <Menu aria-label="foo" selectedKeys={['alpha']}>
        <Item key="alpha">Alpha</Item>
        <Item key="bravo">Bravo</Item>
      </Menu>
    );
    let checkmark = queryByRole('img', { hidden: true });
    expect(checkmark).toBeNull();
  });

  it('two menus can not be open at the same time', function () {
    let { getAllByRole, getByRole, queryByRole } = renderWithProvider(
      <>
        <MenuTrigger>
          <Button>{triggerText}</Button>
          <Menu items={withSection}>
            <Item key="alpha">Alpha</Item>
            <Item key="bravo">Bravo</Item>
          </Menu>
        </MenuTrigger>
        <MenuTrigger>
          <Button>{triggerText}</Button>
          <Menu items={withSection}>
            <Item key="whiskey">Whiskey</Item>
            <Item key="tango">Tango</Item>
            <Item key="foxtrot">Foxtrot</Item>
          </Menu>
        </MenuTrigger>
      </>
    );
    let [button1, button2] = getAllByRole('button');
    firePress(button1);
    act(() => jest.runAllTimers());
    let menu = getByRole('menu');
    let menuItem1 = within(menu).getByText('Alpha');
    expect(menuItem1).toBeInTheDocument();

    // pressing once on button 2 should close menu1, but not open menu2 yet
    firePress(button2);
    act(() => {
      jest.runAllTimers();
    }); // FocusScope useLayoutEffect cleanup
    act(() => {
      jest.runAllTimers();
    }); // FocusScope raf
    expect(queryByRole('menu')).toBeNull();

    // second press of button2 should open menu2
    firePress(button2);
    act(() => jest.runAllTimers());
    let menu2 = getByRole('menu');
    let menu2Item1 = within(menu2).getByText('Whiskey');
    expect(menu2Item1).toBeInTheDocument();
  });

  describe('trigger="longPress" open behavior', function () {
    installPointerEvent();

    const ERROR_MENU_NOT_FOUND = new Error('Menu not found');
    const getMenuOrThrow = (tree: RenderResult, button: HTMLElement) => {
      try {
        let menu = tree.getByRole('menu');
        expect(menu).toBeTruthy();
        expect(menu).toHaveAttribute('aria-labelledby', button.id);
      } catch (e) {
        throw ERROR_MENU_NOT_FOUND;
      }
    };

    it('should open the menu on longPress', function () {
      verifyMenuToggle(
        { onOpenChange, trigger: 'longPress' },
        {},
        (button, menu) => {
          expect(button).toHaveAttribute('aria-describedby');
          expect(
            document.getElementById(button.getAttribute('aria-describedby')!)
          ).toHaveTextContent(
            'Long press or press Alt + ArrowDown to open menu'
          );

          if (!menu) {
            fireLongPress(button);
          } else {
            fireTouch(button);
          }
        }
      );
    });

    it('should not open menu on click', function () {
      let tree = renderComponent({ onOpenChange, trigger: 'longPress' });
      let button = tree.getByRole('button');

      act(() => {
        fireTouch(button);
        setTimeout(
          () => {
            expect(getMenuOrThrow).toThrow(ERROR_MENU_NOT_FOUND);
          },
          0,
          tree,
          button
        );
        jest.runAllTimers();
      });
    });

    it(`should not open menu on short press (default threshold set to ${DEFAULT_LONG_PRESS_TIME}ms)`, function () {
      let tree = renderComponent({ onOpenChange, trigger: 'longPress' });
      let button = tree.getByRole('button');

      act(() => {
        fireTouch(button);
        setTimeout(
          () => {
            expect(getMenuOrThrow).toThrow(ERROR_MENU_NOT_FOUND);
          },
          DEFAULT_LONG_PRESS_TIME / 2,
          tree,
          button
        );
        jest.runAllTimers();
      });
    });

    it('should not open the menu on Enter', function () {
      let tree = renderComponent({ onOpenChange, trigger: 'longPress' });
      let button = tree.getByRole('button');
      act(() => {
        fireTouch(button);
        setTimeout(
          () => {
            expect(getMenuOrThrow).toThrow(ERROR_MENU_NOT_FOUND);
          },
          0,
          tree,
          button
        );
        jest.runAllTimers();
      });
    });

    it('should not open the menu on Space', function () {
      let tree = renderComponent({ onOpenChange, trigger: 'longPress' });
      let button = tree.getByRole('button');
      act(() => {
        fireTouch(button);
        setTimeout(
          () => {
            expect(getMenuOrThrow).toThrow(ERROR_MENU_NOT_FOUND);
          },
          0,
          tree,
          button
        );
        jest.runAllTimers();
      });
    });

    it('should open the menu on Alt+ArrowUp', function () {
      verifyMenuToggle(
        { onOpenChange, trigger: 'longPress' },
        {},
        (button, menu) => {
          if (!menu) {
            fireEvent.keyDown(button, { key: 'ArrowUp', altKey: true });
          } else {
            fireTouch(button);
          }
        }
      );
    });

    it('should open the menu on Alt+ArrowDown', function () {
      verifyMenuToggle(
        { onOpenChange, trigger: 'longPress' },
        {},
        (button, menu) => {
          if (!menu) {
            fireEvent.keyDown(button, { key: 'ArrowDown', altKey: true });
          } else {
            fireTouch(button);
          }
        }
      );
    });
  });

  describe('trigger="longPress" focus behavior', function () {
    installPointerEvent();

    function expectMenuItemToBeActive(
      tree: RenderResult,
      idx: number,
      selectionMode: SelectionMode
    ) {
      let menuItemRole = 'menuitem';
      if (selectionMode === 'multiple') {
        menuItemRole = 'menuitemcheckbox';
      } else if (selectionMode === 'single') {
        menuItemRole = 'menuitemradio';
      }
      let menu = tree.getByRole('menu');
      expect(menu).toBeTruthy();
      let menuItems = within(menu).getAllByRole(menuItemRole);
      let selectedItem = menuItems[idx < 0 ? menuItems.length + idx : idx];
      expect(selectedItem).toBe(document.activeElement);
      return menu;
    }

    it('should focus the selected item on menu open', async function () {
      let tree = renderComponent(
        { trigger: 'longPress' },
        { selectedKeys: ['Bar'], selectionMode: 'single' }
      );
      let button = tree.getByRole('button');
      act(() => {
        fireLongPress(button);
        jest.runAllTimers();
      });
      let menu = expectMenuItemToBeActive(tree, 1, 'single');
      act(() => {
        fireTouch(button);
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(menu).not.toBeInTheDocument();
      });

      // Opening menu via Alt+ArrowUp still autofocuses the selected item
      fireEvent.keyDown(button, { key: 'ArrowUp', altKey: true });
      menu = expectMenuItemToBeActive(tree, 1, 'single');

      act(() => {
        fireTouch(button);
        jest.runAllTimers();
      });
      await waitFor(() => {
        expect(menu).not.toBeInTheDocument();
      });

      // Opening menu via Alt+ArrowDown still autofocuses the selected item
      fireEvent.keyDown(button, { key: 'ArrowDown', altKey: true });
      menu = expectMenuItemToBeActive(tree, 1, 'single');

      act(() => {
        fireTouch(button);
        jest.runAllTimers();
      });
      await waitFor(() => {
        expect(menu).not.toBeInTheDocument();
      });
    });

    it('should focus the last item on Alt+ArrowUp if no selectedKeys specified', function () {
      let tree = renderComponent({ trigger: 'longPress' });
      let button = tree.getByRole('button');
      fireEvent.keyDown(button, { key: 'ArrowUp', altKey: true });
      expectMenuItemToBeActive(tree, -1, 'none');
    });

    it('should focus the first item on Alt+ArrowDown if no selectedKeys specified', function () {
      let tree = renderComponent({ trigger: 'longPress' });
      let button = tree.getByRole('button');
      fireEvent.keyDown(button, { key: 'ArrowDown', altKey: true });
      expectMenuItemToBeActive(tree, 0, 'none');
    });
  });
});

function renderComponent<T>(
  triggerProps: Partial<MenuTriggerProps> = {},
  menuProps: Partial<Omit<MenuProps<T>, 'items'>> = {},
  buttonProps: Partial<ButtonProps> = {}
) {
  return renderWithProvider(
    <MenuTrigger {...triggerProps}>
      <Button {...buttonProps}>{triggerText}</Button>
      <Menu
        items={[
          {
            name: 'Heading 1',
            children: [{ name: 'Foo' }, { name: 'Bar' }, { name: 'Baz' }],
          },
          { name: 'Heading 2', children: [{ name: 'Blah' }, { name: 'Bleh' }] },
        ]}
        {...menuProps}
      >
        {item => (
          <Section key={item.name} items={item.children} title={item.name}>
            {item => <Item key={item.name}>{item.name}</Item>}
          </Section>
        )}
      </Menu>
    </MenuTrigger>
  );
}
