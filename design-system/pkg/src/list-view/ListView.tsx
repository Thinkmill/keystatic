import { GridList, GridListLoadMoreItem } from 'react-aria-components/GridList';
import {
  ListLayout,
  type ListLayoutOptions,
  Virtualizer,
} from 'react-aria-components/Virtualizer';
import React, {
  createContext,
  type ForwardedRef,
  type ReactElement,
  type ReactNode,
  useMemo,
} from 'react';
import { useLocalizedStringFormatter } from 'react-aria/useLocalizedStringFormatter';

import { useProvider } from '@keystar/ui/core';
import { ProgressCircle } from '@keystar/ui/progress';
import {
  classNames,
  css,
  toDataAttributes,
  tokenSchema,
  useStyleProps,
} from '@keystar/ui/style';

import { listViewClassList } from './class-list';
import localizedMessages from './l10n';
import type { ListViewLoadMoreItemProps, ListViewProps } from './types';

const ROW_HEIGHTS = {
  compact: { medium: 32, large: 40 },
  regular: { medium: 40, large: 50 },
  spacious: { medium: 48, large: 60 },
} as const;

export const ListViewContext = createContext({
  density: 'regular' as NonNullable<ListViewProps<object>['density']>,
  hasActions: false,
  overflowMode: 'truncate' as NonNullable<
    ListViewProps<object>['overflowMode']
  >,
});

function ListView<T extends object>(
  props: ListViewProps<T>,
  ref: ForwardedRef<HTMLDivElement>
) {
  let {
    density = 'regular',
    overflowMode = 'truncate',
    onAction,
    dragAndDropHooks,
    renderEmptyState,
    selectionStyle = 'checkbox',
    ...otherProps
  } = props;
  let selectionBehavior: 'replace' | 'toggle' =
    selectionStyle === 'highlight' ? 'replace' : 'toggle';
  let { layout, layoutOptions } = useListLayout<T>(density, overflowMode);
  let styleProps = useStyleProps(props);

  return (
    <ListViewContext.Provider
      value={{ density, hasActions: !!onAction, overflowMode }}
    >
      <Virtualizer
        layout={layout}
        layoutOptions={layoutOptions}
        shouldObserveItemSize={overflowMode === 'wrap'}
      >
        <GridList
          {...otherProps}
          {...styleProps}
          {...toDataAttributes({
            density,
            draggable: !!dragAndDropHooks?.useDraggableCollectionState,
            overflowMode,
          })}
          ref={ref}
          className={classNames(
            listViewClassList.element('root'),
            css({
              backgroundColor: tokenSchema.color.background.canvas,
              border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.neutral}`,
              borderRadius: tokenSchema.size.radius.medium,
              boxSizing: 'content-box',
              outline: 0,
              overflow: 'auto',
              position: 'relative',
              transform: 'translate3d(0, 0, 0)',
              userSelect: 'none',

              '&[data-drop-target=true]': {
                borderColor: tokenSchema.color.alias.focusRing,
                backgroundColor: tokenSchema.color.alias.backgroundSelected,
                boxShadow: `inset 0 0 0 1px ${tokenSchema.color.alias.focusRing}`,
              },
              '&[data-focus-visible]': {
                borderColor: tokenSchema.color.alias.focusRing,
                boxShadow: `inset 0 0 0 1px ${tokenSchema.color.alias.focusRing}`,
              },
            }),
            styleProps.className
          )}
          dragAndDropHooks={dragAndDropHooks}
          onAction={onAction}
          selectionBehavior={selectionBehavior}
          renderEmptyState={
            renderEmptyState
              ? states => (
                  <CenteredWrapper>{renderEmptyState(states)}</CenteredWrapper>
                )
              : undefined
          }
        />
      </Virtualizer>
    </ListViewContext.Provider>
  );
}

const _ListView = React.forwardRef(ListView) as <T extends object>(
  props: ListViewProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReactElement;

export { _ListView as ListView };

export function ListViewLoadMoreItem(props: ListViewLoadMoreItemProps) {
  let stringFormatter = useLocalizedStringFormatter(localizedMessages);
  let {
    children,
    isLoading,
    'aria-label': ariaLabel = stringFormatter.format('loadingMore'),
    ...otherProps
  } = props;
  let styleProps = useStyleProps(props);
  return (
    <GridListLoadMoreItem {...otherProps} {...styleProps} isLoading={isLoading}>
      {children ??
        (isLoading ? (
          <CenteredWrapper>
            <ProgressCircle isIndeterminate aria-label={ariaLabel} />
          </CenteredWrapper>
        ) : null)}
    </GridListLoadMoreItem>
  );
}

function useListLayout<T>(
  density: NonNullable<ListViewProps<T>['density']>,
  overflowMode: ListViewProps<T>['overflowMode']
) {
  let { scale } = useProvider();
  return useMemo(() => {
    let layoutOptions: ListLayoutOptions = {
      estimatedRowSize:
        overflowMode === 'wrap' ? undefined : ROW_HEIGHTS[density][scale],
    };
    return {
      layout: new ListLayout<T>(layoutOptions),
      layoutOptions,
    };
  }, [scale, density, overflowMode]);
}

function CenteredWrapper({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        alignItems: 'center',
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        width: '100%',
      })}
    >
      {children}
    </div>
  );
}
