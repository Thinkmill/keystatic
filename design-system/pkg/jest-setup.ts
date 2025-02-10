import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});

const prevConsoleError = console.error;

console.error = function (...args: unknown[]) {
  const stringified = args[0] + '';
  // the jsdom and then the component stack that react adds is very noisy when something fails but you expected it
  if (
    stringified.startsWith('Error: Uncaught [') ||
    stringified.startsWith('The above error occurred in the <')
  ) {
    return;
  }
  prevConsoleError.apply(this, args);
};

export {};
