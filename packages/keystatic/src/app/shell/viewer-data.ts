import { FragmentOf, readFragment } from 'gql.tada';
import { graphql } from '../../graphql';
import { createContext, useContext } from 'react';

export const SidebarFooter_viewer = graphql(`
  fragment SidebarFooter_viewer on User {
    id
    name
    login
    avatarUrl
    databaseId
  }
`);

export const ViewerContext = createContext<
  FragmentOf<typeof SidebarFooter_viewer> | undefined
>(undefined);

export function useViewer() {
  const val = useContext(ViewerContext);
  if (!val) return;
  return readFragment(SidebarFooter_viewer, val);
}
