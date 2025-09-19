

import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarFooter, SidebarTrigger } from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Compass, ListChecks, PlusSquare, User as UserIcon, LogOut, HomeIcon, Shield, Gem, Users2, Rocket } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { ClientNavItem } from '@/components/client-nav-item';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { PageTitle } from '@/components/page-title';
import { NotificationsDropdown } from '@/components/notifications-dropdown';

function AppFooter() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="mt-auto text-center py-4 border-t border-border/50 bg-muted/50">
            <p className="text-xs text-muted-foreground">
                &copy; {currentYear} Projeto Favor. Todos os direitos reservados.
            </p>
        </footer>
    );
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  const userInitial = user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-muted/40">
        <Sidebar side="left" variant="sidebar" collapsible="icon">
            <SidebarHeader className="border-b border-sidebar-border">
              <div className="p-3 flex justify-center items-center h-16">
                <Link href="/">
                  <Logo size="md" />
                </Link>
              </div>
            </SidebarHeader>
            <SidebarContent className="flex-grow">
              <nav aria-label="Navegação Principal">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <ClientNavItem href="/inicio" exact label="Início">
                      <HomeIcon />
                      <span>Início</span>
                    </ClientNavItem>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <ClientNavItem href="/favores" label="Descobrir Favores">
                      <Compass />
                      <span>Descobrir</span>
                    </ClientNavItem>
                  </SidebarMenuItem>
                   <SidebarMenuItem>
                    <ClientNavItem href="/comunidades" label="Comunidades">
                      <Users2 />
                      <span>Comunidades</span>
                    </ClientNavItem>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <ClientNavItem href="/favores/pedir" label="Pedir um Favor">
                      <PlusSquare />
                      <span>Pedir Favor</span>
                    </ClientNavItem>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <ClientNavItem href="/favores/meus" label="Meus Favores">
                      <ListChecks />
                      <span>Meus Favores</span>
                    </ClientNavItem>
                  </SidebarMenuItem>
                   <SidebarMenuItem>
                    <ClientNavItem href="/missoes" label="Missões">
                      <Rocket />
                      <span>Missões</span>
                    </ClientNavItem>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <ClientNavItem href="/assinatura" label="Minha Assinatura">
                      <Gem />
                      <span>Assinatura</span>
                    </ClientNavItem>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <ClientNavItem href="/perfil" label="Perfil">
                      <UserIcon />
                      <span>Perfil</span>
                    </ClientNavItem>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <ClientNavItem href="/admin/painel" label="Admin">
                      <Shield />
                      <span>Admin</span>
                    </ClientNavItem>
                  </SidebarMenuItem>
                </SidebarMenu>
              </nav>
            </SidebarContent>
            <SidebarFooter className="border-t border-sidebar-border p-3 space-y-3">
               <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://picsum.photos/seed/avatar${user?.id}/40/40`} alt={user?.name} data-ai-hint="avatar person" />
                  <AvatarFallback>{userInitial}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium text-sidebar-foreground truncate">{user?.name || 'Nome do Usuário'}</span>
                  <span className="text-xs text-sidebar-foreground/70 truncate">{user?.email || 'usuario@exemplo.com'}</span>
                </div>
              </div>
              <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" asChild>
                <Link href="/auth/entrar">
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
              <PageTitle />
            </div>
            <div className="flex items-center gap-2">
                <NotificationsDropdown />
                <ThemeToggleButton />
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 overflow-auto bg-background">
            {children}
          </main>
          <AppFooter />
        </div>
      </div>
    </SidebarProvider>
  );
}

    