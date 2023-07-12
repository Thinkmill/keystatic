const babelConfig = require('../../babel.config.json');
const webpack = require('webpack');

module.exports = {
  title: 'Playroom | Keystar UI',
  components: './playroom/components.ts',
  outputPath: './public/playroom/',
  baseUrl: '/playroom/',
  exampleCode: `<Text>Hello world</Text>`,
  frameComponent: './playroom/frame.tsx',
  port: 9000,
  typeScriptFiles: ['../pkg/src/**/*.{ts,tsx}', '!**/node_modules'],
  widths: [320, 768, 1024],
  webpackConfig: () => ({
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: babelConfig,
          },
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx'],
    },
    plugins: [new webpack.ProvidePlugin({ process: 'process/browser' })],
  }),
};
