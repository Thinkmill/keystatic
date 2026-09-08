import { useMenuSection } from 'react-aria/useMenu';
import { useSeparator } from 'react-aria/useSeparator';
import { getChildNodes } from 'react-stately/private/collections/getChildNodes';
import { TreeState } from 'react-stately/useTreeState';
import { Node } from '@react-types/shared';
import { Fragment } from 'react';

import { Divider } from '@keystar/ui/layout';
import { css, tokenSchema } from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';

import { MenuItem } from './MenuItem';

interface MenuSectionProps<T> {
  item: Node<T>;
  state: TreeState<T>;
}

/** @private */
export function MenuSection<T>(props: MenuSectionProps<T>) {
  let { item, state } = props;
  let { itemProps, headingProps, groupProps } = useMenuSection({
    heading: item.rendered,
    'aria-label': item['aria-label'],
  });

  let { separatorProps } = useSeparator({});

  return (
    <Fragment>
      {item.key !== state.collection.getFirstKey() && (
        <Divider {...separatorProps} marginY="small" />
      )}
      <div {...itemProps}>
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
        <div {...groupProps}>
          {[...getChildNodes(item, state.collection)].map(node => {
            let item = <MenuItem key={node.key} item={node} state={state} />;

            if (node.wrapper) {
              item = node.wrapper(item);
            }

            return item;
          })}
        </div>
      </div>
    </Fragment>
  );
}
