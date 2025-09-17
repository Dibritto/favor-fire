
"use client";

import { useState, useEffect } from 'react';
import type { Favor, User } from '@/types';
import { mockFavors, mockUsers } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Sparkles, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';

// Função para obter o estilo do status para consistência
const getStatusStyles = (status: Favor['status']) => {
    switch (status) {
      case 'open':
        return "border-blue-500 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700";
      case 'accepted':
        return "border-purple-500 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700";
      case 'completed':
        return "border-teal-500 bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700";
      case 'cancelled':
        return "border-gray-500 bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-700";
      default:
        return "";
    }
}

const statusTranslations: { [key in Favor['status']]: string } = {
    open: 'Aberto',
    accepted: 'Aceito',
    completed: 'Concluído',
    cancelled: 'Cancelado',
};

export default function AdminManageFavorsPage() {
  const [favors, setFavors] = useState<Favor[]>([]);

  useEffect(() => {
    // Em um app real, você buscaria os favores da sua API
    const populatedFavors = mockFavors.map(favor => ({
      ...favor,
      requester: mockUsers.find(u => u.id === favor.requesterId),
      executor: favor.executorId ? mockUsers.find(u => u.id === favor.executorId) : null,
    }));
    setFavors(populatedFavors);
  }, []);

  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Favores</CardTitle>
          <CardDescription>Visualize e gerencie todos os favores criados na plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Favor</TableHead>
                <TableHead className="hidden md:table-cell">Solicitante</TableHead>
                <TableHead className="hidden lg:table-cell">Executor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Tipo</TableHead>
                <TableHead className="hidden lg:table-cell">Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {favors.map(favor => (
                <TableRow key={favor.id}>
                  <TableCell>
                    <div className="font-medium line-clamp-1">{favor.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{favor.location}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{favor.requester?.name || 'N/A'}</TableCell>
                  <TableCell className="hidden lg:table-cell">{favor.executor?.name || 'Nenhum'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`capitalize ${getStatusStyles(favor.status)}`}>
                      {statusTranslations[favor.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex items-center gap-1.5">
                      {favor.type === 'paid' ? <DollarSign className="h-4 w-4 text-green-600" /> : <Sparkles className="h-4 w-4 text-blue-500" />}
                      <span className="capitalize">{favor.type === 'paid' ? 'Pago' : 'Voluntário'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {format(new Date(favor.createdAt), 'P', { locale: ptBR })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                           <Link href={`/favores/${favor.id}`}>Ver Detalhes</Link> 
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Suspender Favor</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
