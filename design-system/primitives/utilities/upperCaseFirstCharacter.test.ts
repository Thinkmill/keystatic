import { expect, describe, it } from '@jest/globals';
import { upperCaseFirstCharacter } from './upperCaseFirstCharacter';

describe('Utilities: upperCaseFirstCharacter', () => {
  it('it transforms all lowercase word', () => {
    expect(upperCaseFirstCharacter('keystar')).toStrictEqual('Keystar');
  });

  it('it transforms all lowercase sentence (words with spaces)', () => {
    expect(upperCaseFirstCharacter('keystar design token')).toStrictEqual(
      'Keystar design token'
    );
  });

  it('it preserves casing for words that are already all uppercased', () => {
    expect(upperCaseFirstCharacter('KEYSTAR')).toStrictEqual('KEYSTAR');
  });

  it('it transforms all camelCase word', () => {
    expect(upperCaseFirstCharacter('camelCase')).toStrictEqual('CamelCase');
  });
});
