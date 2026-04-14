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
  introPrompt(color.inverse('itgkey - integrate into existing Next.js app'));
  log.message(logo);
};
