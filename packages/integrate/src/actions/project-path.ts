import fs from 'node:fs';
import path from 'node:path';
import { confirm, isCancel, log, select, text } from '@clack/prompts';
import { Context } from '..';
import { cancelStep } from '../utils';

export const projectPath = async (ctx: Context) => {
  const pathArg = process.argv[2];
  const target =
    pathArg ??
    (await text({
      message: 'Where is your existing Next.js project? (use . for current directory)',
      defaultValue: '.',
      placeholder: '.',
    }));

  if (isCancel(target)) cancelStep();

  const projectDir = path.resolve(String(target));

  if (!fs.existsSync(projectDir) || !fs.statSync(projectDir).isDirectory()) {
    throw new Error(`Project directory not found: ${projectDir}`);
  }

  if (!fs.existsSync(path.join(projectDir, 'package.json'))) {
    throw new Error(
      'No package.json found in target directory. Please run this inside an existing Next.js app.'
    );
  }

  const appPath = path.join(projectDir, 'app');
  const srcAppPath = path.join(projectDir, 'src', 'app');

  if (fs.existsSync(appPath)) {
    ctx.appDir = 'app';
  } else if (fs.existsSync(srcAppPath)) {
    ctx.appDir = 'src/app';
  } else {
    log.warn('No App Router directory found. A new one will be created.');
    const appDir = await select({
      message: 'Where should App Router files be created?',
      options: [
        { value: 'app', label: 'app' },
        { value: 'src/app', label: 'src/app' },
      ],
    });

    if (isCancel(appDir)) cancelStep();
    ctx.appDir = appDir as Context['appDir'];
  }

  const shouldInstall = await confirm({
    message: 'Install @itgkey dependencies now?',
    initialValue: true,
  });

  if (isCancel(shouldInstall)) cancelStep();

  ctx.projectDir = projectDir;
  ctx.installDependencies = Boolean(shouldInstall);
};
