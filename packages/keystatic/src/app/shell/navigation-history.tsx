import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

// Types
export type RecentItem = {
  type: 'collection' | 'singleton' | 'entry';
  key: string;
  label: string;
  href: string;
  collectionKey?: string;
  timestamp: number;
};

export type FavoriteItem = {
  type: 'collection' | 'singleton';
  key: string;
  label: string;
  href: string;
};

type NavigationHistoryContextType = {
  recentItems: RecentItem[];
  favorites: FavoriteItem[];
  addRecentItem: (item: Omit<RecentItem, 'timestamp'>) => void;
  clearRecentItems: () => void;
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (key: string) => void;
  isFavorite: (key: string) => boolean;
  toggleFavorite: (item: FavoriteItem) => void;
};

const NavigationHistoryContext = createContext<NavigationHistoryContextType | null>(null);

const RECENT_STORAGE_KEY = 'keystatic-recent-items';
const FAVORITES_STORAGE_KEY = 'keystatic-favorites';
const MAX_RECENT_ITEMS = 10;

export function NavigationHistoryProvider({ children }: { children: ReactNode }) {
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedRecent = localStorage.getItem(RECENT_STORAGE_KEY);
      if (storedRecent) {
        setRecentItems(JSON.parse(storedRecent));
      }
      const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (e) {
      console.warn('Failed to load navigation history:', e);
    }
  }, []);

  // Save recent items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(recentItems));
    } catch (e) {
      console.warn('Failed to save recent items:', e);
    }
  }, [recentItems]);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.warn('Failed to save favorites:', e);
    }
  }, [favorites]);

  const addRecentItem = useCallback((item: Omit<RecentItem, 'timestamp'>) => {
    setRecentItems(prev => {
      // Remove existing item with same href
      const filtered = prev.filter(i => i.href !== item.href);
      // Add new item at the start
      const newItem: RecentItem = {
        ...item,
        timestamp: Date.now(),
      };
      return [newItem, ...filtered].slice(0, MAX_RECENT_ITEMS);
    });
  }, []);

  const clearRecentItems = useCallback(() => {
    setRecentItems([]);
  }, []);

  const addFavorite = useCallback((item: FavoriteItem) => {
    setFavorites(prev => {
      if (prev.some(f => f.key === item.key)) {
        return prev;
      }
      return [...prev, item];
    });
  }, []);

  const removeFavorite = useCallback((key: string) => {
    setFavorites(prev => prev.filter(f => f.key !== key));
  }, []);

  const isFavorite = useCallback((key: string) => {
    return favorites.some(f => f.key === key);
  }, [favorites]);

  const toggleFavorite = useCallback((item: FavoriteItem) => {
    if (isFavorite(item.key)) {
      removeFavorite(item.key);
    } else {
      addFavorite(item);
    }
  }, [isFavorite, removeFavorite, addFavorite]);

  return (
    <NavigationHistoryContext.Provider
      value={{
        recentItems,
        favorites,
        addRecentItem,
        clearRecentItems,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </NavigationHistoryContext.Provider>
  );
}

export function useNavigationHistory() {
  const context = useContext(NavigationHistoryContext);
  if (!context) {
    throw new Error('useNavigationHistory must be used within NavigationHistoryProvider');
  }
  return context;
}

export function useRecentItems() {
  const { recentItems, addRecentItem, clearRecentItems } = useNavigationHistory();
  return { recentItems, addRecentItem, clearRecentItems };
}

export function useFavorites() {
  const { favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite } = useNavigationHistory();
  return { favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite };
}
