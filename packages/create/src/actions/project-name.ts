import fs from 'node:fs';
import path from 'node:path';
import { text, isCancel } from '@clack/prompts';
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
    // Check for package.json
    // if true = We seem to be in a project already, do you wish to continue here?
    if (projectName === '.' || projectName === './') {
      ctx.cwd = process.cwd();
    } else {
      ctx.cwd = projectName;
    }

    // const isProject = fs.existsSync(path.join(ctx.cwd, 'package.json'));
    // if (isProject) {

    // }
  }
};
