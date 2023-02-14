export type SidebarLink = { name: string; href: string };
export type SidebarGroup = { name: string; children: SidebarLink[] };

export type SidebarItem = SidebarLink | SidebarGroup;
