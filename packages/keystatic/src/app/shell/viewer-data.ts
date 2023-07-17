import { FragmentData, gql } from '@ts-gql/tag/no-transform';
import { createContext, useContext } from 'react';

export const SidebarFooter_viewer = gql`
  fragment SidebarFooter_viewer on User {
    id
    name
    login
    avatarUrl
    databaseId
  }
` as import('../../../__generated__/ts-gql/SidebarFooter_viewer').type;

export const ViewerContext = createContext<
  FragmentData<typeof SidebarFooter_viewer> | undefined
>(undefined);

export function useViewer() {
  return useContext(ViewerContext);
}
