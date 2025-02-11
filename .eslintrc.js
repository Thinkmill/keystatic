const OFF = 0;
const WARN = 1;
const ERROR = 2;

const reactComponentTypeMessage = {
  message:
    'This type includes the children prop which is generally wrong, ' +
    'instead of using this type, type the props of the component',
};

/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },
  extends: ['plugin:jest/recommended', 'prettier'],
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
    'import',
    'jest',
    'react-compiler',
  ],
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    // '@typescript-eslint/consistent-type-imports': WARN,
    curly: [ERROR, 'multi-line'],
    'import/first': ERROR,
    'import/newline-after-import': ERROR,
    'import/no-duplicates': ERROR,
    'jest/valid-describe': OFF,
    'jest/valid-expect': OFF,
    'jest/no-conditional-expect': OFF,
    'jest/no-standalone-expect': OFF,
    'jest/expect-expect': OFF,
    'jest/no-export': OFF,
    'jest/valid-title': OFF,
    'jest/no-try-expect': OFF,
    'jest/no-disabled-tests': ERROR,
    'jest/no-alias-methods': ERROR,
    'jsx-quotes': ERROR,
    'no-trailing-spaces': ERROR,
    'no-undef': ERROR,
    'no-unused-expressions': ERROR,
    'object-curly-spacing': [ERROR, 'always'],
    'react-hooks/exhaustive-deps': ERROR,
    'react-hooks/rules-of-hooks': ERROR,
    'react/jsx-boolean-value': WARN,
    'react/jsx-no-undef': ERROR,
    'react/jsx-uses-react': ERROR,
    'react/jsx-uses-vars': ERROR,
    'react/jsx-wrap-multilines': WARN,
    'react/no-did-mount-set-state': WARN,
    'react/no-did-update-set-state': WARN,
    'react/no-unescaped-entities': OFF,
    'react/no-unknown-property': WARN,
    'react/react-in-jsx-scope': OFF,
    'react/self-closing-comp': WARN,
    'react/sort-prop-types': WARN,
    semi: ERROR,
    strict: OFF,
    '@typescript-eslint/no-unused-vars': [
      ERROR,
      {
        args: 'after-used',
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true,
        vars: 'all',
      },
    ],
    quotes: [
      ERROR,
      'single',
      { avoidEscape: true, allowTemplateLiterals: true },
    ],
    'no-restricted-syntax': [
      ERROR,
      {
        // Curious why we have this rule?
        // - Enums only work for a subset of use cases that unions of string
        // literals + objects work for and learning one language feature is
        // easier than learning two language features
        // - Enums are a new language feature which have runtime semantics which
        // means they change TypeScript from JS + types to JS + types + extra
        // language features which is harder to teach without clear advantages
        // for this specific feature
        selector: 'TSEnumDeclaration',
        message: 'Use a union of string literals instead of an enum',
      },
    ],
    '@typescript-eslint/ban-types': [
      ERROR,
      {
        extendDefaults: false,
        types: {
          Function:
            '`Function` types are unsafe. Use more specific function types ' +
            'instead. e.g. (arg: number) => string',
          String: {
            message:
              'The `String` type refers to the String object which is probably ' +
              'not what you want, you probably want `string` instead which ' +
              'refers to the string primitive type.',
            fixWith: 'string',
          },
          ComponentType: reactComponentTypeMessage,
          FC: reactComponentTypeMessage,
          SFC: reactComponentTypeMessage,
          'React.ComponentType': reactComponentTypeMessage,
          'React.FC': reactComponentTypeMessage,
          'React.SFC': reactComponentTypeMessage,
        },
      },
    ],
    'no-restricted-syntax': [
      ERROR,
      {
        selector: "TSQualifiedName[left.name='React']",
        message:
          "Avoid using the global React type, import the specific type you want from 'react'",
      },
    ],
    'react/no-unknown-property': OFF,
    'react-compiler/react-compiler': [
      ERROR,
      {
        reportableLevels: new Set([
          'InvalidJS',
          'InvalidReact',
          // uncomment if you want to see these cases
          // 'CannotPreserveMemoization',
        ]),
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      rules: {
        // TypeScript already checks for the following things and they cause conflicts
        'import/no-unresolved': OFF,
        'no-undef': OFF,
      },
    },
    {
      files: [
        '**/__tests__/**/*',
        '**/*stories.*',
        '**/*test.*',
        '**/build/**/*',
        '**/test-fixtures.*',
        '**/tests/**/*',
      ],
      rules: {
        // Allow importing from packages that aren't listed in package.json for
        // test and Storybook files
        // TypeScript will still catch uninstalled imports for us as there will
        // be no modules or type definitions for them
        'import/no-extraneous-dependencies': OFF,
      },
    },
  ],
};
