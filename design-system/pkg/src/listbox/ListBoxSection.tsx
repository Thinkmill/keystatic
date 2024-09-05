import { useLocale } from '@react-aria/i18n';
import { useListBoxSection } from '@react-aria/listbox';
import {
  VirtualizerItemOptions,
  layoutInfoToStyle,
  useVirtualizerItem,
} from '@react-aria/virtualizer';
import { LayoutInfo } from '@react-stately/virtualizer';
import { Node } from '@react-types/shared';
import { Fragment, ReactNode, useRef } from 'react';

import { Divider } from '@keystar/ui/layout';
import { classNames, css, tokenSchema } from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';

import { useListBoxContext } from './context';

interface ListBoxSectionProps<T> extends Omit<VirtualizerItemOptions, 'ref'> {
  headerLayoutInfo: LayoutInfo;
  item: Node<T>;
  children?: ReactNode;
}

/** @private */
export function ListBoxSection<T>(props: ListBoxSectionProps<T>) {
  let { children, layoutInfo, headerLayoutInfo, virtualizer, item } = props;
  let { headingProps, groupProps } = useListBoxSection({
    heading: item.rendered,
    'aria-label': item['aria-label'],
  });

  let headerRef = useRef<HTMLDivElement>(null);
  useVirtualizerItem({
    layoutInfo: headerLayoutInfo,
    virtualizer,
    ref: headerRef,
  });

  let { direction } = useLocale();
  let { state } = useListBoxContext();

  return (
    <Fragment>
      <div
        role="presentation"
        ref={headerRef}
        style={layoutInfoToStyle(headerLayoutInfo, direction)}
      >
        {item.key !== state.collection.getFirstKey() && (
          <Divider
            role="presentation"
            elementType="div"
            size="medium"
            UNSAFE_className={css({ margin: tokenSchema.size.space.medium })}
          />
        )}
        {item.rendered && (
          <Text
            {...headingProps}
            casing="uppercase"
            color="neutralSecondary"
            size="small"
            weight="medium"
            UNSAFE_className={css({ padding: tokenSchema.size.space.medium })}
          >
            {item.rendered}
          </Text>
        )}
      </div>
      <div
        {...groupProps}
        style={layoutInfoToStyle(layoutInfo, direction)}
        className={classNames(css({}), 'ListBoxSection')}
      >
        {children}
      </div>
    </Fragment>
  );
}
