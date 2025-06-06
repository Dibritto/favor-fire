

import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarFooter, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Compass, ListChecks, PlusSquare, User as UserIcon, LogOut, HomeIcon } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
// import { redirect } from 'next/navigation'; // Uncomment for production to protect routes
import { ClientNavItem } from '@/components/client-nav-item';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ThemeToggleButton } from '@/components/theme-toggle-button';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  // if (!user) {
  //   redirect('/auth/login');
  // }

  const userInitial = user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-muted/40">
        <Sidebar side="left" variant="sidebar" collapsible="icon">
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="p-3 flex justify-between items-center h-16">
              <Logo size="md" />
              {/* SidebarTrigger is for mobile, usually placed in the header of SidebarInset */}
            </div>
          </SidebarHeader>
          <SidebarContent className="flex-grow">
            <SidebarMenu>
              <SidebarMenuItem>
                <ClientNavItem href="/" exact label="Início">
                  <HomeIcon />
                  <span>Início</span>
                </ClientNavItem>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <ClientNavItem href="/favors" label="Descobrir Favores">
                  <Compass />
                  <span>Descobrir Favores</span>
                </ClientNavItem>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <ClientNavItem href="/favors/my" label="Meus Favores">
                  <ListChecks />
                  <span>Meus Favores</span>
                </ClientNavItem>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <ClientNavItem href="/favors/submit" label="Pedir um Favor">
                  <PlusSquare />
                  <span>Pedir um Favor</span>
                </ClientNavItem>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <ClientNavItem href="/profile" label="Perfil">
                  <UserIcon />
                  <span>Perfil</span>
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
                <span className="text-sm font-medium text-sidebar-foreground">{user?.name || 'Nome do Usuário'}</span>
                <span className="text-xs text-sidebar-foreground/70">{user?.email || 'usuario@exemplo.com'}</span>
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
        <SidebarInset className="flex flex-col flex-1">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
            <SidebarTrigger className="md:hidden" /> {/* Mobile trigger visible on small screens */}
            <div className="flex-1">
                <h1 className="font-semibold text-xl font-headline text-foreground">Favor</h1>
            </div>
            <div className="flex items-center gap-2">
                <ThemeToggleButton />
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 overflow-auto bg-background">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
