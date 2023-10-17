// credit: https://github.com/primer/primitives/blob/main/src/formats/jsonFigma.ts
import StyleDictionary from 'style-dictionary';
import { format } from '@prettier/sync';
import type { FormatterArguments } from 'style-dictionary/types/Format';

import { transformNamePathToFigma } from '../transformers/namePathToFigma';

const { sortByReference } = StyleDictionary.formatHelpers;

const isReference = (string: string): boolean => /^\{([^\\]*)\}$/g.test(string);

const getReference = (
  dictionary: StyleDictionary.Dictionary,
  refString: string,
  platform: StyleDictionary.Platform
) => {
  if (isReference(refString)) {
    // retrieve reference token
    const refToken = dictionary.getReferences(refString)[0];
    // return full reference
    return [
      refToken.attributes?.collection,
      transformNamePathToFigma(refToken, platform),
    ]
      .filter(Boolean)
      .join('/');
  }
};

const getFigmaType = (type: string): string => {
  const validTypes = {
    color: 'COLOR',
    dimension: 'FLOAT',
  };
  if (type in validTypes) return validTypes[type as keyof typeof validTypes];
  throw new Error(`Invalid type: ${type}`);
};

/**
 * @description Converts `StyleDictionary.dictionary.tokens` to javascript esm (javascript export statement)
 * @param arguments [FormatterArguments](https://github.com/amzn/style-dictionary/blob/main/types/Format.d.ts)
 * @returns formatted `string`
 */
export const jsonFigma: StyleDictionary.Formatter = ({
  dictionary,
  file: _file,
  platform,
}: FormatterArguments) => {
  // sort tokens by reference
  const tokens = dictionary.allTokens
    .sort(sortByReference(dictionary))
    .map(token => {
      const {
        attributes,
        value,
        $type,
        comment: description,
        original,
        alpha,
        mix,
      } = token;
      const { mode, collection, scopes } = attributes || {};
      return {
        name: token.name,
        value,
        type: getFigmaType($type),
        alpha,
        isMix: mix ? true : undefined,
        description,
        refId: [collection, token.name].filter(Boolean).join('/'),
        reference: getReference(dictionary, original.value, platform),
        collection,
        mode,
        scopes,
      };
    });
  // add file header and convert output
  const output = JSON.stringify(tokens, null, 2);
  // return prettified
  return format(output, { parser: 'json', printWidth: 500 });
};
