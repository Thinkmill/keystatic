/* eslint-disable react-compiler/react-compiler */
import { fireEvent, render, screen } from '@testing-library/react';
import { createContext, useContext, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { KeystarProvider } from '@keystar/ui/core';

import { useNavigate, usePathname, useSearch } from '..';

const LocationContext = createContext({ pathname: '', search: '' });

function useTestPathname() {
  return useContext(LocationContext).pathname;
}

function useTestSearch() {
  return useContext(LocationContext).search;
}

function useFirstPathname() {
  const [pathname] = useState('/first');
  return pathname;
}

function useSecondPathname() {
  useState(null);
  const [pathname] = useState('/second');
  return pathname;
}

describe('router', () => {
  it('provides navigation', () => {
    const navigate = vi.fn();

    function Consumer() {
      const navigate = useNavigate();
      return (
        <button onClick={() => navigate('/items?page=2', { replace: true })}>
          Navigate
        </button>
      );
    }

    render(
      <KeystarProvider router={{ navigate }}>
        <Consumer />
      </KeystarProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Navigate' }));

    expect(navigate).toHaveBeenCalledWith('/items?page=2', { replace: true });
  });

  it('provides the current pathname and search lazily', () => {
    function App() {
      const [location, setLocation] = useState({
        pathname: '/items',
        search: '?page=1',
      });
      const router = {
        navigate: vi.fn(),
        usePathname: useTestPathname,
        useSearch: useTestSearch,
      };

      return (
        <LocationContext.Provider value={location}>
          <KeystarProvider router={router}>
            <Location />
            <button
              onClick={() =>
                setLocation({ pathname: '/items/1', search: '?view=details' })
              }
            >
              Update
            </button>
          </KeystarProvider>
        </LocationContext.Provider>
      );
    }

    function Location() {
      const pathname = usePathname();
      const search = useSearch();
      return <output>{pathname + search}</output>;
    }

    render(<App />);
    expect(screen.getByText('/items?page=1')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Update' }));
    expect(screen.getByText('/items/1?view=details')).toBeInTheDocument();
  });

  it('remounts consumers when an underlying hook changes', () => {
    let instanceCount = 0;

    function Consumer() {
      const [instance] = useState(() => ++instanceCount);
      const pathname = usePathname();
      return <output>{`${instance}:${pathname}`}</output>;
    }

    function App() {
      const [isSecond, setIsSecond] = useState(false);
      return (
        <KeystarProvider
          router={{
            navigate: vi.fn(),
            usePathname: isSecond ? useSecondPathname : useFirstPathname,
          }}
        >
          <Consumer />
          <button onClick={() => setIsSecond(true)}>Change hook</button>
        </KeystarProvider>
      );
    }

    render(<App />);
    expect(screen.getByText('1:/first')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Change hook' }));
    expect(screen.getByText('2:/second')).toBeInTheDocument();
  });
});
