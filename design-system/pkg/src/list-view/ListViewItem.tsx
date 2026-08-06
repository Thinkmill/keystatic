import {
  Button as AriaButton,
  Checkbox as AriaCheckbox,
  GridListItem,
  Text as AriaText,
  type GridListItemRenderProps,
} from 'react-aria-components/GridList';
import { useLocale } from 'react-aria-components';
import {
  Children,
  type ForwardedRef,
  type ReactElement,
  isValidElement,
  type ReactNode,
  forwardRef,
  useContext,
} from 'react';

import { KeystarProvider } from '@keystar/ui/core';
import { Icon } from '@keystar/ui/icon';
import { chevronLeftIcon } from '@keystar/ui/icon/icons/chevronLeftIcon';
import { chevronRightIcon } from '@keystar/ui/icon/icons/chevronRightIcon';
import { gripVerticalIcon } from '@keystar/ui/icon/icons/gripVerticalIcon';
import { Grid } from '@keystar/ui/layout';
import { CheckboxIndicator } from '../checkbox/Checkbox';
import { ClearSlots, SlotProvider } from '@keystar/ui/slots';
import {
  classNames,
  css,
  toDataAttributes,
  tokenSchema,
  useStyleProps,
} from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';

import { listViewClassList, listViewItemClassList } from './class-list';
import { ListViewContext } from './ListView';
import type { ListViewItemProps } from './types';

function ListViewItem<T extends object>(
  props: ListViewItemProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let { children, hasChildItems, ...otherProps } = props;
  let { density, overflowMode, hasActions } = useContext(ListViewContext);
  let styleProps = useStyleProps(props);
  let { direction } = useLocale();

  return (
    <GridListItem
      {...otherProps}
      {...styleProps}
      textValue={
        otherProps.textValue ??
        (isReactText(children) ? String(children) : undefined)
      }
      ref={forwardedRef}
      className={classNames(
        listViewItemClassList.element('row'),
        css({
          cursor: 'default',
          height: '100%',
          outline: 0,
          position: 'relative',

          '&:not(:last-child)::after': {
            boxShadow: `inset 0 -1px 0 0 ${tokenSchema.color.border.neutral}`,
            content: '" "',
            display: 'block',
            inset: 0,
            pointerEvents: 'none',
            position: 'absolute',
            zIndex: 3,
          },
        })
      )}
    >
      {states => {
        let {
          allowsDragging,
          isDisabled,
          isFocusVisible,
          isFocusVisibleWithin,
          isHovered,
          isPressed,
          selectionBehavior,
          selectionMode,
        } = states;
        let resolvedChildren = resolveChildren(children, states);
        let content = isReactText(resolvedChildren) ? (
          <Text>{resolvedChildren}</Text>
        ) : (
          wrapDescription(resolvedChildren)
        );
        let showCheckbox =
          selectionMode !== 'none' && selectionBehavior === 'toggle';
        let renderedContent = isDisabled ? (
          <KeystarProvider isDisabled>{content}</KeystarProvider>
        ) : (
          content
        );

        return (
          <div
            {...toDataAttributes({
              draggable: allowsDragging || undefined,
              focus: isFocusVisible
                ? 'visible'
                : isFocusVisibleWithin
                ? 'within'
                : undefined,
              interaction: isPressed
                ? 'press'
                : isHovered
                ? 'hover'
                : undefined,
            })}
            className={classNames(
              listViewItemClassList.element('root'),
              css({
                display: 'grid',
                minHeight: tokenSchema.size.element.medium,
                outline: 0,
                paddingBlock: tokenSchema.size.space.medium,
                paddingInline: tokenSchema.size.space.medium,
                position: 'relative',

                [`${listViewClassList.selector(
                  'root'
                )}[data-density="compact"] &`]: {
                  minHeight: tokenSchema.size.element.regular,
                  paddingBlock: tokenSchema.size.space.regular,
                },
                [`${listViewClassList.selector(
                  'root'
                )}[data-density="spacious"] &`]: {
                  minHeight: tokenSchema.size.element.large,
                  paddingBlock: tokenSchema.size.space.large,
                },
                '&[data-draggable=true]': {
                  paddingInlineStart: tokenSchema.size.space.small,
                },
                '&[data-interaction="hover"]': {
                  backgroundColor: tokenSchema.color.alias.backgroundHovered,
                },
                '&[data-interaction="press"]': {
                  backgroundColor: tokenSchema.color.alias.backgroundPressed,
                },
                '&[data-focus="visible"]::before': {
                  backgroundColor: tokenSchema.color.background.accentEmphasis,
                  borderRadius: tokenSchema.size.space.small,
                  content: '""',
                  insetBlock: tokenSchema.size.space.xsmall,
                  insetInlineStart: tokenSchema.size.space.xsmall,
                  position: 'absolute',
                  width: tokenSchema.size.space.small,
                },
                [`${listViewItemClassList.selector(
                  'row'
                )}[aria-selected="true"] &`]: {
                  backgroundColor: tokenSchema.color.alias.backgroundSelected,
                },
              })
            )}
          >
            <Grid
              UNSAFE_className={listViewItemClassList.element('grid')}
              columns="auto auto auto 1fr minmax(0px, auto) auto auto"
              rows="1fr auto"
              areas={[
                'draghandle checkbox thumbnail content actions actionmenu chevron',
                'draghandle checkbox thumbnail description actions actionmenu chevron',
              ]}
              alignItems="center"
            >
              {allowsDragging && !isDisabled && (
                <AriaButton
                  slot="drag"
                  className={css({
                    alignItems: 'center',
                    display: 'flex',
                    gridArea: 'draghandle',
                    justifyContent: 'center',
                    outline: 0,
                    width: tokenSchema.size.element.small,
                  })}
                >
                  <Icon src={gripVerticalIcon} color="neutral" />
                </AriaButton>
              )}
              {showCheckbox && (
                <AriaCheckbox
                  slot="selection"
                  className={css({
                    alignItems: 'center',
                    display: 'flex',
                    gridArea: 'checkbox',
                    justifyContent: 'center',
                    paddingInlineEnd: tokenSchema.size.space.regular,
                  })}
                >
                  <CheckboxIndicator />
                </AriaCheckbox>
              )}
              <SlotProvider
                slots={{
                  text: {
                    color: isDisabled
                      ? 'color.alias.foregroundDisabled'
                      : undefined,
                    gridArea: 'content',
                    flexGrow: 1,
                    truncate: overflowMode === 'truncate',
                    weight: 'medium',
                    UNSAFE_className: listViewItemClassList.element('content'),
                  },
                  description: {
                    color: isDisabled
                      ? 'color.alias.foregroundDisabled'
                      : 'neutralSecondary',
                    size: 'small',
                    gridArea: 'description',
                    flexGrow: 1,
                    marginTop: 'regular',
                    truncate: overflowMode === 'truncate',
                    UNSAFE_className:
                      listViewItemClassList.element('description'),
                  },
                  image: {
                    borderRadius: 'xsmall',
                    gridArea: 'thumbnail',
                    marginEnd: 'regular',
                    overflow: 'hidden',
                    height:
                      density === 'compact'
                        ? 'element.small'
                        : 'element.regular',
                    UNSAFE_className:
                      listViewItemClassList.element('thumbnail'),
                  },
                  button: {
                    UNSAFE_className: listViewItemClassList.element('actions'),
                    prominence: 'low',
                    gridArea: 'actions',
                  },
                  actionGroup: {
                    UNSAFE_className: listViewItemClassList.element('actions'),
                    prominence: 'low',
                    gridArea: 'actions',
                    density: 'compact',
                  },
                  actionMenu: {
                    UNSAFE_className:
                      listViewItemClassList.element('actionmenu'),
                    prominence: 'low',
                    gridArea: 'actionmenu',
                  },
                }}
              >
                {renderedContent}
                <ClearSlots>
                  <Icon
                    {...toDataAttributes({
                      disabled: !hasActions,
                      visible: hasChildItems,
                    })}
                    color="neutral"
                    src={
                      direction === 'ltr' ? chevronRightIcon : chevronLeftIcon
                    }
                    aria-hidden="true"
                    UNSAFE_className={classNames(
                      listViewItemClassList.element('parent-indicator'),
                      css({
                        display: hasChildItems ? 'inline-block' : 'none',
                        gridArea: 'chevron',
                        marginInlineStart: tokenSchema.size.space.regular,
                      })
                    )}
                  />
                </ClearSlots>
              </SlotProvider>
            </Grid>
          </div>
        );
      }}
    </GridListItem>
  );
}

const _ListViewItem = forwardRef(ListViewItem) as <T extends object = object>(
  props: ListViewItemProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReactElement;

export { _ListViewItem as ListViewItem };

function resolveChildren(
  children: ListViewItemProps<object>['children'],
  states: GridListItemRenderProps
) {
  return typeof children === 'function'
    ? (children as (states: GridListItemRenderProps) => ReactNode)(states)
    : children;
}

function wrapDescription(children: ReactNode): ReactNode {
  return Children.map(children, child => {
    if (
      isValidElement<{ slot?: string }>(child) &&
      child.props.slot === 'description'
    ) {
      return <AriaText slot="description">{child}</AriaText>;
    }
    return child;
  });
}
