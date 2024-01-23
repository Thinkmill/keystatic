import { transform } from '@svgr/core';
import _rawIcons from 'lucide-static';
import fs from 'fs/promises';
import path from 'path';

const seenIcons = new Set<string>();

const icons = Object.entries(
  _rawIcons as {
    [key: string]: string;
  }
)
  .filter(([, svg]) => {
    const svgWithoutName = svg.replace(/lucide-.*"/, '');
    if (seenIcons.has(svgWithoutName)) {
      return false;
    }
    seenIcons.add(svgWithoutName);

    return true;
  })
  .map(([name, svg]) => {
    return {
      name: name + 'Icon',
      data: svg,
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

async function writeIcons() {
  let iconOutDir = path.join('src', 'icon', 'icons');

  await fs.mkdir(iconOutDir, { recursive: true });
  await Promise.all(
    icons.map(async icon => {
      const name = icon.name[0].toLowerCase() + icon.name.slice(1);
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
                    attr.name.name !== 'fill' &&
                    attr.name.name !== 'className')
              );
            return context.tpl`
            export const ${name} = ${variables.jsx};
            `;
          },
          plugins: [
            '@svgr/plugin-svgo',
            '@svgr/plugin-jsx',
            '@svgr/plugin-prettier',
          ],
        },
        { componentName: name }
      );
      await fs.writeFile(path.join(iconOutDir, `${name}.tsx`), code);
    })
  );
}

async function writeAllFile() {
  const index =
    icons
      .map(
        icon =>
          `export { ${
            icon.name[0].toLowerCase() + icon.name.slice(1)
          } } from './icons/${
            icon.name[0].toLowerCase() + icon.name.slice(1)
          }';`
      )
      .join('\n') + `\n`;
  await fs.writeFile('src/icon/all-inner.ts', index);
  console.info('✅ Index file written successfully');
}

// BUILD
// ------------------------------

async function build() {
  console.info('🧹 Cleaning existing exports');
  await fs.rm('src/icon/icons', { recursive: true, force: true });
  console.info('🚧 Building icon exports');

  await writeIcons();

  await writeAllFile();
}

build().catch(error => {
  console.error(error);
  process.exit(1);
});
