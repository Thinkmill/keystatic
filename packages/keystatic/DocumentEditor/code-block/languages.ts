import Prism from '../prism';

const languages = [
  { label: 'C', value: 'c' },
  { label: 'C++', value: 'cpp' },
  { label: 'Arduino', value: 'arduino' },
  { label: 'Bash', value: 'bash' },
  { label: 'C#', value: 'csharp' },
  { label: 'CSS', value: 'css' },
  { label: 'Diff', value: 'diff' },
  { label: 'Go', value: 'go' },
  { label: 'INI', value: 'ini' },
  { label: 'Java', value: 'java' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'JSX', value: 'jsx' },
  { label: 'JSON', value: 'json' },
  { label: 'Kotlin', value: 'kotlin' },
  { label: 'Less', value: 'less' },
  { label: 'Lua', value: 'lua' },
  { label: 'Makefile', value: 'makefile' },
  { label: 'Markdown', value: 'markdown' },
  { label: 'Objective-C', value: 'objectivec' },
  { label: 'Perl', value: 'perl' },
  { label: 'PHP', value: 'php' },
  { label: 'Python', value: 'python' },
  { label: 'R', value: 'r' },
  { label: 'Ruby', value: 'ruby' },
  { label: 'Rust', value: 'rust' },
  { label: 'Sass', value: 'sass' },
  { label: 'SCSS', value: 'scss' },
  { label: 'SQL', value: 'sql' },
  { label: 'Swift', value: 'swift' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'TSX', value: 'tsx' },
  { label: 'VB.NET', value: 'vbnet' },
  { label: 'YAML', value: 'yaml' },
];

export const canonicalNameToLabel = new Map(
  languages.map(x => [x.value, x.label])
);
export const labelToCanonicalName = new Map(
  languages.map(x => [x.label, x.value])
);

const languageToCanonicalName = new Map(
  languages.map(lang => [Prism.languages[lang.value], lang.value])
);

export const aliasesToCanonicalName = new Map(
  Object.keys(Prism.languages).flatMap(lang => {
    const canonicalName = languageToCanonicalName.get(Prism.languages[lang]);
    if (canonicalName === undefined) {
      return [];
    }
    return [[lang, canonicalName]];
  })
);

const languagesToAliases = new Map(
  languages.map(lang => [lang.value, [] as string[]])
);

for (const [alias, canonicalName] of aliasesToCanonicalName) {
  languagesToAliases.get(canonicalName)!.push(alias);
}
export const languagesWithAliases = [
  { label: 'Plain text', value: 'plain', aliases: [] },
  ...[...languagesToAliases].map(([canonicalName, aliases]) => ({
    label: canonicalNameToLabel.get(canonicalName)!,
    value: canonicalName,
    aliases,
  })),
];
export const aliasesToLabel = new Map(
  [...aliasesToCanonicalName].map(([alias, canonicalName]) => [
    alias,
    canonicalNameToLabel.get(canonicalName)!,
  ])
);
