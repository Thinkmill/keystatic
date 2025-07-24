import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const languages = [
  'clike',
  'c',
  'cpp',
  'arduino',
  'bash',
  'csharp',
  'markup',
  'css',
  'diff',
  'go',
  'ini',
  'java',
  'regex',
  'javascript',
  'jsx',
  'json',
  'kotlin',
  'less',
  'lua',
  'makefile',
  'yaml',
  'markdown',
  'objectivec',
  'perl',
  'markup-templating',
  'php',
  'python',
  'r',
  'ruby',
  'rust',
  'sass',
  'scss',
  'sql',
  'swift',
  'typescript',
  'tsx',
  'basic',
  'vbnet',
];

(async () => {
  const otherLanguages = (
    await Promise.all(
      languages.map(lang =>
        fs.readFile(
          fileURLToPath(
            import.meta.resolve(`prismjs/components/prism-${lang}`)
          ),
          'utf8'
        )
      )
    )
  ).join('\n\n');
  const prism = (
    await fs.readFile(fileURLToPath(import.meta.resolve('prismjs')), 'utf8')
  )
    .replace(
      `if (typeof module !== 'undefined' && module.exports) {
\tmodule.exports = Prism;
}

// hack for components to work correctly in node.js
if (typeof global !== 'undefined') {
\tglobal.Prism = Prism;
}`,
      ''
    )
    .replace(
      `var _self = (typeof window !== 'undefined')
	? window   // if in browser
	: (
		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
			? self // if in worker
			: {}   // if in node js
	);`,
      `var _self = globalThis;`
    );
  await fs.writeFile(
    `src/form/fields/document/DocumentEditor/prism.js`,
    '/* eslint-disable */\nglobalThis.Prism = { manual: true };\n' +
      prism +
      '\n' +
      otherLanguages +
      '\nexport default Prism;'
  );
})();
