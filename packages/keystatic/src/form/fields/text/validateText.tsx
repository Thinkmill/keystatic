import { Glob } from '../../../config';

function validatePathSegment(segment: string) {
  if (segment === '') {
    return 'must not be empty';
  }
  if (/[\\/]/.test(segment)) {
    return 'must not contain slashes';
  }
  if (segment === '..') {
    return 'must not be ..';
  }
  if (segment === '.') {
    return 'must not be .';
  }
  if (/^\s|\s$/.test(segment)) {
    return 'must not start or end with spaces';
  }
}

export function validateText(
  val: string,
  min: number,
  max: number,
  fieldLabel: string,
  slugInfo:
    | {
        slugs: Set<string>;
        glob: Glob;
        pathSegments?: { field: string; segment: string }[];
      }
    | undefined,
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
    if (slugInfo.pathSegments) {
      for (const { field, segment } of slugInfo.pathSegments) {
        const segmentError = validatePathSegment(segment);
        if (segmentError !== undefined) {
          return `The "${field}" field is used in the collection's path, so it ${segmentError}`;
        }
      }
    }
    const fullSlug = slugInfo.pathSegments?.length
      ? `${slugInfo.pathSegments.map(x => x.segment).join('/')}/${val}`
      : val;
    if (slugInfo.slugs.has(fullSlug)) {
      return `${fieldLabel} must be unique`;
    }
  }
}
