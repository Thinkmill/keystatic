// credit: https://github.com/primer/primitives/blob/main/src/transformers/figmaAttributes.ts
import type StyleDictionary from 'style-dictionary';

type FigmaVariableScope =
  | 'ALL_SCOPES'
  | 'TEXT_CONTENT'
  | 'CORNER_RADIUS'
  | 'WIDTH_HEIGHT'
  | 'GAP'
  | 'ALL_FILLS'
  | 'FRAME_FILL'
  | 'SHAPE_FILL'
  | 'TEXT_FILL'
  | 'STROKE';

// stroke width not yet available in figma
// https://help.figma.com/hc/en-us/articles/4406787442711#Coming_soon
const figmaScopes: Record<string, FigmaVariableScope[]> = {
  all: ['ALL_SCOPES'],
  radius: ['CORNER_RADIUS'],
  size: ['WIDTH_HEIGHT'],
  gap: ['GAP'],
  bgColor: ['FRAME_FILL', 'SHAPE_FILL'],
  fgColor: ['TEXT_FILL', 'SHAPE_FILL'],
  borderColor: ['STROKE'],
};

const getScopes = (
  scopes: string[] | string | undefined
): FigmaVariableScope[] => {
  if (typeof scopes === 'string') {
    scopes = [scopes];
  }
  if (Array.isArray(scopes)) {
    return scopes
      .map(scope => {
        if (scope in figmaScopes) return figmaScopes[scope];
        throw new Error(`Invalid scope: ${scope}`);
      })
      .flat() as FigmaVariableScope[];
  }

  return ['ALL_SCOPES'];
};
/**
 * @description retrieves figma attributes from token and adds them to attributes
 * @type attribute transformer — [StyleDictionary.AttributeTransform](https://github.com/amzn/style-dictionary/blob/main/types/Transform.d.ts)
 * @matcher matches all tokens
 * @transformer returns ab object of figma attributes
 */
export const figmaAttributes: StyleDictionary.Transform = {
  type: `attribute`,
  transformer: (
    token: StyleDictionary.TransformedToken,
    platform: StyleDictionary.Platform = {}
  ) => {
    const { mode, collection, scopes } =
      token.$extensions?.['org.keystar.figma'] || {};
    return {
      mode: platform.options?.mode || mode || 'default',
      collection,
      scopes: getScopes(scopes),
    };
  },
};
