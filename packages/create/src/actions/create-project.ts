import {
  cpSync,
  createWriteStream,
  readFileSync,
  rmdirSync,
  rmSync,
  mkdirSync,
  existsSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream';
import { promisify } from 'node:util';
import { spinner, log } from '@clack/prompts';
import fetch from 'node-fetch-native';
import color from 'picocolors';
import tar from 'tar';
import { Context } from '..';

const registryDomain = 'https://registry.npmjs.org';
// These templates reference their npm package name
const templates = {
  nextjs: '@keystatic/templates-nextjs',
};

type PackageInfo = {
  dist: {
    tarball: string;
  };
};

type KeystaticFramework = Context['framework'];

const frameworkPackageName: Record<KeystaticFramework, string> = {
  'Next.js': '@keystatic/next',
};

const frameworkPackageDir: Record<KeystaticFramework, string> = {
  'Next.js': 'next',
};

const frameworkTemplateDir: Record<KeystaticFramework, string> = {
  'Next.js': 'nextjs',
};

type PackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

const toPosixPath = (value: string) => value.replaceAll('\\', '/');

function findLocalRepoRoot(startDir: string): string | undefined {
  let current = path.resolve(startDir);

  while (true) {
    const hasWorkspace = existsSync(path.join(current, 'pnpm-workspace.yaml'));
    const hasTemplates = existsSync(path.join(current, 'templates', 'nextjs'));
    const hasCorePackage = existsSync(path.join(current, 'packages', 'keystatic'));
    const hasFrameworkPackage = existsSync(path.join(current, 'packages', 'next'));

    if (hasWorkspace && hasTemplates && hasCorePackage && hasFrameworkPackage) {
      return current;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      return;
    }
    current = parent;
  }
}

function getLocalRepoRoot() {
  const fromEnv = process.env.KEYSTATIC_LOCAL_REPO;
  if (fromEnv) {
    return path.resolve(fromEnv);
  }

  return findLocalRepoRoot(process.cwd());
}

function setPackageVersion(
  pkgJson: PackageJson,
  packageName: string,
  version: string
) {
  if (pkgJson.dependencies?.[packageName]) {
    pkgJson.dependencies[packageName] = version;
  }
  if (pkgJson.devDependencies?.[packageName]) {
    pkgJson.devDependencies[packageName] = version;
  }
}

function maybeApplyLocalPackageOverrides(ctx: Context) {
  const localRepoRoot = getLocalRepoRoot();
  if (!localRepoRoot) {
    return;
  }

  const packageJsonPath = path.join(ctx.cwd, 'package.json');
  const pkgJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as PackageJson;

  const frameworkPkgName = frameworkPackageName[ctx.framework];
  const frameworkPkgDir = frameworkPackageDir[ctx.framework];
  const coreLink = `file:${toPosixPath(path.join(localRepoRoot, 'packages', 'keystatic'))}`;
  const frameworkLink = `file:${toPosixPath(path.join(localRepoRoot, 'packages', frameworkPkgDir))}`;

  setPackageVersion(pkgJson, '@keystatic/core', coreLink);
  setPackageVersion(pkgJson, frameworkPkgName, frameworkLink);

  writeFileSync(packageJsonPath, `${JSON.stringify(pkgJson, null, 2)}\n`);
}

function maybeCopyLocalTemplate(ctx: Context) {
  const localRepoRoot = getLocalRepoRoot();
  if (!localRepoRoot) {
    return false;
  }

  const templateDir = path.join(
    localRepoRoot,
    'templates',
    frameworkTemplateDir[ctx.framework]
  );

  if (!existsSync(templateDir)) {
    throw new Error(`Local template not found: ${templateDir}`);
  }

  if (!existsSync(ctx.cwd)) {
    mkdirSync(ctx.cwd, { recursive: true });
  }

  cpSync(templateDir, ctx.cwd, {
    recursive: true,
    force: true,
    filter: sourcePath => {
      const name = path.basename(sourcePath);
      return !['node_modules', '.next', '.turbo', 'dist'].includes(name);
    },
  });

  return true;
}

export const createProject = async (ctx: Context) => {
  const spin = spinner();
  log.step(
    `Creating your ${color.green(
      `⚡️ Keystatic ${ctx.framework}`
    )} project at ${color.blue(ctx.projectName)}`
  );

  spin.start(`Preparing template and creating files...`);

  const templatesLookup: Record<Context['framework'], string> = {
    'Next.js': templates.nextjs,
  };

  const template = templatesLookup[ctx.framework];

  try {
    const usedLocalTemplate = maybeCopyLocalTemplate(ctx);

    if (!usedLocalTemplate) {
    const templateTarballOverride = process.env.KEYSTATIC_TEMPLATE_TARBALL;

    // Get latest package info from npm if no local override is provided.
    const templateTarballUrl = templateTarballOverride
      ? templateTarballOverride
      : (
          await fetch(`${registryDomain}/${template}/latest`).then(
            response => response.json() as Promise<PackageInfo>
          )
        ).dist.tarball;

    if (!existsSync(ctx.cwd)) {
      mkdirSync(ctx.cwd);
    }

    // Stream latest tarball to the specified directory
    const tarballFile = `${ctx.cwd}/template.tgz`;
    const tarballResponse = await fetch(templateTarballUrl);
    const stream = createWriteStream(tarballFile);
    await promisify(pipeline)(tarballResponse.body as any, stream);

    // npm packages come in a directory named 'package'. Use strip to remove the directory.
    await tar.extract({ file: tarballFile, cwd: ctx.cwd, strip: 1 });
    rmSync(tarballFile);
    }

    maybeApplyLocalPackageOverrides(ctx);
  } catch (err: any) {
    rmdirSync(ctx.cwd);
    log.error('Error downloading template');
    throw new Error(err.message);
  }

  spin.stop('Done ✅');
};
