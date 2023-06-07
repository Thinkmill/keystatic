import { intro } from './actions/intro';
import { projectName } from './actions/project-name';
import { createProject } from './actions/create-project';
import { outro } from './actions/outro';

export type Context = {
  projectName?: string;
  packageManager?: 'npm' | 'pnpm' | 'yarn';
  framework: 'Next.js' | 'Astro' | 'Remix';
  cwd?: string;
};

async function main() {
  const ctx: Context = {
    framework: 'Next.js',
    packageManager: 'npm',
  };

  const steps = [intro, projectName, createProject, outro];

  for (const step of steps) {
    await step(ctx);
  }
}

main().catch(console.error);
