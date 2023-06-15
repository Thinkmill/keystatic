import fs from 'node:fs';
import { text, confirm, log, isCancel } from '@clack/prompts';
import color from 'picocolors';
import { cancelStep } from '../utils';
import { Context } from '..';

export const projectName = async (ctx: Context) => {
  const projectName = await text({
    message: "What's your project name? We'll create a directory for you.",
    defaultValue: './new-keystatic-project',
    placeholder: './new-keystatic-project',
  });

  if (isCancel(projectName)) cancelStep();

  if (typeof projectName === 'string') {
    ctx.projectName = projectName;

    if (projectName === '.' || projectName === './') {
      ctx.cwd = process.cwd();
    } else {
      ctx.cwd = projectName;
    }

    const isDirectoryNotEmpty =
      fs.existsSync(ctx.cwd) && fs.readdirSync(ctx.cwd).length;
    if (isDirectoryNotEmpty) {
      log.warn(
        `${color.blue(ctx.cwd)} is ${color.red(
          'not empty'
        )}. Some files may be overwritten.`
      );

      const shouldContinue = await confirm({
        message: 'Do you wish to continue?',
        initialValue: false,
      });

      if (!shouldContinue || isCancel(shouldContinue)) {
        cancelStep('Exiting create Keystatic app');
      }
    }
  }
};
