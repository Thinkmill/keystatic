import { Collection, Config, Singleton } from "../config.js";
import { ComponentSchema, ObjectField, SlugFormField, ValueForReading, ValueForReadingDeep } from "../form/api.js";
type EntryReaderOpts = {
    resolveLinkedFiles?: boolean;
};
type ValueForReadingWithMode<Schema extends ComponentSchema, ResolveLinkedFiles extends boolean | undefined> = ResolveLinkedFiles extends true ? ValueForReadingDeep<Schema> : ValueForReading<Schema>;
type OptionalChain<T extends {} | undefined, Key extends keyof (T & {})> = T extends {} ? T[Key] : undefined;
export type Entry<CollectionOrSingleton extends Collection<any, any> | Singleton<any>> = CollectionOrSingleton extends Collection<infer Schema, infer SlugField> ? CollectionEntry<Schema, SlugField> : CollectionOrSingleton extends Singleton<infer Schema> ? SingletonEntry<Schema> : never;
export type EntryWithResolvedLinkedFiles<CollectionOrSingleton extends Collection<any, any> | Singleton<any>> = CollectionOrSingleton extends Collection<infer Schema, infer SlugField> ? CollectionEntryWithResolvedLinkedFiles<Schema, SlugField> : CollectionOrSingleton extends Singleton<infer Schema> ? SingletonEntryWithResolvedLinkedFiles<Schema> : never;
type CollectionEntryWithResolvedLinkedFiles<Schema extends Record<string, ComponentSchema>, SlugField extends string> = {
    [Key in keyof Schema]: SlugField extends Key ? Schema[Key] extends SlugFormField<any, any, any, infer SlugSerializedValue> ? SlugSerializedValue : ValueForReadingDeep<Schema[Key]> : ValueForReadingDeep<Schema[Key]>;
};
type CollectionEntry<Schema extends Record<string, ComponentSchema>, SlugField extends string> = {
    [Key in keyof Schema]: SlugField extends Key ? Schema[Key] extends SlugFormField<any, any, any, infer SlugSerializedValue> ? SlugSerializedValue : ValueForReading<Schema[Key]> : ValueForReading<Schema[Key]>;
};
type SingletonEntryWithResolvedLinkedFiles<Schema extends Record<string, ComponentSchema>> = ValueForReadingDeep<ObjectField<Schema>>;
type SingletonEntry<Schema extends Record<string, ComponentSchema>> = ValueForReading<ObjectField<Schema>>;
export type CollectionReader<Schema extends Record<string, ComponentSchema>, SlugField extends string> = {
    read: <Opts extends [opts?: EntryReaderOpts]>(slug: string, ...opts: Opts & [opts?: EntryReaderOpts]) => Promise<{
        [Key in keyof Schema]: SlugField extends Key ? Schema[Key] extends SlugFormField<any, any, any, infer SlugSerializedValue> ? SlugSerializedValue : ValueForReadingWithMode<Schema[Key], OptionalChain<Opts[0], 'resolveLinkedFiles'>> : ValueForReadingWithMode<Schema[Key], OptionalChain<Opts[0], 'resolveLinkedFiles'>>;
    } | null>;
    readOrThrow: <Opts extends [opts?: EntryReaderOpts]>(slug: string, ...opts: Opts & [opts?: EntryReaderOpts]) => Promise<{
        [Key in keyof Schema]: SlugField extends Key ? Schema[Key] extends SlugFormField<any, any, any, infer SlugSerializedValue> ? SlugSerializedValue : ValueForReadingWithMode<Schema[Key], OptionalChain<Opts[0], 'resolveLinkedFiles'>> : ValueForReadingWithMode<Schema[Key], OptionalChain<Opts[0], 'resolveLinkedFiles'>>;
    }>;
    all: <Opts extends [opts?: EntryReaderOpts]>(...opts: Opts & [opts?: EntryReaderOpts]) => Promise<{
        slug: string;
        entry: {
            [Key in keyof Schema]: SlugField extends Key ? Schema[Key] extends SlugFormField<any, any, any, infer SlugSerializedValue> ? SlugSerializedValue : ValueForReadingWithMode<Schema[Key], OptionalChain<Opts[0], 'resolveLinkedFiles'>> : ValueForReadingWithMode<Schema[Key], OptionalChain<Opts[0], 'resolveLinkedFiles'>>;
        };
    }[]>;
    list: () => Promise<string[]>;
};
export type SingletonReader<Schema extends Record<string, ComponentSchema>> = {
    read: <Opts extends [opts?: EntryReaderOpts]>(...opts: Opts & [opts?: EntryReaderOpts]) => Promise<ValueForReadingWithMode<ObjectField<Schema>, OptionalChain<Opts[0], 'resolveLinkedFiles'>> | null>;
    readOrThrow: <Opts extends [opts?: EntryReaderOpts]>(...opts: Opts & [opts?: EntryReaderOpts]) => Promise<ValueForReadingWithMode<ObjectField<Schema>, OptionalChain<Opts[0], 'resolveLinkedFiles'>>>;
};
export type DirEntry = {
    name: string;
    kind: 'file' | 'directory';
};
export type MinimalFs = {
    readFile(path: string): Promise<Uint8Array | null>;
    readdir(path: string): Promise<DirEntry[]>;
    fileExists(path: string): Promise<boolean>;
};
export declare function collectionReader(collection: string, config: Config, fsReader: MinimalFs): CollectionReader<any, any>;
export declare function singletonReader(singleton: string, config: Config, fsReader: MinimalFs): SingletonReader<any>;
export type BaseReader<Collections extends {
    [key: string]: Collection<Record<string, ComponentSchema>, string>;
}, Singletons extends {
    [key: string]: Singleton<Record<string, ComponentSchema>>;
}> = {
    collections: {
        [Key in keyof Collections]: CollectionReader<Collections[Key]['schema'], Collections[Key]['slugField']>;
    };
    singletons: {
        [Key in keyof Singletons]: SingletonReader<Singletons[Key]['schema']>;
    };
    config: Config<Collections, Singletons>;
};
export {};
