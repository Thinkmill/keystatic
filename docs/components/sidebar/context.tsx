import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

type SidebarProviderProps = { children: ReactNode };
type SidebarContextType = ReturnType<typeof useSidebar>;
const SidebarContext = createContext<SidebarContextType | null>(null);
const ERROR_MESSAGE = 'Attempt to use `Sidebar` outside of `SidebarProvider`.';

export const SidebarProvider = (props: SidebarProviderProps) => {
  const ctx = useSidebar();
  return <SidebarContext.Provider value={ctx} {...props} />;
};

export function useSidebarContext() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw Error(ERROR_MESSAGE);
  return ctx;
}

/** @private Manage open state and body overflow behaviour */
function useSidebar() {
  const [sidebarIsOpen, setSidebarOpen] = useState(false);
  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const toggleSidebar = useCallback(() => setSidebarOpen(bool => !bool), []);

  useEffect(() => {
    if (sidebarIsOpen) {
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [sidebarIsOpen]);

  return { sidebarIsOpen, openSidebar, closeSidebar, toggleSidebar };
}
