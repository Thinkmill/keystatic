type NavigateOptions = {
  /** Replace the current history entry instead of adding a new one. */
  replace?: boolean;
};

type Navigate = (href: string, options?: NavigateOptions) => void;

export type Router = {
  /** Perform client-side navigation. */
  navigate: Navigate;
  /** Resolve an application-relative href for an anchor element. */
  useHref?: (href: string) => string;
  /** Return the current application-relative pathname. This hook must have a stable identity. */
  usePathname?: () => string;
  /** Return the current query string, including the leading question mark. This hook must have a stable identity. */
  useSearch?: () => string;
};
