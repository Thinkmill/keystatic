import { HTMLAttributes, useContext } from 'react';
import { I18nProvider, useLocale } from '@react-aria/i18n';
import { ModalProvider, useModalProvider } from '@react-aria/overlays';
import { filterDOMProps } from '@react-aria/utils';

import { DefaultLinkComponent, LinkComponentContext } from '@voussoir/link';
import {
  BreakpointProvider,
  useMatchedBreakpoints,
  useStyleProps,
} from '@voussoir/style';
import { forwardRefWithAs } from '@voussoir/utils/ts';

import { Context, useProvider } from './context';
import { documentElementClasses } from './globals';
import { useColorScheme, useScale } from './mediaQueries';
import { VoussoirProviderProps } from './types';

/** Consolidates core functionality and dependencies of the Voussoir component library. */
export const VoussoirProvider = forwardRefWithAs<VoussoirProviderProps, 'div'>(
  function VoussoirProvider(props, forwardedRef) {
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

    // select only the props with values so undefined props don't overwrite prevContext values
    let currentProps = {
      colorScheme,
      isDisabled,
      isRequired,
      isReadOnly,
      scale,
    };
    let filteredProps = Object.fromEntries(
      Object.entries(currentProps).filter(([_, value]) => value !== undefined)
    );

    // Merge options with parent provider
    let context = Object.assign({}, prevContext, filteredProps);

    // Only wrap in DOM node when necessary
    let contents = children;
    let domProps = filterDOMProps(otherProps);
    let styleProps = useStyleProps(otherProps);
    if (
      !prevContext ||
      props.elementType ||
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
          style={{
            colorScheme,
            isolation: !prevContext ? 'isolate' : undefined,
          }}
          elementType={(props.elementType ?? 'div') as any}
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
                {contents}
              </LinkComponentContext.Provider>
            </ModalProvider>
          </I18nProvider>
        </BreakpointProvider>
      </Context.Provider>
    );
  }
);

const ProviderWrapper = forwardRefWithAs<
  VoussoirProviderProps & HTMLAttributes<HTMLElement>,
  'div'
>(function ProviderWrapper(props, forwardedRef) {
  let { children, style } = props;
  let { locale, direction } = useLocale();
  let { modalProviderProps } = useModalProvider();
  let { colorScheme, scale } = useProvider();
  const ElementType = props.elementType ?? 'div';
  return (
    <ElementType
      {...modalProviderProps}
      className={`${
        props.UNSAFE_className ? `${props.UNSAFE_className} ` : ''
      }${documentElementClasses({
        bodyBackground: props.bodyBackground,
        colorScheme,
        scale,
      })}`}
      lang={locale}
      dir={direction}
      ref={forwardedRef}
      style={{ ...style, ...props.UNSAFE_style }}
    >
      {children}
    </ElementType>
  );
});
