import React, {
  ReactNode,
  forwardRef,
  ElementType,
  ReactElement,
  AllHTMLAttributes,
} from 'react';

export type HTMLTag = keyof JSX.IntrinsicElements & keyof HTMLElementTagNameMap;
// export type PropsWithElementType<P = unknown> = P & { elementType?: HTMLTag };
export type PropsWithElementType<P = unknown> = P & {
  elementType?: ElementType;
};

// https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
type LegacyAttributes = 'background' | 'bgColor' | 'color' | 'height' | 'width';

export type CompWithAsProp<
  BaseProps,
  // this is unused for now but kept for future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  DefaultElementType extends HTMLTag,
> = (
  props: Omit<
    AllHTMLAttributes<HTMLElement>,
    keyof BaseProps | LegacyAttributes
  > &
    BaseProps & {
      // these types are less specific than they could be but for now
      // typescript not being ridiculously slow is more important
      // they could possibly get more specific later
      elementType?: HTMLTag;
      ref?: React.Ref<HTMLElement>;
    }
) => ReactElement | null;

/**
 * This is a hack for sure. The thing is, getting a component to intelligently
 * infer props based on a component or JSX string passed into an `elementType` prop is
 * kind of a huge pain. Getting it to work and satisfy the constraints of
 * `forwardRef` seems dang near impossible. To avoid needing to do this awkward
 * type song-and-dance every time we want to forward a ref into a component
 * that accepts an `elementType` prop, we abstract all of that mess to this function for
 * the time time being.
 */
export function forwardRefWithAs<BaseProps, DefaultElementType extends HTMLTag>(
  render: (
    props: BaseProps & { elementType?: ElementType },
    ref: React.Ref<any>
  ) => Exclude<ReactNode, undefined>
): CompWithAsProp<BaseProps, DefaultElementType> {
  return forwardRef(render as any) as any;
}
