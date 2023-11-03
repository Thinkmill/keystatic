import {
  THEME_DEFAULT,
  SCHEME_AUTO,
  SCHEME_LIGHT,
  SCHEME_DARK,
} from '@keystar/ui/primitives';

export { TOKEN_PREFIX } from '@keystar/ui/primitives';

export const SELECTOR_DEFAULT = selector(THEME_DEFAULT);

export const SELECTOR_AUTO = selector(SCHEME_AUTO);
export const SELECTOR_LIGHT = selector(SCHEME_LIGHT);
export const SELECTOR_DARK = selector(SCHEME_DARK);

function selector(className: string) {
  return `.${className}`;
}
