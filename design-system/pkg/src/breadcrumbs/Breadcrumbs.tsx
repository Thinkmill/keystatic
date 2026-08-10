import { type Collection, type Key, type Node } from '@react-types/shared';
import {
  CollectionRendererContext,
  type CollectionRenderer,
} from 'react-aria-components/CollectionBuilder';
import { Breadcrumbs as AriaBreadcrumbs } from 'react-aria-components/Breadcrumbs';
import {
  type ForwardedRef,
  type ReactElement,
  type RefObject,
  Fragment,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useObjectRef } from 'react-aria/useObjectRef';

import { ActionButton } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { moreHorizontalIcon } from '@keystar/ui/icon/icons/moreHorizontalIcon';
import { Menu, MenuItem, MenuTrigger } from '@keystar/ui/menu';
import { classNames, css, useStyleProps } from '@keystar/ui/style';

import { breadcrumbsClassList } from './BreadcrumbItem';
import { BreadcrumbsStyleContext } from './context';
import type { BreadcrumbsProps } from './types';

const MAX_VISIBLE_ITEMS = 4;

const CollapseContext = createContext<{
  containerRef: RefObject<HTMLOListElement | null>;
  onAction?: (key: Key) => void;
  isDisabled?: boolean;
} | null>(null);

const CollapsingCollectionRenderer: CollectionRenderer = {
  CollectionRoot({ collection }) {
    return <CollapsingCollection collection={collection} />;
  },
  CollectionBranch({ collection }) {
    return <CollapsingCollection collection={collection} />;
  },
};

function Breadcrumbs<T extends object>(
  props: BreadcrumbsProps<T>,
  forwardedRef: ForwardedRef<HTMLOListElement>
) {
  let { size = 'regular', ...otherProps } = props;
  let styleProps = useStyleProps(props);
  let domRef = useObjectRef(forwardedRef);

  return (
    <BreadcrumbsStyleContext.Provider value={{ size }}>
      <CollapseContext.Provider
        value={{
          containerRef: domRef,
          onAction: props.onAction,
          isDisabled: props.isDisabled,
        }}
      >
        <CollectionRendererContext.Provider
          value={CollapsingCollectionRenderer}
        >
          <AriaBreadcrumbs
            {...otherProps}
            {...styleProps}
            ref={domRef}
            className={classNames(
              breadcrumbsClassList.element('list'),
              css({
                alignItems: 'center',
                display: 'flex',
                listStyle: 'none',
                margin: 0,
                minWidth: 0,
                padding: 0,
              }),
              styleProps.className
            )}
          />
        </CollectionRendererContext.Provider>
      </CollapseContext.Provider>
    </BreadcrumbsStyleContext.Provider>
  );
}

function CollapsingCollection({
  collection,
}: {
  collection: Collection<Node<unknown>>;
}) {
  let context = useContext(CollapseContext);
  let [visibleCount, setVisibleCount] = useState(collection.size);
  let needsMeasure = useRef(true);
  let menuRef = useRef<HTMLButtonElement>(null);
  let items = useMemo(
    () => Array.from(collection.getKeys(), key => collection.getItem(key)!),
    [collection]
  );

  let updateOverflow = useCallback(() => {
    let container = context?.containerRef.current;
    if (!container || !container.offsetWidth) {
      setVisibleCount(collection.size);
      return;
    }
    if (!needsMeasure.current) return;

    let items = Array.from(container.children).filter(
      (element): element is HTMLLIElement =>
        element instanceof HTMLLIElement && element.hasAttribute('data-rac')
    );
    if (items.length !== collection.size) return;

    let itemWidths = items.map(item => item.offsetWidth);
    let menuWidth = menuRef.current?.offsetWidth;
    if (!menuWidth) return;

    let gap = Number.parseFloat(getComputedStyle(container).gap) || 0;
    let allWidth = itemWidths.reduce((sum, width) => sum + width, 0);
    if (
      collection.size <= MAX_VISIBLE_ITEMS &&
      allWidth + gap * Math.max(0, collection.size - 1) <= container.offsetWidth
    ) {
      needsMeasure.current = false;
      setVisibleCount(collection.size);
      return;
    }

    let available = container.offsetWidth - itemWidths[0] - menuWidth - gap * 2;
    // Count the visible trailing items. The first item and the overflow menu
    // are accounted for separately when rendering below.
    let count = 0;
    for (let width of itemWidths.slice(1).reverse()) {
      if (available < width) break;
      available -= width + gap;
      count++;
      if (count >= MAX_VISIBLE_ITEMS - 2) break;
    }
    needsMeasure.current = false;
    setVisibleCount(Math.max(1, count));
  }, [collection.size, context]);

  useEffect(() => {
    needsMeasure.current = true;
    setVisibleCount(collection.size);
  }, [collection]);

  useEffect(() => {
    updateOverflow();
    let container = context?.containerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') return;
    let observer = new ResizeObserver(() => {
      needsMeasure.current = true;
      setVisibleCount(collection.size);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [collection.size, context, updateOverflow, visibleCount]);

  useEffect(() => {
    document.fonts?.ready.then(() => {
      needsMeasure.current = true;
      updateOverflow();
    });
  }, [updateOverflow]);

  let sliceIndex = collection.size - visibleCount;
  let hasOverflow = visibleCount < collection.size && collection.size > 2;
  let overflowItems = hasOverflow ? items.slice(1, sliceIndex) : [];

  return (
    <>
      <li
        aria-hidden="true"
        className={css({
          left: 0,
          pointerEvents: 'none',
          position: 'absolute',
          top: 0,
          visibility: 'hidden',
        })}
      >
        <ActionButton ref={menuRef} aria-label="More breadcrumbs">
          <Icon src={moreHorizontalIcon} />
        </ActionButton>
      </li>
      {hasOverflow ? (
        <>
          {items[0]?.render?.(items[0])}
          <li className={breadcrumbsClassList.element('item')}>
            <MenuTrigger>
              <ActionButton
                aria-label="More breadcrumbs"
                isDisabled={context?.isDisabled}
                prominence="low"
              >
                <Icon src={moreHorizontalIcon} />
              </ActionButton>
              <Menu onAction={context?.onAction}>
                {overflowItems.map(item => (
                  <MenuItem
                    id={item.key}
                    key={item.key}
                    textValue={item.textValue}
                  >
                    {item.rendered}
                  </MenuItem>
                ))}
              </Menu>
            </MenuTrigger>
          </li>
          {items.slice(sliceIndex).map(item => (
            <Fragment key={item.key}>{item.render?.(item)}</Fragment>
          ))}
        </>
      ) : (
        items.map(item => (
          <Fragment key={item.key}>{item.render?.(item)}</Fragment>
        ))
      )}
    </>
  );
}

const _Breadcrumbs = forwardRef(Breadcrumbs) as <T extends object>(
  props: BreadcrumbsProps<T> & { ref?: ForwardedRef<HTMLOListElement> }
) => ReactElement;
export { _Breadcrumbs as Breadcrumbs };
