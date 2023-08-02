import { KeystarStyleDictionary } from '../KeystarStyleDictionary';
import { cssOLD } from '../platforms/cssOLD';
import { javascript } from '../platforms/javascript';

function getConfig(scheme: string, scale: string) {
  return {
    source: [
      'tokens/static.@(json|json5)',
      `tokens/scales/${scale}/*.@(json|json5)`,
      `tokens/color/${scheme}/*.@(json|json5)`,
      'tokens/**/shared.@(json|json5)',
    ],
    platforms: {
      css: cssOLD(scheme, scale),
      javascript: javascript(),
    },
  };
}

// console.log("Build started...");

// PROCESS TOKENS FOR SCHEMES, SCALES, AND PLATFORMS

['light', 'dark'].map(function (scheme) {
  ['medium', 'large'].map(function (scale) {
    ['css', 'javascript'].map(function (platform) {
      console.log(`\nProcessing: [${platform}] [${scheme}] [${scale}]`);

      const DictionaryInstance = KeystarStyleDictionary.extend(
        getConfig(scheme, scale)
      );

      DictionaryInstance.buildPlatform(platform);

      // console.log("\nEnd processing");
    });
  });
});

// console.log("\n==============================================");
// console.log("\nBuild completed!");
