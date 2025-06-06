
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentUser } from '@/lib/auth';
import type { User } from '@/types';
import { Activity, Compass, ListChecks, PlusSquare, User as UserIcon } from 'lucide-react';
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

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();
    // In a real app, you would fetch dynamic stats here
    // For example, fetch mockDashboardStats or real data from an API
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">
            Painel de Controle
          </h1>
          <p className="text-muted-foreground">
            Bem-vindo(a) de volta, {user?.name?.split(' ')[0] || 'Usuário'}! Aqui está um resumo da sua atividade.
          </p>
        </div>
        <Button asChild>
          <Link href="/favors/submit">
            <PlusSquare className="mr-2 h-4 w-4" /> Pedir um Novo Favor
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favores Abertos (Perto)</CardTitle>
            <Compass className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openFavorsNearby}</div>
            <p className="text-xs text-muted-foreground">
              Oportunidades para ajudar na sua comunidade.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meus Pedidos Ativos</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.myActiveRequests}</div>
            <p className="text-xs text-muted-foreground">
              Acompanhe os favores que você solicitou.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favores que Aceitei</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.favorsIAccepted}</div>
            <p className="text-xs text-muted-foreground">
              Favores que você se comprometeu a ajudar.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Acesse rapidamente as seções mais importantes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/favors">
                <Compass className="mr-2 h-4 w-4" /> Explorar Todos os Favores
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/favors/my">
                <ListChecks className="mr-2 h-4 w-4" /> Gerenciar Meus Favores
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/profile">
                <UserIcon className="mr-2 h-4 w-4" /> Ver Meu Perfil
              </Link>
            </Button>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Dica do Dia</CardTitle>
            <CardDescription>Pequenas ações, grande impacto!</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Considere oferecer ajuda para uma tarefa simples hoje, como levar o lixo do seu vizinho ou oferecer uma carona. Um pequeno gesto pode fazer uma grande diferença!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
