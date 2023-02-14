import { trashIcon } from '@voussoir/icon/icons/trashIcon';
import { Icon } from '@voussoir/icon';
import { ReactNode, useRef } from 'react';
import { RenderElementProps } from 'slate-react';
import { ComponentBlock, PreviewPropsForToolbar, ObjectField, ComponentSchema } from './api';
import { Tooltip, TooltipTrigger } from '@voussoir/tooltip';
import { Button } from '@voussoir/button';
import { useOverlayTrigger } from '@react-aria/overlays';
import { useOverlayTriggerState } from '@react-stately/overlays';
import { Popover } from '@voussoir/overlays';
import { Box } from '@voussoir/layout';

export function ChromelessComponentBlockElement(props: {
  renderedBlock: ReactNode;
  componentBlock: ComponentBlock & { chromeless: true };
  previewProps: PreviewPropsForToolbar<ObjectField<Record<string, ComponentSchema>>>;
  isOpen: boolean;
  onRemove: () => void;
  attributes: RenderElementProps['attributes'];
}) {
  const ChromelessToolbar = props.componentBlock.toolbar ?? DefaultToolbarWithoutChrome;
  const triggerRef = useRef<HTMLDivElement>(null);
  const state = useOverlayTriggerState({
    isOpen: props.isOpen,
  });
  const { triggerProps, overlayProps } = useOverlayTrigger({ type: 'dialog' }, state, triggerRef);

  return (
    <Box {...props.attributes} marginY="xlarge">
      <div {...triggerProps} ref={triggerRef}>
        {props.renderedBlock}
      </div>
      <Popover {...overlayProps} isNonModal state={state} triggerRef={triggerRef}>
        <ChromelessToolbar onRemove={props.onRemove} props={props.previewProps} />
      </Popover>
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
      <Button tone="critical" onPress={onRemove}>
        <Icon src={trashIcon} />
      </Button>
      <Tooltip>Remove</Tooltip>
    </TooltipTrigger>
  );
}
