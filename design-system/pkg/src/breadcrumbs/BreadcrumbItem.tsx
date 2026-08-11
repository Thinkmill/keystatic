import {
  Breadcrumb as AriaBreadcrumb,
  type BreadcrumbRenderProps,
} from 'react-aria-components/Breadcrumbs';
import { Link } from 'react-aria-components/Link';
import { useLocale } from 'react-aria-components';
import {
  type ForwardedRef,
  type ReactNode,
  forwardRef,
  useContext,
} from 'react';

import { Icon } from '@keystar/ui/icon';
import { chevronLeftIcon } from '@keystar/ui/icon/icons/chevronLeftIcon';
import { chevronRightIcon } from '@keystar/ui/icon/icons/chevronRightIcon';
import {
  ClassList,
  classNames,
  css,
  tokenSchema,
  useStyleProps,
} from '@keystar/ui/style';

import { BreadcrumbsStyleContext } from './context';
import type { BreadcrumbItemProps } from './types';

export const breadcrumbsClassList = new ClassList('Breadcrumbs', [
  'item',
  'link',
  'list',
  'separator',
]);

function BreadcrumbItemImpl(
  props: BreadcrumbItemProps,
  forwardedRef: ForwardedRef<HTMLLIElement>
) {
  let { children, href, size: sizeProp, ...otherProps } = props;
  let { size: contextSize } = useContext(BreadcrumbsStyleContext);
  let size = sizeProp ?? contextSize;
  let { direction } = useLocale();
  let styleProps = useStyleProps(props);
  return (
    <AriaBreadcrumb
      {...otherProps}
      {...styleProps}
      ref={forwardedRef}
      className={classNames(
        breadcrumbsClassList.element('item'),
        css({
          alignItems: 'center',
          display: 'inline-flex',
          minWidth: 0,
          whiteSpace: 'nowrap',
          '&[data-current]': { overflow: 'hidden' },
        }),
        styleProps.className
      )}
    >
      {states => (
        <>
          <Link
            href={states.isCurrent ? undefined : href}
            className={classNames(
              breadcrumbsClassList.element('link'),
              css({
                color: tokenSchema.color.foreground.neutral,
                cursor: 'pointer',
                fontFamily: tokenSchema.typography.fontFamily.base,
                fontSize: tokenSchema.typography.text.regular.size,
                fontWeight: tokenSchema.typography.fontWeight.medium,
                outline: 0,
                '&[data-size=small]': {
                  fontSize: tokenSchema.typography.text.small.size,
                },
                '&[data-size=medium]': {
                  fontSize: tokenSchema.typography.text.medium.size,
                },
                '&[data-size=large]': {
                  fontSize: tokenSchema.typography.text.large.size,
                },
                '[data-current] &': {
                  cursor: 'default',
                  fontWeight: tokenSchema.typography.fontWeight.semibold,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                },
                '[data-disabled]:not([data-current]) &': {
                  color: tokenSchema.color.alias.foregroundDisabled,
                },
              })
            )}
            data-size={size === 'regular' ? undefined : size}
          >
            {resolveChildren(children, states)}
          </Link>
          {!states.isCurrent && (
            <Icon
              src={direction === 'rtl' ? chevronLeftIcon : chevronRightIcon}
              color={
                states.isDisabled
                  ? 'color.alias.foregroundDisabled'
                  : 'neutralSecondary'
              }
              marginX="small"
              UNSAFE_className={breadcrumbsClassList.element('separator')}
            />
          )}
        </>
      )}
    </AriaBreadcrumb>
  );
}

export const BreadcrumbItem = forwardRef(BreadcrumbItemImpl);

function resolveChildren(
  children: BreadcrumbItemProps['children'],
  states: BreadcrumbRenderProps
): ReactNode {
  return typeof children === 'function'
    ? (children as (states: BreadcrumbRenderProps) => ReactNode)(states)
    : children;
}
