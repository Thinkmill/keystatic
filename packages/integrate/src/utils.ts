import { spawnSync } from 'node:child_process';
import { cancel } from '@clack/prompts';

export const cancelStep = (message = 'itgkey integration cancelled') => {
  cancel(message);
  return process.exit(0);
};

export const getPackageManager = () => {
  const userAgent = process.env.npm_config_user_agent;
  return {
    name: userAgent?.split('/')[0] ?? 'npm',
  };
};

type InstallCommand = {
  command: string;
  args: string[];
  pretty: string;
};

export const getInstallCommand = (packageManager: string): InstallCommand => {
  const deps = ['@itgkey/core@latest', '@itgkey/next@latest', '@markdoc/markdoc'];

  if (packageManager === 'pnpm') {
    return {
      command: 'pnpm',
      args: ['add', ...deps],
      pretty: `pnpm add ${deps.join(' ')}`,
    };
  }

  if (packageManager === 'yarn') {
    return {
      command: 'yarn',
      args: ['add', ...deps],
      pretty: `yarn add ${deps.join(' ')}`,
    };
  }

  if (packageManager === 'bun') {
    return {
      command: 'bun',
      args: ['add', ...deps],
      pretty: `bun add ${deps.join(' ')}`,
    };
  }

  return {
    command: 'npm',
    args: ['install', ...deps],
    pretty: `npm install ${deps.join(' ')}`,
  };
};

export const installRuntimeDependencies = (
  packageManager: string,
  cwd: string
): boolean => {
  const installCommand = getInstallCommand(packageManager);
  const result = spawnSync(installCommand.command, installCommand.args, {
    cwd,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  return result.status === 0;
};
