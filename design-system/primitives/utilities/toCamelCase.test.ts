import { toCamelCase } from './toCamelCase';
import { expect, it, describe } from '@jest/globals';

describe('Utilities: toCamelCase', () => {
  it('it transforms all lowercase word', () => {
    expect(toCamelCase('keystar')).toStrictEqual('keystar');
  });

  it('it transforms all lowercase sentence (words with spaces)', () => {
    expect(toCamelCase('keystar design token')).toStrictEqual(
      'keystarDesignToken'
    );
  });

  it('it transforms all words with special chars', () => {
    expect(toCamelCase('keystar_design-token+edition')).toStrictEqual(
      'keystarDesignTokenEdition'
    );
  });

  it('it preserves casing for words that are already all uppercased', () => {
    expect(toCamelCase('PRIMER')).toStrictEqual('PRIMER');
  });

  it('it transforms all camelCase word', () => {
    expect(toCamelCase('camelCase')).toStrictEqual('camelCase');
  });

  it('it transforms array of words', () => {
    expect(toCamelCase(['keystar', 'design', 'token'])).toStrictEqual(
      'keystarDesignToken'
    );
  });
});
