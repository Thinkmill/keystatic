import React, {
  type ForwardedRef,
  type ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { FocusScope } from '@react-aria/focus';
import { useLocale, useLocalizedStringFormatter } from '@react-aria/i18n';
import { ListKeyboardDelegate } from '@react-aria/selection';
import { AriaTagGroupProps, useTagGroup } from '@react-aria/tag';
import {
  useId,
  useLayoutEffect,
  useObjectRef,
  useResizeObserver,
  useValueEffect,
} from '@react-aria/utils';
import { ListCollection, useListState } from '@react-stately/list';
import type { Collection, Node } from '@react-types/shared';

import {
  type BaseStyleProps,
  FocusRing,
  css,
  tokenSchema,
} from '@keystar/ui/style';

import { ActionButton } from '@keystar/ui/button';
import { KeystarProvider, useProviderProps } from '@keystar/ui/core';
import { type FieldProps, FieldPrimitive } from '@keystar/ui/field';
import { SlotProvider } from '@keystar/ui/slots';
import { Text } from '@keystar/ui/typography';

import localizedMessages from './l10n';
import { gapVar, heightVar, radiusVar, tokenValues } from './styles';
import { Tag } from './Tag';

export interface TagGroupProps<T>
  extends Omit<
      AriaTagGroupProps<T>,
      | 'defaultSelectedKeys'
      | 'disallowEmptySelection'
      | 'onSelectionChange'
      | 'selectedKeys'
      | 'selectionBehavior'
      | 'selectionMode'
    >,
    BaseStyleProps,
    FieldProps {
  /** The label to display on the action button.  */
  actionLabel?: string;
  /** Handler that is called when the action button is pressed. */
  onAction?: () => void;
  /** Sets what the TagGroup should render when there are no tags to display. */
  renderEmptyState?: () => ReactElement;
  /** Limit the number of rows initially shown. This will render a button that allows the user to expand to show all tags. */
  maxRows?: number;
}

function TagGroup<T extends object>(
  props: TagGroupProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  props = useProviderProps(props);
  // props = useFormProps(props);
  let {
    maxRows,
    children,
    actionLabel,
    onAction,
    renderEmptyState: renderEmptyStateProp,
  } = props;
  let domRef = useObjectRef(forwardedRef);
  let containerRef = useRef<HTMLDivElement | null>(null);
  let tagsRef = useRef<HTMLDivElement | null>(null);
  let { direction } = useLocale();

  let stringFormatter = useLocalizedStringFormatter(localizedMessages);
  let [isCollapsed, setIsCollapsed] = useState(maxRows != null);
  let state = useListState(props);
  let [tagState, setTagState] = useValueEffect({
    visibleTagCount: state.collection.size,
    showCollapseButton: false,
  });
  let renderEmptyState = useMemo(() => {
    if (renderEmptyStateProp) {
      return renderEmptyStateProp;
    }
    return () => (
      <Text marginStart="regular" trim={false}>
        {stringFormatter.format('noTags')}
      </Text>
    );
  }, [stringFormatter, renderEmptyStateProp]);
  let keyboardDelegate = useMemo(() => {
    let collection = (
      isCollapsed
        ? new ListCollection(
            [...state.collection].slice(0, tagState.visibleTagCount)
          )
        : new ListCollection([...state.collection])
    ) as Collection<Node<T>>;
    return new ListKeyboardDelegate({
      collection,
      ref: domRef,
      direction,
      orientation: 'horizontal',
    });
  }, [
    direction,
    isCollapsed,
    state.collection,
    tagState.visibleTagCount,
    domRef,
  ]) as ListKeyboardDelegate<T>;
  // Remove onAction from props so it doesn't make it into useGridList.
  delete props.onAction;
  const { gridProps, labelProps, descriptionProps, errorMessageProps } =
    useTagGroup({ ...props, keyboardDelegate }, state, tagsRef);
  const actionsId = useId();
  const actionsRef = useRef<HTMLDivElement>(null);

  let updateVisibleTagCount = useCallback(() => {
    if (maxRows && maxRows > 0) {
      let computeVisibleTagCount = () => {
        const containerEl = containerRef.current;
        const tagsEl = tagsRef.current;
        const actionsEl = actionsRef.current;
        if (
          !containerEl ||
          !tagsEl ||
          !actionsEl ||
          state.collection.size === 0
        ) {
          return {
            visibleTagCount: 0,
            showCollapseButton: false,
          };
        }

        // Count rows and show tags until we hit the maxRows.
        let tags = [...tagsEl.children];
        let currY = -Infinity;
        let rowCount = 0;
        let index = 0;
        const tagWidths: number[] = [];
        for (let tag of tags) {
          let { width, y } = tag.getBoundingClientRect();

          if (y !== currY) {
            currY = y;
            rowCount++;
          }

          if (maxRows && rowCount > maxRows) {
            break;
          }
          tagWidths.push(width);
          index++;
        }

        // Remove tags until there is space for the collapse button and action button (if present) on the last row.
        let buttons = [...actionsEl.children];
        if (maxRows && buttons.length > 0 && rowCount >= maxRows) {
          let buttonsWidth = buttons.reduce(
            (acc, curr) => (acc += curr.getBoundingClientRect().width),
            0
          );
          buttonsWidth += tokenValues.gap * buttons.length;
          let end: 'left' | 'right' = direction === 'ltr' ? 'right' : 'left';
          let containerEnd =
            containerEl.parentElement?.getBoundingClientRect()[end] ?? 0;
          let lastTagEnd = tags[index - 1]?.getBoundingClientRect()[end];
          lastTagEnd += tokenValues.gap / 2;
          let availableWidth = containerEnd - lastTagEnd;

          while (availableWidth < buttonsWidth && index > 0) {
            // ceremony for TS to understand that tagWidths.pop() is not undefined
            let nextAvailableWidth = tagWidths.pop();
            if (nextAvailableWidth) {
              availableWidth += nextAvailableWidth;
            }
            index--;
          }
        }

        return {
          visibleTagCount: Math.max(index, 1),
          showCollapseButton: index < state.collection.size,
        };
      };

      setTagState(function* () {
        // Update to show all items.
        yield {
          visibleTagCount: state.collection.size,
          showCollapseButton: true,
        };

        // Measure, and update to show the items until maxRows is reached.
        yield computeVisibleTagCount();
      });
    }
  }, [maxRows, setTagState, direction, state.collection.size]);

  useResizeObserver({ ref: containerRef, onResize: updateVisibleTagCount });

  // we only want this effect to run when children change
  // eslint-disable-next-line react-compiler/react-compiler
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(updateVisibleTagCount, [children]);

  useEffect(() => {
    // Recalculate visible tags when fonts are loaded.
    document.fonts?.ready.then(() => updateVisibleTagCount());

    // we strictly want this effect to only run once
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let visibleTags = useMemo(
    () =>
      [...state.collection].slice(
        0,
        isCollapsed ? tagState.visibleTagCount : state.collection.size
      ),
    [isCollapsed, state.collection, tagState.visibleTagCount]
  );

  let handlePressCollapse = () => {
    // Prevents button from losing focus if focusedKey got collapsed.
    state.selectionManager.setFocusedKey(null);
    setIsCollapsed(prevCollapsed => !prevCollapsed);
  };

  let showActions = tagState.showCollapseButton || (actionLabel && onAction);
  let isEmpty = state.collection.size === 0;

  let containerStyle = useMemo(() => {
    if (maxRows == null || !isCollapsed || isEmpty) {
      return undefined;
    }
    let maxHeight = (tokenValues.height + tokenValues.gap) * maxRows;
    return { maxHeight, overflow: 'hidden' };
  }, [isCollapsed, maxRows, isEmpty]);

  return (
    <FocusScope>
      <FieldPrimitive
        {...props}
        labelProps={labelProps}
        descriptionProps={descriptionProps}
        errorMessageProps={errorMessageProps}
        ref={domRef}
        labelElementType="span"
      >
        <div
          ref={containerRef}
          data-empty={isEmpty}
          className={css({
            '&[data-empty=false]': {
              margin: `calc(${gapVar} / -2)`,
            },
          })}
          style={containerStyle}
        >
          <FocusRing>
            <div
              ref={tagsRef}
              {...gridProps}
              className={css({
                borderRadius: radiusVar,
                display: 'inline',
                outline: 'none',

                '&[data-focus=visible]': {
                  display: 'block',
                  outlineColor: tokenSchema.color.alias.focusRing,
                  outlineStyle: 'solid',
                  outlineWidth: tokenSchema.size.alias.focusRing,
                  outlineOffset: `calc(${tokenSchema.size.border.regular} * -1)`,
                },
              })}
            >
              {visibleTags.map(item => (
                <Tag {...item.props} key={item.key} item={item} state={state}>
                  {item.rendered}
                </Tag>
              ))}
              {isEmpty && (
                <div className={css({ minHeight: heightVar })}>
                  {renderEmptyState()}
                </div>
              )}
            </div>
          </FocusRing>
          {showActions && !isEmpty && (
            <KeystarProvider isDisabled={false}>
              <SlotProvider slots={{ text: { size: 'small' } }}>
                <div
                  role="group"
                  ref={actionsRef}
                  id={actionsId}
                  aria-label={stringFormatter.format('actions')}
                  aria-labelledby={`${gridProps.id} ${actionsId}`}
                  className={css({ display: 'inline' })}
                >
                  {tagState.showCollapseButton && (
                    <ActionButton
                      prominence="low"
                      onPress={handlePressCollapse}
                      UNSAFE_className={css({
                        borderRadius: radiusVar,
                        height: heightVar,
                        margin: `calc(${gapVar} / 2)`,
                        paddingInline: tokenSchema.size.space.small,
                      })}
                    >
                      {isCollapsed
                        ? stringFormatter.format('showAllButtonLabel', {
                            tagCount: state.collection.size,
                          })
                        : stringFormatter.format('hideButtonLabel')}
                    </ActionButton>
                  )}
                  {actionLabel && onAction && (
                    <ActionButton
                      prominence="low"
                      onPress={() => onAction?.()}
                      UNSAFE_className={css({
                        borderRadius: radiusVar,
                        height: heightVar,
                        margin: `calc(${gapVar} / 2)`,
                        paddingInline: tokenSchema.size.space.small,
                      })}
                    >
                      {actionLabel}
                    </ActionButton>
                  )}
                </div>
              </SlotProvider>
            </KeystarProvider>
          )}
        </div>
      </FieldPrimitive>
    </FocusScope>
  );
}

/** Tags allow users to categorize content. They can represent keywords or people, and are grouped to describe an item or a search request. */
const _TagGroup = React.forwardRef(TagGroup) as <T>(
  props: TagGroupProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReactElement;
export { _TagGroup as TagGroup };
