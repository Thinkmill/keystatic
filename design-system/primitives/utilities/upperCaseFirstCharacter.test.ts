import {upperCaseFirstCharacter} from './upperCaseFirstCharacter'

describe('Utilities: upperCaseFirstCharacter', () => {
  it('it transforms all lowercase word', () => {
    expect(upperCaseFirstCharacter('primer')).toStrictEqual('Primer')
  })

  it('it transforms all lowercase sentence (words with spaces)', () => {
    expect(upperCaseFirstCharacter('primer design token')).toStrictEqual('Primer design token')
  })

  it('it preserves casing for words that are already all uppercased', () => {
    expect(upperCaseFirstCharacter('PRIMER')).toStrictEqual('PRIMER')
  })

  it('it transforms all camelCase word', () => {
    expect(upperCaseFirstCharacter('camelCase')).toStrictEqual('CamelCase')
  })
})
