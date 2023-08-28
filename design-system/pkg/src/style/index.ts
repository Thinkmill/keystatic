export { css, keyframes, injectGlobal, cache } from '@emotion/css'; // simplify dependencies + ensure the same version of emotion is used

export { transition } from './animation';
export { resetClassName, classNames, ClassList } from './classNames';
export {
  BreakpointProvider,
  useBreakpoint,
  useResponsiveValue,
  useMatchedBreakpoints,
  useResponsiveRange,
} from './context';
export { filterStyleProps, onlyStyleProps } from './filterStyleProps';
export { FocusRing } from './FocusRing';
export {
  maybeTokenByKey,
  resolveProp,
  resolvePropWithPath,
  sizeResolver,
} from './resolvers';
export { breakpoints, breakpointQueries, containerQueries } from './responsive';
export { tokenSchema } from './tokens';
export { toDataAttributes } from './toDataAttributes';
export { useIsMobileDevice } from './useIsMobileDevice';
export { useMediaQuery } from './useMediaQuery';
export { useStyleProps } from './useStyleProps';

// NOTE: some package's types are "hoisted" up to '@keystar/ui/types' avoiding
// circular dependencies, allowing safe imports internally. this package is the
// exception, it is the only internal dependency of '@keystar/ui/types' and
// therefore cannot import from it.
export * from './types';
