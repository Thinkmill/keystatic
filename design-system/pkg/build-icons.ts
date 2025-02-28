import { transform } from '@svgr/core';
import { optimize } from 'svgo';
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
      const optimized = optimize(icon.data, {
        plugins: [
          { name: 'preset-default' },
          {
            name: 'removeAttrs',
            params: { attrs: ['class'] },
          },
        ],
      }).data;
      let code = (
        await transform(
          optimized,
          {
            icon: true,
            typescript: true,
            expandProps: false,
            template: function (variables, context) {
              return context.tpl`
            /** LOCATION_FOR_REPLACEMENT */
            export const ${name} = ${
              variables.jsx.children.length === 1
                ? variables.jsx.children[0]
                : {
                    type: 'JSXFragment',
                    openingFragment: {
                      type: 'JSXOpeningFragment',
                    },
                    closingFragment: {
                      type: 'JSXClosingFragment',
                    },
                    children: variables.jsx.children,
                  }
            }
            `;
            },
            plugins: ['@svgr/plugin-jsx', '@svgr/plugin-prettier'],
          },
          { componentName: name }
        )
      ).replace(
        'LOCATION_FOR_REPLACEMENT',
        `![${name}](data:image/svg+xml;base64,${Buffer.from(
          optimized
            .replace(
              /<svg[^>]+>/,
              '$&<rect fill="#fff" stroke="#fff" width="24" height="24"/>'
            )
            .replace(/currentColor/g, '#000'),
          'utf8'
        ).toString('base64')})`
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
