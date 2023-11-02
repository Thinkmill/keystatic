import { useBreadcrumbItem } from '@react-aria/breadcrumbs';
import { useLocale } from '@react-aria/i18n';
import { useHover } from '@react-aria/interactions';
import { mergeProps } from '@react-aria/utils';
import React, { Fragment, useMemo, useRef } from 'react';

import { Icon } from '@keystar/ui/icon';
import { chevronRightIcon } from '@keystar/ui/icon/icons/chevronRightIcon';
import { chevronLeftIcon } from '@keystar/ui/icon/icons/chevronLeftIcon';
import {
  ClassList,
  FocusRing,
  classNames,
  css,
  toDataAttributes,
  tokenSchema,
} from '@keystar/ui/style';

import { BreadcrumbItemProps } from './types';

export const breadcrumbsClassList = new ClassList('Breadcrumbs', [
  'item',
  'link',
  'list',
  'separator',
]);

export function BreadcrumbItem(props: BreadcrumbItemProps) {
  let { children, isCurrent, isDisabled, size = 'regular' } = props;

  let { direction } = useLocale();
  let ref = useRef<HTMLSpanElement>(null);
  let { itemProps } = useBreadcrumbItem({ ...props, elementType: 'span' }, ref);
  let { hoverProps, isHovered } = useHover(props);
  let icon = useMemo(() => {
    return direction === 'rtl' ? chevronLeftIcon : chevronRightIcon;
  }, [direction]);

  return (
    <Fragment>
      <FocusRing>
        <span
          {...mergeProps(itemProps, hoverProps)}
          {...toDataAttributes({
            size: size !== 'regular' ? size : undefined,
            interaction: isHovered ? 'hover' : undefined,
          })}
          ref={ref}
          className={classNames(
            breadcrumbsClassList.element('link'),
            css({
              color: tokenSchema.color.foreground.neutral,
              cursor: 'default',
              fontSize: tokenSchema.typography.text.regular.size,
              fontFamily: tokenSchema.typography.fontFamily.base,
              fontWeight: tokenSchema.typography.fontWeight.medium,
              MozOsxFontSmoothing: 'auto',
              WebkitFontSmoothing: 'auto',

              '&[data-size=small]': {
                fontSize: tokenSchema.typography.text.small.size,
              },
              '&[data-size=medium]': {
                fontSize: tokenSchema.typography.text.medium.size,
              },
              '&[data-size=large]': {
                fontSize: tokenSchema.typography.text.large.size,
              },

              '&:not([aria-current=page])': {
                '&:not([aria-disabled=true])': {
                  cursor: 'pointer',
                },

                '&[data-interaction=hover]': {
                  color: tokenSchema.color.foreground.neutralEmphasis,
                  textDecoration: 'underline',
                },
                '&[aria-disabled=true]': {
                  color: tokenSchema.color.alias.foregroundDisabled,
                },
              },

              '&[aria-current=page]': {
                color: tokenSchema.color.foreground.neutralEmphasis,
                fontWeight: tokenSchema.typography.fontWeight.semibold,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
            }),
            {
              'is-hovered': isHovered,
            }
          )}
        >
          {children}
        </span>
      </FocusRing>
      {!isCurrent && (
        <Icon
          src={icon}
          color={
            isDisabled ? 'color.alias.foregroundDisabled' : 'neutralSecondary'
          }
          marginX="small"
          UNSAFE_className={breadcrumbsClassList.element('separator')}
        />
      )}
    </Fragment>
  );
}
