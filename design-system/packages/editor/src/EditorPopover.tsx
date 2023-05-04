import { HTMLProps, ReactNode, forwardRef, useState } from 'react';
import {
  FloatingPortal,
  ReferenceElement,
  autoUpdate,
  flip,
  inline,
  limitShift,
  offset,
  shift,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { css, tokenSchema } from '@voussoir/style';

const DEFAULT_OFFSET = 8;

type EditorPopoverProps = {
  children: ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  reference?: ReferenceElement | null;
  sticky?: boolean;
};

export function EditorPopover(props: EditorPopoverProps) {
  const { children, isOpen, onOpenChange, reference } = props;

  const [floating, setFloating] = useState<HTMLDivElement | null>(null);
  const middleware = getMiddleware(props);
  const { floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange,
    middleware,
    whileElementsMounted: autoUpdate,
    elements: { reference, floating },
  });
  const role = useRole(context);
  const { getFloatingProps } = useInteractions([role]);

  if (!isOpen || !reference) {
    return null;
  }

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

function getMiddleware(props: EditorPopoverProps) {
  const { sticky } = props;

  if (sticky) {
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

  return [
    offset(DEFAULT_OFFSET),
    flip({ padding: DEFAULT_OFFSET }),
    shift({ padding: DEFAULT_OFFSET }),
    inline(),
  ];
}

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
      })}
    />
  );
});
