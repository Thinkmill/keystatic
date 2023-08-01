import type StyleDictionary from 'style-dictionary';

/**
 * @description converts the [TransformedToken's](https://github.com/amzn/style-dictionary/blob/main/types/TransformedToken.d.ts) `.path` array to a kebab-case string, preserves casing of parts
 * @type name transformer — [StyleDictionary.NameTransform](https://github.com/amzn/style-dictionary/blob/main/types/Transform.d.ts)
 * @matcher omitted to match all tokens
 * @transformer returns `string` kebab-case
 */
export const namePathToKebabCase: StyleDictionary.Transform = {
  type: `name`,
  transformer: (
    token: StyleDictionary.TransformedToken,
    options?: StyleDictionary.Platform
  ): string => {
    return (
      [options?.prefix, ...token.path]
        // remove undefined if exists
        .filter(
          (part: unknown): part is string =>
            typeof part === 'string' && part !== '@'
        )
        .join('-')
    );
  },
};
