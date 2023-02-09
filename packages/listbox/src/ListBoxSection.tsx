import { useLocale } from '@react-aria/i18n';
import { useListBoxSection } from '@react-aria/listbox';
import { useSeparator } from '@react-aria/separator';
import { layoutInfoToStyle, useVirtualizerItem } from '@react-aria/virtualizer';
import { ReusableView } from '@react-stately/virtualizer';
import { Node } from '@react-types/shared';
import { warning } from 'emery';
import { Fragment, ReactNode, useRef } from 'react';

import { classNames, css, tokenSchema } from '@voussoir/style';

import { useListBoxContext } from './context';
import { Text } from '@voussoir/typography';
import { Divider } from '@voussoir/layout';

interface ListBoxSectionProps<T> {
  reusableView: ReusableView<Node<T>, unknown>;
  header: ReusableView<Node<T>, unknown>;
  children?: ReactNode;
}

/** @private */
export function ListBoxSection<T>(props: ListBoxSectionProps<T>) {
  let { children, reusableView, header } = props;
  let item = reusableView.content;
  let ariaLabel = item['aria-label'];

  warning(
    !!(item.rendered || ariaLabel),
    'A section must have a title or aria-label.'
  );

  let { headingProps, groupProps } = useListBoxSection({
    heading: item.rendered,
    'aria-label': ariaLabel,
  });

  let { separatorProps } = useSeparator({
    elementType: 'li',
  });

  let headerRef = useRef<HTMLDivElement>(null);
  useVirtualizerItem({
    reusableView: header,
    ref: headerRef,
  });

  let { direction } = useLocale();
  let state = useListBoxContext();

  return (
    <Fragment>
      <div
        role="presentation"
        ref={headerRef}
        style={
          header.layoutInfo
            ? layoutInfoToStyle(header.layoutInfo, direction)
            : undefined
        }
      >
        {item.key !== state.collection.getFirstKey() && (
          <Divider
            {...separatorProps}
            elementType="div"
            size="medium"
            UNSAFE_className={css({ margin: tokenSchema.size.space.medium })}
          />
        )}
        {item.rendered && (
          <Text
            casing="uppercase"
            size="small"
            color="neutralSecondary"
            weight="medium"
            UNSAFE_className={css({
              paddingBlock: tokenSchema.size.space.medium,
              paddingInline: tokenSchema.size.space.medium,
            })}
            {...headingProps}
          >
            {item.rendered}
          </Text>
        )}
      </div>
      <div
        {...groupProps}
        style={
          reusableView.layoutInfo
            ? layoutInfoToStyle(reusableView.layoutInfo, direction)
            : undefined
        }
        className={classNames(css({}), 'ListBoxSection')}
      >
        {children}
      </div>
    </Fragment>
  );
}
