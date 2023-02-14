import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

type IntersectionObserverContextType = {
  observe?: (target: Element) => () => void;
  entries: readonly IntersectionObserverEntry[];
};

const IntersectionObserverContext = createContext<
  IntersectionObserverContextType | undefined
>(undefined);

const merge = <T, K>(keyof: (item: T) => K, ...args: (readonly T[])[]): T[] => {
  const entries = args.flat().map(item => [keyof(item), item] as const);
  return Array.from(new Map(entries).values());
};

const defaultOptions = { threshold: 1.0 };

export const IntersectionObserverProvider = ({
  children,
  options = defaultOptions,
}: {
  children: ReactNode;
  options?: IntersectionObserverInit;
}) => {
  const [entries, setEntries] = useState<
    IntersectionObserverContextType['entries']
  >([]);

  const observer = useMemo(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    return new IntersectionObserver(
      entries =>
        setEntries(prevEntries =>
          merge(entry => entry.target, prevEntries, entries)
        ),
      options
    );
  }, [options]);

  useEffect(
    () => (observer ? () => observer.disconnect() : undefined),
    [observer]
  );

  const observe = useMemo(() => {
    if (!observer) return;
    return (target: Element) => {
      observer.observe(target);
      return () => {
        observer.unobserve(target);
        setEntries(entries => entries.filter(entry => entry.target !== target));
      };
    };
  }, [observer]);

  return (
    <IntersectionObserverContext.Provider value={{ observe, entries }}>
      {children}
    </IntersectionObserverContext.Provider>
  );
};

export const useObserve = <T extends Element>() => {
  const context = useContext(IntersectionObserverContext);
  if (context === undefined) {
    throw new Error(
      'useObserve must be used within a IntersectionObserverProvider'
    );
  }
  const { observe } = context;
  const ref = useRef<T>(null);
  useEffect(
    () => (ref.current ? observe?.(ref.current) : undefined),
    [observe, ref]
  );
  return { ref };
};

export const useEntries = () => {
  const context = useContext(IntersectionObserverContext);
  if (context === undefined) {
    throw new Error(
      'useEntries must be used within a IntersectionObserverProvider'
    );
  }
  return context.entries;
};
