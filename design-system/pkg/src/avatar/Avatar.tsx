import { filterDOMProps } from '@react-aria/utils';
import { AriaLabelingProps, DOMProps } from '@react-types/shared';
import {
  forwardRef,
  ForwardedRef,
  ForwardRefExoticComponent,
  Ref,
} from 'react';

import { useSlotProps } from '@keystar/ui/slots';
import {
  BaseStyleProps,
  classNames,
  css,
  tokenSchema,
  useStyleProps,
  SizeElement,
} from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';

export type AvatarProps = {
  /**
   * Text description of the avatar. When no `alt` is provided the avatar is
   * treated as a decorative element.
   */
  alt?: string;
  /**
   * The size of the avatar.
   * @default 'regular'
   */
  size?: SizeElement;
} & (
  | {
      /** The name used for the initials. */
      name: string;
    }
  | {
      /** The `src` attribute of the image. */
      src: string;
    }
) &
  Omit<BaseStyleProps, 'height' | 'width'> &
  DOMProps &
  AriaLabelingProps;

/**
 * An avatar is a thumbnail representation of an entity, such as a user or an
 * organization.
 */
export const Avatar: ForwardRefExoticComponent<
  AvatarProps & { ref?: Ref<HTMLDivElement> }
> = forwardRef(function Avatar(
  props: AvatarProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  props = useSlotProps(props, 'avatar');
  const { alt, size = 'regular', ...otherProps } = props;
  const styleProps = useStyleProps(otherProps);

  return (
    <div
      ref={forwardedRef}
      role="img"
      aria-label={alt}
      data-size={size === 'regular' ? undefined : size}
      {...styleProps}
      {...filterDOMProps(otherProps)}
      className={classNames(
        styleProps.className,
        css({
          alignItems: 'center',
          backgroundColor: tokenSchema.color.background.surfaceTertiary,
          borderRadius: '50%',
          display: 'inline-flex',
          flexShrink: 0,
          fontSize: 'var(--avatar-text-size)',
          height: 'var(--avatar-size)',
          justifyContent: 'center',
          overflow: 'hidden',
          width: 'var(--avatar-size)',
          userSelect: 'none',

          // sizes
          '--avatar-size': tokenSchema.size.element.regular,
          '--avatar-text-size': tokenSchema.typography.text.regular.size,
          '&[data-size=xsmall]': {
            '--avatar-size': tokenSchema.size.element.xsmall,
            '--avatar-text-size': tokenSchema.typography.text.small.size,
          },
          '&[data-size=small]': {
            '--avatar-size': tokenSchema.size.element.small,
            '--avatar-text-size': tokenSchema.typography.text.small.size,
          },
          '&[data-size=medium]': {
            '--avatar-size': tokenSchema.size.element.medium,
            '--avatar-text-size': tokenSchema.typography.text.medium.size,
          },
          '&[data-size=large]': {
            '--avatar-size': tokenSchema.size.element.large,
            '--avatar-text-size': tokenSchema.typography.text.large.size,
          },
          '&[data-size=xlarge]': {
            '--avatar-size': tokenSchema.size.element.xlarge,
            '--avatar-text-size': tokenSchema.typography.text.large.size,
          },
        })
      )}
    >
      {'src' in props ? (
        <div
          className={css({
            height: '100%',
            width: '100%',
          })}
          style={{
            backgroundImage: `url(${props.src})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        />
      ) : (
        <Text
          aria-hidden
          color="neutralSecondary"
          weight="medium"
          UNSAFE_className={css({ fontSize: 'inherit' })}
        >
          {getInitials(props.name, size)}
        </Text>
      )}
    </div>
  );
});

function getInitials(name: string, size: SizeElement) {
  const words = name.split(' ');
  const first = words[0].charAt(0);
  const last = words[words.length - 1].charAt(0);

  if (size === 'xsmall') {
    return `${first}`.toUpperCase();
  }

  return `${first}${last}`.toUpperCase();
}
