import { Glob } from '../../../config';

export function validateText(
  val: string,
  min: number,
  max: number,
  fieldLabel: string,
  slugInfo: { slugs: Set<string>; glob: Glob } | undefined,
  pattern: { regex: RegExp; message?: string } | undefined
) {
  if (val.length < min) {
    if (min === 1) {
      return `${fieldLabel} must not be empty`;
    } else {
      return `${fieldLabel} must be at least ${min} characters long`;
    }
  }
  if (val.length > max) {
    return `${fieldLabel} must be no longer than ${max} characters`;
  }
  if (pattern && !pattern.regex.test(val)) {
    return (
      pattern.message || `${fieldLabel} must match the pattern ${pattern.regex}`
    );
  }
  if (slugInfo) {
    if (val === '') {
      return `${fieldLabel} must not be empty`;
    }
    if (val === '..') {
      return `${fieldLabel} must not be ..`;
    }
    if (val === '.') {
      return `${fieldLabel} must not be .`;
    }
    if (slugInfo.glob === '**') {
      const split = val.split('/');
      if (split.some(s => s === '..')) {
        return `${fieldLabel} must not contain ..`;
      }
      if (split.some(s => s === '.')) {
        return `${fieldLabel} must not be .`;
      }
    }
    if ((slugInfo.glob === '*' ? /[\\/]/ : /[\\]/).test(val)) {
      return `${fieldLabel} must not contain slashes`;
    }
    if (/^\s|\s$/.test(val)) {
      return `${fieldLabel} must not start or end with spaces`;
    }
    if (slugInfo.slugs.has(val)) {
      return `${fieldLabel} must be unique`;
    }
  }
}
