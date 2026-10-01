import { Field } from './fields';

// ... (outras importações existentes)

export type CollectionConfig<TFields extends Record<string, any>> = {
	label: string;
	schema: Record<string, Field>;
	// ... outras propriedades existentes
} & (
	| {
		path: string;
		slugField: keyof TFields;
	}
	| {
		path: (fields: TFields) => string;
		slugField?: keyof TFields;
	}
);

// Ajuste na definição de Collection para suportar a união acima
export interface Collection<TFields extends Record<string, any>> {
	config: CollectionConfig<TFields>;
	// ... restante da interface
}
