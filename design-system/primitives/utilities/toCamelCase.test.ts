import { toCamelCase } from './toCamelCase';

describe('Utilities: toCamelCase', () => {
  it('it transforms all lowercase word', () => {
    expect(toCamelCase('primer')).toStrictEqual('primer');
  });

  it('it transforms all lowercase sentence (words with spaces)', () => {
    expect(toCamelCase('primer design token')).toStrictEqual(
      'primerDesignToken'
    );
  });

  it('it transforms all words with special chars', () => {
    expect(toCamelCase('primer_design-token+edition')).toStrictEqual(
      'primerDesignTokenEdition'
    );
  });

  it('it preserves casing for words that are already all uppercased', () => {
    expect(toCamelCase('PRIMER')).toStrictEqual('PRIMER');
  });

  it('it transforms all camelCase word', () => {
    expect(toCamelCase('camelCase')).toStrictEqual('camelCase');
  });

  it('it transforms array of words', () => {
    expect(toCamelCase(['primer', 'design', 'token'])).toStrictEqual(
      'primerDesignToken'
    );
  });
});
