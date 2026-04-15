import { log } from '@clack/prompts';
import { intro } from './actions/intro';
import { projectPath } from './actions/project-path';
import { integrate } from './actions/integrate';
import { outro } from './actions/outro';
import { cancelStep, getPackageManager } from './utils';

export type Context = {
  projectDir: string;
  packageManager: string;
  appDir: 'app' | 'src/app';
  routeMode: 'preserve' | 'replace';
  installDependencies: boolean;
  installStatus: 'installed' | 'skipped' | 'failed';
  createdFiles: string[];
  overwrittenFiles: string[];
  skippedFiles: string[];
};

type Step = (ctx: Context) => Promise<void> | void;

async function main() {
  const ctx: Context = {
    projectDir: process.cwd(),
    packageManager: getPackageManager().name,
    appDir: 'app',
    routeMode: 'preserve',
    installDependencies: true,
    installStatus: 'skipped',
    createdFiles: [],
    overwrittenFiles: [],
    skippedFiles: [],
  };

  const steps: Step[] = [intro, projectPath, integrate, outro];

  for (const step of steps) {
    try {
      await step(ctx);
    } catch (error) {
      log.error('An error occurred.');
      if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof error.message === 'string'
      ) {
        log.error(error.message);
      }
      cancelStep();
    }
  }
}

main().catch(console.error);
