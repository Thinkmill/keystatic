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
    <div className="pb-6 lg:-ml-4">
      <h3
        id={id}
        className={`mb-2 text-xs font-normal uppercase text-slate-9 px-4${
          visuallyHideTitle ? ' sr-only' : ''
        }`}
      >
        {title}
      </h3>
      <ul aria-labelledby={id}>{children}</ul>
    </div>
  );
}
