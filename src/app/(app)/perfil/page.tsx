"use client";

import { useEffect, useState } from 'react';
import { getCurrentUser, getUserById } from '@/lib/auth';
import { mockFavors } from '@/lib/mock-data';
import type { User, Favor } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Award, Edit3, Mail, Phone, Star, ListChecks, HelpingHand, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function ProfileFavorItem({ favor }: { favor: Favor }) {
    return (
        <Link href={`/favores/${favor.id}`} className="block hover:bg-muted/50 p-3 rounded-md transition-colors">
            <div className="flex justify-between items-start">
                <h4 className="font-semibold text-primary">{favor.title}</h4>
                <Badge variant="outline" className="capitalize text-xs">{favor.status === "completed" ? "concluído" : favor.status}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
                {favor.type === 'paid' ? `Pago (R$${favor.amount})` : 'Voluntário'} - {format(new Date(favor.createdAt), "P", { locale: ptBR })}
            </p>
            <p className="text-sm text-foreground mt-1 line-clamp-2">{favor.description}</p>
        </Link>
    );
}


export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [favorsRequested, setFavorsRequested] = useState<Favor[]>([]);
  const [favorsFulfilled, setFavorsFulfilled] = useState<Favor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        setFavorsRequested(mockFavors.filter(f => f.requesterId === currentUser.id));
        setFavorsFulfilled(mockFavors.filter(f => f.executorId === currentUser.id && f.status === 'completed'));
      }
      setIsLoading(false);
    };
    fetchProfileData();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div><p className="ml-4 text-muted-foreground">Carregando perfil...</p></div>;
  }

  if (!user) {
    return <p className="text-center text-muted-foreground">Não foi possível carregar o perfil do usuário. Por favor, tente fazer login novamente.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <header className="shadow-xl overflow-hidden rounded-lg">
        <div className="h-32 bg-gradient-to-r from-primary to-accent relative" data-ai-hint="abstract pattern">
           <Image 
            src="https://placehold.co/1200x200.png" 
            alt="Banner do perfil" 
            fill
            style={{ objectFit: 'cover' }}
            priority
            data-ai-hint="abstract banner"
          />
        </div>
        <div className="relative pt-0">
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-12 space-y-4 sm:space-y-0 sm:space-x-6 p-6 bg-card/80 backdrop-blur-sm rounded-b-lg">
                <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                    <AvatarImage src={`https://placehold.co/128x128.png?text=${user.name.charAt(0).toUpperCase()}`} alt={user.name} data-ai-hint="profile picture"/>
                    <AvatarFallback className="text-4xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-grow text-center sm:text-left">
                    <h1 className="text-2xl sm:text-3xl font-headline">{user.name}</h1>
                    <div className="flex items-center justify-center sm:justify-start text-yellow-500 mt-1">
                        {[...Array(Math.floor(user.reputation))].map((_, i) => <Star key={`full-${i}`} className="h-5 w-5 fill-current" />)}
                        {user.reputation % 1 >= 0.5 && <Star key="half" className="h-5 w-5" style={{ clipPath: 'inset(0 50% 0 0)' }} />}
                        {[...Array(5 - Math.ceil(user.reputation))].map((_, i) => <Star key={`empty-${i}`} className="h-5 w-5 text-muted-foreground" />)}
                        <span className="ml-2 text-sm text-muted-foreground">({user.reputation.toFixed(1)} Reputação)</span>
                    </div>
                </div>
                <Button variant="outline" size="sm"><Edit3 className="mr-2 h-4 w-4" /> Editar Perfil (Em Breve)</Button>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <aside className="md:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-headline">Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <p className="flex items-center"><Mail className="mr-3 h-5 w-5 text-primary" /> {user.email}</p>
                    {user.phone && <p className="flex items-center"><Phone className="mr-3 h-5 w-5 text-primary" /> {user.phone}</p>}
                    <p className="flex items-center">
                        <CalendarDays className="mr-3 h-5 w-5 text-primary" /> 
                        {user.joinDate ? `Entrou em: ${format(new Date(user.joinDate), "P", { locale: ptBR })}` : 'Data de entrada não disponível'}
                    </p>
                </CardContent>
            </Card>
        </aside>
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-headline">Contribuição Comunitária</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 rounded-lg bg-muted">
                        <HelpingHand className="h-8 w-8 mx-auto text-primary mb-2" />
                        <p className="text-2xl font-bold">{user.favorsCompleted}</p>
                        <p className="text-sm text-muted-foreground">Favores Concluídos</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted">
                        <ListChecks className="h-8 w-8 mx-auto text-accent mb-2" />
                        <p className="text-2xl font-bold">{user.favorsRequested}</p>
                        <p className="text-sm text-muted-foreground">Favores Pedidos</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-headline">Favores Pedidos ({favorsRequested.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {favorsRequested.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {favorsRequested.map(favor => <ProfileFavorItem key={favor.id} favor={favor} />)}
            </div>
          ) : (
            <p className="text-muted-foreground">Você ainda não pediu nenhum favor.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-headline">Favores Realizados ({favorsFulfilled.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {favorsFulfilled.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {favorsFulfilled.map(favor => <ProfileFavorItem key={favor.id} favor={favor} />)}
            </div>
          ) : (
            <p className="text-muted-foreground">Você ainda não realizou nenhum favor.</p>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
