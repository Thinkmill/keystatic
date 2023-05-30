import { spinner } from '@clack/prompts';
import { Context } from '..';

export const createProject = async (ctx: Context) => {
  const spin = spinner();
  spin.start(`Creating your ⚡️ Keystatic ⚡️ ${ctx.framework} project...`);
  spin.stop('Done ✅');
};
