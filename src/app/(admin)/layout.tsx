

import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarFooter, SidebarTrigger } from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, LayoutDashboard, Users } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { ClientNavItem } from '@/components/client-nav-item';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { Footer } from '@/components/footer';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser(); // Assuming admin is also a user

  const userInitial = user?.name?.charAt(0).toUpperCase() || 'A';

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-muted/40">
        <Sidebar side="left" variant="sidebar" collapsible="icon">
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="p-3 flex justify-between items-center h-16">
              <Logo size="md" />
            </div>
          </SidebarHeader>
          <SidebarContent className="flex-grow">
            <SidebarMenu>
              <SidebarMenuItem>
                <ClientNavItem href="/admin/dashboard" exact label="Admin Dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </ClientNavItem>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <ClientNavItem href="/admin/users" label="Gerenciar Usuários">
                  <Users />
                  <span>Usuários</span>
                </ClientNavItem>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t border-sidebar-border p-3">
             <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={`https://placehold.co/40x40.png?text=${userInitial}`} alt={user?.name} data-ai-hint="avatar person" />
                <AvatarFallback>{userInitial}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-sidebar-foreground">{user?.name || 'Admin'}</span>
                <span className="text-xs text-sidebar-foreground/70">{user?.email || 'admin@exemplo.com'}</span>
              </div>
            </div>
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" asChild>
              <Link href="/auth/login"> {/* Mock logout */}
                <LogOut className="mr-2 h-5 w-5" />
                Sair
              </Link>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col flex-1">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
                <h1 className="font-semibold text-xl font-headline text-foreground">Painel Administrativo</h1>
            </div>
            <div className="flex items-center gap-2">
                <ThemeToggleButton />
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 overflow-auto bg-background">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}
