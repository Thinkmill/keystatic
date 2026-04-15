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

  const previewPath =
    ctx.routeMode === 'preserve'
      ? '  Open preview: http://127.0.0.1:3000/itgkey-preview'
      : '  Open site: http://127.0.0.1:3000/';

  const steps = [
    color.reset(`  cd ${ctx.projectDir}`),
    color.reset(
      ctx.installStatus === 'installed'
        ? '(dependencies already installed)'
        : getInstallCommand(ctx.packageManager).pretty
    ),
    color.reset(`  ${getDevCommand(ctx.packageManager)}`),
    color.reset('  Open: http://127.0.0.1:3000/keystatic'),
    color.reset(previewPath),
  ];

  note(steps.join('\n'), 'Next steps');

  log.message('Need custom schema/content model? Edit keystatic.config.ts and rerun your app.');
  log.message('Use ./.github/prompts/itgkey-migration-agent.prompt.md with your coding agent for project-specific migration.');
  log.message('Define extra block/component schemas in ./itgkey-blocks.ts.');
  outroPrompt('itgkey integration finished.');
};
