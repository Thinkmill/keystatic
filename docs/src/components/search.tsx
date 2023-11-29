// @ts-nocheck
'use client';

import Link from 'next/link';
import { useRouter, usePathName } from 'next/navigation';
import { useState, useEffect, Fragment, useCallback } from 'react';
import { Combobox, Dialog, Transition } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

function Result({ result, isActive }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const data = await result.data();
      setData(data);
    }
    fetchData();
  }, [result]);

  if (!data) return null;

  const url = new RegExp('/server/app/(.*?).html');
  const strippedUrl = url.exec(data.raw_url);

  if (!strippedUrl) {
    return null;
  }

  return (
    <Link
      href={strippedUrl[1]}
      className={`block p-6 ${isActive && 'bg-iris-3'}`}
    >
      <h3 className="text-xl font-medium">{data.meta.title}</h3>
      <p className="mt-2" dangerouslySetInnerHTML={{ __html: data.excerpt }} />
    </Link>
  );
}

export function Search() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);

  const router = useRouter();

  // Wiring up pagefinder
  useEffect(() => {
    async function loadPagefind() {
      if (typeof window.pagefind === 'undefined') {
        try {
          window.pagefind = await import(
            // @ts-expect-error pagefind.js generated after build
            process.env.NODE_ENV === 'development'
              ? '/pagefind/pagefind.js'
              : /* webpackIgnore: true */ './app/(public)/pagefind/pagefind.js'
          );
        } catch (e) {
          window.pagefind = { search: () => ({ results: [] }) };
        }
      }
    }
    loadPagefind();
  }, []);

  // Command + K search combobox
  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        setIsOpen(!isOpen);
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  // Close modal when user clicks on a search result
  const pathname = usePathName;
  const closeModal = useCallback(() => setIsOpen(false), []);
  useEffect(() => closeModal(), [closeModal, pathname]);

  async function handleSearch(e) {
    const query = e.target.value;
    setQuery(query);
    if (window.pagefind) {
      const search = await window.pagefind.search(query);
      setResults(search.results);
    }
  }

  async function handleSelect(selection) {
    const data = await selection.data();
    const url = new RegExp('/server/app/(.*?).html');
    const strippedUrl = url.exec(data.raw_url);
    router.push(`/${strippedUrl[1]}`);
    setIsOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-md border border-slate-11/10 bg-white/10 px-2 py-1 backdrop-blur hover:bg-white/20"
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
        <span className="text-sm">(⌘K)</span>
      </button>

      <Transition.Root
        show={isOpen}
        as={Fragment}
        afterLeave={() => setQuery('')}
      >
        <Dialog
          className="fixed inset-0 z-30 mt-12 overflow-y-auto p-4 px-6"
          onClose={setIsOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-slate-12 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Combobox
              as="div"
              className="relative mx-auto max-w-xl divide-y divide-slate-5 overflow-hidden rounded-lg bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all"
              onChange={handleSelect}
            >
              <div className="flex items-center gap-2 px-4">
                <MagnifyingGlassIcon
                  className="text-gray-500 pointer-events-none h-6 w-6"
                  aria-hidden="true"
                />
                <Combobox.Input
                  className="h-12 w-full border-0 bg-transparent text-slate-11 placeholder-slate-9 focus:outline-none"
                  placeholder="Search..."
                  onChange={e => handleSearch(e)}
                />
              </div>

              {results.length > 0 && (
                <Combobox.Options
                  static
                  className="max-h-[40rem] divide-y divide-slate-5 overflow-y-auto"
                >
                  {results.map(result => (
                    <Combobox.Option key={result.id} value={result}>
                      {({ active }) => (
                        <Result result={result} isActive={active} />
                      )}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              )}

              {query !== '' && results.length === 0 && (
                <p className="text-gray-500 p-6">No results found.</p>
              )}
            </Combobox>
          </Transition.Child>
        </Dialog>
      </Transition.Root>
    </>
  );
}
