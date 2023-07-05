import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { ReactElement, StrictMode } from 'react';

import { TestProvider } from '@keystar/ui/core';

export function renderWithProvider(
  ui: ReactElement,
  options?: RenderOptions
): RenderResult {
  return render(ui, { wrapper: StrictModeProvider, ...options });
}

export function customRender(
  ui: ReactElement,
  options?: RenderOptions
): RenderResult {
  return render(ui, { wrapper: StrictModeWrapper, ...options });
}

function StrictModeWrapper(props: { children: ReactElement }) {
  if (process.env.STRICT_MODE) {
    return <StrictMode>{props.children}</StrictMode>;
  }

  return props.children;
}

function StrictModeProvider(props: { children: ReactElement }) {
  return (
    <StrictModeWrapper>
      <TestProvider>{props.children}</TestProvider>
    </StrictModeWrapper>
  );
}
