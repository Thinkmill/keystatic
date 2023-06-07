import { intro } from './actions/intro';
import { projectName } from './actions/project-name';
import { createProject } from './actions/create-project';
import { outro } from './actions/outro';
import { getPackageManager } from './utils';

export type Context = {
  projectName?: string;
  packageManager?: string;
  framework: 'Next.js' | 'Astro' | 'Remix';
  cwd?: string;
};

async function main() {
  const ctx: Context = {
    framework: 'Next.js',
    packageManager: getPackageManager().name,
  };

  const steps = [intro, projectName, createProject, outro];

  for (const step of steps) {
    await step(ctx);
  }
}

main().catch(console.error);
