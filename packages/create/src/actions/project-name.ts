import { text, isCancel } from '@clack/prompts';
import { cancelStep } from '../utils';
import { Context } from '..';

export const projectName = async (ctx: Context) => {
  // Check for package.json
  // if true = We seem to be in a project already, do you wish to continue here?
  const projectName = await text({
    message: "What's your project name? We'll create a directory for you.",
    initialValue: './new-keystatic-project',
  });

  if (isCancel(projectName)) cancelStep();

  if (typeof projectName === 'string') {
    ctx.projectName = projectName;
  }
};
