// @ts-nocheck
'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, Fragment, useCallback } from 'react';
import { Combobox, Dialog, Transition } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

import { linkStylesShared, linkStylesIdle } from './navigation/header-nav';
import { cx } from '../utils';

function getRoutePathFromData(route: string): string {
  const url = new RegExp('/server/app/(.*?).html');
  const strippedUrl = url.exec(route);
  return strippedUrl ? `/${strippedUrl[1]}` : null;
}

function Result({ result }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const data = await result.data();
      setData(data);
    }
    fetchData();
  }, [result]);

  if (!data) return null;

  const routePath = getRoutePathFromData(data.raw_url);
  if (!routePath) {
    return null;
  }

  return (
    <Link href={routePath} className="block py-4">
      <h3 className="text-base font-medium">{data.meta.title}: </h3>
      <p
        className="[&_mark]:text-inherit mt-1.5 text-sm text-slate-9 [&_mark]:bg-transparent [&_mark]:font-medium"
        dangerouslySetInnerHTML={{ __html: data.excerpt }}
      />
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
            // See the `pagefind:local` npm script to "hack" the pagefind content for local dev.
            process.env.NODE_ENV === 'development'
              ? '/pagefind/pagefind.js'
              : // @ts-expect-error pagefind.js generated after build
                /* webpackIgnore: true */ '/_next/static/chunks/app/(public)/pagefind/pagefind.js'
          );
        } catch (e) {
          window.pagefind = { search: () => ({ results: [] }) };
        }
      }
      // Customise search options
      await window.pagefind.options?.({ excerptLength: 15 });
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

  // Close modal when user clicks on a search result (when route changes)
  const pathname = usePathname();
  const closeModal = useCallback(() => setIsOpen(false), []);
  useEffect(() => {
    closeModal();
  }, [closeModal, pathname]);

  async function handleSearch(e) {
    const query = e.target.value;
    setQuery(query);
    if (window.pagefind) {
      const search = await window.pagefind.debouncedSearch(query);
      setResults(search?.results ?? []);
    }
  }

  async function handleSelect(selection) {
    const data = await selection.data();
    const routePath = getRoutePathFromData(data.raw_url);
    if (routePath) {
      router.push(routePath);
    }
    setIsOpen(false);
  }

  return (
    <>
      {/* Toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className={cx(
          'flex items-center gap-2',
          linkStylesShared,
          linkStylesIdle
        )}
        title="⌘K"
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
        <span className="hidden sm:block">Search</span>
      </button>

      {/* Modal */}
      <Transition.Root
        show={isOpen}
        as={Fragment}
        afterLeave={() => {
          setResults([]);
          setQuery('');
        }}
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
            <Dialog.Overlay className="fixed inset-0 bg-slate-12 bg-opacity-75 backdrop-blur-[2px] transition-opacity" />
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
              className="relative mx-auto max-w-2xl divide-y divide-slate-5 overflow-hidden rounded-lg bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all"
              onChange={handleSelect}
            >
              <div className="flex items-center gap-2 px-6 py-4">
                <MagnifyingGlassIcon
                  className="pointer-events-none h-6 w-6 text-slate-9"
                  aria-hidden="true"
                />
                <Combobox.Input
                  className="w-full border-0 bg-transparent text-lg font-medium placeholder-slate-9 focus:outline-none"
                  placeholder="Search&hellip;"
                  onChange={e => handleSearch(e)}
                />
              </div>

              {results.length > 0 && (
                <div className="p-2">
                  <Combobox.Options
                    static
                    className="max-h-[40rem] divide-y divide-slate-3 overflow-y-auto px-4"
                  >
                    {results.map(result => (
                      <Combobox.Option
                        key={result.id}
                        value={result}
                        className={({ active }) =>
                          `${active ? '-mx-4 bg-slate-3 px-4' : ''}`
                        }
                      >
                        <Result result={result} />
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                </div>
              )}

              {query !== '' && results.length === 0 && (
                <p className="text-gray-500 p-6">No results for "{query}"</p>
              )}
            </Combobox>
          </Transition.Child>
        </Dialog>
      </Transition.Root>
    </>
  );
}
