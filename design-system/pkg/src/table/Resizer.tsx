import { FocusRing } from '@react-aria/focus';
import { useLocale, useLocalizedStringFormatter } from '@react-aria/i18n';
import { useUNSTABLE_PortalContext } from '@react-aria/overlays';
import { useTableColumnResize } from '@react-aria/table';
import { mergeProps, useObjectRef } from '@react-aria/utils';
import { TableColumnResizeState } from '@react-stately/table';
import { GridNode } from '@react-types/grid';
import { Key, RefObject } from '@react-types/shared';
import { ColumnSize } from '@react-types/table';
import React, {
  createContext,
  ForwardedRef,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import ReactDOM from 'react-dom';

import { useTableContext, useVirtualizerContext } from './context';
import localizedMessages from './l10n';
import {
  columnResizerClassname,
  columnResizerPlaceholderClassname,
} from './styles';

interface ResizerProps<T> {
  column: GridNode<T>;
  showResizer: boolean;
  triggerRef: RefObject<HTMLDivElement | null>;
  onResizeStart: (widths: Map<Key, ColumnSize>) => void;
  onResize: (widths: Map<Key, ColumnSize>) => void;
  onResizeEnd: (widths: Map<Key, ColumnSize>) => void;
}

const CURSORS = {
  ew: 'col-resize',
  w: 'w-resize',
  e: 'e-resize',
};

export const ResizeStateContext =
  createContext<TableColumnResizeState<unknown> | null>(null);
export function useResizeStateContext() {
  const context = useContext(ResizeStateContext);
  if (context === null) {
    throw new Error('ResizeStateContext not found');
  }
  return context;
}

function Resizer<T>(
  props: ResizerProps<T>,
  forwardedRef: ForwardedRef<HTMLInputElement | null>
) {
  let { column, showResizer } = props;
  let { isEmpty, onFocusedResizer } = useTableContext();
  let layout = useContext(ResizeStateContext)!;
  // Virtualizer re-renders, but these components are all cached
  // in order to get around that and cause a rerender here, we use context
  // but we don't actually need any value, they are available on the layout object
  useVirtualizerContext();
  let stringFormatter = useLocalizedStringFormatter(localizedMessages);
  let { direction } = useLocale();

  let [isPointerDown, setIsPointerDown] = useState(false);
  useEffect(() => {
    let setDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') {
        setIsPointerDown(true);
      }
    };
    let setUp = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') {
        setIsPointerDown(false);
      }
    };
    document.addEventListener('pointerdown', setDown, { capture: true });
    document.addEventListener('pointerup', setUp, { capture: true });
    return () => {
      document.removeEventListener('pointerdown', setDown, { capture: true });
      document.removeEventListener('pointerup', setUp, { capture: true });
    };
  }, []);

  let domRef = useObjectRef(forwardedRef);
  let { inputProps, resizerProps } = useTableColumnResize<unknown>(
    mergeProps(props, {
      'aria-label': stringFormatter.format('columnResizer'),
      isDisabled: isEmpty,
    }),
    layout,
    domRef
  );

  let isEResizable =
    layout.getColumnMinWidth(column.key) >= layout.getColumnWidth(column.key);
  let isWResizable =
    layout.getColumnMaxWidth(column.key) <= layout.getColumnWidth(column.key);
  let isResizing = layout.resizingColumn === column.key;
  let cursor = '';
  if (isEResizable) {
    cursor = direction === 'rtl' ? CURSORS.w : CURSORS.e;
  } else if (isWResizable) {
    cursor = direction === 'rtl' ? CURSORS.e : CURSORS.w;
  } else {
    cursor = CURSORS.ew;
  }

  let style = {
    ...resizerProps.style,
    height: '100%',
    display: showResizer ? undefined : 'none',
    cursor,
  };

  return (
    <>
      <FocusRing within focusRingClass="focus-ring">
        <div
          {...resizerProps}
          role="presentation"
          style={style}
          className={columnResizerClassname}
        >
          <input
            ref={domRef}
            {...mergeProps(inputProps, { onFocus: onFocusedResizer })}
          />
        </div>
      </FocusRing>
      {/* Placeholder so that the title doesn't intersect with space reserved by the resizer when it appears. */}
      <div
        aria-hidden
        role="presentation"
        className={columnResizerPlaceholderClassname}
      />
      <CursorOverlay show={isResizing && isPointerDown}>
        <div
          style={{
            bottom: 0,
            cursor,
            left: 0,
            position: 'fixed',
            right: 0,
            top: 0,
          }}
        />
      </CursorOverlay>
    </>
  );
}

function CursorOverlay(props: PropsWithChildren<{ show: boolean }>) {
  let { show, children } = props;
  let { getContainer } = useUNSTABLE_PortalContext();
  return show
    ? ReactDOM.createPortal(children, getContainer?.() ?? document.body)
    : null;
}

const _Resizer = React.forwardRef(Resizer);
export { _Resizer as Resizer };
