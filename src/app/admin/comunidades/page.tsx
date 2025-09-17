
"use client";

import { useState, useEffect } from 'react';
import type { Community, User } from '@/types';
import { mockCommunities, mockUsers } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Globe, Lock, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AdminManageCommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);

  useEffect(() => {
    // Em um app real, você buscaria os dados da sua API
    setCommunities(mockCommunities);
  }, []);

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-headline font-bold">Gerenciar Comunidades</h1>
                <p className="text-muted-foreground">Crie, visualize e gerencie as comunidades da plataforma.</p>
            </div>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Criar Comunidade
            </Button>
        </div>
      <section aria-labelledby="communities-table-heading">
        <Card>
          <CardHeader>
            <CardTitle id="communities-table-heading">Todas as Comunidades</CardTitle>
            <CardDescription>
              Um total de {communities.length} comunidades encontradas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Comunidade</TableHead>
                  <TableHead className="hidden sm:table-cell">Tipo</TableHead>
                  <TableHead className="hidden md:table-cell">Criador</TableHead>
                  <TableHead className="hidden lg:table-cell">Membros</TableHead>
                  <TableHead className="hidden lg:table-cell">Criada em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {communities.map(community => (
                  <TableRow key={community.id}>
                    <TableCell>
                      <div className="font-medium">{community.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{community.description}</div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant={community.type === 'public' ? 'secondary' : 'outline'} className="capitalize">
                        {community.type === 'public' ? <Globe className="mr-1.5 h-3 w-3" /> : <Lock className="mr-1.5 h-3 w-3" />}
                        {community.type === 'public' ? 'Pública' : 'Privada'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{community.creator?.name || 'N/A'}</TableCell>
                    <TableCell className="hidden lg:table-cell">{community.memberIds.length}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {format(new Date(community.createdAt), 'P', { locale: ptBR })}
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
                          <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                          <DropdownMenuItem>Editar Comunidade</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Desativar Comunidade</DropdownMenuItem>
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
    </div>
  );
}
