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
    // javascript: javascript(`javascript/${filename}.js`, options.prefix, options.buildPath),
    javascript: javascript(),
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
  const animationFiles = glob.sync('tokens/animation/*');
  for (const file of animationFiles) {
    // build functional scales
    KeystarStyleDictionary.extend(
      getStyleDictionaryConfig(
        `animation/${file
          .replace('tokens/animation/', '')
          .replace('.json5', '')}`,
        [file],
        [],
        buildOptions
      )
    ).buildAllPlatforms();
  }

  /** -----------------------------------
   * Colors, shadows & borders
   * ----------------------------------- */
  for (const { filename, source, include } of themes) {
    // build functional scales
    KeystarStyleDictionary.extend(
      getStyleDictionaryConfig(
        `themes/${filename}`,
        source,
        include,
        { ...buildOptions, themed: true },
        // disable fallbacks for themes
        { fallbacks: undefined }
      )
    ).buildAllPlatforms();
  }

  /** -----------------------------------
   * Size tokens
   * ----------------------------------- */
  // const sizeFiles = glob.sync('src/tokens/functional/size/*');
  // //
  // for (const file of sizeFiles) {
  //   KeystarStyleDictionary.extend(
  //     getStyleDictionaryConfig(
  //       `size/${file
  //         .replace('src/tokens/functional/size/', '')
  //         .replace('.json', '')}`,
  //       [file],
  //       ['src/tokens/base/size/size.json', ...sizeFiles],
  //       buildOptions
  //     )
  //   ).buildAllPlatforms();
  // }
  // // build base scales
  // KeystarStyleDictionary.extend(
  //   // using includes as source
  //   getStyleDictionaryConfig(
  //     `base/size/size`,
  //     ['src/tokens/base/size/size.json'],
  //     [],
  //     {
  //       buildPath: buildOptions.buildPath,
  //       prefix: undefined,
  //     }
  //   )
  // ).buildAllPlatforms();

  // /** -----------------------------------
  //  * Typography tokens
  //  * ----------------------------------- */
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

  // KeystarStyleDictionary.extend(
  //   getStyleDictionaryConfig(
  //     `base/typography/typography`,
  //     [`src/tokens/base/typography/*.json`],
  //     [],
  //     buildOptions
  //   )
  // ).buildAllPlatforms();
};

/** -----------------------------------
 * Run build script
 * ----------------------------------- */
buildDesignTokens({
  buildPath: 'dist/',
});
