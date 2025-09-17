"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockFavors, mockUsers } from '@/lib/mock-data';
import { Users, Handshake, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFavors: 0,
    completedFavors: 0,
  });

  useEffect(() => {
    // Em uma aplicação real, esses dados seriam buscados de uma API
    setStats({
      totalUsers: mockUsers.length,
      totalFavors: mockFavors.length,
      completedFavors: mockFavors.filter(f => f.status === 'completed').length,
    });
  }, []);

  return (
    <section className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">Usuários registrados na plataforma.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Favores</CardTitle>
            <Handshake className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalFavors}</div>
            <p className="text-xs text-muted-foreground mt-1">Favores criados na comunidade.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favores Concluídos</CardTitle>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.completedFavors}</div>
            <p className="text-xs text-muted-foreground mt-1">Favores que foram concluídos com sucesso.</p>
          </CardContent>
        </Card>
      </div>
       <Card>
        <CardHeader>
          <CardTitle>Bem-vindo ao Painel Administrativo</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Use o menu à esquerda para navegar pelas seções de gerenciamento. Você pode visualizar todos os usuários, monitorar atividades e obter uma visão geral do ecossistema.</p>
        </CardContent>
      </Card>
    </section>
  );
}
