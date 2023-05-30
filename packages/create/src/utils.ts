import { cancel } from '@clack/prompts';

export const cancelStep = () => {
  cancel('Operation cancelled');
  return process.exit(0);
};
