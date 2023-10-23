import { isNumber } from 'emery';
import { CSSProperties } from 'react';

import { tokenSchema } from './tokens';
import { AnimationDuration, AnimationEasing } from './types';

type Kebab<
  T extends string,
  A extends string = '',
> = T extends `${infer F}${infer R}`
  ? Kebab<R, `${A}${F extends Lowercase<F> ? '' : '-'}${Lowercase<F>}`>
  : A;
type KebabKeys<T> = { [K in keyof T as K extends string ? Kebab<K> : K]: T[K] };

type CSSProp = keyof KebabKeys<CSSProperties>;
type Easing = AnimationEasing | 'linear';
type Duration = AnimationDuration | number;

type Options = {
  /**
   * The transition delay.
   */
  delay?: Duration;
  /**
   * The transition duration.
   * @default 'short'
   */
  duration?: Duration;
  /**
   * The transition easing.
   * @default 'easeInOut'
   */
  easing?: Easing;
};

/** Helper function for resolving animation tokens.  */
export function transition(
  prop: CSSProp | CSSProp[],
  options: Options = {}
): string {
  let { delay = 0, duration = 'short', easing = 'easeInOut' } = options;
  let easingValue =
    easing === 'linear' ? 'linear' : tokenSchema.animation.easing[easing];
  let durationValue = resolveDuration(duration);

  if (Array.isArray(prop)) {
    return prop.map(p => transition(p, options)).join(', ');
  }

  return (
    `${prop} ${durationValue} ${easingValue}` +
    (delay ? ` ${resolveDuration(delay)}` : '')
  );
}

function resolveDuration(duration: Duration) {
  return isNumber(duration)
    ? `${duration}ms`
    : tokenSchema.animation.duration[duration];
}
