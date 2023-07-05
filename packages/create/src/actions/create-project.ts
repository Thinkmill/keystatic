import {
  createWriteStream,
  rmdirSync,
  rmSync,
  mkdirSync,
  existsSync,
} from 'node:fs';
import { pipeline } from 'node:stream';
import { promisify } from 'node:util';
import { spinner, log } from '@clack/prompts';
import fetch from 'node-fetch-native';
import color from 'picocolors';
import tar from 'tar';
import { Context } from '..';

type NextOrAstro = Extract<Context['framework'], 'Astro' | 'Next.js'>;

const registryDomain = 'https://registry.npmjs.org';
// These templates reference their npm package name
const templates = {
  nextjs: '@keystatic/templates-nextjs',
  astro: '@keystatic/templates-astro',
};

type PackageInfo = {
  dist: {
    tarball: string;
  };
};

export const createProject = async (ctx: Context) => {
  const spin = spinner();
  log.step(
    `Creating your ${color.green(
      `⚡️ Keystatic ${ctx.framework}`
    )} project at ${color.blue(ctx.projectName)}`
  );

  spin.start(`Downloading template and creating files...`);

  const templatesLookup: Record<NextOrAstro, string> = {
    'Next.js': templates.nextjs,
    Astro: templates.astro,
  };

  const defaultTemplate = templatesLookup[ctx.framework as NextOrAstro];

  try {
    // Get latest package info from npm
    const packageInfo: PackageInfo = await fetch(
      `${registryDomain}/${defaultTemplate}/latest`
    ).then(response => response.json());

    if (!existsSync(ctx.cwd)) {
      mkdirSync(ctx.cwd);
    }

    // Stream latest tarball to the specified directory
    const tarballFile = `${ctx.cwd}/template.tgz`;
    const tarballResponse = await fetch(packageInfo.dist.tarball);
    const stream = createWriteStream(tarballFile);
    await promisify(pipeline)(tarballResponse.body as any, stream);

    // npm packages come in a directory named 'package'. Use strip to remove the directory.
    await tar.extract({ file: tarballFile, cwd: ctx.cwd, strip: 1 });

    rmSync(tarballFile);
  } catch (err: any) {
    rmdirSync(ctx.cwd);
    log.error('Error downloading template');
    throw new Error(err.message);
  }

  spin.stop('Done ✅');
};
