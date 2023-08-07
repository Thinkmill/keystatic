import fs from 'fs';

import { KeystarStyleDictionary } from '../KeystarStyleDictionary';

import { figma } from '../platforms';
import type { ConfigGeneratorOptions } from '../types';
import { themes } from './themes.config';

/*
Desired output
------------------------------
{
  "id": "collection-id",
  "name": "colors",
  "modes": {
    "1:0": "Light",
    "1:1": "Dark"
  },
  "variableIds": ["loads-of-ids"],
  "variables": [
    {
      "id": "token-id",
      "name": "alias/backgroundPressed",
      "type": "COLOR",
      "scopes": ["FRAME_FILL", "SHAPE_FILL"],
      "valuesByMode": {
        "1:0": {
          "type": "VARIABLE_ALIAS",
          "id": "id-of-token"
        },
        "1:1": {
          "type": "VARIABLE_ALIAS",
          "id": "id-of-token"
        }
      },
      "resolvedValuesByMode": {
        "1:0": {
          "resolvedValue": {
            "r": 0,
            "g": 0,
            "b": 0,
            "a": 0.114
          },
          "alias": "id-of-token",
          "aliasName": "scales/black"
        },
        "1:1": {
          "resolvedValue": {
            "r": 1,
            "g": 1,
            "b": 1,
            "a": 0.124
          },
          "alias": "id-of-token",
          "aliasName": "scales/white"
        }
      }
    }
  ]
}
*/

export const buildFigma = (buildOptions: ConfigGeneratorOptions): void => {
  /** -----------------------------------
   * Color collection
   * ----------------------------------- */
  for (const { filename, source, include } of themes) {
    if (['light', 'dark'].includes(filename)) {
      // build functional scales
      KeystarStyleDictionary.extend({
        source,
        include,
        platforms: {
          figma: figma(
            `figma/themes/${filename}.json`,
            buildOptions.prefix,
            buildOptions.buildPath,
            {
              mode: filename,
            }
          ),
        },
      }).buildAllPlatforms();
    }
  }
  // /** -----------------------------------
  //  * Size tokens
  //  * ----------------------------------- */
  // const sizeFiles = [
  //   'src/tokens/base/size/size.json',
  //   'src/tokens/functional/size/breakpoints.json',
  //   'src/tokens/functional/size/size.json',
  //   'src/tokens/functional/size/border.json',
  //   // 'src/tokens/functional/size/size-fine.json',
  //   // 'src/tokens/functional/size/size-coarse.json',
  // ];
  // //
  // KeystarStyleDictionary.extend({
  //   source: sizeFiles,
  //   include: sizeFiles,
  //   platforms: {
  //     figma: figma(
  //       `figma/dimension/dimension.json`,
  //       buildOptions.prefix,
  //       buildOptions.buildPath
  //     ),
  //   },
  // }).buildAllPlatforms();

  /** -----------------------------------
   * Create list of files
   * ----------------------------------- */
  const dirNames = fs
    .readdirSync(`${buildOptions.buildPath}figma`, { withFileTypes: true })
    .filter(dir => dir.isDirectory())
    .map(dir => dir.name);

  const files = dirNames.flatMap(dir => {
    const localFiles = fs.readdirSync(`${buildOptions.buildPath}figma/${dir}`);
    return localFiles.map(
      file => `${buildOptions.buildPath}figma/${dir}/${file}`
    );
  });

  const tokens: {
    collection: string;
    mode: string;
  }[] = files.flatMap(filePath =>
    JSON.parse(fs.readFileSync(filePath, 'utf8'))
  );
  const collections: Record<string, string[]> = {};

  for (const { collection, mode } of tokens) {
    if (!(collection in collections)) {
      collections[collection] = [];
    }
    if (!collections[collection].includes(mode)) {
      collections[collection].push(mode);
    }
  }

  // define the order of the modes
  // we inverse it to deal with the -1 of the indexOf if item is not found in the array: basically anything that is not in the list should come last
  const modeOrder = ['light', 'dark'].reverse();
  // sort modes in the order defined above
  for (const collection in collections) {
    collections[collection].sort(
      (a, b) => modeOrder.indexOf(b) - modeOrder.indexOf(a)
    );
  }
  // write to file
  fs.writeFileSync(
    `${buildOptions.buildPath}figma/figma.json`,
    JSON.stringify({ collections, files }, null, 2)
  );
};

buildFigma({
  buildPath: 'dist/',
});
