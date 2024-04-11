import { useBreadcrumbs } from '@react-aria/breadcrumbs';
import {
  useLayoutEffect,
  useObjectRef,
  useResizeObserver,
  useValueEffect,
} from '@react-aria/utils';
import {
  Children,
  ForwardedRef,
  Key,
  ReactElement,
  forwardRef,
  isValidElement,
  useCallback,
  useRef,
  useState,
  Ref,
} from 'react';

import { ActionButton } from '@keystar/ui/button';
import { useProviderProps } from '@keystar/ui/core';
import { Icon } from '@keystar/ui/icon';
import { folderClosedIcon } from '@keystar/ui/icon/icons/folderClosedIcon';
import { folderOpenIcon } from '@keystar/ui/icon/icons/folderOpenIcon';
import { Menu, MenuTrigger } from '@keystar/ui/menu';
import { classNames, css, tokenSchema, useStyleProps } from '@keystar/ui/style';

import { BreadcrumbItem, breadcrumbsClassList } from './BreadcrumbItem';
import { BreadcrumbsProps } from './types';

const MIN_VISIBLE_ITEMS = 1;
const MAX_VISIBLE_ITEMS = 4;

function Breadcrumbs<T>(
  props: BreadcrumbsProps<T>,
  ref: ForwardedRef<HTMLDivElement>
) {
  props = useProviderProps(props);
  let {
    children,
    showRoot,
    size = 'regular',
    isDisabled,
    onAction,
    ...otherProps
  } = props;

  // Not using React.Children.toArray because it mutates the key prop.
  let childArray: ReactElement[] = [];
  Children.forEach(children, child => {
    if (isValidElement(child)) {
      childArray.push(child);
    }
  });

  let domRef = useObjectRef(ref);
  let listRef = useRef<HTMLUListElement>(null);
  let [menuIsOpen, setMenuOpen] = useState(false);

  let [visibleItems, setVisibleItems] = useValueEffect(childArray.length);

  let { navProps } = useBreadcrumbs(props);
  let styleProps = useStyleProps(otherProps);

  let updateOverflow = useCallback(() => {
    let computeVisibleItems = (visibleItems: number): number => {
      // refs may be null at runtime
      let currListRef: HTMLUListElement | null = listRef.current;
      if (!currListRef) {
        return visibleItems;
      }

      let listItems = Array.from(currListRef.children) as HTMLLIElement[];
      if (listItems.length <= 0) {
        return visibleItems;
      }
      let containerWidth = currListRef.offsetWidth;
      let isShowingMenu = childArray.length > visibleItems;
      let calculatedWidth = 0;
      let newVisibleItems = 0;
      let maxVisibleItems = MAX_VISIBLE_ITEMS;

      if (showRoot) {
        calculatedWidth += (listItems.shift() as HTMLLIElement).offsetWidth;
        newVisibleItems++;
      }

      if (isShowingMenu) {
        calculatedWidth += (listItems.shift() as HTMLLIElement).offsetWidth;
        maxVisibleItems--;
      }

      if (showRoot && calculatedWidth >= containerWidth) {
        newVisibleItems--;
      }

      if (listItems.length > 0) {
        // Ensure the last breadcrumb isn't truncated when we measure it.
        let last = listItems.pop() as HTMLLIElement;
        last.style.overflow = 'visible';

        calculatedWidth += last.offsetWidth;
        if (calculatedWidth < containerWidth) {
          newVisibleItems++;
        }

        last.style.overflow = '';
      }

      for (let breadcrumb of listItems.reverse()) {
        calculatedWidth += breadcrumb.offsetWidth;
        if (calculatedWidth < containerWidth) {
          newVisibleItems++;
        }
      }

      return Math.max(
        MIN_VISIBLE_ITEMS,
        Math.min(maxVisibleItems, newVisibleItems)
      );
    };

    setVisibleItems(function* () {
      // Update to show all items.
      yield childArray.length;

      // Measure, and update to show the items that fit.
      let newVisibleItems = computeVisibleItems(childArray.length);
      yield newVisibleItems;

      // If the number of items is less than the number of children,
      // then update again to ensure that the menu fits.
      if (newVisibleItems < childArray.length && newVisibleItems > 1) {
        yield computeVisibleItems(newVisibleItems);
      }
    });
  }, [childArray.length, setVisibleItems, showRoot]);

  useResizeObserver({ ref: domRef, onResize: updateOverflow });

  let lastChildren = useRef<typeof children | null>(null);
  useLayoutEffect(() => {
    if (children !== lastChildren.current) {
      lastChildren.current = children;
      updateOverflow();
    }
  });

  let contents = childArray;
  if (childArray.length > visibleItems) {
    let selectedItem = childArray[childArray.length - 1];
    let selectedKey = selectedItem.key ?? childArray.length - 1;
    let onMenuAction = (key: Key) => {
      // Don't fire onAction when clicking on the last item
      if (key !== selectedKey && onAction) {
        onAction(key);
      }
    };

    let menuItem = (
      <BreadcrumbItem key="menu" isMenu>
        <MenuTrigger onOpenChange={setMenuOpen}>
          <ActionButton aria-label="…" prominence="low" isDisabled={isDisabled}>
            <Icon src={menuIsOpen ? folderOpenIcon : folderClosedIcon} />
          </ActionButton>
          <Menu
            selectionMode="single"
            selectedKeys={[selectedKey]}
            onAction={onMenuAction}
          >
            {childArray}
          </Menu>
        </MenuTrigger>
      </BreadcrumbItem>
    );

    contents = [menuItem];
    let breadcrumbs = [...childArray];
    let endItems = visibleItems;
    if (showRoot && visibleItems > 1) {
      let rootItem = breadcrumbs.shift();
      if (rootItem) {
        contents.unshift(rootItem);
      }
      endItems--;
    }
    contents.push(...breadcrumbs.slice(-endItems));
  }

  let lastIndex = contents.length - 1;
  let breadcrumbItems = contents.map((child, index) => {
    let isCurrent = index === lastIndex;
    let key = child.key ?? index;
    let onPress = () => {
      if (onAction) {
        onAction(key);
      }
    };

    return (
      <li
        key={index}
        className={classNames(
          breadcrumbsClassList.element('item'),
          css({
            alignItems: 'center',
            display: 'inline-flex',
            whiteSpace: 'nowrap',

            '&:last-child': { overflow: 'hidden' },
          })
        )}
      >
        <BreadcrumbItem
          {...child.props}
          isCurrent={isCurrent}
          isDisabled={isDisabled}
          key={key}
          onPress={onPress}
          size={size}
        >
          {child.props.children}
        </BreadcrumbItem>
      </li>
    );
  });

  return (
    <nav
      {...navProps}
      {...styleProps}
      ref={domRef}
      className={classNames(
        breadcrumbsClassList.element('root'),
        styleProps.className
      )}
    >
      <ul
        ref={listRef}
        className={classNames(
          breadcrumbsClassList.element('list'),
          css({
            display: 'flex',
            height: tokenSchema.size.element.regular,
            justifyContent: 'flex-start',
          })
        )}
      >
        {breadcrumbItems}
      </ul>
    </nav>
  );
}

// forwardRef doesn't support generic parameters, so cast the result to the correct type
// https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref

/**
 * Breadcrumbs show hierarchy and navigational context for a user's location
 * within an application.
 */
const _Breadcrumbs: <T>(
  props: BreadcrumbsProps<T> & { ref?: Ref<HTMLDivElement> }
) => ReactElement = forwardRef(Breadcrumbs) as any;
export { _Breadcrumbs as Breadcrumbs };
