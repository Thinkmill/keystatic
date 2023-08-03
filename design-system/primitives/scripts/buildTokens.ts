import glob from 'fast-glob';
import type StyleDictionary from 'style-dictionary';

import { KeystarStyleDictionary } from '../KeystarStyleDictionary';
import { css, javascript } from '../platforms';
import type {
  ConfigGeneratorOptions,
  StyleDictionaryConfigGenerator,
} from '../types';

import { themes } from './themes.config';
import { buildFigma } from './buildFigma';

/**
 * getStyleDictionaryConfig
 * @param filename output file name without extension
 * @param source array of source token json files
 * @param include array of included token json files (will not be present in output btu values are used when referenced)
 * @param options options object
 * @returns style dictionary config object
 */
const getStyleDictionaryConfig: StyleDictionaryConfigGenerator = (
  filename,
  source,
  include,
  options,
  platforms = {}
): StyleDictionary.Config => ({
  source, // build the special formats
  include,
  platforms: {
    css: css(`css/${filename}.css`, options.prefix, options.buildPath, {
      themed: options.themed,
    }),
    javascript: javascript(
      `javascript/${filename}.js`,
      options.prefix,
      options.buildPath
    ),
    ...platforms,
  },
});

export const buildDesignTokens = (
  buildOptions: ConfigGeneratorOptions
): void => {
  buildFigma(buildOptions);

  /** -----------------------------------
   * Animation tokens
   * ----------------------------------- */
  KeystarStyleDictionary.extend(
    getStyleDictionaryConfig(
      `animation/animation`,
      ['tokens/animation/animation.json5'],
      [],
      buildOptions
    )
  ).buildAllPlatforms();

  /** -----------------------------------
   * Colors, shadows & borders
   * ----------------------------------- */
  for (const { filename, source, include } of themes) {
    // build functional scales
    KeystarStyleDictionary.extend(
      getStyleDictionaryConfig(`themes/${filename}`, source, include, {
        ...buildOptions,
        themed: true,
      })
    ).buildAllPlatforms();
  }

  /** -----------------------------------
   * Size tokens
   * ----------------------------------- */
  const sizeFiles = glob.sync('tokens/size/*');
  //
  for (const file of sizeFiles) {
    KeystarStyleDictionary.extend(
      getStyleDictionaryConfig(
        `size/${file.replace('tokens/size/', '').replace('.json5', '')}`,
        [file],
        [...sizeFiles],
        buildOptions
      )
    ).buildAllPlatforms();
  }

  /** -----------------------------------
   * Typography tokens
   * ----------------------------------- */
  KeystarStyleDictionary.extend(
    getStyleDictionaryConfig(
      `typography/typography`,
      ['tokens/typography/typography.json5'],
      [],
      buildOptions
    )
  ).buildAllPlatforms();
  // KeystarStyleDictionary.extend(
  //   getStyleDictionaryConfig(
  //     `functional/typography/typography`,
  //     [`src/tokens/functional/typography/*.json`],
  //     [`src/tokens/base/typography/*.json`],
  //     buildOptions,
  //     {
  //       css: css(
  //         `css/functional/typography/typography.css`,
  //         buildOptions.prefix,
  //         buildOptions.buildPath,
  //         {
  //           options: {
  //             outputReferences: true,
  //           },
  //         }
  //       ),
  //     }
  //   )
  // ).buildAllPlatforms();
};

/** -----------------------------------
 * Run build script
 * ----------------------------------- */
buildDesignTokens({
  buildPath: 'dist/',
});
