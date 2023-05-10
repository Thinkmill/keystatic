import { HTMLProps, forwardRef } from 'react';
import { css, tokenSchema } from '@voussoir/style';

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
