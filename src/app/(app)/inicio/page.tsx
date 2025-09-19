
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentUser } from '@/lib/auth';
import type { User, Favor } from '@/types';
import { Activity, Compass, ListChecks, PlusSquare, User as UserIcon, BookOpen, HelpCircle, MessageSquareQuestion, Info, Lightbulb, ShieldCheck, FileText, Users2, Phone, Star, CalendarPlus, CheckCircle, UserPlus, TrendingUp, LayoutList, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { mockFavors, mockUsers } from '@/lib/mock-data';
import { FavorCard } from '@/components/favor-card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ClientFormattedDate } from '@/components/client-formatted-date';

// Estatísticas de exemplo
const initialDashboardStats = {
  openFavorsNearby: 0,
  myActiveRequests: 0,
  favorsIAccepted: 0,
};

// Dados de Atividade de Exemplo
interface ActivityItem {
  id: string;
  type: 'new_favor' | 'favor_accepted' | 'favor_completed' | 'new_user';
  userName: string;
  userId: string;
  userAvatar?: string;
  favorTitle?: string;
  favorId?: string;
  timestamp: Date;
  message?: string;
}

const initialMockActivities: ActivityItem[] = [
  { id: 'act1', type: 'new_favor', userName: 'Carlos Pereira', userId: 'user3', favorTitle: 'Preciso de ajuda com mudança', favorId: 'favor1', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
  { id: 'act2', type: 'favor_completed', userName: 'Beatriz Costa', userId: 'user1', favorTitle: 'Passeio com cães', favorId: 'favor2', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) },
  { id: 'act3', type: 'new_user', userName: 'Mariana Silva', userId: 'user2', message: 'Mariana Silva juntou-se à comunidade!', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  { id: 'act4', type: 'favor_accepted', userName: 'Lucas Almeida', userId: 'user2', favorTitle: 'Aulas de violão para iniciantes', favorId: 'favor3', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
];


export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState(initialDashboardStats);
  const [recentOpenFavors, setRecentOpenFavors] = useState<Favor[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>(initialMockActivities);

  useEffect(() => {
    const fetchInitialData = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        const userFavorsRequested = mockFavors.filter(f => f.requesterId === currentUser.id && (f.status === 'open' || f.status === 'accepted')).length;
        const userFavorsAccepted = mockFavors.filter(f => f.executorId === currentUser.id && f.status === 'accepted').length;
        
        setStats({
            openFavorsNearby: mockFavors.filter(f => f.status === 'open').length, // Simplificado: todos os favores abertos
            myActiveRequests: userFavorsRequested,
            favorsIAccepted: userFavorsAccepted,
        });
      } else {
         setStats({
            openFavorsNearby: mockFavors.filter(f => f.status === 'open').length,
            myActiveRequests: 0,
            favorsIAccepted: 0,
        });
      }


      const populatedFavors = mockFavors.map(favor => ({
        ...favor,
        requester: mockUsers.find(u => u.id === favor.requesterId)
      }));
      setRecentOpenFavors(populatedFavors.filter(f => f.status === 'open').slice(0, 3));
    };
    
    fetchInitialData();
  }, []);
  
  const renderActivityIcon = (type: ActivityItem['type']) => {
    switch(type) {
      case 'new_favor': return <CalendarPlus className="h-5 w-5 text-primary" />;
      case 'favor_accepted': return <CheckCircle className="h-5 w-5 text-purple-500" />;
      case 'favor_completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'new_user': return <UserPlus className="h-5 w-5 text-blue-500" />;
      default: return <Activity className="h-5 w-5 text-muted-foreground" />;
    }
  }

  return (
    <main className="space-y-8 md:space-y-12">
      <section className="bg-card p-6 sm:p-8 rounded-lg shadow-lg border border-border">
        <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-2">
          Bem-vindo(a) de volta, {user?.name?.split(' ')[0] || 'Usuário'}!
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Pronto para fazer a diferença ou encontrar a ajuda que precisa hoje?
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-shadow">
            <Link href="/favores/pedir">
              <PlusSquare className="mr-2 h-5 w-5" /> Pedir um Favor
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="shadow-md hover:shadow-lg transition-shadow">
            <Link href="/favores">
              <Compass className="mr-2 h-5 w-5" /> Explorar Favores
            </Link>
          </Button>
        </div>
      </section>

      <section aria-labelledby="dashboard-stats-heading">
        <div className="flex items-center mb-4">
          <TrendingUp className="h-6 w-6 mr-2 text-primary" />
          <h2 id="dashboard-stats-heading" className="text-2xl font-headline font-semibold text-foreground">Suas Estatísticas</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Favores Abertos (Comunidade)</CardTitle>
              <Compass className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.openFavorsNearby}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Oportunidades para ajudar.
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
                Acompanhe seus pedidos.
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
                Compromissos assumidos.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Minha Reputação</CardTitle>
              <Star className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold flex items-center">
                {user?.reputation !== undefined ? user.reputation.toFixed(1) : "N/A"}
                {user?.reputation !== undefined && <Star className="h-6 w-6 text-yellow-400 fill-yellow-400 ml-1.5"/>}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Com base nas suas interações.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <section aria-labelledby="recent-favors-heading">
         <Card className="shadow-lg">
            <CardHeader>
                <div className="flex items-center mb-1">
                    <Search className="h-6 w-6 mr-2 text-primary" />
                    <CardTitle id="recent-favors-heading" className="text-xl font-headline text-primary">Pronto para Ajudar ou Ser Ajudado?</CardTitle>
                </div>
                <CardDescription>Veja alguns dos últimos favores disponíveis ou publique o seu!</CardDescription>
            </CardHeader>
            <CardContent>
                {recentOpenFavors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {recentOpenFavors.map((favor) => (
                        <FavorCard key={favor.id} favor={favor} />
                    ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground mb-6 text-center py-4">Nenhum favor aberto encontrado para prévia no momento. Que tal pedir um?</p>
                )}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild size="lg" >
                        <Link href="/favores"><Compass className="mr-2 h-5 w-5" /> Explorar Todos os Favores</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <Link href="/favores/pedir"><PlusSquare className="mr-2 h-5 w-5" /> Pedir um Favor</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2" aria-labelledby="recent-activity-heading">
          <Card className="shadow-md hover:shadow-lg transition-shadow h-full">
            <CardHeader>
                <div className="flex items-center">
                    <LayoutList className="h-6 w-6 mr-2 text-primary" />
                    <CardTitle id="recent-activity-heading" className="text-xl font-headline">Atividade Recente na Comunidade</CardTitle>
                </div>
                <CardDescription>Veja o que está acontecendo na plataforma.</CardDescription>
            </CardHeader>
            <CardContent>
              {activities.length > 0 ? (
                <ul className="space-y-4">
                  {activities.map((activity) => {
                    let activityMessage;
                    let userLink = <Link href={`/perfil/${activity.userId}`} className="font-medium text-primary hover:underline">{activity.userName}</Link>;

                    if (activity.message) {
                      activityMessage = <>{userLink} {activity.message.substring(activity.userName.length)}</>;
                    } else if (activity.type === 'new_favor') {
                      activityMessage = (
                        <>
                          {userLink} pediu um novo favor:{' '}
                          <Link href={`/favores/${activity.favorId}`} className="font-medium text-primary hover:underline">
                            "{activity.favorTitle}"
                          </Link>
                        </>
                      );
                    } else if (activity.type === 'favor_accepted') {
                      activityMessage = (
                        <>
                          {userLink} aceitou o favor:{' '}
                          <Link href={`/favores/${activity.favorId}`} className="font-medium text-primary hover:underline">
                            "{activity.favorTitle}"
                          </Link>
                        </>
                      );
                    } else if (activity.type === 'favor_completed') {
                      activityMessage = (
                        <>
                          {userLink} completou o favor:{' '}
                          <Link href={`/favores/${activity.favorId}`} className="font-medium text-primary hover:underline">
                            "{activity.favorTitle}"
                          </Link>
                        </>
                      );
                    }
                  
                    return (
                      <li key={activity.id} className="flex items-start space-x-3 p-3 rounded-md hover:bg-muted/50 transition-colors">
                        <Link href={`/perfil/${activity.userId}`} className="shrink-0">
                          <Avatar className="h-10 w-10 border">
                            {activity.userAvatar ? <AvatarImage src={activity.userAvatar} alt={activity.userName} data-ai-hint="avatar person"/> : 
                            <AvatarFallback className="bg-muted text-muted-foreground">
                                {activity.userName.charAt(0).toUpperCase()}
                            </AvatarFallback>}
                          </Avatar>
                        </Link>
                        <div className="flex-1">
                          <p className="text-sm text-foreground leading-snug">
                             {activityMessage}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <ClientFormattedDate 
                                dateString={activity.timestamp.toISOString()}
                                formatFunction="formatDistanceToNow"
                                addSuffix={true}
                                formatString=''
                            />
                          </p>
                        </div>
                        {renderActivityIcon(activity.type)}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center py-4">Nenhuma atividade recente para mostrar.</p>
              )}
            </CardContent>
          </Card>
        </section>

        <aside className="lg:col-span-1 space-y-8">
            <section aria-labelledby="quick-actions-heading">
                <Card className="shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle id="quick-actions-heading" className="text-xl font-headline">Ações Rápidas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button variant="outline" className="w-full justify-start text-base py-3 h-auto" asChild>
                        <Link href="/favores/meus">
                            <ListChecks className="mr-3 h-5 w-5 text-primary" /> Gerenciar Meus Favores
                        </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-base py-3 h-auto" asChild>
                        <Link href="/perfil">
                            <UserIcon className="mr-3 h-5 w-5 text-primary" /> Ver Meu Perfil
                        </Link>
                        </Button>
                    </CardContent>
                </Card>
            </section>
            <section aria-labelledby="tip-of-the-day-heading">
                <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle id="tip-of-the-day-heading" className="text-xl font-headline">Dica do Dia</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-start">
                    <Lightbulb className="h-6 w-6 text-yellow-400 mr-3 mt-1 shrink-0" />
                    <p className="text-sm text-muted-foreground">
                        Ao pedir um favor, seja claro e detalhado sobre o que precisa. Isso aumenta as chances de alguém poder ajudar!
                    </p>
                    </div>
                </CardContent>
                </Card>
            </section>
        </aside>
      </div>
    </main>
  );
}

    