import {
  defaultStringFormatter,
  KeystaticStringFormatter,
} from '../../../app/l10n/default-formatter';
import { Glob } from '../../../config';

export function validateText(
  val: string,
  min: number,
  max: number,
  fieldLabel: string,
  slugInfo: { slugs: Set<string>; glob: Glob } | undefined,
  pattern: { regex: RegExp; message?: string } | undefined,
  stringFormatter: KeystaticStringFormatter = defaultStringFormatter
) {
  if (val.length < min) {
    if (min === 1) {
      return stringFormatter.format('fieldMustNotBeEmpty', {
        label: fieldLabel,
      });
    } else {
      return stringFormatter.format('fieldMustBeAtLeastCharacters', {
        label: fieldLabel,
        min,
      });
    }
  }
  if (val.length > max) {
    return stringFormatter.format('fieldMustBeNoLongerThanCharacters', {
      label: fieldLabel,
      max,
    });
  }
  if (pattern && !pattern.regex.test(val)) {
    return (
      pattern.message ||
      stringFormatter.format('fieldMustMatchPattern', {
        label: fieldLabel,
        pattern: String(pattern.regex),
      })
    );
  }
  if (slugInfo) {
    if (val === '') {
      return stringFormatter.format('fieldMustNotBeEmpty', {
        label: fieldLabel,
      });
    }
    if (val === '..') {
      return stringFormatter.format('fieldMustNotBe', {
        label: fieldLabel,
        value: '..',
      });
    }
    if (val === '.') {
      return stringFormatter.format('fieldMustNotBe', {
        label: fieldLabel,
        value: '.',
      });
    }
    if (slugInfo.glob === '**') {
      const split = val.split('/');
      if (split.some(s => s === '..')) {
        return stringFormatter.format('fieldMustNotContain', {
          label: fieldLabel,
          value: '..',
        });
      }
      if (split.some(s => s === '.')) {
        return stringFormatter.format('fieldMustNotBe', {
          label: fieldLabel,
          value: '.',
        });
      }
    }
    if ((slugInfo.glob === '*' ? /[\\/]/ : /[\\]/).test(val)) {
      return stringFormatter.format('fieldMustNotContainSlashes', {
        label: fieldLabel,
      });
    }
    if (/^\s|\s$/.test(val)) {
      return stringFormatter.format('fieldMustNotStartOrEndWithSpaces', {
        label: fieldLabel,
      });
    }
    if (slugInfo.slugs.has(val)) {
      return stringFormatter.format('fieldMustBeUnique', { label: fieldLabel });
    }
  }
}
