import { ReactNode } from 'react';

/**
 * From T, pick a set of properties whose keys are required. All other
 * properties are made optional.
 */
export type PartialRequired<T, K extends keyof T> = Partial<T> &
  Required<Pick<T, K>>;

/**
 * Make all properties in T never.
 */
export type Never<T> = {
  [P in keyof T]?: never;
};

/**
 * Allow "falsy" values + some type. Used for React children.
 */
export type Conditional<T> = T | false | null | undefined;

/**
 * Support conditional children, where `React.ReactNode` is too loose.
 */
export type ChildrenOf<Child> = Child | Conditional<Child>[];

/** Support traditional children, or a render function. */
export type WithRenderProps<T> = {
  /**
   * The children of the component. A function may be provided to alter the
   * children based on component state.
   */
  children?: ReactNode | RenderProp<T>;
};
export type RenderProp<T> = (values: T) => ReactNode;
