
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentUser } from '@/lib/auth';
import type { User, Favor } from '@/types'; // Added Favor type
import { Activity, Compass, ListChecks, PlusSquare, User as UserIcon, BookOpen, HelpCircle, MessageSquareQuestion, Info, Lightbulb, ShieldCheck, FileText, Users2, Phone, Star, CalendarPlus, CheckCircle, UserPlus, TrendingUp, LayoutList, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { mockFavors, mockUsers } from '@/lib/mock-data'; // For previewing favors
import { FavorCard } from '@/components/favor-card'; // To display favor previews
import { Separator } from '@/components/ui/separator'; // For visual separation
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // For activity feed
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock stats for now, replace with real data fetching as needed
const mockDashboardStats = {
  openFavorsNearby: 12,
  myActiveRequests: 2,
  favorsIAccepted: 1,
};

// Mock Activity Data
interface ActivityItem {
  id: string;
  type: 'new_favor' | 'favor_accepted' | 'favor_completed' | 'new_user';
  userName: string;
  userAvatar?: string;
  favorTitle?: string;
  favorId?: string;
  timestamp: Date;
  message?: string;
}

const mockActivities: ActivityItem[] = [
  { id: 'act1', type: 'new_favor', userName: 'Carlos Pereira', favorTitle: 'Preciso de ajuda com mudança', favorId: 'favor1', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
  { id: 'act2', type: 'favor_completed', userName: 'Beatriz Costa', favorTitle: 'Passeio com cães', favorId: 'favor2', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) },
  { id: 'act3', type: 'new_user', userName: 'Mariana Silva', message: 'Mariana Silva juntou-se à comunidade!', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  { id: 'act4', type: 'favor_accepted', userName: 'Lucas Almeida', favorTitle: 'Aulas de violão para iniciantes', favorId: 'favor3', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
];


export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState(mockDashboardStats);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [recentOpenFavors, setRecentOpenFavors] = useState<Favor[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>(mockActivities);

  useEffect(() => {
    const fetchInitialData = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      // Populate recent open favors for preview (mocked)
      const populatedFavors = mockFavors.map(favor => ({
        ...favor,
        requester: mockUsers.find(u => u.id === favor.requesterId)
      }));
      setRecentOpenFavors(populatedFavors.filter(f => f.status === 'open').slice(0, 3));
    };
    
    fetchInitialData();
    setCurrentYear(new Date().getFullYear());
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

  const getActivityMessage = (activity: ActivityItem) => {
    if (activity.message) return activity.message;
    switch(activity.type) {
      case 'new_favor': return `${activity.userName} pediu um novo favor: "${activity.favorTitle}"`;
      case 'favor_accepted': return `${activity.userName} aceitou o favor: "${activity.favorTitle}"`;
      case 'favor_completed': return `${activity.userName} completou o favor: "${activity.favorTitle}"`;
      default: return "Nova atividade";
    }
  }


  return (
    <div className="space-y-8 md:space-y-12">
      {/* Welcome Section */}
      <section className="bg-card p-6 sm:p-8 rounded-lg shadow-lg border border-border">
        <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-2">
          Bem-vindo(a) de volta, {user?.name?.split(' ')[0] || 'Usuário'}!
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Pronto para fazer a diferença ou encontrar a ajuda que precisa hoje?
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

      {/* Detailed Stats Section */}
      <section>
        <div className="flex items-center mb-4">
          <TrendingUp className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-2xl font-headline font-semibold text-foreground">Suas Estatísticas</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Favores Abertos (Perto)</CardTitle>
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
                {user?.reputation.toFixed(1) || "N/A"}
                <Star className="h-6 w-6 text-yellow-400 fill-yellow-400 ml-1.5"/>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Com base nas suas interações.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Discover Favors Focus Section */}
      <section>
         <Card className="shadow-lg border-primary border-2">
            <CardHeader>
                <div className="flex items-center mb-1">
                    <Search className="h-6 w-6 mr-2 text-primary" />
                    <CardTitle className="text-xl font-headline text-primary">Pronto para Ajudar ou Ser Ajudado?</CardTitle>
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
                        <Link href="/favors"><Compass className="mr-2 h-5 w-5" /> Explorar Todos os Favores</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <Link href="/favors/submit"><PlusSquare className="mr-2 h-5 w-5" /> Pedir um Favor</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Feed */}
        <section className="lg:col-span-2">
          <Card className="shadow-md hover:shadow-lg transition-shadow h-full">
            <CardHeader>
                <div className="flex items-center">
                    <LayoutList className="h-6 w-6 mr-2 text-primary" />
                    <CardTitle className="text-xl font-headline">Atividade Recente na Comunidade</CardTitle>
                </div>
                <CardDescription>Veja o que está acontecendo na plataforma.</CardDescription>
            </CardHeader>
            <CardContent>
              {activities.length > 0 ? (
                <ul className="space-y-4">
                  {activities.map((activity) => (
                    <li key={activity.id} className="flex items-start space-x-3">
                      <Avatar className="h-10 w-10 border">
                        {activity.userAvatar ? <AvatarImage src={activity.userAvatar} alt={activity.userName} data-ai-hint="avatar person"/> : 
                        <AvatarFallback className="bg-muted text-muted-foreground">
                            {activity.userName.charAt(0).toUpperCase()}
                        </AvatarFallback>}
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm text-foreground leading-snug">
                           {getActivityMessage(activity)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(activity.timestamp, { addSuffix: true, locale: ptBR })}
                        </p>
                      </div>
                      {renderActivityIcon(activity.type)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center py-4">Nenhuma atividade recente para mostrar.</p>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Quick Actions & Tip */}
        <section className="lg:col-span-1 space-y-8">
            <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle className="text-xl font-headline">Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
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
      </div>


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
    

    

    