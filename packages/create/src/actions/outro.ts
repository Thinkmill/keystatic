import { log, outro as outroPrompt, note } from '@clack/prompts';
import { Context } from '..';

export const outro = (ctx: Context) => {
  log.message('Your project is ready!');

  note(
    `cd ${ctx.projectName}
${ctx.packageManager === 'npm' ? 'npm run' : ctx.packageManager} dev
http://127.0.0.1:3000/keystatic`,
    'Next steps:'
  );

  log.message(`If you have any questions or feedback reach out to us at:
https://github.com/Thinkmill/keystatic/discussions`);

  outroPrompt(`Happy coding ⚡️`);
};
