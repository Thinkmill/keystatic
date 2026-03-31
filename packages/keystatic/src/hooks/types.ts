import { ReactElement } from 'react';

export type HookEvent =
  | 'beforeCreate'
  | 'afterCreate'
  | 'beforeSave'
  | 'afterSave'
  | 'beforeDelete'
  | 'afterDelete';

export type StorageInfo = { kind: 'local' | 'github' | 'cloud' };

export type HookContext<Schema = Record<string, unknown>> = {
  event: HookEvent;
  trigger: 'event' | 'manual';
  collection?: string;
  singleton?: string;
  slug?: string;
  data: Schema;
  previousData?: Schema;
  storage: StorageInfo;
};

export type BeforeHookResult =
  | void
  | { cancel: true; reason?: string }
  | { data: Record<string, unknown> };

export type AfterHookContext<Schema = Record<string, unknown>> =
  HookContext<Schema> & {
    update(data: Partial<Schema>): Promise<void>;
  };

export type BeforeHook<Schema = Record<string, unknown>> = (
  ctx: HookContext<Schema>
) => Promise<BeforeHookResult | void>;

export type AfterHook<Schema = Record<string, unknown>> = (
  ctx: AfterHookContext<Schema>
) => Promise<void>;

export type HooksConfig<Schema = Record<string, unknown>> = {
  beforeCreate?: BeforeHook<Schema>[];
  afterCreate?: AfterHook<Schema>[];
  beforeSave?: BeforeHook<Schema>[];
  afterSave?: AfterHook<Schema>[];
  beforeDelete?: BeforeHook<Schema>[];
  afterDelete?: AfterHook<Schema>[];
};

export type ActionContext<Schema = Record<string, unknown>> = {
  trigger: 'manual';
  collection?: string;
  singleton?: string;
  slug?: string;
  data: Schema;
  storage: StorageInfo;
  update(data: Partial<Schema>): Promise<void>;
};

export type ActionResult = void | { message: string } | { error: string };

export type Action<Schema = Record<string, unknown>> = {
  label: string;
  description?: string;
  icon?: ReactElement;
  handler: (ctx: ActionContext<Schema>) => Promise<ActionResult | void>;
  when?: {
    match?: (ctx: { slug?: string; data: Schema }) => boolean;
  };
};
