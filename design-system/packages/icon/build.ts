import { transform } from '@svgr/core';
import rawIcons from 'lucide-static';
import fs from 'fs/promises';
import path from 'path';

const icons = Object.entries(rawIcons)
  .map(([name, svg]) => {
    return {
      name: name + 'Icon',
      data: svg,
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

async function writeIcons() {
  let iconOutDir = path.join(__dirname, 'src', 'icons');

  await fs.mkdir(iconOutDir, { recursive: true });
  await Promise.all(
    icons.map(async icon => {
      let code = await transform(
        icon.data,
        {
          icon: true,
          typescript: true,
          expandProps: false,

          template: function (variables, context) {
            variables.jsx.openingElement.attributes =
              variables.jsx.openingElement.attributes.filter(
                attr =>
                  attr.type !== 'JSXAttribute' ||
                  (attr.name.name !== 'width' &&
                    attr.name.name !== 'height' &&
                    attr.name.name !== 'stroke' &&
                    attr.name.name !== 'fill')
              );
            return context.tpl`
            export const ${variables.componentName} = ${variables.jsx};
            `;
          },
          plugins: [
            '@svgr/plugin-svgo',
            '@svgr/plugin-jsx',
            '@svgr/plugin-prettier',
          ],
        },
        { componentName: icon.name }
      );
      await fs.writeFile(path.join(iconOutDir, `${icon.name}.tsx`), code);
    })
  );
}

async function writeAllFile() {
  const index =
    icons
      .map(icon => `export { ${icon.name} } from './icons/${icon.name}';`)
      .join('\n') + `\n`;
  await fs.writeFile('src/all-inner.ts', index);
  console.info('✅ Index file written successfully');
}

async function createEntrypointPkgJsons() {
  await Promise.all(
    icons.map(async icon => {
      const pkgPath = path.join(
        process.cwd(),
        'icons',
        icon.name,
        'package.json'
      );
      await fs.mkdir(path.dirname(pkgPath), { recursive: true });
      const pkgJson = {
        main: `dist/keystar-ui-icon-icons-${icon.name}.cjs.js`,
        module: `dist/keystar-ui-icon-icons-${icon.name}.esm.js`,
      };
      await fs.writeFile(pkgPath, JSON.stringify(pkgJson, null, 2) + '\n');
    })
  );

  console.info('✅ all package.json entrypoint files written successfully');
}

// BUILD
// ------------------------------

async function build() {
  console.info('🧹 Cleaning existing exports');
  await Promise.all([
    fs.rm('icons', { recursive: true, force: true }),
    fs.rm('src/icons', { recursive: true, force: true }),
  ]);
  console.info('🚧 Building icon exports');

  await writeIcons();

  await writeAllFile();
  await createEntrypointPkgJsons();
}

build().catch(error => {
  console.error(error);
  process.exit(1);
});
