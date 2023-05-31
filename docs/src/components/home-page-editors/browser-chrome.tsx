import { ReactNode } from 'react';

export function BrowserChrome({ children }: { children: ReactNode }) {
  return (
    <div className="h-[31rem] rounded-xl border border-neutral-200 bg-neutral-50 shadow-2xl w-[42rem]">
      {/* <!-- Header bar --> */}
      <div className="grid grid-cols-7 px-2 pb-3 pt-2">
        {/* <!-- Controls --> */}
        <div className="col-span-2 flex gap-2 p-1">
          <span className="h-3 w-3 shrink-0 rounded-full bg-red-400" />
          <span className="h-3 w-3 shrink-0 rounded-full bg-amber-400" />
          <span className="h-3 w-3 shrink-0 rounded-full bg-green-500" />
        </div>

        {/* <!-- URL bar --> */}
        <div className="col-span-3 overflow-hidden rounded bg-neutral-200 px-2 py-1 text-center text-sm text-neutral-600">
          localhost:3000
        </div>
      </div>

      <div className="px-3 pb-3">{children}</div>
    </div>
  );
}
