
"use client";

import { useState, useEffect } from 'react';
import { FavorCard } from '@/components/favor-card';
import { mockFavors, mockUsers } from '@/lib/mock-data';
import type { Favor, User } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUser } from '@/lib/auth';
import { ListChecks, HelpingHand, Search } from 'lucide-react';

export default function MyFavorsPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [requestedFavors, setRequestedFavors] = useState<Favor[]>([]);
  const [acceptedFavors, setAcceptedFavors] = useState<Favor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndFavors = async () => {
      setIsLoading(true);
      const user = await getCurrentUser();
      setCurrentUser(user);

      if (user) {
        const populatedFavors = mockFavors.map(favor => ({
            ...favor,
            requester: mockUsers.find(u => u.id === favor.requesterId),
            executor: favor.executorId ? mockUsers.find(u => u.id === favor.executorId) : null,
        }));

        setRequestedFavors(populatedFavors.filter(favor => favor.requesterId === user.id));
        setAcceptedFavors(populatedFavors.filter(favor => favor.executorId === user.id));
      }
      setIsLoading(false);
    };
    fetchUserAndFavors();
  }, []);

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="ml-4 text-muted-foreground">Carregando seus favores...</p>
        </div>
    );
  }

  if (!currentUser) {
    return <p className="text-center text-muted-foreground">Por favor, faça login para ver seus favores.</p>;
  }

  const renderFavorList = (favors: Favor[], emptyMessage: string, emptyIcon: JSX.Element) => {
    if (favors.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          {emptyIcon}
          <h3 className="mt-4 text-xl font-semibold">Nada aqui ainda!</h3>
          <p>{emptyMessage}</p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favors.map(favor => (
          <FavorCard key={favor.id} favor={favor} />
        ))}
      </div>
    );
  };

  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-headline font-bold">Meus Favores</h1>
      <Tabs defaultValue="requested" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2">
          <TabsTrigger value="requested">
            <ListChecks className="mr-2 h-4 w-4" /> Meus Pedidos
          </TabsTrigger>
          <TabsTrigger value="accepted">
            <HelpingHand className="mr-2 h-4 w-4" /> Favores Aceitos por Mim
          </TabsTrigger>
        </TabsList>
        <TabsContent value="requested" className="mt-6">
           <section>
              <h2 className="sr-only">Meus Pedidos de Favor</h2>
              {renderFavorList(
                requestedFavors,
                "Você ainda não pediu nenhum favor.",
                <ListChecks className="mx-auto h-12 w-12" />
              )}
           </section>
        </TabsContent>
        <TabsContent value="accepted" className="mt-6">
          <section>
            <h2 className="sr-only">Favores Aceitos por Mim</h2>
            {renderFavorList(
              acceptedFavors,
              "Você ainda não aceitou nenhum favor. Dê uma olhada na página Descobrir!",
              <Search className="mx-auto h-12 w-12" />
            )}
          </section>
        </TabsContent>
      </Tabs>
    </main>
  );
}
