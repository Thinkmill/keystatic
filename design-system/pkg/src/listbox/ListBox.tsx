import {
  Header,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  ListBoxLoadMoreItem as AriaListBoxLoadMoreItem,
  ListBoxSection as AriaListBoxSection,
  Text as AriaText,
  type ListBoxItemProps as AriaListBoxItemProps,
  type ListBoxItemRenderProps,
  type ListBoxLoadMoreItemProps as AriaListBoxLoadMoreItemProps,
  type ListBoxProps as AriaListBoxProps,
  type ListBoxSectionProps as AriaListBoxSectionProps,
} from 'react-aria-components/ListBox';
import {
  ListLayout,
  type ListLayoutOptions,
  Virtualizer,
} from 'react-aria-components/Virtualizer';
import {
  Children,
  type ForwardedRef,
  type ReactElement,
  type ReactNode,
  forwardRef,
  isValidElement,
  useMemo,
} from 'react';
import { useLocalizedStringFormatter } from 'react-aria/useLocalizedStringFormatter';

import { useProvider } from '@keystar/ui/core';
import { ProgressCircle } from '@keystar/ui/progress';
import {
  type BaseStyleProps,
  classNames,
  css,
  tokenSchema,
  useStyleProps,
} from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';

import { ListItem } from './ListItem';
import localizedMessages from './l10n';
import { listStyles } from './styles';

export interface ListBoxProps<T>
  extends Omit<AriaListBoxProps<T>, 'className' | 'style'>,
    BaseStyleProps {}

function ListBox<T extends object>(
  props: ListBoxProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let styleProps = useStyleProps(props);
  let { scale } = useProvider();
  let { layout, layoutOptions } = useMemo(() => {
    let layoutOptions: ListLayoutOptions = {
      estimatedRowSize: scale === 'large' ? 48 : 32,
      estimatedHeadingSize: scale === 'large' ? 33 : 26,
      padding: scale === 'large' ? 5 : 4,
    };
    return {
      layout: new ListLayout<T>(layoutOptions),
      layoutOptions,
    };
  }, [scale]);

  return (
    <Virtualizer layout={layout} layoutOptions={layoutOptions}>
      <AriaListBox
        {...props}
        {...styleProps}
        ref={forwardedRef}
        className={classNames(listStyles, styleProps.className)}
      />
    </Virtualizer>
  );
}

const _ListBox = forwardRef(ListBox) as <T extends object>(
  props: ListBoxProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReactElement;

export { _ListBox as ListBox };

export interface ListBoxItemProps<T = object>
  extends Omit<AriaListBoxItemProps<T>, 'className' | 'style'>,
    BaseStyleProps {}

function ListBoxItem<T extends object>(
  props: ListBoxItemProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let { children, ...otherProps } = props;
  let styleProps = useStyleProps(props);

  return (
    <AriaListBoxItem
      {...otherProps}
      {...styleProps}
      textValue={
        otherProps.textValue ??
        (isReactText(children) ? String(children) : undefined)
      }
      ref={forwardedRef}
      style={{
        ...styleProps.style,
        height: '100%',
        minHeight: 0,
        outline: 'none',
      }}
    >
      {states => (
        <ListItem
          aria-disabled={states.isDisabled}
          isFocused={states.isFocused}
          isHovered={states.isHovered}
          isPressed={states.isPressed}
          isSelected={states.isSelected}
        >
          {wrapItemContent(resolveChildren(children, states))}
        </ListItem>
      )}
    </AriaListBoxItem>
  );
}

const _ListBoxItem = forwardRef(ListBoxItem) as <T extends object = object>(
  props: ListBoxItemProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReactElement;

export { _ListBoxItem as ListBoxItem };

export interface ListBoxSectionProps<T = object>
  extends Omit<AriaListBoxSectionProps<T>, 'className' | 'style'>,
    BaseStyleProps {}

function ListBoxSection<T extends object>(
  props: ListBoxSectionProps<T>,
  forwardedRef: ForwardedRef<HTMLElement>
) {
  let styleProps = useStyleProps(props);
  return (
    <AriaListBoxSection
      {...props}
      {...styleProps}
      ref={forwardedRef}
      className={classNames(
        css({
          '& + &': {
            borderTop: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.neutral}`,
          },
        }),
        styleProps.className
      )}
    />
  );
}

const _ListBoxSection = forwardRef(ListBoxSection) as <
  T extends object = object,
>(
  props: ListBoxSectionProps<T> & { ref?: ForwardedRef<HTMLElement> }
) => ReactElement;

export { _ListBoxSection as ListBoxSection };

export function ListBoxHeader({ children }: { children: ReactNode }) {
  return (
    <Header
      render={({ className, ...headerProps }) => (
        <Text
          {...headerProps}
          elementType="header"
          casing="uppercase"
          color="neutralSecondary"
          size="small"
          weight="medium"
          UNSAFE_className={classNames(
            className,
            css({ padding: tokenSchema.size.space.medium })
          )}
        />
      )}
    >
      {children}
    </Header>
  );
}

export interface ListBoxLoadMoreItemProps
  extends Omit<AriaListBoxLoadMoreItemProps, 'className' | 'style'>,
    BaseStyleProps {
  /** Accessible label for the default loading indicator. */
  'aria-label'?: string;
}

export function ListBoxLoadMoreItem(props: ListBoxLoadMoreItemProps) {
  let stringFormatter = useLocalizedStringFormatter(localizedMessages);
  let {
    children,
    isLoading,
    'aria-label': ariaLabel = stringFormatter.format('loadingMore'),
    ...otherProps
  } = props;
  let styleProps = useStyleProps(props);
  return (
    <AriaListBoxLoadMoreItem
      {...otherProps}
      {...styleProps}
      isLoading={isLoading}
    >
      {children ??
        (isLoading ? (
          <div
            className={css({
              alignItems: 'center',
              display: 'flex',
              height: '100%',
              justifyContent: 'center',
            })}
          >
            <ProgressCircle
              isIndeterminate
              size="small"
              aria-label={ariaLabel}
            />
          </div>
        ) : null)}
    </AriaListBoxLoadMoreItem>
  );
}

function resolveChildren(
  children: AriaListBoxItemProps<object>['children'],
  states: ListBoxItemRenderProps
) {
  return typeof children === 'function'
    ? (children as (states: ListBoxItemRenderProps) => ReactNode)(states)
    : children;
}

function wrapItemContent(children: ReactNode): ReactNode {
  if (isReactText(children)) {
    return <Text>{children}</Text>;
  }

  return Children.map(children, child => {
    if (isValidElement<TextChildProps>(child) && child.type === Text) {
      let { children, slot, ...textProps } = child.props;
      return (
        <AriaText
          slot={slot === 'description' ? 'description' : 'label'}
          render={({ className: _, ...domProps }) => (
            <Text {...textProps} {...domProps} slot={slot} />
          )}
        >
          {children}
        </AriaText>
      );
    }
    return child;
  });
}

interface TextChildProps {
  children?: ReactNode;
  slot?: string;
  [key: string]: unknown;
}
