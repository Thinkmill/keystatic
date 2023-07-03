import { css } from '@keystar/ui/style';
import { HTMLAttributes, forwardRef } from 'react';

export const NotEditable = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function NotEditable({ className, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      className={[
        css({ userSelect: 'none', whiteSpace: 'initial' }),
        className,
      ].join(' ')}
      contentEditable={false}
    />
  );
});
