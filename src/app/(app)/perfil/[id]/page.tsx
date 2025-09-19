
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getUserById } from '@/lib/auth';
import { mockFavors } from '@/lib/mock-data';
import type { User, Favor, ReportReason, FavorStatus } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CalendarDays, Gift, MessageCircle, MoreVertical, ShieldAlert, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const reasonTranslations: { [key in ReportReason]: string } = {
    spam: 'Spam ou Propaganda',
    inappropriate: 'Conteúdo Inadequado',
    scam: 'Fraude ou Golpe',
    other: 'Outro',
};

const statusTranslations: Record<FavorStatus, string> = {
  open: 'Aberto',
  accepted: 'Aceito',
  completed: 'Concluído',
  cancelled: 'Cancelado',
};

function ProfileFavorItem({ favor }: { favor: Favor }) {
    return (
        <Link href={`/favores/${favor.id}`} className="block hover:bg-muted/50 p-3 rounded-md transition-colors">
            <div className="flex justify-between items-start">
                <h4 className="font-semibold text-primary">{favor.title}</h4>
                <div className="capitalize text-xs p-1 px-2 rounded-md" >{statusTranslations[favor.status]}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
                {favor.type === 'paid' ? `Pago (R$${favor.amount})` : 'Voluntário'} - {format(new Date(favor.createdAt), "P", { locale: ptBR })}
            </p>
            <p className="text-sm text-foreground mt-1 line-clamp-2">{favor.description}</p>
        </Link>
    );
}

export default function PublicProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const { toast } = useToast();
  
  const [user, setUser] = useState<User | null>(null);
  const [favorsRequested, setFavorsRequested] = useState<Favor[]>([]);
  const [favorsFulfilled, setFavorsFulfilled] = useState<Favor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState<ReportReason | ''>('');
  const [reportComments, setReportComments] = useState("");

  useEffect(() => {
    if (!userId) return;
    const fetchProfileData = async () => {
      setIsLoading(true);
      const profileUser = await getUserById(userId);
      
      if (profileUser) {
        setUser(profileUser);
        setFavorsRequested(mockFavors.filter(f => f.requesterId === profileUser.id));
        setFavorsFulfilled(mockFavors.filter(f => f.executorId === profileUser.id && f.status === 'completed'));
      }
      setIsLoading(false);
    };
    fetchProfileData();
  }, [userId]);

  const handleReportSubmit = () => {
     if (!reportReason) {
        toast({
            title: "Erro",
            description: "Por favor, selecione um motivo para a denúncia.",
            variant: "destructive",
        });
        return;
    }
    console.log("Denúncia enviada:", { userId: user?.id, motivo: reportReason, comentarios: reportComments });
    toast({
        title: "Denúncia Enviada",
        description: "Agradecemos o seu feedback. Nossa equipe de moderação irá analisar a denúncia.",
    });
    setReportReason("");
    setReportComments("");
    setIsReportDialogOpen(false);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div><p className="ml-4 text-muted-foreground">Carregando perfil...</p></div>;
  }

  if (!user) {
    return <p className="text-center text-muted-foreground">Usuário não encontrado.</p>;
  }

  const publicName = user.displayName || user.name;

  return (
    <main className="max-w-4xl mx-auto space-y-8 pb-12">
      <header>
        <Card className="shadow-xl overflow-hidden rounded-lg">
          <div className="h-32 bg-gradient-to-r from-primary to-accent relative" data-ai-hint="abstract pattern">
            <Image 
              src="https://picsum.photos/seed/profilebanner/1200/200" 
              alt="Banner do perfil" 
              fill
              style={{ objectFit: 'cover' }}
              priority
              data-ai-hint="abstract banner"
            />
          </div>
          <div className="relative pt-0">
              <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-12 space-y-4 sm:space-y-0 sm:space-x-6 p-6 bg-card/80 backdrop-blur-sm rounded-b-lg">
                  <Avatar className="h-32 w-32 border-4 border-background shadow-lg shrink-0">
                      <AvatarImage src={`https://picsum.photos/seed/avatar${user.id}/128/128`} alt={publicName} data-ai-hint="profile picture"/>
                      <AvatarFallback className="text-4xl">{publicName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-center sm:items-start flex-grow w-full">
                      <div className="flex items-center justify-between w-full">
                          <div>
                              <h1 className="text-2xl sm:text-3xl font-headline">{publicName}</h1>
                              {user.bio && <p className="text-muted-foreground mt-1 text-sm max-w-lg text-center sm:text-left">{user.bio}</p>}
                              <div className="flex items-center justify-center sm:justify-start text-yellow-500 mt-1">
                                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                  <span className="ml-2 text-sm text-muted-foreground">({user.reputation.toFixed(1)} Reputação)</span>
                              </div>
                          </div>
                          <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
                                      <MoreVertical className="h-5 w-5" />
                                      <span className="sr-only">Mais opções</span>
                                  </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => setIsReportDialogOpen(true)} className="text-destructive">
                                      <ShieldAlert className="mr-2 h-4 w-4" />
                                      Denunciar Perfil
                                  </DropdownMenuItem>
                              </DropdownMenuContent>
                          </DropdownMenu>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 mt-4 w-full justify-center sm:justify-start">
                          <Button size="sm">
                              <MessageCircle className="mr-2 h-4 w-4" /> Enviar Mensagem
                          </Button>
                      </div>
                  </div>
              </div>
          </div>
        </Card>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <aside className="md:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-headline">Informações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <p className="flex items-center">
                        <CalendarDays className="mr-3 h-5 w-5 text-primary" /> 
                        {user.joinDate ? `Entrou em: ${format(new Date(user.joinDate), "P", { locale: ptBR })}` : 'Data de entrada não disponível'}
                    </p>
                </CardContent>
            </Card>
             {user.sponsor && (
                <Card>
                    <CardHeader>
                         <CardTitle className="text-xl font-headline flex items-center gap-2"><Gift className="h-5 w-5 text-primary"/> Apadrinhamento</CardTitle>
                         <CardDescription>Convidado(a) por:</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href={`/perfil/${user.sponsor.id}`} className="block group">
                             <div className="flex items-center gap-4 rounded-lg p-3 transition-colors group-hover:bg-muted/50">
                                <Avatar>
                                    <AvatarImage src={`https://picsum.photos/seed/avatar${user.sponsor.id}/128/128`} alt={user.sponsor.name} data-ai-hint="profile picture" />
                                    <AvatarFallback>{user.sponsor.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-primary group-hover:underline">{user.sponsor.displayName || user.sponsor.name}</p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" /> {user.sponsor.reputation.toFixed(1)} de reputação
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </aside>
        <div className="md:col-span-2 space-y-6">
            <section>
              <Card as="article" aria-labelledby="contribution-heading">
                  <CardHeader>
                      <CardTitle id="contribution-heading" className="text-xl font-headline">Contribuição Comunitária</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-4 rounded-lg bg-muted">
                          <p className="text-2xl font-bold">{user.favorsCompleted}</p>
                          <p className="text-sm text-muted-foreground">Favores Concluídos</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted">
                          <p className="text-2xl font-bold">{user.favorsRequested}</p>
                          <p className="text-sm text-muted-foreground">Favores Pedidos</p>
                      </div>
                  </CardContent>
              </Card>
            </section>
            
            <section>
              <Card as="article" aria-labelledby="requested-favors-heading">
                <CardHeader>
                  <CardTitle id="requested-favors-heading" className="text-xl font-headline">Favores Pedidos ({favorsRequested.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {favorsRequested.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                      {favorsRequested.map(favor => <ProfileFavorItem key={favor.id} favor={favor} />)}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Este usuário ainda não pediu favores.</p>
                  )}
                </CardContent>
              </Card>
            </section>

            <section>
              <Card as="article" aria-labelledby="fulfilled-favors-heading">
                <CardHeader>
                  <CardTitle id="fulfilled-favors-heading" className="text-xl font-headline">Favores Realizados ({favorsFulfilled.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {favorsFulfilled.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                      {favorsFulfilled.map(favor => <ProfileFavorItem key={favor.id} favor={favor} />)}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Este usuário ainda não realizou favores.</p>
                  )}
                </CardContent>
              </Card>
            </section>
        </div>
      </div>
      <AlertDialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Denunciar este perfil</AlertDialogTitle>
            <AlertDialogDescription>
               Por favor, selecione o motivo da denúncia e, se desejar, adicione comentários. Sua denúncia é anônima.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="report-reason" className="text-right">Motivo</Label>
                <Select value={reportReason} onValueChange={(value) => setReportReason(value as ReportReason)}>
                    <SelectTrigger id="report-reason" className="col-span-3">
                        <SelectValue placeholder="Selecione um motivo..." />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(reasonTranslations).map(([key, value]) => (
                            <SelectItem key={key} value={key}>{value}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="report-comments" className="text-right pt-2">
                Comentários
              </Label>
              <Textarea
                id="report-comments"
                value={reportComments}
                onChange={(e) => setReportComments(e.target.value)}
                className="col-span-3"
                placeholder="Ex: Comportamento inadequado, spam, etc. (Opcional)"
                rows={3}
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleReportSubmit} disabled={!reportReason}>Enviar Denúncia</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

    
