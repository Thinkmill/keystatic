import { intro as intro$1, log, cancel, select, isCancel, text, confirm, spinner, note, outro as outro$1 } from '@clack/prompts';
import color from 'picocolors';
import fs, { existsSync, mkdirSync, createWriteStream, rmSync, rmdirSync } from 'node:fs';
import { pipeline } from 'node:stream';
import { promisify } from 'node:util';
import fetch from 'node-fetch-native';
import tar from 'tar';

const logo = `
   +---+
  /    |
 /     +---+
+---      /
    |    /
    +---+
`;
const intro = () => {
  intro$1(color.inverse("Keystatic — let's get you setup"));
  log.message(logo);
};

const cancelStep = (message = 'Keystatic app creation cancelled') => {
  cancel(message);
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
  const framework = await select({
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
  if (isCancel(framework)) cancelStep();
  ctx.framework = framework;
};

const projectName = async ctx => {
  const projectName = await text({
    message: "What's your project name? We'll create a directory for you.",
    defaultValue: './new-keystatic-project',
    placeholder: './new-keystatic-project'
  });
  if (isCancel(projectName)) cancelStep();
  if (typeof projectName === 'string') {
    ctx.projectName = projectName;
    if (projectName === '.' || projectName === './') {
      ctx.cwd = process.cwd();
    } else {
      ctx.cwd = projectName;
    }
    const isDirectoryNotEmpty = fs.existsSync(ctx.cwd) && fs.readdirSync(ctx.cwd).length;
    if (isDirectoryNotEmpty) {
      log.warn(`${color.blue(ctx.cwd)} is ${color.red('not empty')}. Some files may be overwritten.`);
      const shouldContinue = await confirm({
        message: 'Do you wish to continue?',
        initialValue: false
      });
      if (!shouldContinue || isCancel(shouldContinue)) {
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
  const spin = spinner();
  log.step(`Creating your ${color.green(`⚡️ Keystatic ${ctx.framework}`)} project at ${color.blue(ctx.projectName)}`);
  spin.start(`Downloading template and creating files...`);
  const templatesLookup = {
    'Next.js': templates.nextjs,
    Astro: templates.astro,
    Remix: templates.remix
  };
  const template = templatesLookup[ctx.framework];
  try {
    // Get latest package info from npm
    const packageInfo = await fetch(`${registryDomain}/${template}/latest`).then(response => response.json());
    if (!existsSync(ctx.cwd)) {
      mkdirSync(ctx.cwd);
    }

    // Stream latest tarball to the specified directory
    const tarballFile = `${ctx.cwd}/template.tgz`;
    const tarballResponse = await fetch(packageInfo.dist.tarball);
    const stream = createWriteStream(tarballFile);
    await promisify(pipeline)(tarballResponse.body, stream);

    // npm packages come in a directory named 'package'. Use strip to remove the directory.
    await tar.extract({
      file: tarballFile,
      cwd: ctx.cwd,
      strip: 1
    });
    rmSync(tarballFile);
  } catch (err) {
    rmdirSync(ctx.cwd);
    log.error('Error downloading template');
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
  log.message('Your project is ready!');

  // By default `note` turns the contents grey. color.reset sets to the default terminal
  // colour but requires reset to be called for every line
  note([color.reset(`  cd ${ctx.projectName}`), color.reset(`  ${ctx.packageManager} install`), color.reset(`  ${ctx.packageManager === 'npm' ? 'npm run' : ctx.packageManager} dev`), color.reset(`  http://127.0.0.1:${devServerPortLookup[ctx.framework]}/keystatic`)].join('\n'), 'Next steps');
  log.message(`If you have any questions or feedback reach out to us at:
https://github.com/Thinkmill/keystatic/discussions`);
  outro$1(`Happy coding ⚡️`);
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
      log.error('An error occurred.');
      if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
        log.error(error.message);
      }
      cancelStep();
    }
  }
}
main().catch(console.error);
