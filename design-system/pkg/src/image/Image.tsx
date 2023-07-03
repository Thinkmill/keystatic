import { filterDOMProps } from '@react-aria/utils';
import { DOMProps } from '@react-types/shared';
import { warning } from 'emery';
import { ReactEventHandler, ReactNode } from 'react';

import { AspectRatio, AspectRatioProps } from '@keystar/ui/layout';
import { useSlotProps } from '@keystar/ui/slots';
import {
  BoxStyleProps,
  classNames,
  css,
  useStyleProps,
} from '@keystar/ui/style';

const supportedProps = new Set(['loading', 'onError', 'onLoad', 'src']);

export type ImageProps = {
  /**
   * Text description of the image.
   */
  alt: string;
  /**
   * Overlay content to be displayed on top of the image.
   */
  children?: ReactNode;
  /**
   * The preferred aspect ratio for the box, which will be used in the
   * calculation of auto sizes and some other layout functions. See
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio).
   */
  aspectRatio: AspectRatioProps['value'];
  /**
   * The URL of the image.
   */
  src: string;
  /**
   * Callback that is called when the image fails to load because of an error.
   */
  onError?: ReactEventHandler<HTMLImageElement>;
  /**
   * Callback that is called when the image loads successfully.
   */
  onLoad?: ReactEventHandler<HTMLImageElement>;
  /**
   * How the image should be resized to fit its container. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit).
   *
   * @default 'cover'
   */
  fit?: 'contain' | 'cover';
  /**
   * How to handle loading of the image. When `"lazy"`, loading is deferred
   * until the image reaches a distance threshold from the viewport. See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/loading).
   *
   * @default 'eager'
   */
  loading?: 'eager' | 'lazy';
} & BoxStyleProps &
  DOMProps;

/**
 * A wrapper around the native image tag with support for common behaviour.
 */
export function Image(props: ImageProps) {
  props = useSlotProps(props, 'image');
  const { alt, aspectRatio, children, fit = 'cover', ...otherProps } = props;
  const styleProps = useStyleProps(otherProps);

  warning(
    alt != null,
    'The `alt` prop was not provided to an image. ' +
      'Add `alt` text for screen readers, or set `alt=""` prop to indicate that the image ' +
      'is decorative or redundant with displayed text and should not be announced by screen readers.'
  );

  return (
    <AspectRatio
      value={aspectRatio}
      UNSAFE_className={styleProps.className}
      UNSAFE_style={styleProps.style}
    >
      <img
        {...filterDOMProps(otherProps, { propNames: supportedProps })}
        alt={alt}
        role={alt === '' ? 'presentation' : undefined}
        className={classNames(css({ objectFit: fit }))}
      />
      {children}
    </AspectRatio>
  );
}
