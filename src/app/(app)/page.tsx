
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentUser } from '@/lib/auth';
import type { User } from '@/types';
import { Activity, Compass, ListChecks, PlusSquare, User as UserIcon, BookOpen, HelpCircle, MessageSquareQuestion, Info, Lightbulb, ShieldCheck, FileText, Users2, Phone } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Mock stats for now, replace with real data fetching as needed
const mockDashboardStats = {
  openFavorsNearby: 12,
  myActiveRequests: 2,
  favorsIAccepted: 1,
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState(mockDashboardStats);
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();
    setCurrentYear(new Date().getFullYear());
    // In a real app, you would fetch dynamic stats here
  }, []);

  return (
    <div className="space-y-8 md:space-y-12">
      {/* Welcome/Hero Section */}
      <section className="bg-card p-6 sm:p-8 rounded-lg shadow-lg border border-border">
        <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-2">
          Bem-vindo(a) ao Favor, {user?.name?.split(' ')[0] || 'Usuário'}!
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Sua plataforma para fortalecer laços comunitários através da troca de favores.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-shadow">
            <Link href="/favors/submit">
              <PlusSquare className="mr-2 h-5 w-5" /> Pedir um Favor
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="shadow-md hover:shadow-lg transition-shadow">
            <Link href="/favors">
              <Compass className="mr-2 h-5 w-5" /> Explorar Favores
            </Link>
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section>
        <h2 className="text-2xl font-headline font-semibold mb-4 text-foreground">Seu Resumo</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Favores Abertos (Perto)</CardTitle>
              <Compass className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.openFavorsNearby}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Oportunidades para ajudar na sua comunidade.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meus Pedidos Ativos</CardTitle>
              <ListChecks className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.myActiveRequests}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Acompanhe os favores que você solicitou.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Favores que Aceitei</CardTitle>
              <Activity className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.favorsIAccepted}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Favores que você se comprometeu a ajudar.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Actions & Tip of the day */}
      <section className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl font-headline">Ações Rápidas</CardTitle>
            <CardDescription>Acesse rapidamente as seções mais importantes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start text-base py-3 h-auto" asChild>
              <Link href="/favors">
                <Compass className="mr-3 h-5 w-5 text-primary" /> Explorar Todos os Favores
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start text-base py-3 h-auto" asChild>
              <Link href="/favors/my">
                <ListChecks className="mr-3 h-5 w-5 text-primary" /> Gerenciar Meus Favores
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start text-base py-3 h-auto" asChild>
              <Link href="/profile">
                <UserIcon className="mr-3 h-5 w-5 text-primary" /> Ver Meu Perfil
              </Link>
            </Button>
          </CardContent>
        </Card>
         <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl font-headline">Dica do Dia</CardTitle>
            <CardDescription>Pequenas ações, grande impacto!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start">
              <Lightbulb className="h-6 w-6 text-yellow-400 mr-3 mt-1 shrink-0" />
              <p className="text-sm text-muted-foreground">
                Considere oferecer ajuda para uma tarefa simples hoje, como levar o lixo do seu vizinho ou oferecer uma carona. Um pequeno gesto pode fazer uma grande diferença na vida de alguém!
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer Section */}
      <footer className="mt-16 pt-10 border-t border-border text-sm text-muted-foreground">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8 px-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-base flex items-center"><BookOpen className="mr-2 h-5 w-5 text-primary"/>Recursos</h4>
            <Link href="#" className="block hover:text-primary transition-colors">Documentação</Link>
            <Link href="#" className="block hover:text-primary transition-colors">Ajuda & Suporte</Link>
            <Link href="#" className="block hover:text-primary transition-colors">FAQ</Link>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-base flex items-center"><Users2 className="mr-2 h-5 w-5 text-primary"/>Sobre</h4>
            <Link href="#" className="block hover:text-primary transition-colors">Sobre Nós</Link>
            <Link href="#" className="block hover:text-primary transition-colors">Dicas da Comunidade</Link>
            <Link href="#" className="block hover:text-primary transition-colors">Informações Adicionais</Link> 
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-base flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-primary"/>Legal</h4>
            <Link href="#" className="block hover:text-primary transition-colors">Política de Privacidade</Link>
            <Link href="#" className="block hover:text-primary transition-colors">Termos de Uso</Link>
          </div>
           <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-base flex items-center"><Phone className="mr-2 h-5 w-5 text-primary"/>Conecte-se</h4>
            <Link href="#" className="block hover:text-primary transition-colors">Contate-nos</Link>
            {/* Social media links can be added here */}
          </div>
        </div>
        <div className="text-center py-6 border-t border-border/50">
          <p>
            &copy; {currentYear || new Date().getFullYear()} Favor. Todos os direitos reservados.
          </p>
          <p className="text-xs mt-1">
            Construindo comunidades mais fortes, um favor de cada vez.
          </p>
        </div>
      </footer>
    </div>
  );
}
