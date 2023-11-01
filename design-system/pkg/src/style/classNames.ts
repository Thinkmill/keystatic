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
export class ClassList<ElementName extends string> {
  /** The component name for this class list. */
  componentName: string;
  /** The root class name. */
  root: string;
  /** The list of element class names. */
  elements: Map<ElementName, string>;

  constructor(
    componentName: string,
    elements: ReadonlyArray<ElementName> = []
  ) {
    this.componentName = componentName;
    this.root = voussoirClassName(componentName);
    this.elements = new Map(
      elements.map(element => [element, `${this.root}-${element}`])
    );
  }

  get(element: ElementName | 'root') {
    if (element === 'root') {
      return this.root;
    }

    let className = this.elements.get(element);

    assert(
      !!className,
      `Element "${element}" not found in "${this.componentName}" class list. All elements must be defined when the ClassList is instantiated.`
    );

    return className;
  }

  selector(element: ElementName | 'root', combinator?: CssCombinator) {
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
