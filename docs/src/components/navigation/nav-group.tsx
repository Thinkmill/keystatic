import { ReactNode, useId } from 'react';

export function NavGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const id = useId();

  return (
    <div className="lg:-ml-4 pb-6">
      <h3
        id={id}
        className="text-xs uppercase font-normal text-stone-500 mb-2 px-4"
      >
        {title}
      </h3>
      <ul aria-labelledby={id}>{children}</ul>
    </div>
  );
}
