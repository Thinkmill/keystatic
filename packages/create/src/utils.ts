import { cancel } from '@clack/prompts';

export const cancelStep = (message = 'Keystatic app creation cancelled') => {
  cancel(message);
  return process.exit(0);
};

export const getPackageManager = () => {
  const userAgent = process.env.npm_config_user_agent;
  return {
    name: userAgent?.split('/')[0] ?? 'npm',
  };
};
