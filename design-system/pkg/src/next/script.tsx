const script = `
let classList = document.documentElement.classList;
let style = document.documentElement.style;

let storedPreference = localStorage.getItem('keystatic-root-color-scheme');
let systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
let preference = storedPreference === 'light' || storedPreference === 'dark' ? storedPreference : systemPreference;

if (preference === 'dark') {
  classList.remove('ksv-scheme--light');
  classList.add('ksv-scheme--dark');
  style.colorScheme = 'dark';
} else {
  classList.remove('ksv-scheme--dark');
  classList.add('ksv-scheme--light');
  style.colorScheme = 'light';
}

let fine = window.matchMedia('(any-pointer: fine)');
if (!fine.matches) {
  classList.remove('ksv-scale--medium');
  classList.add('ksv-scale--large');
} else {
  classList.add('ksv-scale--medium');
  classList.remove('ksv-scale--large');
}
`.replace(/\n|\s{2,}/g, '');

/** @deprecated use `nextRootScript` instead. */
export const mediaQueryOnlyColorSchemeScaleScript = (
  <script dangerouslySetInnerHTML={{ __html: script }} />
);
export const nextRootScript = (
  <script dangerouslySetInnerHTML={{ __html: script }} />
);
