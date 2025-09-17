
"use client";

import { useState, useMemo, useEffect } from 'react';
import { mockCommunities, mockUsers } from '@/lib/mock-data';
import type { Community } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CommunityCard } from '@/components/community-card';
import Link from 'next/link';

export default function CommunityDiscoveryPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simula a busca de dados
    const publicCommunities = mockCommunities.filter(c => c.type === 'public');
    setCommunities(publicCommunities);
  }, []);

  const filteredCommunities = useMemo(() => {
    return communities.filter(community => {
      return community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             community.description.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [communities, searchTerm]);


  return (
    <main className="space-y-6">
       <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
            <h1 className="text-3xl font-headline font-bold">Explorar Comunidades</h1>
            <p className="text-muted-foreground">Encontre grupos de interesse e conecte-se com outros membros.</p>
        </div>
        <Button asChild>
          <Link href="/comunidades/criar">
            <PlusCircle className="mr-2 h-4 w-4" /> Criar Comunidade
          </Link>
        </Button>
      </header>

      <section aria-labelledby="filter-communities-heading">
        <Card>
          <CardHeader>
              <CardTitle id="filter-communities-heading" className="text-lg">Buscar Comunidade</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="relative max-w-md">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                      type="search"
                      placeholder="Buscar por nome ou descrição..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-full"
                  />
              </div>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="communities-list-heading">
        <h2 id="communities-list-heading" className="sr-only">Lista de Comunidades Públicas</h2>
        {filteredCommunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCommunities.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhuma Comunidade Encontrada</h3>
            <p className="text-muted-foreground">Tente ajustar sua busca ou explore mais tarde!</p>
          </div>
        )}
      </section>
    </main>
  );
}
