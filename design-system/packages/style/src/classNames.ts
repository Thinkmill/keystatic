import { cx, ClassNamesArg } from '@emotion/css';
import { warning } from 'emery';

export const classNamePrefix = 'ksv';
export const resetClassName = voussoirClassName('reset');
export function voussoirClassName(className: string) {
  return `${classNamePrefix}:${className}`;
}

/**
 * A thin wrapper around [Emotion's `cx`
 * function](https://emotion.sh/docs/@emotion/css#cx) that includes the reset
 * class name.
 */
export function classNames(...inputs: ClassNamesArg[]) {
  let resolved = cx(inputs);

  if (resolved.includes(resetClassName)) {
    return resolved;
  }

  return cx(resetClassName, resolved);
}

/**
 * A thin wrapper around Map to manage component class names. Keys are prefixed
 * with the component name and Voussoir's prefix.
 */
export class ClassList extends Map {
  prefix: string;

  constructor(componentName: string) {
    super();
    this.prefix = voussoirClassName(componentName);
  }

  root() {
    return this.prefix;
  }

  declare(element: string) {
    if (!this.has(element)) {
      this.set(element, `${this.prefix}-${element}`);
    }

    return this.get(element);
  }

  selector(element: string) {
    warning(this.has(element), `ClassList: "${element}" is not declared.`);

    return `.${this.get(element)}`.replace(/:/g, '\\:');
  }

  childSelector(element: string) {
    return `& ${this.selector(element)}`;
  }
}
