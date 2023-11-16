// re-export everything
export * from '@testing-library/react';

export * from './drag-and-drop';
export * from './events';
export { renderWithProvider } from './setup';

// override render method
export { customRender as render } from './setup';
