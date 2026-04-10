import { select, isCancel } from '@clack/prompts';
import { cancelStep } from '../utils';
import { Context } from '..';

export const frameworkChoice = async (ctx: Context) => {
  const framework = await select({
    message: 'Pick a framework to use with Keystatic',
    options: [{ value: 'Next.js', label: 'Next.js' }],
  });

  if (isCancel(framework)) cancelStep();

  ctx.framework = framework as Context['framework'];
};
