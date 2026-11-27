import { KeystarProvider } from '@keystar/ui/core';
import { act } from '@testing-library/react';
import { ComponentProps } from 'react';
// @ts-expect-error -- @keystar/docs omits @types/react-dom
import { hydrateRoot } from 'react-dom/client';
// @ts-expect-error -- @keystar/docs omits @types/react-dom
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ReactLive } from './index';

vi.mock('../../scope', async () => {
  const internationalizedDate = await import('@internationalized/date');
  const { DatePicker } = await import('@keystar/ui/date-time');
  const { Flex } = await import('@keystar/ui/layout');

  return {
    scope: {
      DatePicker,
      Flex,
      ...internationalizedDate,
    },
  };
});

type LiveProp = ComponentProps<typeof ReactLive>['live'];

function makeLive(code: string): LiveProp {
  return {
    code,
    exampleType: 'jsx',
    location: 'date-picker.mdoc',
  };
}

describe('ReactLive hydration', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    if (!window.matchMedia) {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: query.includes('min-width'),
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });
    }
    if (!globalThis.ResizeObserver) {
      globalThis.ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
      };
    }
    if (!globalThis.IntersectionObserver) {
      globalThis.IntersectionObserver = class {
        root = null;
        rootMargin = '';
        thresholds = [];
        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords() {
          return [];
        }
      };
    }
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('hydrates runtime-clock previews without mismatches when SSR and client dates differ', async () => {
    const content = `<DatePicker label="Date" value={today(getLocalTimeZone())} isReadOnly />`;
    const live = makeLive(
      `return React.createElement(DatePicker, { label: "Date", value: today(getLocalTimeZone()), isReadOnly: true });`
    );

    vi.setSystemTime(new Date('2026-06-01T12:00:00Z'));
    const serverHtml = renderToString(
      <KeystarProvider>
        <ReactLive content={content} live={live} />
      </KeystarProvider>
    );

    vi.setSystemTime(new Date('2026-07-19T12:00:00Z'));
    const container = document.createElement('div');
    container.innerHTML = serverHtml;
    document.body.appendChild(container);

    const recoverableErrors: unknown[] = [];
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    let root: ReturnType<typeof hydrateRoot>;
    await act(async () => {
      root = hydrateRoot(
        container,
        <KeystarProvider>
          <ReactLive content={content} live={live} />
        </KeystarProvider>,
        {
          onRecoverableError(err: unknown) {
            recoverableErrors.push(err);
          },
        }
      );
    });

    expect(recoverableErrors).toHaveLength(0);
    expect(errorSpy).not.toHaveBeenCalled();

    const spinbuttons = Array.from(
      container.querySelectorAll('[role="spinbutton"]')
    ).map(el => el.getAttribute('aria-valuenow'));
    expect(spinbuttons).toEqual(['7', '19', '2026']);

    await act(async () => {
      root!.unmount();
    });
    container.remove();
  });

  it('continues server-rendering deterministic live previews', () => {
    const content = `<DatePicker label="Static" defaultValue={parseDate('2023-04-14')} />`;
    const live = makeLive(
      `return React.createElement(DatePicker, { label: "Static", defaultValue: parseDate("2023-04-14") });`
    );

    const serverHtml = renderToString(
      <KeystarProvider>
        <ReactLive content={content} live={live} />
      </KeystarProvider>
    );

    expect(serverHtml).toContain('2023');
    expect(serverHtml).toContain('Static');
  });
});
