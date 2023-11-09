import { AriaLabelingProps, DOMProps } from '@react-types/shared';
import { filterDOMProps } from '@react-aria/utils';
import {
  ReactNode,
  forwardRef,
  ForwardedRef,
  ForwardRefExoticComponent,
  Ref,
} from 'react';

import {
  BaseStyleProps,
  classNames,
  css,
  tokenSchema,
  useStyleProps,
} from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';

type StatusLightTones =
  | 'accent'
  | 'caution'
  | 'critical'
  | 'neutral'
  | 'pending'
  | 'positive';

export type StatusLightProps = {
  /** The content to display as the label. */
  children?: ReactNode;
  /**
   * An accessibility role for the status light. Should be set when the status
   * can change at runtime, and no more than one status light will update simultaneously.
   */
  role?: 'status';
  /**
   * The tone of the status light, which indicates semantic meaning.
   * @default 'neutral'
   */
  tone?: StatusLightTones;
} & BaseStyleProps &
  DOMProps &
  AriaLabelingProps;

/** Status lights describe the state or condition of an entity. */
export const StatusLight: ForwardRefExoticComponent<
  StatusLightProps & { ref?: Ref<HTMLDivElement> }
> = forwardRef(function StatusLight(
  props: StatusLightProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let { children, role, tone = 'neutral' } = props;
  const styleProps = useStyleProps(props);

  if (!children && !props['aria-label']) {
    console.warn(
      'If no children are provided, an aria-label must be specified'
    );
  }

  if (!role && (props['aria-label'] || props['aria-labelledby'])) {
    console.warn('A labelled StatusLight must have a role.');
  }

  return (
    <div
      {...filterDOMProps(props, { labelable: true })}
      {...styleProps}
      ref={forwardedRef}
      data-tone={tone}
      className={classNames(
        css({
          alignItems: 'center',
          color: tokenSchema.color.foreground.neutral,
          display: 'flex',
          gap: tokenSchema.size.space.regular,
          height: tokenSchema.size.element.small,

          // indicator
          '&::before': {
            content: '""',
            backgroundColor: tokenSchema.color.foreground.neutralTertiary,
            borderRadius: tokenSchema.size.radius.full,
            height: tokenSchema.size.scale[100],
            width: tokenSchema.size.scale[100],
          },

          // special case for neutral
          '&[data-tone=neutral]': {
            color: tokenSchema.color.foreground.neutralSecondary,
          },

          '&[data-tone=accent]::before': {
            backgroundColor: tokenSchema.color.background.accentEmphasis,
          },
          '&[data-tone=caution]::before': {
            backgroundColor: tokenSchema.color.background.cautionEmphasis,
          },
          '&[data-tone=critical]::before': {
            backgroundColor: tokenSchema.color.background.criticalEmphasis,
          },
          '&[data-tone=pending]::before': {
            backgroundColor: tokenSchema.color.background.pendingEmphasis,
          },
          '&[data-tone=positive]::before': {
            backgroundColor: tokenSchema.color.background.positiveEmphasis,
          },
        }),
        styleProps.className
      )}
    >
      {isReactText(children) ? (
        <Text color="inherit">{children}</Text>
      ) : (
        children
      )}
    </div>
  );
});
