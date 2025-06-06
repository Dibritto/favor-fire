"use client"; // For client-side filtering and state

import { useState, useMemo, useEffect } from 'react';
import { FavorCard } from '@/components/favor-card';
import { mockFavors, mockUsers } from '@/lib/mock-data'; // Using mock data
import type { Favor, FavorType, UrgencyLevel, User } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Search, FilterX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function FavorDiscoveryPage() {
  const [favors, setFavors] = useState<Favor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FavorType | 'all'>('all');
  const [filterUrgency, setFilterUrgency] = useState<UrgencyLevel | 'all'>('all');
  // const [filterLocation, setFilterLocation] = useState(''); // Future: more complex location filter

  useEffect(() => {
    // Simulate fetching data
    const populatedFavors = mockFavors.map(favor => ({
      ...favor,
      requester: mockUsers.find(u => u.id === favor.requesterId)
    }));
    setFavors(populatedFavors.filter(f => f.status === 'open' || f.status === 'accepted')); // Show open and accepted favors
  }, []);

  const filteredFavors = useMemo(() => {
    return favors
      .filter(favor => {
        const matchesSearchTerm =
          favor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          favor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          favor.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          favor.requester?.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = filterType === 'all' || favor.type === filterType;
        const matchesUrgency = filterUrgency === 'all' || favor.urgency === filterUrgency;
        // const matchesLocation = filterLocation === '' || favor.location.toLowerCase().includes(filterLocation.toLowerCase());

        return matchesSearchTerm && matchesType && matchesUrgency;
      });
  }, [favors, searchTerm, filterType, filterUrgency]);

  const resetFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterUrgency('all');
    // setFilterLocation('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
            <h1 className="text-3xl font-headline font-bold">Descobrir Favores</h1>
            <p className="text-muted-foreground">Encontre oportunidades para ajudar ou obter ajuda em sua comunidade.</p>
        </div>
        <Button asChild>
          <Link href="/favors/submit">
            <PlusCircle className="mr-2 h-4 w-4" /> Pedir um Favor
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
            <CardTitle className="text-lg">Filtrar Favores</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Buscar por palavra-chave, local..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-full"
                />
            </div>
            
            <Select value={filterType} onValueChange={(value) => setFilterType(value as FavorType | 'all')}>
                <SelectTrigger>
                    <SelectValue placeholder="Filtrar por Tipo" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos os Tipos</SelectItem>
                    <SelectItem value="volunteer">Voluntário</SelectItem>
                    <SelectItem value="paid">Pago</SelectItem>
                </SelectContent>
            </Select>

            <Select value={filterUrgency} onValueChange={(value) => setFilterUrgency(value as UrgencyLevel | 'all')}>
                <SelectTrigger>
                    <SelectValue placeholder="Filtrar por Urgência" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todas as Urgências</SelectItem>
                    <SelectItem value="low">Baixa Urgência</SelectItem>
                    <SelectItem value="medium">Média Urgência</SelectItem>
                    <SelectItem value="high">Alta Urgência</SelectItem>
                </SelectContent>
            </Select>
            {/* 
            <Input
                placeholder="Filter by Location (e.g. Anytown)"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
            /> 
            */}
            <Button onClick={resetFilters} variant="outline" className="w-full md:w-auto">
                <FilterX className="mr-2 h-4 w-4" /> Limpar Filtros
            </Button>
        </CardContent>
      </Card>


      {filteredFavors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavors.map((favor) => (
            <FavorCard key={favor.id} favor={favor} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Nenhum Favor Encontrado</h3>
          <p className="text-muted-foreground">Tente ajustar sua busca ou filtros, ou volte mais tarde!</p>
        </div>
      )}
    </div>
  );
}
