import { log } from '@clack/prompts';
import { intro } from './actions/intro';
import { frameworkChoice } from './actions/framework-choice';
import { projectName } from './actions/project-name';
import { createProject } from './actions/create-project';
import { outro } from './actions/outro';
import { cancelStep, getPackageManager } from './utils';

export type Context = {
  projectName?: string;
  packageManager?: string;
  framework: 'Next.js' | 'Astro' | 'Remix';
  cwd: string;
};

type Step = (ctx: Context) => Promise<void> | void;

async function main() {
  const ctx: Context = {
    framework: 'Next.js',
    packageManager: getPackageManager().name,
    cwd: process.cwd(),
  };

  const steps: Step[] = [
    intro,
    frameworkChoice,
    projectName,
    createProject,
    outro,
  ];

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
