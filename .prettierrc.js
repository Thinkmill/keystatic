module.exports = {
  arrowParens: 'avoid',
  // printWidth: 100,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  proseWrap: 'always',
  useTabs: false,
  // FIXME: get this working
  // importOrder: [
  //   '^react$',
  //   '^[a-zA-Z](.*)',
  //   '^@(.*)',
  //   '^@(?!voussoir)(.*)$',
  //   '^[./]',
  // ],
  // importOrderSeparation: true,
  // importOrderSortSpecifiers: true,
  overrides: [
    {
      files: 'keystatic/**',
      options: {
        // to align with the keystone repo
        printWidth: 100,
      },
    },
  ],
};
