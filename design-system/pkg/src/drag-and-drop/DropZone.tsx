'use client';

import { DropOptions, useClipboard, useDrop } from '@react-aria/dnd';
import { useFocusRing } from '@react-aria/focus';
import { useLocalizedStringFormatter } from '@react-aria/i18n';
import {
  filterDOMProps,
  mergeProps,
  useLabels,
  useObjectRef,
  useSlotId,
} from '@react-aria/utils';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { AriaLabelingProps, DOMProps } from '@react-types/shared';
import { useMemo, useRef } from 'react';

import {
  BaseStyleProps,
  ClassList,
  classNames,
  css,
  toDataAttributes,
  tokenSchema,
  useStyleProps,
} from '@keystar/ui/style';
import { WithRenderProps } from '@keystar/ui/types';
import { useRenderProps } from '@keystar/ui/utils';
import { forwardRefWithAs } from '@keystar/ui/utils/ts';

import localizedMessages from './l10n';
import { SlotProvider } from '../slots';

export type DropZoneProps = Omit<
  DropOptions,
  'getDropOperationForPoint' | 'ref' | 'hasDropButton'
> &
  WithRenderProps<{ isDropTarget: boolean }> &
  BaseStyleProps &
  DOMProps &
  AriaLabelingProps;

export const dropZoneClassList = new ClassList('DropZone');

/**
 * A DropZone is an area into which one or multiple objects can be dragged and
 * dropped.
 */
export const DropZone = forwardRefWithAs<DropZoneProps, 'div'>(
  function DropZone(props, forwardedRef) {
    let dropzoneRef = useObjectRef(forwardedRef);
    let buttonRef = useRef<HTMLButtonElement>(null);
    let { dropProps, dropButtonProps, isDropTarget } = useDrop({
      ...props,
      ref: buttonRef,
      hasDropButton: true,
    });
    let { clipboardProps } = useClipboard({
      onPaste: items =>
        props.onDrop?.({
          type: 'drop',
          items,
          x: 0,
          y: 0,
          dropOperation: 'copy',
        }),
    });
    let { focusProps, isFocused, isFocusVisible } = useFocusRing();
    let stringFormatter = useLocalizedStringFormatter(localizedMessages);
    let labelId = useSlotId();
    let dropzoneId = useSlotId();
    let ariaLabel =
      props['aria-label'] || stringFormatter.format('dropzoneLabel');
    let messageId = props['aria-labelledby'];
    // Chrome + VO will not announce the drop zone's accessible name if useLabels combines an aria-label and aria-labelledby
    let ariaLabelledby = [dropzoneId, labelId, messageId]
      .filter(Boolean)
      .join(' ');
    let labelProps = useLabels({ 'aria-labelledby': ariaLabelledby });

    // Use the "label" slot so consumers can choose whether to put it on a
    // `Heading` or `Text` instance.
    // TODO: warn when no label is provided
    let slots = {
      icon: { color: isDropTarget ? 'accent' : 'neutral' },
      label: {
        id: labelId,
        color: isDropTarget ? 'accent' : undefined,
      },
    } as const;

    let renderProps = useMemo(() => ({ isDropTarget }), [isDropTarget]);
    let children = useRenderProps(props, renderProps);
    let styleProps = useStyleProps(props);
    let ElementType = props.elementType || 'div';

    return (
      <ElementType
        {...dropProps}
        {...styleProps}
        {...filterDOMProps(props, { labelable: true })}
        {...toDataAttributes(
          { isDropTarget, isFocused, isFocusVisible },
          { omitFalsyValues: true, trimBooleanKeys: true }
        )}
        ref={dropzoneRef}
        className={classNames(
          dropZoneClassList.element('root'),
          css({
            border: `${tokenSchema.size.border.medium} dashed ${tokenSchema.color.border.neutral}`,
            borderRadius: tokenSchema.size.radius.regular,
            display: 'flex',
            flexDirection: 'column',
            gap: tokenSchema.size.space.medium,

            '&[data-drop-target]': {
              backgroundColor: tokenSchema.color.alias.backgroundSelected,
              borderColor: tokenSchema.color.alias.focusRing,
              borderStyle: 'solid',
              cursor: 'copy',
            },
            '&[data-focus-visible]': {
              borderColor: tokenSchema.color.alias.focusRing,
            },
          }),
          styleProps.className
        )}
      >
        <VisuallyHidden>
          {/* Added as a workaround for a Chrome + VO bug where it will not announce the aria label */}
          <div id={dropzoneId} aria-hidden="true">
            {ariaLabel}
          </div>
          <button
            {...mergeProps(
              dropButtonProps,
              focusProps,
              clipboardProps,
              labelProps
            )}
            ref={buttonRef}
          />
        </VisuallyHidden>

        <SlotProvider slots={slots}>{children}</SlotProvider>
      </ElementType>
    );
  }
);
