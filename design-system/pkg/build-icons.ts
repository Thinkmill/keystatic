import { transform } from '@svgr/core';
// @ts-expect-error
import _rawIcons from 'lucide-static';
import fs from 'fs/promises';
import path from 'path';

const icons = Object.entries(
  _rawIcons as {
    [key: string]: string;
  }
)
  .map(([name, svg]) => {
    return {
      name: name + 'Icon',
      data: svg,
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

async function writeIcons() {
  let iconOutDir = path.join(__dirname, 'src', 'icon', 'icons');

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
  await fs.writeFile('src/icon/all-inner.ts', index);
  console.info('✅ Index file written successfully');
}

// BUILD
// ------------------------------

async function build() {
  console.info('🧹 Cleaning existing exports');
  await Promise.all([
    fs.rm('icon/icons', { recursive: true, force: true }),
    fs.rm('src/icon/icons', { recursive: true, force: true }),
  ]);
  console.info('🚧 Building icon exports');

  await writeIcons();

  await writeAllFile();
}

build().catch(error => {
  console.error(error);
  process.exit(1);
});
