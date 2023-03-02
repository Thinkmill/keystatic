import { useBreadcrumbs } from '@react-aria/breadcrumbs';
import {
  useLayoutEffect,
  useObjectRef,
  useResizeObserver,
  useValueEffect,
} from '@react-aria/utils';
import { isNumber } from 'emery';
import React, {
  ForwardedRef,
  Key,
  ReactElement,
  useCallback,
  useRef,
} from 'react';

import { ActionButton } from '@voussoir/button';
import { moreHorizontalIcon } from '@voussoir/icon/icons/moreHorizontalIcon';
import { useProviderProps } from '@voussoir/core';
import { Menu, MenuTrigger } from '@voussoir/menu';
import { classNames, css, tokenSchema, useStyleProps } from '@voussoir/style';

import { BreadcrumbItem, breadcrumbsClassList } from './BreadcrumbItem';
import { BreadcrumbsProps } from './types';
import { Icon } from '@voussoir/icon';

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
  React.Children.forEach(children, child => {
    if (React.isValidElement(child)) {
      childArray.push(child);
    }
  });

  let domRef = useObjectRef(ref);
  let listRef = useRef<HTMLUListElement>(null);

  let [visibleItems, setVisibleItems] = useValueEffect(childArray.length);

  let { navProps } = useBreadcrumbs(props);
  let styleProps = useStyleProps(otherProps);

  let updateOverflow = useCallback(() => {
    let computeVisibleItems = (visibleItems: number) => {
      let currListRef = listRef.current;
      if (!currListRef) {
        return;
      }

      let listItems = Array.from(currListRef.children) as HTMLLIElement[];
      let containerWidth = currListRef.offsetWidth;
      let isShowingMenu = childArray.length > visibleItems;
      let calculatedWidth = 0;
      let newVisibleItems = 0;
      let maxVisibleItems = MAX_VISIBLE_ITEMS;

      if (showRoot) {
        let el = listItems.shift();
        if (el) {
          calculatedWidth += el.offsetWidth;
          newVisibleItems++;
        }
      }

      if (isShowingMenu) {
        let el = listItems.shift();
        if (el) {
          calculatedWidth += el.offsetWidth;
          maxVisibleItems--;
        }
      }

      if (showRoot && calculatedWidth >= containerWidth) {
        newVisibleItems--;
      }

      if (listItems.length > 0) {
        // Ensure the last breadcrumb isn't truncated when we measure it.
        let last = listItems.pop();
        if (last) {
          last.style.overflow = 'visible';

          calculatedWidth += last.offsetWidth;
          if (calculatedWidth < containerWidth) {
            newVisibleItems++;
          }

          last.style.overflow = '';
        }
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
      if (
        isNumber(newVisibleItems) &&
        newVisibleItems < childArray.length &&
        newVisibleItems > 1
      ) {
        yield computeVisibleItems(newVisibleItems);
      }
    });
  }, [childArray.length, setVisibleItems, showRoot]);

  useResizeObserver({ ref: domRef, onResize: updateOverflow });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(updateOverflow, [children]);

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
      <BreadcrumbItem key="menu">
        <MenuTrigger>
          <ActionButton aria-label="…" prominence="low" isDisabled={isDisabled}>
            <Icon src={moreHorizontalIcon} />
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
      let el = breadcrumbs.shift();
      if (el) {
        contents.unshift(el);
        endItems--;
      }
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
          breadcrumbsClassList.declare('item'),
          css({
            alignItems: 'center',
            display: 'inline-flex',
            whiteSpace: 'nowrap',

            '&:last-child': { overflow: 'hidden' },
          })
        )}
      >
        <BreadcrumbItem
          key={key}
          isCurrent={isCurrent}
          isDisabled={isDisabled}
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
      {...styleProps}
      {...navProps}
      ref={domRef}
      className={breadcrumbsClassList.root()}
    >
      <ul
        ref={listRef}
        className={classNames(
          breadcrumbsClassList.declare('list'),
          css({
            display: 'flex',
            height: tokenSchema.size.element.regular,
            justifyContent: 'flex-start',
          }),
          styleProps.className
        )}
      >
        {breadcrumbItems}
      </ul>
    </nav>
  );
}

/**
 * Breadcrumbs show hierarchy and navigational context for a user’s location within an application.
 */
let _Breadcrumbs = React.forwardRef(Breadcrumbs);
export { _Breadcrumbs as Breadcrumbs };
