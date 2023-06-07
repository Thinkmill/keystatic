import { log, outro as outroPrompt } from '@clack/prompts';
import color from 'picocolors';
import { Context } from '..';

export const outro = (ctx: Context) => {
  log.message('Your project is ready!');

  log.message(`Next steps:
  cd ${ctx.projectName}
  ${ctx.packageManager === 'npm' ? 'npm run' : ctx.packageManager} dev
  http://localhost:3000`);

  log.message(`If you have any questions or feedback reach out to us at:
https://github.com/Thinkmill/keystatic/discussions`);

  outroPrompt(`${color.inverse('Happy coding ⚡️')}`);
};
