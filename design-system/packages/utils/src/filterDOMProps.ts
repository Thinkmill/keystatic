import { AriaLabelingProps, DOMProps } from '@react-types/shared';

const defaultPropNames = new Set(['aria-hidden', 'id', 'title', 'form']);
const labellingPropNames = new Set([
  'aria-label',
  'aria-labelledby',
  'aria-describedby',
  'aria-details',
]);

type Options = {
  /**
   * Convenience prop for a including predefined aria labelling properties in
   * the filter:
   * - `aria-label`
   * - `aria-labelledby`
   * - `aria-describedby`
   * - `aria-details`
   */
  labellable?: boolean;
} & (
  | {
      /**
       * A Set of property names to **exclude** from the filter.
       */
      omit?: Set<string>;
      pick?: never;
    }
  | {
      /**
       * A Set of property names to **include** in the filter.
       */
      pick?: Set<string>;
      omit?: never;
    }
);

const propRegex = /^(data-.*)$/;

/**
 * Filters out props that aren't valid DOM props or defined via override options.
 * @param props - The component props to be filtered.
 * @param options - Props to override.
 */
export function filterDOMProps<P extends Record<string, any>>(
  props: P,
  options: Options = {}
): DOMProps & AriaLabelingProps {
  let filteredProps: any = {};

  for (const prop in props) {
    if (
      Object.prototype.hasOwnProperty.call(props, prop) &&
      (defaultPropNames.has(prop) ||
        (options.labellable && labellingPropNames.has(prop)) ||
        ('pick' in options && options.pick?.has(prop)) ||
        ('omit' in options && !options.omit?.has(prop)) ||
        propRegex.test(prop))
    ) {
      filteredProps[prop] = props[prop];
    }
  }

  return filteredProps;
}
