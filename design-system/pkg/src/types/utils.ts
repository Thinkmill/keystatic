import { ReactNode } from 'react';

/**
 * The types that may be considered valid "text", and can be safely rendered as
 * children of a React component or element.
 */
export type ReactText = string | number;

/**
 * From T, pick a set of properties whose keys are required. All other
 * properties remain untouched.
 */
export type PickRequired<T, K extends keyof T> = Omit<T, K> &
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
 * Define a type that may be a single value, or an array of that value.
 */
export type MaybeArray<T> = T | T[];

/**
 * Support conditional children, where `React.ReactNode` is too loose.
 */
export type ChildrenOf<Child> = Child | Conditional<Child>[];

/**
 * Support traditional children, or a render function.
 */
export type WithRenderProps<T> = {
  /**
   * The children of the component. A function may be provided to alter the
   * children based on component state.
   */
  children?: ReactNode | RenderProp<T>;
};

/**
 * A function that renders a `ReactNode`, based on some props.
 */
export type RenderProp<P> = (props: P) => ReactNode;
