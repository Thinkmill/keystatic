import { initGraphQLTada } from 'gql.tada';
import type { introspection } from './graphql-introspection';

export const graphql = initGraphQLTada<{
  introspection: typeof introspection;
  scalars: {
    URI: string;
    GitObjectID: string;
    ID: string;
  };
}>();
