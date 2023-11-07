import { SCHEME_AUTO, SCHEME_DARK, SCHEME_LIGHT } from '@keystar/ui/primitives';

const script = `
let classList = document.documentElement.classList;
let storedPreference = localStorage.getItem('keystatic-root-color-scheme');
let schemeClasses = [...classList].filter((name) => name.includes('scheme'));

if (storedPreference === 'dark') {
  classList.remove(schemeClasses);
  classList.add('${SCHEME_DARK}');
} else if (storedPreference === 'light') {
  classList.remove(schemeClasses);
  classList.add('${SCHEME_LIGHT}');
} else {
  classList.remove(schemeClasses);
  classList.add('${SCHEME_AUTO}');
}
`.replace(/\n|\s{2,}/g, '');

/** @deprecated use `nextRootScript` instead. */
export const mediaQueryOnlyColorSchemeScaleScript = (
  <script dangerouslySetInnerHTML={{ __html: script }} />
);
export const nextRootScript = (
  <script dangerouslySetInnerHTML={{ __html: script }} />
);
