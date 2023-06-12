import fs from 'node:fs';
import { spinner, log } from '@clack/prompts';
import { downloadTemplate } from 'giget';
import color from 'picocolors';
import { Context } from '..';

const templates = {
  // To target a branch add it to the end of this string after a hash, e.g. #create-cli
  nextAppDir: 'github:thinkmill/keystatic/templates/next-app-dir',
};

export const createProject = async (ctx: Context) => {
  const spin = spinner();
  log.step(
    `Creating your ${color.green(
      `⚡️ Keystatic ${ctx.framework}`
    )} project at ${color.blue(ctx.projectName)}`
  );

  spin.start(`Downloading template and creating files...`);

  const defaultTemplate = templates.nextAppDir;
  try {
    await downloadTemplate(defaultTemplate, {
      force: true,
      provider: 'github',
      cwd: ctx.cwd,
      dir: '.',
    });
  } catch (err: any) {
    fs.rmdirSync(ctx.cwd);
    log.error('Error downloading template');
    throw new Error(err.message);
  }

  // giget doesn't throw if the repo exists but the template doesn't exist in it.
  // Check directory isn't empty to confirm.
  if (fs.readdirSync(ctx.cwd).length === 0) {
    fs.rmdirSync(ctx.cwd);
    throw new Error('Template not found.');
  }

  spin.stop('Done ✅');
};
