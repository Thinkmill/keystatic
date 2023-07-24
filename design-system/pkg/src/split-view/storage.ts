// Credit: https://github.com/bvaughn/react-resizable-panels/blob/main/packages/react-resizable-panels/src/PanelGroup.ts
import { SplitViewStorage } from './types';

// SplitView might be rendering in a server-side environment where
// `localStorage` is not available or on a browser with cookies/storage
// disabled. In either case, this function avoids accessing `localStorage` until
// needed, and avoids throwing user-visible errors.
function initializeDefaultStorage(storageObject: SplitViewStorage) {
  try {
    if (typeof localStorage !== 'undefined') {
      // Bypass this check for future calls
      storageObject.getItem = (name: string) => {
        return localStorage.getItem(name);
      };
      storageObject.setItem = (name: string, value: string) => {
        localStorage.setItem(name, value);
      };
    } else {
      throw new Error('localStorage not supported in this environment');
    }
  } catch (error) {
    console.error(error);

    storageObject.getItem = () => null;
    storageObject.setItem = () => {};
  }
}

export const defaultStorage: SplitViewStorage = {
  getItem: (name: string) => {
    initializeDefaultStorage(defaultStorage);
    return defaultStorage.getItem(name);
  },
  setItem: (name: string, value: string) => {
    initializeDefaultStorage(defaultStorage);
    defaultStorage.setItem(name, value);
  },
};
