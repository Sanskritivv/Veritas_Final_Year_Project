'use client';

import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  ShieldCheck,
  BarChart3,
  Aperture,
  Settings,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type AppShellProps = {
  children: ReactNode;
};

const navItems = [
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    href: '/dashboard/risk-scoring',
    icon: ShieldCheck,
    label: 'Risk Scoring',
  },
  {
    href: '/dashboard/reports',
    icon: BarChart3,
    label: 'Reports',
  },
];

const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader className="p-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-primary-foreground group-data-[collapsible=icon]:justify-center"
          >
            <Aperture className="size-7 shrink-0 text-primary" />
            <span className="text-xl font-semibold group-data-[collapsible=icon]:hidden">
              Veritas
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label }}
                    asChild
                  >
                    <a>
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <div className="flex items-center gap-3">
             {userAvatar && (
              <Avatar className="size-9">
                <AvatarImage
                  src={userAvatar.imageUrl}
                  alt={userAvatar.description}
                  data-ai-hint={userAvatar.imageHint}
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            )}
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="font-medium text-sm">Jane Doe</span>
              <span className="text-xs text-muted-foreground">Analyst</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">
              {navItems.find((item) => item.href === pathname)?.label ||
                'Dashboard'}
            </h1>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="size-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
