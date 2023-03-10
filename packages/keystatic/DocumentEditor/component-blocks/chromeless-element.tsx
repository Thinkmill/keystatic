import { ReactNode } from 'react';
import { Element } from 'slate';
import { RenderElementProps } from 'slate-react';

import { ActionButton } from '@voussoir/button';
import { Icon } from '@voussoir/icon';
import { trashIcon } from '@voussoir/icon/icons/trashIcon';
import { Box } from '@voussoir/layout';
import { Tooltip, TooltipTrigger } from '@voussoir/tooltip';

import { BlockPopover, BlockPopoverTrigger } from '../primitives';

import {
  ComponentBlock,
  PreviewPropsForToolbar,
  ObjectField,
  ComponentSchema,
} from './api';

export function ChromelessComponentBlockElement(props: {
  renderedBlock: ReactNode;
  componentBlock: ComponentBlock & { chromeless: true };
  previewProps: PreviewPropsForToolbar<
    ObjectField<Record<string, ComponentSchema>>
  >;
  onRemove: () => void;
  attributes: RenderElementProps['attributes'];
  element: Element;
}) {
  const ChromelessToolbar =
    props.componentBlock.toolbar ?? DefaultToolbarWithoutChrome;

  return (
    <Box {...props.attributes} marginY="xlarge">
      <BlockPopoverTrigger element={props.element}>
        <div>{props.renderedBlock}</div>
        <BlockPopover>
          <ChromelessToolbar
            onRemove={props.onRemove}
            props={props.previewProps}
          />
        </BlockPopover>
      </BlockPopoverTrigger>
    </Box>
  );
}

function DefaultToolbarWithoutChrome({
  onRemove,
}: {
  onRemove(): void;
  props: Record<string, any>;
}) {
  return (
    <TooltipTrigger>
      <ActionButton onPress={onRemove} margin="regular">
        <Icon src={trashIcon} />
      </ActionButton>
      <Tooltip tone="critical">Remove</Tooltip>
    </TooltipTrigger>
  );
}
