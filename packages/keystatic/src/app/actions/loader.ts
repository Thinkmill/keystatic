import type { CollectionAction } from '../../config';

export type CollectionActionModule = {
  key: string;
  label: string;
  icon?: any;
  description?: string;
  handler: CollectionAction['handler'];
  condition?: CollectionAction['condition'];
  component?: CollectionAction['component'];
};

let actionModulesCache: Record<string, CollectionActionModule> | null = null;

/**
 * @example Set global actions components cache
 * window.__KS_ACTION_LOADER__ = import.meta.glob([
 *   '/src/actions/components/*.ts',
 *   '/src/actions/components/*.tsx'
 * ], { eager: false })
 */
export async function loadCollectionActions(
  collectionName: string
): Promise<CollectionAction[]> {
  if (typeof window === 'undefined') {
    return [];
  }

  if (!actionModulesCache) (actionModulesCache = await loadActionModules());

  const actions: CollectionAction[] = [];

  for (const [path, module] of Object.entries(actionModulesCache)) {
    if (path.includes(collectionName)) {
      actions.push({
        key: module.key,
        label: module.label,
        icon: module.icon,
        description: module.description,
        handler: module.handler,
        condition: module.condition,
        component: module.component,
      });
    }
  }

  return actions;
}

export function clearActionCache(): void {
  actionModulesCache = null;
}

async function loadActionModules(): Promise<
  Record<string, CollectionActionModule>
> {
  const modules: Record<string, CollectionActionModule> = {};

  if (!(window as any).__KS_ACTION_LOADER__) {
    return modules;
  }

  const loader = (window as any).__KS_ACTION_LOADER__ as Record<
    string,
    () => Promise<CollectionActionModule>
  >;

  for (const [path, loadModule] of Object.entries(loader)) {
    try {
      modules[getActionName(path)] = await loadModule();
    } catch (error) {
      console.error(`Failed to load action module: ${path}`, error);
    }
  }

  return modules;
}

function getActionName(path: string): string {
  return path
    .replace(/^.*\/actions\/components\//, '')
    .replace(/(index)?\.(ts|js|tsx|jsx)$/, '')
    .replace(/^\//, '')
    .replace(/\/$/, '');
}
