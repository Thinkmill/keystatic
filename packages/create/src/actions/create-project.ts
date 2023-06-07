import { spinner, log } from '@clack/prompts';
import { downloadTemplate } from 'giget';
import color from 'picocolors';
import { Context } from '..';

const templates = {
  nextAppDir: 'github:thinkmill/keystatic/templates/next-app-dir#create-cli',
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
    throw new Error(err.message);
  }

  spin.stop('Done ✅');
};
