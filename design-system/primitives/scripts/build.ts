import glob from 'fast-glob';
import fs from 'fs';
import StyleDictionary from 'style-dictionary';

const { fileHeader } = StyleDictionary.formatHelpers;

const build = ({
  destination,
  files,
}: {
  destination: string;
  files: string[];
}) => {
  // remove existing file
  if (fs.existsSync(destination)) {
    fs.unlinkSync(destination);
  }

  // add file header
  fs.writeFileSync(destination, fileHeader({ file: { destination } }));

  // concat all css files into one
  files.forEach(file => {
    fs.appendFileSync(destination, fs.readFileSync(file).toString());
  });
};

build({
  // bring themes to the top of the file, but dark must be after light
  files: glob.sync('dist/css/**/*.css').sort((a, b) => {
    if (a.includes('theme')) return -1;
    if (b.includes('theme')) return 1;
    if (a.includes('dark')) return 1;
    if (b.includes('dark')) return -1;
    return 0;
  }),
  destination: 'dist/keystar.css',
});
