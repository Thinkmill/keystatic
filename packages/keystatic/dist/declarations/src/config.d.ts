import { ColorScheme } from '@keystar/ui/types';
import { ReactElement } from 'react';
import { ComponentSchema, SlugFormField } from "./form/api.js";
import type { Locale } from "./app/l10n/locales.js";
import { RepoConfig } from "./app/repo-config.js";
export type DataFormat = 'json' | 'yaml';
export type Format = DataFormat | {
    data?: DataFormat;
    contentField?: string;
};
export type EntryLayout = 'content' | 'form';
export type Glob = '*' | '**';
export type Collection<Schema extends Record<string, ComponentSchema>, SlugField extends string> = {
    label: string;
    path?: `${string}/${Glob}` | `${string}/${Glob}/${string}`;
    entryLayout?: EntryLayout;
    format?: Format;
    previewUrl?: string;
    slugField: SlugField;
    schema: Schema;
};
export type Singleton<Schema extends Record<string, ComponentSchema>> = {
    label: string;
    path?: string;
    entryLayout?: EntryLayout;
    format?: Format;
    previewUrl?: string;
    schema: Schema;
};
type CommonConfig<Collections, Singletons> = {
    locale?: Locale;
    cloud?: {
        project: string;
    };
    ui?: UserInterface<Collections, Singletons>;
};
type CommonRemoteStorageConfig = {
    pathPrefix?: string;
    branchPrefix?: string;
};
type BrandMark = (props: {
    colorScheme: Exclude<ColorScheme, 'auto'>;
}) => ReactElement;
export declare const NAVIGATION_DIVIDER_KEY = "---";
type UserInterface<Collections, Singletons> = {
    brand?: {
        mark?: BrandMark;
        name: string;
    };
    navigation?: Navigation<(keyof Collections & string) | (keyof Singletons & string) | typeof NAVIGATION_DIVIDER_KEY>;
};
type Navigation<K> = K[] | {
    [section: string]: K[];
};
type GitHubStorageConfig = {
    kind: 'github';
    repo: RepoConfig;
} & CommonRemoteStorageConfig;
export type GitHubConfig<Collections extends {
    [key: string]: Collection<Record<string, ComponentSchema>, string>;
} = {
    [key: string]: Collection<Record<string, ComponentSchema>, string>;
}, Singletons extends {
    [key: string]: Singleton<Record<string, ComponentSchema>>;
} = {
    [key: string]: Singleton<Record<string, ComponentSchema>>;
}> = {
    storage: GitHubStorageConfig;
    collections?: Collections;
    singletons?: Singletons;
} & CommonConfig<Collections, Singletons>;
type LocalStorageConfig = {
    kind: 'local';
};
export type LocalConfig<Collections extends {
    [key: string]: Collection<Record<string, ComponentSchema>, string>;
} = {
    [key: string]: Collection<Record<string, ComponentSchema>, string>;
}, Singletons extends {
    [key: string]: Singleton<Record<string, ComponentSchema>>;
} = {
    [key: string]: Singleton<Record<string, ComponentSchema>>;
}> = {
    storage: LocalStorageConfig;
    collections?: Collections;
    singletons?: Singletons;
} & CommonConfig<Collections, Singletons>;
type CloudStorageConfig = {
    kind: 'cloud';
} & CommonRemoteStorageConfig;
export type CloudConfig<Collections extends {
    [key: string]: Collection<Record<string, ComponentSchema>, string>;
} = {
    [key: string]: Collection<Record<string, ComponentSchema>, string>;
}, Singletons extends {
    [key: string]: Singleton<Record<string, ComponentSchema>>;
} = {
    [key: string]: Singleton<Record<string, ComponentSchema>>;
}> = {
    storage: CloudStorageConfig;
    cloud: {
        project: string;
    };
    collections?: Collections;
    singletons?: Singletons;
} & CommonConfig<Collections, Singletons>;
export type Config<Collections extends {
    [key: string]: Collection<Record<string, ComponentSchema>, string>;
} = {
    [key: string]: Collection<Record<string, ComponentSchema>, string>;
}, Singletons extends {
    [key: string]: Singleton<Record<string, ComponentSchema>>;
} = {
    [key: string]: Singleton<Record<string, ComponentSchema>>;
}> = {
    storage: LocalStorageConfig | GitHubStorageConfig | CloudStorageConfig;
    collections?: Collections;
    singletons?: Singletons;
} & ({} extends Collections ? {} : {
    collections: Collections;
}) & ({} extends Singletons ? {} : {
    singletons: Singletons;
}) & CommonConfig<Collections, Singletons>;
export declare function config<Collections extends {
    [key: string]: Collection<Record<string, ComponentSchema>, string>;
}, Singletons extends {
    [key: string]: Singleton<Record<string, ComponentSchema>>;
}>(config: Config<Collections, Singletons>): Config<Collections, Singletons>;
export declare function collection<Schema extends Record<string, ComponentSchema>, SlugField extends {
    [K in keyof Schema]: Schema[K] extends SlugFormField<any, any, any, any> ? K : never;
}[keyof Schema]>(collection: Collection<Schema, SlugField & string>): Collection<Schema, SlugField & string>;
export declare function singleton<Schema extends Record<string, ComponentSchema>>(collection: Singleton<Schema>): Singleton<Schema>;
export {};
