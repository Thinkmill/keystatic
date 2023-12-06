'use strict';

var prompts = require('@clack/prompts');
var color = require('picocolors');
var fs = require('node:fs');
var node_stream = require('node:stream');
var node_util = require('node:util');
var fetch = require('node-fetch-native');
var tar = require('tar');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var color__default = /*#__PURE__*/_interopDefault(color);
var fs__default = /*#__PURE__*/_interopDefault(fs);
var fetch__default = /*#__PURE__*/_interopDefault(fetch);
var tar__default = /*#__PURE__*/_interopDefault(tar);

const logo = `
   +---+
  /    |
 /     +---+
+---      /
    |    /
    +---+
`;
const intro = () => {
  prompts.intro(color__default["default"].inverse("Keystatic — let's get you setup"));
  prompts.log.message(logo);
};

const cancelStep = (message = 'Keystatic app creation cancelled') => {
  prompts.cancel(message);
  return process.exit(0);
};
const getPackageManager = () => {
  var _userAgent$split$;
  const userAgent = process.env.npm_config_user_agent;
  return {
    name: (_userAgent$split$ = userAgent === null || userAgent === void 0 ? void 0 : userAgent.split('/')[0]) !== null && _userAgent$split$ !== void 0 ? _userAgent$split$ : 'npm'
  };
};

const frameworkChoice = async ctx => {
  const framework = await prompts.select({
    message: 'Pick a framework to use with Keystatic',
    options: [{
      value: 'Next.js',
      label: 'Next.js'
    }, {
      value: 'Astro',
      label: 'Astro'
    }, {
      value: 'Remix',
      label: 'Remix'
    }]
  });
  if (prompts.isCancel(framework)) cancelStep();
  ctx.framework = framework;
};

const projectName = async ctx => {
  const projectName = await prompts.text({
    message: "What's your project name? We'll create a directory for you.",
    defaultValue: './new-keystatic-project',
    placeholder: './new-keystatic-project'
  });
  if (prompts.isCancel(projectName)) cancelStep();
  if (typeof projectName === 'string') {
    ctx.projectName = projectName;
    if (projectName === '.' || projectName === './') {
      ctx.cwd = process.cwd();
    } else {
      ctx.cwd = projectName;
    }
    const isDirectoryNotEmpty = fs__default["default"].existsSync(ctx.cwd) && fs__default["default"].readdirSync(ctx.cwd).length;
    if (isDirectoryNotEmpty) {
      prompts.log.warn(`${color__default["default"].blue(ctx.cwd)} is ${color__default["default"].red('not empty')}. Some files may be overwritten.`);
      const shouldContinue = await prompts.confirm({
        message: 'Do you wish to continue?',
        initialValue: false
      });
      if (!shouldContinue || prompts.isCancel(shouldContinue)) {
        cancelStep('Exiting create Keystatic app');
      }
    }
  }
};

const registryDomain = 'https://registry.npmjs.org';
// These templates reference their npm package name
const templates = {
  nextjs: '@keystatic/templates-nextjs',
  astro: '@keystatic/templates-astro',
  remix: '@keystatic/templates-remix'
};
const createProject = async ctx => {
  const spin = prompts.spinner();
  prompts.log.step(`Creating your ${color__default["default"].green(`⚡️ Keystatic ${ctx.framework}`)} project at ${color__default["default"].blue(ctx.projectName)}`);
  spin.start(`Downloading template and creating files...`);
  const templatesLookup = {
    'Next.js': templates.nextjs,
    Astro: templates.astro,
    Remix: templates.remix
  };
  const template = templatesLookup[ctx.framework];
  try {
    // Get latest package info from npm
    const packageInfo = await fetch__default["default"](`${registryDomain}/${template}/latest`).then(response => response.json());
    if (!fs.existsSync(ctx.cwd)) {
      fs.mkdirSync(ctx.cwd);
    }

    // Stream latest tarball to the specified directory
    const tarballFile = `${ctx.cwd}/template.tgz`;
    const tarballResponse = await fetch__default["default"](packageInfo.dist.tarball);
    const stream = fs.createWriteStream(tarballFile);
    await node_util.promisify(node_stream.pipeline)(tarballResponse.body, stream);

    // npm packages come in a directory named 'package'. Use strip to remove the directory.
    await tar__default["default"].extract({
      file: tarballFile,
      cwd: ctx.cwd,
      strip: 1
    });
    fs.rmSync(tarballFile);
  } catch (err) {
    fs.rmdirSync(ctx.cwd);
    prompts.log.error('Error downloading template');
    throw new Error(err.message);
  }
  spin.stop('Done ✅');
};

const devServerPortLookup = {
  'Next.js': '3000',
  Astro: '4321',
  Remix: '2222'
};
const outro = ctx => {
  prompts.log.message('Your project is ready!');

  // By default `note` turns the contents grey. color.reset sets to the default terminal
  // colour but requires reset to be called for every line
  prompts.note([color__default["default"].reset(`  cd ${ctx.projectName}`), color__default["default"].reset(`  ${ctx.packageManager} install`), color__default["default"].reset(`  ${ctx.packageManager === 'npm' ? 'npm run' : ctx.packageManager} dev`), color__default["default"].reset(`  http://127.0.0.1:${devServerPortLookup[ctx.framework]}/keystatic`)].join('\n'), 'Next steps');
  prompts.log.message(`If you have any questions or feedback reach out to us at:
https://github.com/Thinkmill/keystatic/discussions`);
  prompts.outro(`Happy coding ⚡️`);
};

async function main() {
  const ctx = {
    framework: 'Next.js',
    packageManager: getPackageManager().name,
    cwd: process.cwd()
  };
  const steps = [intro, frameworkChoice, projectName, createProject, outro];
  for (const step of steps) {
    try {
      await step(ctx);
    } catch (error) {
      prompts.log.error('An error occurred.');
      if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
        prompts.log.error(error.message);
      }
      cancelStep();
    }
  }
}
main().catch(console.error);
