const script = `
let classList = document.documentElement.classList;
let storedPreference = localStorage.getItem('keystatic-root-color-scheme');
let schemeClasses = [...classList].filter((name) => name.includes('scheme'));

if (storedPreference === 'dark') {
  classList.remove(schemeClasses);
  classList.add('ksv-scheme--dark');
} else if (storedPreference === 'light') {
  classList.remove(schemeClasses);
  classList.add('ksv-scheme--light');
} else {
  classList.remove(schemeClasses);
  classList.add('ksv-scheme--auto');
}
`.replace(/\n|\s{2,}/g, '');

/** @deprecated use `nextRootScript` instead. */
export const mediaQueryOnlyColorSchemeScaleScript = (
  <script dangerouslySetInnerHTML={{ __html: script }} />
);
export const nextRootScript = (
  <script dangerouslySetInnerHTML={{ __html: script }} />
);
