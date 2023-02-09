import {
  createContext,
  ForwardedRef,
  forwardRef,
  HTMLAttributes,
  useContext,
  useEffect,
} from 'react';
import { I18nProvider, useLocale } from '@react-aria/i18n';
import { ModalProvider, useModalProvider } from '@react-aria/overlays';

import { DefaultLinkComponent, LinkComponentContext } from '@voussoir/link';
import {
  BreakpointProvider,
  // css,
  // tokenSchema,
  useMatchedBreakpoints,
  useStyleProps,
} from '@voussoir/style';
import { filterDOMProps } from '@voussoir/utils';

import { useColorScheme, useScale } from './mediaQueries';
import { VoussoirProviderContext, VoussoirProviderProps } from './types';
import { ensureGlobalsImported } from './injectVoussoirStyles';

/** Consolidates core functionality and dependencies of the Voussoir component library. */
export const VoussoirProvider = forwardRef(function VoussoirProvider(
  props: VoussoirProviderProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let prevContext = useContext(Context);
  let prevColorScheme = prevContext && prevContext.colorScheme;

  let autoColorScheme = useColorScheme('light');
  let autoScale = useScale();
  let { locale: prevLocale } = useLocale();
  let matchedBreakpoints = useMatchedBreakpoints();

  // importance of color scheme props > parent > auto:(OS > default > omitted)
  let {
    children,
    colorScheme = prevColorScheme ?? autoColorScheme,
    isDisabled,
    isRequired,
    isReadOnly,
    locale = prevContext ? prevLocale : undefined,
    linkComponent = DefaultLinkComponent,
    scale = prevContext ? prevContext.scale : autoScale,
    ...otherProps
  } = props;

  // FIXME: This is a hack for storybook and portals. This scripting should be
  // managed by the consumer. Opportunity to combine with the global styles.
  useEffect(() => {
    let classList = document.documentElement.classList;
    let style = document.documentElement.style;

    if (!classList.contains(`ksv-theme`)) {
      classList.add(`ksv-theme`);
    }
    if (colorScheme === 'dark') {
      classList.remove(`ksv-theme--light`);
      classList.add(`ksv-theme--dark`);
      style.colorScheme = 'dark';
    } else {
      classList.remove(`ksv-theme--dark`);
      classList.add(`ksv-theme--light`);
      style.colorScheme = 'light';
    }

    if (scale === 'large') {
      classList.remove('ksv-theme--medium');
      classList.add('ksv-theme--large');
    } else {
      classList.add('ksv-theme--medium');
      classList.remove('ksv-theme--large');
    }
  }, [colorScheme, scale]);

  // select only the props with values so undefined props don't overwrite prevContext values
  let currentProps = { colorScheme, isDisabled, isRequired, isReadOnly, scale };
  let filteredProps = Object.fromEntries(
    Object.entries(currentProps).filter(([_, value]) => value !== undefined)
  );

  // Merge options with parent provider
  let context = Object.assign({}, prevContext, filteredProps);

  ensureGlobalsImported();

  // Only wrap in DOM node when necessary
  let contents = children;
  let domProps = filterDOMProps(otherProps);
  let styleProps = useStyleProps(otherProps);
  if (
    !prevContext ||
    props.locale ||
    colorScheme !== prevContext.colorScheme ||
    scale !== prevContext.scale ||
    Object.keys(domProps).length > 0 ||
    otherProps.UNSAFE_className ||
    (styleProps.style && Object.keys(styleProps.style).length > 0)
  ) {
    contents = (
      <ProviderWrapper
        ref={forwardedRef}
        {...props}
        style={{ colorScheme, isolation: !prevContext ? 'isolate' : undefined }}
      >
        {contents}
      </ProviderWrapper>
    );
  }

  return (
    <Context.Provider value={context}>
      <BreakpointProvider value={matchedBreakpoints}>
        <I18nProvider locale={locale}>
          <ModalProvider>
            <LinkComponentContext.Provider value={linkComponent}>
              {/* FIXME: this is gross */}
              {!prevContext && (
                <link
                  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
                  rel="stylesheet"
                />
              )}
              {contents}
            </LinkComponentContext.Provider>
          </ModalProvider>
        </I18nProvider>
      </BreakpointProvider>
    </Context.Provider>
  );
});

const ProviderWrapper = forwardRef<
  HTMLDivElement,
  VoussoirProviderProps & HTMLAttributes<HTMLDivElement>
>(function ProviderWrapper(props, forwardedRef) {
  let { children, style } = props;
  let { locale, direction } = useLocale();
  let { modalProviderProps } = useModalProvider();
  let { colorScheme, scale } = useProvider();

  return (
    <div
      {...modalProviderProps}
      className={[
        `ksv-theme ksv-theme--${colorScheme} ksv-theme--${scale}`,
        // css({ backgroundColor: tokenSchema.color.background.canvas }),
      ].join(' ')}
      lang={locale}
      dir={direction}
      ref={forwardedRef}
      style={style}
    >
      {children}
    </div>
  );
});

// Context

const Context = createContext<VoussoirProviderContext | null>(null);
Context.displayName = 'ProviderContext';

/**
 * Returns the settings and styles applied by the nearest parent
 * Provider. Properties explicitly set by the nearest parent Provider override
 * those provided by preceeding Providers.
 */
export function useProvider(): VoussoirProviderContext {
  let context = useContext(Context);
  if (!context) {
    throw new Error('Attempt to access context outside of VoussoirProvider.');
  }
  return context;
}

export function useProviderProps<T>(props: T): T {
  let context = useProvider();
  if (!context) {
    return props;
  }
  return Object.assign(
    {},
    {
      // prominence: context.prominence,
      isDisabled: context.isDisabled,
      isRequired: context.isRequired,
      isReadOnly: context.isReadOnly,
    },
    props
  );
}
