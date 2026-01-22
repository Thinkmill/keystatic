'use client';
import { ReactNode, type JSX } from 'react';

import { Flex } from '@keystar/ui/layout';

import { SidebarItem, Sidebar, SidebarProvider } from './sidebar';
import { Toaster } from '@keystar/ui/toast';

export function Layout({
  children,
  navigation,
}: {
  children: ReactNode;
  navigation: SidebarItem[];
}): JSX.Element {
  return (
    <SidebarProvider>
      <Flex
        height="100%"
        // create a stacking context for app contents, ensuring portalled
        // dialogs etc. are always on top w/o z-index hacks
        UNSAFE_style={{ isolation: 'isolate' }}
      >
        <Sidebar items={navigation} />
        {children}
      </Flex>
      <Toaster />
    </SidebarProvider>
  );
}
