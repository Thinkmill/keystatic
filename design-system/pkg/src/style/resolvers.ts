import { MaybeArray } from '@keystar/ui/types';
import { assertNever } from 'emery';

import { tokenSchema } from './tokens';
import {
  CSSProp,
  DimensionKey,
  LooseSizeDimension,
  StyleResolver,
} from './types';

// Utils
// ----------------------------------------------------------------------------

function get(val: object, path: string) {
  for (const part of path.split('.')) {
    if (
      typeof val !== 'object' ||
      val === null ||
      !Object.prototype.hasOwnProperty.call(val, part)
    ) {
      return;
    }
    val = (val as any)[part];
  }
  return val;
}

export function maybeTokenByKey<T = unknown>(path: string, keyOrValue: T): any {
  if (typeof keyOrValue !== 'string') {
    return keyOrValue;
  }

  // let folks go rouge, why not?
  path = keyOrValue.includes('.') ? keyOrValue : `${path}.${keyOrValue}`;

  return get(tokenSchema, path) ?? keyOrValue;
}
export function resolvePropWithPath<P extends MaybeArray<CSSProp>>(
  prop: P,
  path: string
): [P, StyleResolver] {
  const resolver = (value: unknown) => maybeTokenByKey(path, value);
  return [prop, resolver];
}

// default
const identity: StyleResolver = value => value;
export function resolveProp<P extends MaybeArray<CSSProp>>(
  prop: P,
  fn = identity
): [P, StyleResolver] {
  return [prop, fn];
}

// common
export function border<P extends MaybeArray<CSSProp>>(
  prop: P
): [P, StyleResolver] {
  const resolver = (value: unknown) => {
    const color = maybeTokenByKey('color.border', value);
    return `${tokenSchema.size.border.regular} solid ${color}`;
  };
  return [prop, resolver];
}
function isDimensionKey(value: string): value is DimensionKey {
  let [prop, key] = value.split('.');
  if (!prop || !key) {
    return false;
  }
  // @ts-expect-error
  return !!tokenSchema.size[prop][key];
}
export function sizeResolver(value: LooseSizeDimension) {
  if (typeof value === 'number') {
    if (value === 0) {
      return `${value}px`;
    }
    assertNever(value);
  }

  if (isDimensionKey(value)) {
    let [prop, key] = value.split('.');
    // @ts-expect-error
    return tokenSchema.size[prop][key];
  }

  if (
    value === 'auto' ||
    value === 'inherit' ||
    value === '100%' ||
    value === '100vh' ||
    value === '100vw'
  ) {
    return value;
  }
  assertNever(value);
}
function size(cssProp: MaybeArray<CSSProp>) {
  return [cssProp, sizeResolver];
}
function space(prop: MaybeArray<CSSProp>) {
  return resolvePropWithPath(prop, 'size.space');
}
function radius(prop: MaybeArray<CSSProp>) {
  return resolvePropWithPath(prop, 'size.radius');
}

// Config
// ----------------------------------------------------------------------------

export const defaultStyleProps = {
  // color
  backgroundColor: resolvePropWithPath('backgroundColor', 'color.background'),
  boxShadow: ['boxShadow', boxShadowResolver],

  // dimension
  height: size('height'),
  maxHeight: size('maxHeight'),
  minHeight: size('minHeight'),
  maxWidth: size('maxWidth'),
  minWidth: size('minWidth'),
  width: size('width'),

  // space
  margin: space('margin'),
  marginStart: space('marginInlineStart'),
  marginEnd: space('marginInlineEnd'),
  marginTop: space('marginBlockStart'),
  marginBottom: space('marginBlockEnd'),
  marginX: space('marginInline'),
  marginY: space('marginBlock'),

  padding: space('padding'),
  paddingStart: space('paddingInlineStart'),
  paddingEnd: space('paddingInlineEnd'),
  paddingTop: space('paddingBlockStart'),
  paddingBottom: space('paddingBlockEnd'),
  paddingX: space('paddingInline'),
  paddingY: space('paddingBlock'),

  // border
  border: border('border'),
  borderStart: border('borderInlineStart'),
  borderEnd: border('borderInlineEnd'),
  borderTop: border('borderTop'),
  borderBottom: border('borderBottom'),

  borderColor: resolvePropWithPath('borderColor', 'color.border'),
  borderStartColor: resolvePropWithPath(
    'borderInlineStartColor',
    'color.border'
  ),
  borderEndColor: resolvePropWithPath('borderInlineEndColor', 'color.border'),
  borderTopColor: resolvePropWithPath('borderTopColor', 'color.border'),
  borderBottomColor: resolvePropWithPath('borderBottomColor', 'color.border'),

  borderStyle: resolveProp('borderStyle'),
  borderStartStyle: resolveProp('borderInlineStartStyle'),
  borderEndStyle: resolveProp('borderInlineEndStyle'),
  borderTopStyle: resolveProp('borderTopStyle'),
  borderBottomStyle: resolveProp('borderBottomStyle'),

  borderWidth: resolvePropWithPath('borderWidth', 'size.border'),
  borderStartWidth: resolvePropWithPath(
    'borderInlineStartWidth',
    'size.border'
  ),
  borderEndWidth: resolvePropWithPath('borderInlineEndWidth', 'size.border'),
  borderTopWidth: resolvePropWithPath('borderTopWidth', 'size.border'),
  borderBottomWidth: resolvePropWithPath('borderBottomWidth', 'size.border'),

  borderRadius: radius('borderRadius'),
  borderTopStartRadius: radius('borderStartStartRadius'),
  borderTopEndRadius: radius('borderStartEndRadius'),
  borderBottomStartRadius: radius('borderEndStartRadius'),
  borderBottomEndRadius: radius('borderEndEndRadius'),
  borderTopRadius: radius(['borderStartStartRadius', 'borderStartEndRadius']),
  borderBottomRadius: radius(['borderEndStartRadius', 'borderEndEndRadius']),
  borderStartRadius: radius(['borderStartStartRadius', 'borderEndStartRadius']),
  borderEndRadius: radius(['borderEndEndRadius', 'borderStartEndRadius']),

  // position
  inset: space('inset'),
  insetBottom: space('insetBlockEnd'),
  insetEnd: space('insetInlineEnd'),
  insetStart: space('insetInlineStart'),
  insetTop: space('insetBlockStart'),
  insetX: space('insetInline'),
  insetY: space('insetBlock'),
  position: resolveProp('position'),
  zIndex: resolveProp('zIndex'),

  // flex child
  order: resolveProp('order'),
  alignSelf: resolveProp('alignSelf'),
  flex: resolveProp('flex', flexResolver),
  flexBasis: size('flexBasis'),
  flexGrow: resolveProp('flexGrow', flexResolver),
  flexShrink: resolveProp('flexShrink', flexResolver),
  justifySelf: resolveProp('justifySelf'),

  // grid child
  gridArea: resolveProp('gridArea'),
  gridColumn: resolveProp('gridColumn'),
  gridColumnEnd: resolveProp('gridColumnEnd'),
  gridColumnStart: resolveProp('gridColumnStart'),
  gridRow: resolveProp('gridRow'),
  gridRowEnd: resolveProp('gridRowEnd'),
  gridRowStart: resolveProp('gridRowStart'),

  // misc. non-theme related
  cursor: resolveProp('cursor'),
  opacity: resolveProp('opacity'),
  pointerEvents: resolveProp('pointerEvents'),
  overflow: resolveProp('overflow'),
  userSelect: resolveProp('userSelect'),
};

// Unique
// ----------------------------------------------------------------------------

function flexResolver(value: any) {
  if (typeof value === 'boolean') {
    return value ? '1' : undefined;
  }

  return '' + value;
}

function boxShadowResolver(value: any) {
  const sizeToColorKey = {
    small: 'muted',
    medium: 'regular',
    large: 'emphasis',
  };
  const [sizeKey, maybeColorKey] = value.split(' ');
  const color = maybeTokenByKey(
    'color.shadow',
    maybeColorKey ?? sizeToColorKey[sizeKey as keyof typeof sizeToColorKey]
  );
  const size = maybeTokenByKey('size.shadow', sizeKey);
  return `${size} ${color}`;
}
