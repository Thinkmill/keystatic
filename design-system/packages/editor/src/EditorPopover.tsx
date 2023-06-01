import {
  HTMLProps,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import {
  ContextData,
  FloatingPortal,
  Middleware,
  Placement,
  ReferenceElement,
  autoUpdate,
  flip,
  inline,
  limitShift,
  offset,
  shift,
  size,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { css, tokenSchema } from '@voussoir/style';

export type EditorPopoverProps = {
  children: ReactNode;
  reference: ReferenceElement;
  placement?: Placement;
  /**
   * How the popover should adapt when constrained by available space in the viewport.
   * @default 'flip'
   */
  adaptToViewport?: 'flip' | 'stick' | 'stretch';
};

export type EditorPopoverRef = { context: ContextData; update: () => void };

export const EditorPopover = forwardRef<EditorPopoverRef, EditorPopoverProps>(
  function EditorPopover(props, forwardedRef) {
    const { children, reference, placement = 'bottom' } = props;

    const [floating, setFloating] = useState<HTMLDivElement | null>(null);
    const middleware = getMiddleware(props);
    const { floatingStyles, context, update } = useFloating({
      elements: { reference, floating },
      middleware,
      placement,
      whileElementsMounted: autoUpdate,
    });
    const role = useRole(context);
    const { getFloatingProps } = useInteractions([role]);

    useImperativeHandle(
      forwardedRef,
      () => {
        return { context, update };
      },
      [context, update]
    );

    return (
      <FloatingPortal>
        <DialogElement
          ref={setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          {children}
        </DialogElement>
      </FloatingPortal>
    );
  }
);

// Utils
// ------------------------------

export const DEFAULT_OFFSET = 8;

export function getMiddleware(
  props: EditorPopoverProps
): Array<Middleware | null | undefined | false> {
  const { adaptToViewport } = props;

  if (adaptToViewport === 'stick') {
    return [
      offset(DEFAULT_OFFSET),
      shift({
        crossAxis: true,
        padding: DEFAULT_OFFSET,
        limiter: limitShift({
          offset: ({ rects }) => ({
            crossAxis: rects.floating.height,
          }),
        }),
      }),
    ];
  }
  if (adaptToViewport === 'stretch') {
    return [
      flip(),
      offset(DEFAULT_OFFSET),
      size({
        apply({ elements, availableHeight }) {
          Object.assign(elements.floating.style, {
            maxHeight: `${availableHeight}px`,
            // minWidth: `${rects.reference.width}px`,
          });
        },
        padding: DEFAULT_OFFSET,
      }),
    ];
  }

  return [
    offset(DEFAULT_OFFSET),
    flip({ padding: DEFAULT_OFFSET }),
    shift({ padding: DEFAULT_OFFSET }),
    inline(),
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
      ref={forwardedRef}
      {...props}
      className={css({
        backgroundColor: tokenSchema.color.background.surface,
        borderRadius: tokenSchema.size.radius.medium,
        border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.emphasis}`,
        boxShadow: `${tokenSchema.size.shadow.medium} ${tokenSchema.color.shadow.regular}`,
        minHeight: tokenSchema.size.element.regular,
        minWidth: tokenSchema.size.element.regular,
        outline: 0,
        overflowY: 'auto',
      })}
    />
  );
});
