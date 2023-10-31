import { HTMLAttributes, useContext } from 'react';
import { I18nProvider, useLocale } from '@react-aria/i18n';
import { ModalProvider, useModalProvider } from '@react-aria/overlays';
import { RouterProvider, filterDOMProps } from '@react-aria/utils';

import {
  BreakpointProvider,
  useMatchedBreakpoints,
  useStyleProps,
} from '@keystar/ui/style';
import { forwardRefWithAs } from '@keystar/ui/utils/ts';

import { Context, useProvider } from './context';
import { documentElementClasses } from './globals';
import { useScale } from './mediaQueries';
import { KeystarProviderProps } from './types';

/** Consolidates core functionality and dependencies of the Keystar component library. */
export const KeystarProvider = forwardRefWithAs<KeystarProviderProps, 'div'>(
  function KeystarProvider(props, forwardedRef) {
    let prevContext = useContext(Context);
    let prevColorScheme = prevContext && prevContext.colorScheme;

    let autoScale = useScale();
    let { locale: prevLocale } = useLocale();
    let matchedBreakpoints = useMatchedBreakpoints();

    // importance of color scheme props > parent > auto
    let {
      children,
      colorScheme = prevColorScheme || 'auto',
      isDisabled,
      isRequired,
      isReadOnly,
      locale = prevContext ? prevLocale : undefined,
      router,
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
            isolation: !prevContext ? 'isolate' : undefined,
          }}
          elementType={(props.elementType ?? 'div') as any}
        >
          {contents}
        </ProviderWrapper>
      );
    }

    if (router) {
      contents = <RouterProvider {...router}>{contents}</RouterProvider>;
    }

    return (
      <Context.Provider value={context}>
        <BreakpointProvider value={matchedBreakpoints}>
          <I18nProvider locale={locale}>
            <ModalProvider>{contents}</ModalProvider>
          </I18nProvider>
        </BreakpointProvider>
      </Context.Provider>
    );
  }
);

const ProviderWrapper = forwardRefWithAs<
  KeystarProviderProps & HTMLAttributes<HTMLElement>,
  'div'
>(function ProviderWrapper(props, forwardedRef) {
  let { children, style } = props;
  let { locale, direction } = useLocale();
  let { modalProviderProps } = useModalProvider();
  let { colorScheme } = useProvider();
  const ElementType = props.elementType ?? 'div';
  return (
    <ElementType
      {...modalProviderProps}
      className={`${
        props.UNSAFE_className ? `${props.UNSAFE_className} ` : ''
      }${documentElementClasses({
        bodyBackground: props.bodyBackground,
        colorScheme,
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
