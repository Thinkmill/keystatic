// credit: https://github.com/primer/primitives/blob/main/src/transformers/namePathToFigma.ts
import type StyleDictionary from 'style-dictionary';

export const transformNamePathToFigma = (
  token: StyleDictionary.TransformedToken,
  options?: StyleDictionary.Platform
): string => {
  let pathArray = token.path.filter(
    (part: unknown): part is string => part !== '@'
  );
  if (
    ['fgColor', 'borderColor', 'bgColor'].includes(pathArray[0]) &&
    pathArray.length === 3
  ) {
    pathArray = [pathArray[0], `${pathArray[1]}-${pathArray[2]}`];
  }
  return (
    [options?.prefix, ...pathArray]
      // remove undefined if exists
      .filter(
        (part: unknown): part is string =>
          typeof part === 'string' && part !== '@'
      )
      .join('/')
  );
};

/**
 * @description converts the [TransformedToken's](https://github.com/amzn/style-dictionary/blob/main/types/TransformedToken.d.ts) `.path` array to a specific figma name
 * @type name transformer — [StyleDictionary.NameTransform](https://github.com/amzn/style-dictionary/blob/main/types/Transform.d.ts)
 * @matcher omitted to match all tokens
 * @transformer returns `string`
 */
export const namePathToFigma: StyleDictionary.Transform = {
  type: `name`,
  transformer: transformNamePathToFigma,
};
