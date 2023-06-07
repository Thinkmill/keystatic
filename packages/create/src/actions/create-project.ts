import { spinner } from '@clack/prompts';
import { downloadTemplate } from 'giget';
import { Context } from '..';

export const createProject = async (ctx: Context) => {
  const spin = spinner();
  spin.start(`Creating your ⚡️ Keystatic ⚡️ ${ctx.framework} project...`);

  const template =
    'github:thinkmill/keystatic/templates/next-app-dir#create-cli';
  try {
    await downloadTemplate(template, {
      force: true,
      provider: 'github',
      cwd: process.cwd(),
      dir: '.',
    });
  } catch (err: any) {
    throw new Error(err.message);
  }

  spin.stop('Done ✅');
};
