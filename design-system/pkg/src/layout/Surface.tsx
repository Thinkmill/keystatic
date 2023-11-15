import { DOMProps } from '@react-types/shared';
import { createContext, ReactNode, useContext } from 'react';

import { TOKEN_PREFIX } from '@keystar/ui/primitives';
import {
  BoxStyleProps,
  classNames,
  filterStyleProps,
  useStyleProps,
} from '@keystar/ui/style';
import { forwardRefWithAs } from '@keystar/ui/utils/ts';

const levels = ['one', 'two', 'three'];
const MAX_LEVEL = levels.length - 1;

export type SurfaceProps = {
  /** Provide contents of the surface. */
  children?: ReactNode;
  /** Override the hierarchical level. */
  level?: 0 | 1 | 2;
} & DOMProps &
  Omit<BoxStyleProps, 'backgroundColor'>;

// CONTEXT

export const SurfaceContext = createContext(1);

/**
 * Get information about the current surface. Use to
 * pull from the `level` for the surface of the invoking component.
 */
export function useSurface() {
  const level = useContext(SurfaceContext);
  return { level };
}

// COMPONENT

/**
 * A surface contains UI in an isolated container, a bit like CSS stacking
 * contexts. Use surfaces to create interfaces that are related to but distinct
 * from those around them.
 */
export const Surface = forwardRefWithAs<SurfaceProps, 'div'>(
  (props, forwardedRef) => {
    const {
      elementType: ElementType = 'div',
      children,
      level: overrideLevel,
      ...otherProps
    } = props;
    const contextLevel = useContext(SurfaceContext);
    const level = overrideLevel ?? contextLevel;
    const levelClassName = `${TOKEN_PREFIX}--surface-${levels[level]}`;
    const value = Math.max(0, Math.min(level + 1, MAX_LEVEL));
    const styleProps = useStyleProps(otherProps);

    return (
      <SurfaceContext.Provider value={value}>
        <ElementType
          ref={forwardedRef}
          {...filterStyleProps(otherProps)}
          {...styleProps}
          className={classNames(levelClassName, styleProps.className)}
        >
          {children}
        </ElementType>
      </SurfaceContext.Provider>
    );
  }
);
