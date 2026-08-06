'use client';

import { useLocalizedStringFormatter } from 'react-aria/useLocalizedStringFormatter';
import {
  DropZone as AriaDropZone,
  type DropZoneProps as AriaDropZoneProps,
} from 'react-aria-components/DropZone';
import { AriaLabelingProps, DOMProps } from '@react-types/shared';
import { ForwardedRef, forwardRef } from 'react';

import {
  BaseStyleProps,
  ClassList,
  classNames,
  css,
  filterStyleProps,
  tokenSchema,
  useStyleProps,
} from '@keystar/ui/style';
import { WithRenderProps } from '@keystar/ui/types';

import localizedMessages from './l10n';
import { SlotProvider } from '../slots';

export type DropZoneProps = Omit<
  AriaDropZoneProps,
  'children' | 'className' | 'style'
> &
  WithRenderProps<{ isDropTarget: boolean }> &
  BaseStyleProps &
  DOMProps &
  AriaLabelingProps & {
    className?: string;
  };

export const dropZoneClassList = new ClassList('DropZone');

/** A DropZone is an area into which one or multiple objects may be dropped. */
export const DropZone = forwardRef(function DropZone(
  props: DropZoneProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let stringFormatter = useLocalizedStringFormatter(localizedMessages);
  let { className, ...styleInputProps } = props;
  let styleProps = useStyleProps(styleInputProps);
  let children = props.children;

  return (
    <AriaDropZone
      {...(filterStyleProps(props, ['className']) as AriaDropZoneProps)}
      {...styleProps}
      aria-label={
        props['aria-label'] || stringFormatter.format('dropzoneLabel')
      }
      ref={forwardedRef}
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
        className,
        styleProps.className
      )}
    >
      {({ isDropTarget }) => (
        <SlotProvider
          slots={{
            icon: { color: isDropTarget ? 'accent' : 'neutral' },
            label: { color: isDropTarget ? 'accent' : undefined },
          }}
        >
          {typeof children === 'function'
            ? children({ isDropTarget })
            : children}
        </SlotProvider>
      )}
    </AriaDropZone>
  );
});
