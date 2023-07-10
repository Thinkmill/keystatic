export const KS_CLOUD_STORAGE_URL = 'https://keystatic.io/';
export const DEFAULT_IMG_WIDTHS = [375, 960, 1280, 1920];

export const MAIN_EL_MAX_WIDTH = '76.5rem'; // 1200px + 24px gutter (`px-6`) as rems

/**
 * This is a 'remainder' value set by 'auto' and is generated by:
 * - Content + Side Nav = `MAIN_EL_MAX_WIDTH` (tailwind `max-w-7xl`)
 * - Side Nav = 15rem (`w-60`)
 * - padding right 1.5rem
 * - ON THIS PAGE = 12rem
 * - gap = 1.5rem (`gap-6`)
 * - padding left = 3rem (`pl-12`)
 * -----------------------------------
 * Total: 43.5rem
 */
export const CONTENT_MAX_WIDTH_DESKTOP = '43.5rem';

export const H1_ID = 'heading-1-overview';
