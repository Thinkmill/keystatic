import { ReactNode } from 'react';

export function CodeEditorChrome({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl bg-sky-950 shadow-2xl">
      {/* <!-- Header bar --> */}
      <div className="flex border-b border-sky-900">
        {/* <!-- Controls --> */}
        <div className="col-span-2 flex gap-2 p-3">
          <span className="h-3 w-3 shrink-0 rounded-full bg-red-400" />
          <span className="h-3 w-3 shrink-0 rounded-full bg-amber-400" />
          <span className="h-3 w-3 shrink-0 rounded-full bg-green-500" />
        </div>

        {/* <!-- File tab --> */}
        <div className="flex items-center overflow-hidden px-2 py-1 text-center text-sm text-sky-100 -mb-px border-l border-r border-x-sky-900 border-t-sky-900 border-b border-b-sky-950">
          content.mdoc
        </div>
      </div>

      <div className="p-3">{children}</div>
    </div>
  );
}
