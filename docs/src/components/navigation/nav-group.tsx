import { ReactNode, useId } from 'react';

export function NavGroup({
  title,
  children,
  visuallyHideTitle,
}: {
  title: string;
  children: ReactNode;
  visuallyHideTitle?: boolean;
}) {
  const id = useId();

  return (
    <div className="lg:-ml-4 pb-6">
      <h3
        id={id}
        className={`text-xs uppercase font-normal text-neutral-500 mb-2 px-4${
          visuallyHideTitle ? ' sr-only' : ''
        }`}
      >
        {title}
      </h3>
      <ul aria-labelledby={id}>{children}</ul>
    </div>
  );
}
