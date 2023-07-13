import { useMenuSection } from '@react-aria/menu';
import { useSeparator } from '@react-aria/separator';
import { getChildNodes } from '@react-stately/collections';
import { TreeState } from '@react-stately/tree';
import { Node } from '@react-types/shared';
import { Fragment, Key } from 'react';

import { Divider } from '@keystar/ui/layout';
import { classNames, css, tokenSchema } from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';

import { MenuItem } from './MenuItem';

interface MenuSectionProps<T> {
  item: Node<T>;
  state: TreeState<T>;
  onAction?: (key: Key) => void;
}

/** @private */
export function MenuSection<T>(props: MenuSectionProps<T>) {
  let { item, state, onAction } = props;
  let { itemProps, headingProps, groupProps } = useMenuSection({
    heading: item.rendered,
    'aria-label': item['aria-label'],
  });

  let { separatorProps } = useSeparator({
    elementType: 'li',
  });

  return (
    <Fragment>
      {item.key !== state.collection.getFirstKey() && (
        <Divider {...separatorProps} elementType="li" marginY="small" />
      )}
      <li {...itemProps}>
        {item.rendered && (
          <Text
            casing="uppercase"
            size="small"
            color="neutralSecondary"
            weight="medium"
            UNSAFE_className={css({
              paddingBlock: tokenSchema.size.space.regular,
              paddingInline: tokenSchema.size.space.medium,
            })}
            {...headingProps}
          >
            {item.rendered}
          </Text>
        )}
        <ul {...groupProps} className={classNames('ksv-menu-section')}>
          {[...getChildNodes(item, state.collection)].map(node => {
            let item = (
              <MenuItem
                key={node.key}
                item={node}
                state={state}
                onAction={onAction}
              />
            );

            if (node.wrapper) {
              item = node.wrapper(item);
            }

            return item;
          })}
        </ul>
      </li>
    </Fragment>
  );
}
