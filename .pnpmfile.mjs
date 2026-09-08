const iconExportPrefix = './icon/icons/';

function beforePacking(pkg) {
  delete pkg.devDependencies;
  delete pkg.scripts;
  delete pkg.preconstruct;
  delete pkg['ts-gql'];
  delete pkg.imports;

  if (pkg.name !== '@keystar/ui') {
    return pkg;
  }

  if (
    typeof pkg.exports !== 'object' ||
    pkg.exports === null ||
    Array.isArray(pkg.exports)
  ) {
    throw new Error('Expected @keystar/ui to have an exports map');
  }

  for (const exportPath of Object.keys(pkg.exports)) {
    if (exportPath.startsWith(iconExportPrefix)) {
      delete pkg.exports[exportPath];
    }
  }

  pkg.exports[`${iconExportPrefix}*`] = './dist/keystar-ui-icon-icons-*.js';

  return pkg;
}

export const hooks = {
  beforePacking,
};
