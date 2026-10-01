import { CollectionConfig } from './types';

// Função auxiliar para resolver o caminho final do arquivo
export function resolveCollectionPath<TFields extends Record<string, any>>(
	config: CollectionConfig<TFields>,
	fields: TFields
): string {
	if (typeof config.path === 'function') {
		return config.path(fields);
	}
	
	// Lógica original para path estático
	const slugField = config.slugField;
	if (!slugField || !(slugField in fields)) {
		throw new Error(`Slug field ${slugField} not found in fields`);
	}
	
	const slug = fields[slugField];
	return config.path.replace('*', slug);
}

// No local onde a coleção é processada (ex: saveDocument ou getDocumentPath)
// Substituir a lógica de concatenação de string manual por:
// const path = resolveCollectionPath(collection.config, document.fields);
