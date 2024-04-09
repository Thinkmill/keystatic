import { useEffect, useRef } from 'react';

/**
 * Tracks the previous value of a variable.
 *
 * This is useful for comparing the previous value of some prop or state to the
 * current value, and taking action based on the change.
 */
export function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
