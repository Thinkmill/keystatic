import { GridNode } from '@react-types/grid';

import { Flex, Grid } from '@keystar/ui/layout';
import { SlotProvider } from '@keystar/ui/slots';
import {
  classNames,
  css,
  toDataAttributes,
  tokenSchema,
} from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';

import { listViewItemClassList } from './class-list';
import type { ListViewProps } from './types';

interface DragPreviewProps<T> {
  item: GridNode<any>;
  itemCount: number;
  itemHeight: number;
  density: ListViewProps<T>['density'];
}

export function DragPreview(props: DragPreviewProps<unknown>) {
  let { item, itemCount, itemHeight, density } = props;

  let isDraggingMultiple = itemCount > 1;

  return (
    <div
      {...toDataAttributes({ density, multi: isDraggingMultiple })}
      style={{ height: itemHeight }}
      className={classNames(
        css({
          display: 'grid',
          backgroundColor: tokenSchema.color.background.canvas,
          border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.alias.borderSelected}`,
          borderRadius: tokenSchema.size.radius.small,
          paddingInline: tokenSchema.size.space.medium,
          position: 'relative',
          outline: 0,
          width: tokenSchema.size.alias.singleLineWidth,

          // Density
          minHeight: tokenSchema.size.element.medium,
          paddingBlock: tokenSchema.size.space.medium,
          '&[data-density="compact"]': {
            minHeight: tokenSchema.size.element.regular,
            paddingBlock: tokenSchema.size.space.regular,
          },
          '&[data-density="spacious"]': {
            minHeight: tokenSchema.size.element.large,
            paddingBlock: tokenSchema.size.space.large,
          },

          // indicate that multiple items are being dragged by implying a stack
          '&[data-multi=true]::after': {
            backgroundColor: 'inherit',
            border: 'inherit',
            borderRadius: 'inherit',
            content: '" "',
            display: 'block',
            height: '100%',
            insetInlineStart: 4,
            position: 'absolute',
            top: 4,
            width: '100%',
            zIndex: -1,
          },
        })
      )}
    >
      <Grid
        UNSAFE_className={listViewItemClassList.element('grid')}
        columns="auto auto 1fr auto"
        rows="1fr auto"
        areas={[
          'thumbnail content     . badge',
          'thumbnail description . badge',
        ]}
        alignItems="center"
      >
        <SlotProvider
          slots={{
            text: {
              gridArea: 'content',
              flexGrow: 1,
              truncate: true,
              weight: 'medium',
              UNSAFE_className: listViewItemClassList.element('content'),
            },
            description: {
              color: 'neutralSecondary',
              size: 'small',
              gridArea: 'description',
              flexGrow: 1,
              marginTop: 'small',
              truncate: true,
              UNSAFE_className: listViewItemClassList.element('description'),
            },
            image: {
              borderRadius: 'xsmall',
              gridArea: 'thumbnail',
              marginEnd: 'regular',
              overflow: 'hidden',
              height:
                density === 'compact' ? 'element.small' : 'element.regular',
              UNSAFE_className: listViewItemClassList.element('thumbnail'),
            },
            button: {
              isHidden: true,
              UNSAFE_className: listViewItemClassList.element('actions'),
            },
            actionGroup: {
              isHidden: true,
              UNSAFE_className: listViewItemClassList.element('actions'),
            },
            actionMenu: {
              isHidden: true,
              UNSAFE_className: listViewItemClassList.element('actionmenu'),
            },
          }}
        >
          {isReactText(item.rendered) ? (
            <Text>{item.rendered}</Text>
          ) : (
            item.rendered
          )}

          {isDraggingMultiple && (
            <Flex
              alignItems="center"
              backgroundColor="accentEmphasis"
              borderRadius="small"
              gridArea="badge"
              minWidth="element.small"
              padding="small"
              UNSAFE_className={listViewItemClassList.element('badge')}
            >
              <Text align="center" color="inverse" size="small" weight="medium">
                {itemCount}
              </Text>
            </Flex>
          )}
        </SlotProvider>
      </Grid>
    </div>
  );
}
