import { TOKEN_PREFIX } from '../constants';

export const javascript = () => {
  return {
    prefix: TOKEN_PREFIX,
    transforms: ['attribute/cti', 'name/cti/kebab'],
    buildPath: `dist/javascript/`,
    files: [
      {
        destination: `tokenSchema.js`,
        format: 'javascript/token-map',
      },
    ],
  };
};
