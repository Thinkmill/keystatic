import { Breadcrumbs as AriaBreadcrumbs } from 'react-aria-components/Breadcrumbs';
import { type ForwardedRef, type ReactElement, forwardRef } from 'react';

import { classNames, css, useStyleProps } from '@keystar/ui/style';

import { breadcrumbsClassList } from './BreadcrumbItem';
import { BreadcrumbsStyleContext } from './context';
import type { BreadcrumbsProps } from './types';

function Breadcrumbs<T extends object>(
  props: BreadcrumbsProps<T>,
  forwardedRef: ForwardedRef<HTMLOListElement>
) {
  let { size = 'regular', ...otherProps } = props;
  let styleProps = useStyleProps(props);
  return (
    <BreadcrumbsStyleContext.Provider value={{ size }}>
      <AriaBreadcrumbs
        {...otherProps}
        {...styleProps}
        ref={forwardedRef}
        className={classNames(
          breadcrumbsClassList.element('list'),
          css({
            alignItems: 'center',
            display: 'flex',
            listStyle: 'none',
            margin: 0,
            minWidth: 0,
            padding: 0,
          }),
          styleProps.className
        )}
      />
    </BreadcrumbsStyleContext.Provider>
  );
}

const _Breadcrumbs = forwardRef(Breadcrumbs) as <T extends object>(
  props: BreadcrumbsProps<T> & { ref?: ForwardedRef<HTMLOListElement> }
) => ReactElement;
export { _Breadcrumbs as Breadcrumbs };
