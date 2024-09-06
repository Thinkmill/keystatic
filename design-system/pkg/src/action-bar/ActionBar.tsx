import { FocusScope } from '@react-aria/focus';
import { announce } from '@react-aria/live-announcer';
import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { useKeyboard } from '@react-aria/interactions';
import { filterDOMProps, useObjectRef } from '@react-aria/utils';
import React, {
  ForwardedRef,
  ReactElement,
  Ref,
  useEffect,
  useRef,
  useState,
} from 'react';

import { ActionGroup } from '@keystar/ui/action-group';
import { ActionButton } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { xIcon } from '@keystar/ui/icon/icons/xIcon';
import { Transition } from '@keystar/ui/overlays';
import {
  classNames,
  css,
  tokenSchema,
  transition,
  useStyleProps,
} from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { useProviderProps } from '@keystar/ui/core';

import localizedMessages from './l10n';
import { ActionBarProps } from './types';
import { actionbarClassList } from './class-list';

function ActionBar<T extends object>(
  props: ActionBarProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let isOpen = props.selectedItemCount !== 0;
  let domRef = useObjectRef(forwardedRef);

  return (
    <Transition nodeRef={domRef} isOpen={isOpen}>
      <ActionBarInnerWithRef {...props} ref={domRef} />
    </Transition>
  );
}

interface ActionBarInnerProps<T> extends ActionBarProps<T> {
  isOpen?: boolean;
}

function ActionBarInner<T>(
  props: ActionBarInnerProps<T>,
  ref: Ref<HTMLDivElement>
) {
  props = useProviderProps(props);

  let {
    children,
    onAction,
    onClearSelection,
    selectedItemCount,
    isOpen,
    items,
  } = props;

  let styleProps = useStyleProps(props);
  let stringFormatter = useLocalizedStringFormatter(localizedMessages);

  // Store the last count greater than zero in a ref so that we can retain it while rendering the fade-out animation.
  let [lastCount, setLastCount] = useState(selectedItemCount);
  if (
    (selectedItemCount === 'all' || selectedItemCount > 0) &&
    selectedItemCount !== lastCount
  ) {
    setLastCount(selectedItemCount);
  }

  let { keyboardProps } = useKeyboard({
    onKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClearSelection();
      }
    },
  });

  // Announce "actions available" on mount.
  let isInitial = useRef(true);
  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      announce(stringFormatter.format('actionsAvailable'));
    }
  }, [stringFormatter]);

  // FIXME: style props are passed to both the root and the bar elements
  return (
    <FocusScope restoreFocus>
      <div
        {...filterDOMProps(props)}
        {...styleProps}
        {...keyboardProps}
        data-open={isOpen}
        ref={ref}
        className={classNames(
          css({
            flex: 'none',
            height: 0,
            opacity: 0,
            overflow: 'hidden',
            transition: transition(['height', 'opacity'], {
              duration: 'short',
            }),

            '&[data-open="true"]': {
              height: `calc(${tokenSchema.size.element.large} + (2 * ${tokenSchema.size.space.regular}))`,
              opacity: 1,
            },
          }),
          actionbarClassList.element('root'),
          styleProps.className
        )}
      >
        <div
          data-open={isOpen}
          className={classNames(
            css({
              alignItems: 'center',
              backgroundColor: tokenSchema.color.background.canvas,
              border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.emphasis}`,
              borderRadius: tokenSchema.size.radius.regular,
              boxShadow: `0 1px 4px ${tokenSchema.color.shadow.regular}`,
              display: 'grid',
              gap: tokenSchema.size.space.small,
              gridTemplateAreas: '"clear selected . actiongroup"',
              gridTemplateColumns: `auto max-content minmax(${tokenSchema.size.element.small}, 1fr) auto`,
              bottom: tokenSchema.size.space.regular,
              insetInline: tokenSchema.size.space.regular,
              isolation: 'isolate',
              justifyContent: 'space-between',
              margin: '0 auto',
              padding: tokenSchema.size.space.regular,
              position: 'absolute',
              transform: `translateY(${tokenSchema.size.space.large})`, // initialise with offset
              transition: transition('transform', { duration: 'short' }),

              '&[data-open="true"]': {
                transform: 'translateY(0)',
              },
            }),
            actionbarClassList.element('bar')
          )}
        >
          <ActionGroup
            items={items}
            aria-label={stringFormatter.format('actions')}
            prominence="low"
            overflowMode="collapse"
            buttonLabelBehavior="collapse"
            onAction={onAction}
            gridArea="actiongroup"
          >
            {children}
          </ActionGroup>
          <ActionButton
            gridArea="clear"
            aria-label={stringFormatter.format('clearSelection')}
            onPress={() => onClearSelection()}
            prominence="low"
          >
            <Icon src={xIcon} />
          </ActionButton>
          <Text gridArea="selected">
            {lastCount === 'all'
              ? stringFormatter.format('selectedAll')
              : `${lastCount} selected`}
            {/*
              FIXME: resolve @react-aria/i18n issues
              stringFormatter.format('selected', { count: lastCount })
            */}
          </Text>
        </div>
      </div>
    </FocusScope>
  );
}

const ActionBarInnerWithRef = React.forwardRef(ActionBarInner) as <T>(
  props: ActionBarInnerProps<T> & { ref?: Ref<HTMLDivElement> }
) => ReactElement;

/**
 * Action bars are used for single and bulk selection patterns when a user needs
 * to perform actions on one or more items at the same time.
 */
const _ActionBar: <T>(
  props: ActionBarProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReactElement = React.forwardRef(ActionBar as any) as any;

export { _ActionBar as ActionBar };
