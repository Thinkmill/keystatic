import { intro as introPrompt, log } from '@clack/prompts';
import color from 'picocolors';

const logo = `
   +---+
  /    |
 /     +---+
+---      /
    |    /
    +---+
`;

export const intro = () => {
  introPrompt(color.inverse("Keystatic — let's get you setup"));
  log.message(logo);
};
