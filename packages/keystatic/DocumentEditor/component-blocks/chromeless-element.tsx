import { trashIcon } from '@voussoir/icon/icons/trashIcon';
import { Icon } from '@voussoir/icon';
import { ReactNode, useRef } from 'react';
import { RenderElementProps } from 'slate-react';
import {
  ComponentBlock,
  PreviewPropsForToolbar,
  ObjectField,
  ComponentSchema,
} from './api';
import { Tooltip, TooltipTrigger } from '@voussoir/tooltip';
import { ActionButton } from '@voussoir/button';
import { useOverlayTrigger } from '@react-aria/overlays';
import { useOverlayTriggerState } from '@react-stately/overlays';
import { Popover } from '@voussoir/overlays';
import { Box } from '@voussoir/layout';
import { useSelectedOrFocusWithin } from '../utils';

export function ChromelessComponentBlockElement(props: {
  renderedBlock: ReactNode;
  componentBlock: ComponentBlock & { chromeless: true };
  previewProps: PreviewPropsForToolbar<
    ObjectField<Record<string, ComponentSchema>>
  >;
  onRemove: () => void;
  attributes: RenderElementProps['attributes'];
}) {
  const ChromelessToolbar =
    props.componentBlock.toolbar ?? DefaultToolbarWithoutChrome;
  const triggerRef = useRef<HTMLDivElement>(null);
  const [selectedOrFocused, popoverElementProps] = useSelectedOrFocusWithin();
  const state = useOverlayTriggerState({
    isOpen: selectedOrFocused,
  });
  const {
    triggerProps: { onPress, ...triggerProps },
    overlayProps,
  } = useOverlayTrigger({ type: 'dialog' }, state, triggerRef);

  return (
    <Box {...props.attributes} marginY="xlarge">
      <div {...triggerProps} ref={triggerRef}>
        {props.renderedBlock}
      </div>
      <Popover
        {...overlayProps}
        isNonModal
        state={state}
        triggerRef={triggerRef}
        hideArrow
      >
        <div {...popoverElementProps}>
          <ChromelessToolbar
            onRemove={props.onRemove}
            props={props.previewProps}
          />
        </div>
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
      <ActionButton onPress={onRemove} margin="regular">
        <Icon src={trashIcon} />
      </ActionButton>
      <Tooltip tone="critical">Remove</Tooltip>
    </TooltipTrigger>
  );
}
