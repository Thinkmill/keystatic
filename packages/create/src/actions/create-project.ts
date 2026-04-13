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

const GITHUB_REPO = 'itgkey/itgkey';
const GITHUB_BRANCH = 'main';

// The GitHub archive URL for the repository
const githubArchiveUrl = `https://github.com/${GITHUB_REPO}/archive/refs/heads/${GITHUB_BRANCH}.tar.gz`;

// When GitHub creates an archive, all files are prefixed with "{repo}-{branch}/"
const archiveRepoPrefix = `${GITHUB_REPO.split('/')[1]}-${GITHUB_BRANCH}`;

type PackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

const registryDomain = 'https://registry.npmjs.org';

type PackageInfo = {
  version: string;
};

type KeystaticFramework = Context['framework'];

const frameworkPackageName: Record<KeystaticFramework, string> = {
  'Next.js': '@itgkey/next',
};

const frameworkTemplateDir: Record<KeystaticFramework, string> = {
  'Next.js': 'nextjs',
};

const frameworkPackageDir: Record<KeystaticFramework, string> = {
  'Next.js': 'next',
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

async function getLatestPackageVersion(packageName: string) {
  const packageInfo = await fetch(`${registryDomain}/${packageName}/latest`).then(
    response => response.json() as Promise<PackageInfo>
  );
  return `^${packageInfo.version}`;
}

async function maybeNormalizeTemplatePackageVersions(ctx: Context) {
  const packageJsonPath = path.join(ctx.cwd, 'package.json');
  const pkgJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as PackageJson;
  const frameworkPkgName = frameworkPackageName[ctx.framework];

  const coreVersion =
    pkgJson.dependencies?.['@itgkey/core'] ??
    pkgJson.devDependencies?.['@itgkey/core'];
  const frameworkVersion =
    pkgJson.dependencies?.[frameworkPkgName] ??
    pkgJson.devDependencies?.[frameworkPkgName];

  const coreNeedsNormalization =
    coreVersion === undefined || coreVersion.startsWith('workspace:');
  const frameworkNeedsNormalization =
    frameworkVersion === undefined || frameworkVersion.startsWith('workspace:');

  if (!coreNeedsNormalization && !frameworkNeedsNormalization) {
    return;
  }

  const versions = await Promise.all([
    coreNeedsNormalization
      ? getLatestPackageVersion('@itgkey/core')
      : Promise.resolve(coreVersion),
    frameworkNeedsNormalization
      ? getLatestPackageVersion(frameworkPkgName)
      : Promise.resolve(frameworkVersion),
  ]);

  setPackageVersion(pkgJson, '@itgkey/core', versions[0]!);
  setPackageVersion(pkgJson, frameworkPkgName, versions[1]!);

  if (!pkgJson.dependencies) {
    pkgJson.dependencies = {};
  }
  if (!pkgJson.dependencies['@itgkey/core']) {
    pkgJson.dependencies['@itgkey/core'] = versions[0]!;
  }
  if (!pkgJson.dependencies[frameworkPkgName]) {
    pkgJson.dependencies[frameworkPkgName] = versions[1]!;
  }

  writeFileSync(packageJsonPath, `${JSON.stringify(pkgJson, null, 2)}\n`);
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

  setPackageVersion(pkgJson, '@itgkey/core', coreLink);
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

async function downloadGithubTemplate(ctx: Context) {
  const templateSubdir = frameworkTemplateDir[ctx.framework];
  // GitHub archive path prefix: "{repo}-{branch}/templates/{framework}/"
  const archivePrefix = `${archiveRepoPrefix}/templates/${templateSubdir}/`;
  // Number of path components to strip to get files relative to the template root
  // e.g. "itgkey-main/templates/nextjs/app/page.tsx" -> "app/page.tsx" (strip 3)
  const stripComponents = 3;

  if (!existsSync(ctx.cwd)) {
    mkdirSync(ctx.cwd, { recursive: true });
  }

  const tarballFile = path.join(ctx.cwd, 'template.tgz');
  const response = await fetch(githubArchiveUrl);

  if (!response.ok) {
    throw new Error(
      `Failed to download template from GitHub: ${response.status} ${response.statusText}`
    );
  }

  const stream = createWriteStream(tarballFile);
  if (!response.body) {
    throw new Error('No response body received from GitHub archive download');
  }
  await promisify(pipeline)(
    response.body as unknown as NodeJS.ReadableStream,
    stream
  );

  // Extract only the matching template subdirectory, stripping its path prefix
  await tar.extract({
    file: tarballFile,
    cwd: ctx.cwd,
    strip: stripComponents,
    filter: (entryPath: string) => entryPath.startsWith(archivePrefix),
  });

  rmSync(tarballFile);
}

export const createProject = async (ctx: Context) => {
  const spin = spinner();
  log.step(
    `Creating your ${color.green(
      `⚡️ itgkey ${ctx.framework}`
    )} project at ${color.blue(ctx.projectName)}`
  );

  spin.start(`Preparing template and creating files...`);

  try {
    const usedLocalTemplate = maybeCopyLocalTemplate(ctx);

    if (!usedLocalTemplate) {
      await downloadGithubTemplate(ctx);
    }

    await maybeNormalizeTemplatePackageVersions(ctx);
    maybeApplyLocalPackageOverrides(ctx);
  } catch (err: any) {
    rmdirSync(ctx.cwd);
    log.error('Error downloading template');
    throw new Error(err.message);
  }

  spin.stop('Done ✅');
};

