import { select, isCancel } from '@clack/prompts';
import { cancelStep } from '../utils';
import { Context } from '..';

export const framework = async (ctx: Context) => {
  const frameworkName = String(
    await select({
      message: 'Pick a framework to use with Keystatic',
      options: [
        { value: 'Next.js', label: 'Next.js' },
        { value: 'Astro', label: 'Astro' },
      ],
    })
  ) as Context['framework'];

  if (isCancel(frameworkName)) cancelStep();

  ctx.framework = frameworkName;
};
