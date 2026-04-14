import fs from 'node:fs';
import path from 'node:path';
import { confirm, isCancel, log, spinner } from '@clack/prompts';
import { Context } from '..';
import {
  cancelStep,
  getInstallCommand,
  installRuntimeDependencies,
} from '../utils';

function toPosixPath(value: string) {
  return value.replaceAll('\\', '/');
}

function routeConfigImportPath(appDir: Context['appDir']) {
  return appDir === 'app'
    ? '../../../../keystatic.config'
    : '../../../../../keystatic.config';
}

function uiConfigImportPath(appDir: Context['appDir']) {
  return appDir === 'app' ? '../../keystatic.config' : '../../../keystatic.config';
}

function getKeystaticConfigTemplate() {
  return `import { config, collection, fields } from '@itgkey/core';

export default config({
  storage: { kind: 'local' },
  collections: {
    posts: collection({
      label: 'Posts',
      slugField: 'title',
      path: 'posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        content: fields.markdoc({ label: 'Content' }),
      },
    }),
  },
});
`;
}

function getApiRouteTemplate(appDir: Context['appDir']) {
  return `import { makeRouteHandler } from '@itgkey/next/route-handler';
import keystaticConfig from '${routeConfigImportPath(appDir)}';

export const { POST, GET } = makeRouteHandler({
  config: keystaticConfig,
});
`;
}

function getKeystaticPageTemplate(appDir: Context['appDir']) {
  return `'use client';

import { makePage } from '@itgkey/next/ui/app';
import config from '${uiConfigImportPath(appDir)}';

export default makePage(config);
`;
}

function getLayoutTemplate() {
  return `import KeystaticApp from './keystatic';

export default function RootLayout() {
  return <KeystaticApp />;
}
`;
}

function getCatchAllTemplate() {
  return `export default function Page() {
  return null;
}
`;
}

async function writeWithPrompt(
  ctx: Context,
  filePath: string,
  content: string
): Promise<void> {
  const relPath = toPosixPath(path.relative(ctx.projectDir, filePath));
  const fileExists = fs.existsSync(filePath);

  if (fileExists) {
    const overwrite = await confirm({
      message: `${relPath} already exists. Overwrite it?`,
      initialValue: false,
    });

    if (isCancel(overwrite)) cancelStep();
    if (!overwrite) {
      ctx.skippedFiles.push(relPath);
      return;
    }
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');

  if (fileExists) {
    ctx.overwrittenFiles.push(relPath);
  } else {
    ctx.createdFiles.push(relPath);
  }
}

export const integrate = async (ctx: Context) => {
  const spin = spinner();
  const appRoot = path.join(ctx.projectDir, ...ctx.appDir.split('/'));

  spin.start('Adding itgkey files...');

  await writeWithPrompt(
    ctx,
    path.join(ctx.projectDir, 'keystatic.config.ts'),
    getKeystaticConfigTemplate()
  );
  await writeWithPrompt(
    ctx,
    path.join(appRoot, 'api', 'keystatic', '[...params]', 'route.ts'),
    getApiRouteTemplate(ctx.appDir)
  );
  await writeWithPrompt(
    ctx,
    path.join(appRoot, 'keystatic', 'keystatic.tsx'),
    getKeystaticPageTemplate(ctx.appDir)
  );
  await writeWithPrompt(
    ctx,
    path.join(appRoot, 'keystatic', 'layout.tsx'),
    getLayoutTemplate()
  );
  await writeWithPrompt(
    ctx,
    path.join(appRoot, 'keystatic', '[[...params]]', 'page.tsx'),
    getCatchAllTemplate()
  );

  if (ctx.installDependencies) {
    spin.stop('Files added.');
    spin.start('Installing dependencies...');
    const ok = installRuntimeDependencies(ctx.packageManager, ctx.projectDir);
    ctx.installStatus = ok ? 'installed' : 'failed';
    if (!ok) {
      log.warn('Automatic dependency install failed. You can run it manually.');
    }
  } else {
    ctx.installStatus = 'skipped';
  }

  spin.stop('Integration complete.');

  if (ctx.installStatus !== 'installed') {
    const cmd = getInstallCommand(ctx.packageManager).pretty;
    log.info(`Run manually: ${cmd}`);
  }
}
