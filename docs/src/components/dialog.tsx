import { Fragment, ReactElement, ReactNode } from 'react';
import { Dialog as DialogHui, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

type DialogProps = {
  open: boolean;
  onClose: () => void;
  header: () => ReactElement;
  children: ReactNode;
};

export default function Dialog({
  open,
  onClose,
  header,
  children,
}: DialogProps) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <DialogHui as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-9 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 sm:items-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogHui.Panel className="relative transform overflow-hidden rounded-lg bg-white transition-all sm:my-8 sm:max-w-xl">
                {/* Close button */}
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-lg bg-sand-3 p-1.5 hover:bg-sand-4 focus:outline-none focus:ring-2 focus:ring-iris-7 focus:ring-offset-2 active:bg-sand-5"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
                <header className="bg-sand-2 px-6 pb-6 pt-12 sm:px-8">
                  {header()}
                </header>
                <section>
                  <div className="flex flex-col gap-6 p-6 sm:p-8">
                    {children}
                  </div>
                </section>
              </DialogHui.Panel>
            </Transition.Child>
          </div>
        </div>
      </DialogHui>
    </Transition.Root>
  );
}
