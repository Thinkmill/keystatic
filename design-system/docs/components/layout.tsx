'use client';
import { ReactNode } from 'react';

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
      <Flex height="100vh">
        <Sidebar items={navigation} />
        {children}
      </Flex>
      <Toaster />
    </SidebarProvider>
  );
}
