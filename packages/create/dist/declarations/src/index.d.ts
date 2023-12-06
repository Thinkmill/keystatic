export type Context = {
    projectName?: string;
    packageManager?: string;
    framework: 'Next.js' | 'Astro' | 'Remix';
    cwd: string;
};
