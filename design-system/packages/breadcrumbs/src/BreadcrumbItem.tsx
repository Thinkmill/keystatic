import { useBreadcrumbItem } from '@react-aria/breadcrumbs';
import { useLocale } from '@react-aria/i18n';
import { useHover } from '@react-aria/interactions';
import { mergeProps } from '@react-aria/utils';
import React, { Fragment, useMemo, useRef } from 'react';

import { Icon } from '@voussoir/icon';
import { chevronRightIcon } from '@voussoir/icon/icons/chevronRightIcon';
import { chevronLeftIcon } from '@voussoir/icon/icons/chevronLeftIcon';
import {
  ClassList,
  classNames,
  css,
  FocusRing,
  tokenSchema,
} from '@voussoir/style';
import {} from '@voussoir/typography';
import { toDataAttributes } from '@voussoir/utils';

import { BreadcrumbItemProps } from './types';

export const breadcrumbsClassList = new ClassList('Breadcrumbs');

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
            breadcrumbsClassList.declare('link'),
            css({
              color: tokenSchema.color.foreground.neutral,
              cursor: 'default',
              fontSize: tokenSchema.fontsize.text.regular.size,
              fontFamily: tokenSchema.typography.fontFamily.base,
              fontWeight: tokenSchema.typography.fontWeight.medium,
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',

              '&[data-size=small]': {
                fontSize: tokenSchema.fontsize.text.small.size,
              },
              '&[data-size=medium]': {
                fontSize: tokenSchema.fontsize.text.medium.size,
              },
              '&[data-size=large]': {
                fontSize: tokenSchema.fontsize.text.large.size,
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
          UNSAFE_className={breadcrumbsClassList.declare('separator')}
        />
      )}
    </Fragment>
  );
}
