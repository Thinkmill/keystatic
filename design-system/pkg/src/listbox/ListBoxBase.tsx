import { FocusScope } from '@react-aria/focus';
import { useListBox } from '@react-aria/listbox';
import { useCollator, useLocalizedStringFormatter } from '@react-aria/i18n';
import { mergeProps } from '@react-aria/utils';
import { Virtualizer, VirtualizerItem } from '@react-aria/virtualizer';
import { ListLayout } from '@react-stately/layout';
import { ListState } from '@react-stately/list';
import { ReusableView } from '@react-stately/virtualizer';
import { Node } from '@react-types/shared';
import { RefObject, forwardRef, ReactElement, ReactNode, useMemo } from 'react';

import { useProvider } from '@keystar/ui/core';
import { ProgressCircle } from '@keystar/ui/progress';
import { useStyleProps } from '@keystar/ui/style';

import localizedMessages from './l10n.json';
import { ListBoxContext } from './context';
import { ListBoxOption } from './ListBoxOption';
import { ListBoxSection } from './ListBoxSection';
import { ListBoxBaseProps } from './types';

/** @private */
export function useListBoxLayout<T>(state: ListState<T>) {
  let { scale } = useProvider();
  let collator = useCollator({ usage: 'search', sensitivity: 'base' });
  let layout = useMemo(
    () =>
      new ListLayout<T>({
        estimatedRowHeight: scale === 'large' ? 48 : 32,
        estimatedHeadingHeight: scale === 'large' ? 33 : 26,
        padding: scale === 'large' ? 5 : 4,
        loaderHeight: 40,
        placeholderHeight: scale === 'large' ? 48 : 32,
        collator,
      }),
    [collator, scale]
  );

  layout.collection = state.collection;
  layout.disabledKeys = state.disabledKeys;
  return layout;
}

/** @private */
function ListBoxBase<T>(
  props: ListBoxBaseProps<T>,
  forwardedRef: RefObject<HTMLDivElement>
) {
  let {
    layout,
    state,
    shouldSelectOnPressUp,
    focusOnPointerEnter,
    shouldUseVirtualFocus,
    domProps = {},
    transitionDuration = 0,
    onScroll,
  } = props;
  let { listBoxProps } = useListBox(
    {
      ...props,
      keyboardDelegate: layout,
      isVirtualized: true,
    },
    state,
    forwardedRef
  );
  let styleProps = useStyleProps(props);
  let stringFormatter = useLocalizedStringFormatter(localizedMessages);

  // Sync loading state into the layout.
  layout.isLoading = !!props.isLoading;

  // This overrides collection view's renderWrapper to support heirarchy of items in sections.
  // The header is extracted from the children so it can receive ARIA labeling properties.
  type View = ReusableView<Node<T>, ReactNode>;
  let renderWrapper = (
    parent: View | null,
    reusableView: View,
    children: View[],
    renderChildren: (views: View[]) => ReactElement[]
  ) => {
    if (reusableView.viewType === 'section') {
      return (
        <ListBoxSection
          key={reusableView.key}
          item={reusableView.content}
          layoutInfo={reusableView.layoutInfo!}
          virtualizer={reusableView.virtualizer}
          headerLayoutInfo={
            children.find(c => c.viewType === 'header')?.layoutInfo!
          }
        >
          {renderChildren(children.filter(c => c.viewType === 'item'))}
        </ListBoxSection>
      );
    }

    return (
      <VirtualizerItem
        key={reusableView.key}
        layoutInfo={reusableView.layoutInfo!}
        virtualizer={reusableView.virtualizer}
        parent={parent?.layoutInfo!}
      >
        {reusableView.rendered}
      </VirtualizerItem>
    );
  };

  return (
    <ListBoxContext.Provider value={state}>
      <FocusScope>
        <Virtualizer
          {...styleProps}
          {...mergeProps(listBoxProps, domProps)}
          ref={forwardedRef}
          focusedKey={state.selectionManager.focusedKey}
          autoFocus={!!props.autoFocus}
          sizeToFit="height"
          scrollDirection="vertical"
          layout={layout}
          collection={state.collection}
          renderWrapper={renderWrapper}
          transitionDuration={transitionDuration}
          isLoading={props.isLoading}
          onLoadMore={props.onLoadMore}
          shouldUseVirtualFocus={shouldUseVirtualFocus}
          onScroll={onScroll}
        >
          {(type, item: Node<T>) => {
            if (type === 'item') {
              return (
                <ListBoxOption
                  item={item}
                  shouldSelectOnPressUp={shouldSelectOnPressUp}
                  shouldFocusOnHover={focusOnPointerEnter}
                  shouldUseVirtualFocus={shouldUseVirtualFocus}
                />
              );
            } else if (type === 'loader') {
              return (
                <div
                  role="option"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                  }}
                >
                  <ProgressCircle
                    isIndeterminate
                    size="small"
                    aria-label={
                      state.collection.size > 0
                        ? stringFormatter.format('loadingMore')
                        : stringFormatter.format('loading')
                    }
                  />
                </div>
              );
            } else if (type === 'placeholder') {
              let emptyState = props.renderEmptyState
                ? props.renderEmptyState()
                : null;
              if (emptyState == null) {
                return null;
              }

              return <div role="option">{emptyState}</div>;
            }
          }}
        </Virtualizer>
      </FocusScope>
    </ListBoxContext.Provider>
  );
}

// forwardRef doesn't support generic parameters, so cast the result to the correct type
// https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref
const _ListBoxBase: <T>(
  props: ListBoxBaseProps<T> & { ref?: RefObject<HTMLDivElement> }
) => ReactElement = forwardRef(ListBoxBase as any) as any;
export { _ListBoxBase as ListBoxBase };
