import { log, outro as outroPrompt, note } from '@clack/prompts';
import color from 'picocolors';
import { Context } from '..';

const devServerPortLookup: Record<Context['framework'], string> = {
  'Next.js': '3000',
};

export const outro = (ctx: Context) => {
  const usingLocalRepo = Boolean(process.env.KEYSTATIC_LOCAL_REPO);
  log.message('Your project is ready!');

  // By default `note` turns the contents grey. color.reset sets to the default terminal
  // colour but requires reset to be called for every line
  note(
    [
      color.reset(`  cd ${ctx.projectName}`),
      color.reset(`  ${ctx.packageManager} install`),
      color.reset(
        `  ${ctx.packageManager === 'npm' ? 'npm run' : ctx.packageManager} dev`
      ),
      color.reset(
        `  http://127.0.0.1:${devServerPortLookup[ctx.framework]}/keystatic`
      ),
    ].join('\n'),
    'Next steps'
  );

  if (usingLocalRepo) {
    note(
      [
        color.reset('This project is linked to your local Keystatic fork.'),
        color.reset(
          'Keep the fork dependencies installed and rebuild packages after changes to apply updates here.'
        ),
      ].join('\n'),
      'Local overrides enabled'
    );
  }

  log.message(`If you have any questions or feedback reach out to us at:
https://github.com/Thinkmill/keystatic/discussions`);

  outroPrompt(`Happy coding ⚡️`);
};
