import {
  Fragment,
  HTMLProps,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import {
  Boundary,
  ContextData,
  FloatingPortal,
  Middleware,
  MiddlewareState,
  Placement,
  ReferenceElement,
  autoUpdate,
  flip,
  hide,
  limitShift,
  offset,
  shift,
  size,
  useFloating,
} from '@floating-ui/react';
import {
  BaseStyleProps,
  classNames,
  css,
  tokenSchema,
  useStyleProps,
} from '@keystar/ui/style';

export type EditorPopoverProps = {
  /**
   * How the popover should adapt when constrained by available space.
   * @default 'flip'
   */
  adaptToBoundary?: 'flip' | 'stick' | 'stretch';
  /**
   * The clipping boundary area of the floating element.
   * @default 'clippingAncestors'
   */
  boundary?: Boundary;
  /** The contents of the floating element. */
  children: ReactNode;
  /** The placement of the floating element relative to the reference element. */
  placement?: Placement;
  /**
   * Whether to portal the floating element outside the DOM hierarchy of the parent component.
   * @default true
   */
  portal?: boolean;
  /** The reference element that the floating element should be positioned relative to. */
  reference: ReferenceElement;
} & Pick<
  BaseStyleProps,
  | 'height'
  | 'width'
  | 'maxHeight'
  | 'maxWidth'
  | 'minHeight'
  | 'minWidth'
  | 'UNSAFE_className'
  | 'UNSAFE_style'
>;

export type EditorPopoverRef = { context: ContextData; update: () => void };

export const EditorPopover = forwardRef<EditorPopoverRef, EditorPopoverProps>(
  function EditorPopover(props, forwardedRef) {
    props = useDefaultProps(props);
    const { children, reference, placement, portal } = props;
    const Wrapper = portal ? FloatingPortal : Fragment;

    const styleProps = useStyleProps(props);
    const [floating, setFloating] = useState<HTMLDivElement | null>(null);
    const middleware = getMiddleware(props);
    const { floatingStyles, context, update } = useFloating({
      elements: { reference, floating },
      middleware,
      placement,
      whileElementsMounted: autoUpdate,
    });

    useImperativeHandle(
      forwardedRef,
      () => {
        return { context, update };
      },
      [context, update]
    );

    return (
      <Wrapper>
        <DialogElement
          ref={setFloating}
          {...styleProps}
          style={{ ...floatingStyles, ...styleProps.style }}
        >
          {children}
        </DialogElement>
      </Wrapper>
    );
  }
);

// Utils
// ------------------------------

function useDefaultProps(props: EditorPopoverProps) {
  return Object.assign(
    {},
    {
      adaptToBoundary: 'flip',
      placement: 'bottom',
      portal: true,
    },
    props
  );
}

export const DEFAULT_OFFSET = 8;

/**
 * Watch for values returned from other middlewares and apply the appropriate
 * styles to the floating element.
 */
function applyStyles(): Middleware {
  return {
    name: 'applyStyles',
    async fn(state: MiddlewareState) {
      let { elements, middlewareData } = state;

      if (middlewareData.hide) {
        Object.assign(elements.floating.style, {
          visibility: middlewareData.hide.referenceHidden
            ? 'hidden'
            : 'visible',
        });
      }

      return {};
    },
  };
}

export function getMiddleware(
  props: EditorPopoverProps
): Array<Middleware | null | undefined | false> {
  const { adaptToBoundary, boundary } = props;

  // simulate clipping for portaled popovers
  let portalMiddlewares = [
    ...(props.portal ? [hide({ boundary })] : []),
    applyStyles(),
  ];

  // stick to the boundary
  if (adaptToBoundary === 'stick') {
    return [
      offset(DEFAULT_OFFSET),
      shift({
        boundary,
        crossAxis: true,
        padding: DEFAULT_OFFSET,
        limiter: limitShift({
          offset: ({ rects, middlewareData, placement }) => ({
            crossAxis:
              rects.floating.height +
              (middlewareData.offset?.y ?? 0) * (placement === 'top' ? -1 : 1),
          }),
        }),
      }),
      ...portalMiddlewares,
    ];
  }

  // stretch to fill
  if (adaptToBoundary === 'stretch') {
    return [
      offset(DEFAULT_OFFSET),
      flip({ boundary, padding: DEFAULT_OFFSET }),
      size({
        apply({ elements, availableHeight }) {
          Object.assign(elements.floating.style, {
            maxHeight: `${availableHeight}px`,
          });
        },
        boundary,
        padding: DEFAULT_OFFSET,
      }),
      ...portalMiddlewares,
    ];
  }

  // default: flip
  return [
    offset(DEFAULT_OFFSET),
    flip({ boundary, padding: DEFAULT_OFFSET }),
    shift({ padding: DEFAULT_OFFSET }),
    ...portalMiddlewares,
  ];
}

// Styled components
// ------------------------------

export const DialogElement = forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement>
>(function DialogElement(props, forwardedRef) {
  return (
    <div
      role="dialog"
      ref={forwardedRef}
      {...props}
      className={classNames(
        css({
          backgroundColor: tokenSchema.color.background.surface,
          borderRadius: tokenSchema.size.radius.medium,
          border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.emphasis}`,
          boxShadow: `${tokenSchema.size.shadow.medium} ${tokenSchema.color.shadow.regular}`,
          boxSizing: 'content-box', // resolves measurement/scroll issues related to border
          minHeight: tokenSchema.size.element.regular,
          minWidth: tokenSchema.size.element.regular,
          outline: 0,
        }),
        props.className
      )}
    />
  );
});
