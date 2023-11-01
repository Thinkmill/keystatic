import { cx, ClassNamesArg } from '@emotion/css';
import { assert } from 'emery';

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
 * A ClassList organises component class names with appropriate prefixes,
 * offering strongly-typed methods for declaration in JSX and styles.
 */
export class ClassList<T extends readonly string[], K extends T[number]> {
  /** The root class name. */
  public readonly root: string;
  /** The list of class names. */
  elements: Map<K, string>;

  constructor(componentName: string, elements: T = [] as unknown as T) {
    this.root = voussoirClassName(componentName);
    this.elements = new Map(
      elements.map(element => [element as K, `${this.root}-${element}`])
    );
  }

  get(element: K | 'root') {
    if (element === 'root') {
      return this.root;
    }

    let className = this.elements.get(element);

    assert(!!className, `Class name for ${element} not found.`);

    return className;
  }

  selector(element: K | 'root', combinator?: CssCombinator) {
    let className = this.get(element);

    if (!combinator) {
      return safeClassName(className);
    }

    return combinators[combinator] + safeClassName(className);
  }
}

function safeClassName(className: string) {
  return `.${className.replace(/:/g, '\\:')}`;
}

type CssCombinator = keyof typeof combinators;

const combinators = {
  descendant: '& ',
  child: '& > ',
  sibling: '& ~ ',
  'adjacent-sibling': '& + ',
} as const;
