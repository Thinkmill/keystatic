import { log, note, outro as outroPrompt } from '@clack/prompts';
import color from 'picocolors';
import { Context } from '..';
import { getInstallCommand } from '../utils';

function getDevCommand(packageManager: string) {
  return packageManager === 'npm' ? 'npm run dev' : `${packageManager} dev`;
}

export const outro = (ctx: Context) => {
  if (ctx.createdFiles.length) {
    note(ctx.createdFiles.map(file => color.reset(`  + ${file}`)).join('\n'), 'Created files');
  }

  if (ctx.overwrittenFiles.length) {
    note(
      ctx.overwrittenFiles.map(file => color.reset(`  ~ ${file}`)).join('\n'),
      'Overwritten files'
    );
  }

  if (ctx.skippedFiles.length) {
    note(ctx.skippedFiles.map(file => color.reset(`  - ${file}`)).join('\n'), 'Skipped files');
  }

  const steps = [
    color.reset(`  cd ${ctx.projectDir}`),
    color.reset(
      ctx.installStatus === 'installed'
        ? '(dependencies already installed)'
        : getInstallCommand(ctx.packageManager).pretty
    ),
    color.reset(`  ${getDevCommand(ctx.packageManager)}`),
    color.reset('  Open: http://127.0.0.1:3000/keystatic'),
  ];

  note(steps.join('\n'), 'Next steps');

  log.message('Need custom schema/content model? Edit keystatic.config.ts and rerun your app.');
  outroPrompt('itgkey integration finished.');
};
