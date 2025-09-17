
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mockFavors, mockUsers } from '@/lib/mock-data';
import type { Favor, User, UrgencyLevel, FavorStatus, FavorParticipationType } from '@/types';
import { getCurrentUser } from '@/lib/auth'; // Mock auth
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, CalendarDays, Check, CheckCircle, DollarSign, Handshake, HelpingHand, Loader2, MapPin, MessageSquare, MoreVertical, ShieldAlert, Sparkles, Star, User as UserIcon, Users, X } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { RatingForm } from '@/components/rating-form';
import Image from 'next/image';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const urgencyTranslations: Record<UrgencyLevel, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
};

const statusTranslations: Record<FavorStatus, string> = {
  open: 'Aberto',
  accepted: 'Aceito',
  completed: 'Concluído',
  cancelled: 'Cancelado',
};

const participationTranslations: Record<FavorParticipationType, string> = {
  individual: 'Individual',
  collective: 'Coletivo',
};


export default function FavorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const favorId = params.id as string;

  const [favor, setFavor] = useState<Favor | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportComments, setReportComments] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const user = await getCurrentUser();
      setCurrentUser(user);
      
      const foundFavor = mockFavors.find(f => f.id === favorId);
      if (foundFavor) {
        setFavor({
          ...foundFavor,
          requester: mockUsers.find(u => u.id === foundFavor.requesterId),
          executor: foundFavor.executorId ? mockUsers.find(u => u.id === foundFavor.executorId) : null,
        });
      }
      setIsLoading(false);
    };
    fetchData();
  }, [favorId]);

  const handleAcceptFavor = async () => {
    if (!favor || !currentUser || favor.status !== 'open') return;
    setIsActionLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setFavor(prev => prev ? { ...prev, status: 'accepted', executorId: currentUser.id, executor: currentUser } : null);
    toast({ title: "Favor Aceito!", description: "Você concordou em ajudar. Contate o solicitante para coordenar." });
    setIsActionLoading(false);
  };

  const handleMarkAsComplete = async () => {
    if (!favor || (favor.status !== 'accepted' && favor.status !== 'open')) return;
    setIsActionLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setFavor(prev => prev ? { ...prev, status: 'completed', completedAt: new Date().toISOString() } : null);
    toast({ title: "Favor Concluído!", description: "Ótimo trabalho! Agora você pode avaliar a interação." });
    setIsActionLoading(false);
  };
  
  const handleCancelFavor = async () => {
    if (!favor || favor.status === 'completed' || favor.status === 'cancelled') return;
    setIsActionLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setFavor(prev => prev ? { ...prev, status: 'cancelled' } : null);
    toast({ title: "Favor Cancelado", description: "O pedido de favor foi cancelado.", variant: "destructive" });
    setIsActionLoading(false);
  };

  const submitRating = async (forUserType: 'requester' | 'executor', ratingData: { rating: number, feedback?: string }) => {
    if(!favor) return;
    console.log(`Rating for ${forUserType}:`, ratingData, "Favor ID:", favor.id);
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (forUserType === 'requester') {
      setFavor(prev => prev ? {...prev, requesterRating: ratingData.rating, requesterFeedback: ratingData.feedback} : null);
    } else {
      setFavor(prev => prev ? {...prev, executorRating: ratingData.rating, executorFeedback: ratingData.feedback} : null);
    }
  }

  const handleReportSubmit = () => {
    console.log("Denúncia enviada:", { favorId: favor?.id, comments: reportComments });
    toast({
        title: "Denúncia Enviada",
        description: "Agradecemos o seu feedback. Nossa equipe de moderação irá analisar a denúncia.",
    });
    setReportComments("");
    setIsReportDialogOpen(false);
  }


  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /> <span className="ml-2">Carregando detalhes do favor...</span></div>;
  }

  if (!favor) {
    return <div className="text-center py-10"><AlertTriangle className="mx-auto h-12 w-12 text-destructive" /><h1 className="mt-4 text-2xl font-bold">Favor Não Encontrado</h1><p className="text-muted-foreground">O favor que você está procurando não existe ou foi removido.</p><Button asChild className="mt-6"><Link href="/favores">Voltar para Descobrir</Link></Button></div>;
  }

  const isRequester = currentUser?.id === favor.requesterId;
  const isExecutor = currentUser?.id === favor.executorId;
  const canAccept = favor.status === 'open' && currentUser && !isRequester;
  const canComplete = favor.status === 'accepted' && currentUser && (isRequester || isExecutor);
  const canCancel = (favor.status === 'open' || favor.status === 'accepted') && currentUser && isRequester;


  const getUrgencyStyles = (urgency: Favor['urgency']) => {
    switch (urgency) {
      case 'high': return "border-red-500 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700";
      case 'medium': return "border-yellow-500 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700";
      case 'low': return "border-green-500 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700";
      default: return "";
    }
  };
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

  const canRateRequester = favor.status === 'completed' && isExecutor && !favor.requesterRating;
  const canRateExecutor = favor.status === 'completed' && isRequester && !favor.executorRating;

  const participationStyle = "border-indigo-500 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700";

  return (
    <article className="max-w-3xl mx-auto space-y-6 pb-12">
      <Card className="shadow-lg">
        <CardHeader>
           <div className="flex justify-end gap-2">
             <Badge variant={favor.type === 'paid' ? 'default' : 'secondary'} className="capitalize shrink-0 text-sm px-3 py-1">
                {favor.type === 'paid' ? <DollarSign className="mr-1.5 h-4 w-4" /> : <Sparkles className="mr-1.5 h-4 w-4" />}
                {favor.type === 'paid' ? 'Pago' : 'Voluntário'} {favor.type === 'paid' && favor.amount ? ` (R$${favor.amount})` : ''}
            </Badge>
             <Badge variant="outline" className={`capitalize text-xs px-1.5 py-0 ${getStatusStyles(favor.status)}`}>
                <CheckCircle className="h-2.5 w-2.5 mr-1" /> {statusTranslations[favor.status]}
            </Badge>
          </div>
          <div className="flex justify-between items-start gap-4">
              <CardTitle className="text-2xl sm:text-3xl font-headline line-clamp-2 flex-1 pt-2">{favor.title}</CardTitle>
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Mais opções</span>
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setIsReportDialogOpen(true)} className="text-destructive">
                          <ShieldAlert className="mr-2 h-4 w-4" />
                          Denunciar Favor
                      </DropdownMenuItem>
                  </DropdownMenuContent>
              </DropdownMenu>
          </div>
          <CardDescription className="text-sm text-muted-foreground pt-1">
            Publicado em {format(new Date(favor.createdAt), "P", { locale: ptBR })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground text-base leading-relaxed">{favor.description}</p>
          
          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
                <h3 className="font-semibold mb-2 text-primary">Detalhes:</h3>
                <div className="space-y-3">
                    <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-1 shrink-0" /> 
                        <div>
                            <strong className="text-foreground">Localização:</strong>
                            <p className="text-muted-foreground break-words">{favor.location}</p>
                        </div>
                    </div>
                    {favor.preferredDateTime && (
                        <div className="flex items-start gap-2">
                            <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground mt-1 shrink-0" />
                             <div>
                                <strong className="text-foreground">Preferência de Data:</strong>
                                <p className="text-muted-foreground">{format(new Date(favor.preferredDateTime), "Pp", { locale: ptBR })}</p>
                             </div>
                        </div>
                    )}
                     <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
                        <strong className="text-foreground">Urgência:</strong>
                        <Badge variant="outline" className={`capitalize ${getUrgencyStyles(favor.urgency)}`}>
                            {urgencyTranslations[favor.urgency]}
                        </Badge>
                    </div>
                     <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
                        <strong className="text-foreground">Participação:</strong>
                        <Badge variant="outline" className={`capitalize ${participationStyle}`}>
                           {favor.participationType === 'collective' ? <Users className="h-3 w-3 mr-1" /> : <UserIcon className="h-3 w-3 mr-1" />}
                           {participationTranslations[favor.participationType]} {favor.numberOfPeople ? `(${favor.numberOfPeople})` : ''}
                        </Badge>
                    </div>
                </div>
            </div>
            <div>
                <h3 className="font-semibold mb-2 text-primary">Participantes:</h3>
                {favor.requester && (
                  <Link href={`/perfil/${favor.requester.id}`} className="flex items-center space-x-3 mb-2 group">
                        <Avatar>
                            <AvatarImage src={`https://picsum.photos/seed/avatar${favor.requester.id}/40/40`} data-ai-hint="avatar person" alt={favor.requester.name} />
                            <AvatarFallback>{favor.requester.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium group-hover:underline">{favor.requester.name} (Solicitante)</p>
                            <p className="text-xs text-muted-foreground">Reputação: {favor.requester.reputation.toFixed(1)} <Star className="inline h-3 w-3 text-yellow-400 fill-yellow-400" /></p>
                        </div>
                   </Link>
                )}
                {favor.executor && (
                   <Link href={`/perfil/${favor.executor.id}`} className="flex items-center space-x-3 group">
                        <Avatar>
                            <AvatarImage src={`https://picsum.photos/seed/avatar${favor.executor.id}/40/40`} data-ai-hint="avatar person" alt={favor.executor.name} />
                            <AvatarFallback>{favor.executor.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium group-hover:underline">{favor.executor.name} (Ajudante)</p>
                            <p className="text-xs text-muted-foreground">Reputação: {favor.executor.reputation.toFixed(1)} <Star className="inline h-3 w-3 text-yellow-400 fill-yellow-400" /></p>
                        </div>
                   </Link>
                )}
                 {!favor.executor && favor.status === 'open' && (
                    <p className="text-sm text-muted-foreground italic">Aguardando um ajudante...</p>
                 )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2 pt-4">
          {canAccept && (
            <Button onClick={handleAcceptFavor} disabled={isActionLoading} className="w-full sm:w-auto">
              {isActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Handshake className="mr-2 h-4 w-4" />} Aceitar Favor
            </Button>
          )}
          {canComplete && (
            <Button onClick={handleMarkAsComplete} disabled={isActionLoading} className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
              {isActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />} Marcar como Concluído
            </Button>
          )}
           {canCancel && (
            <Button onClick={handleCancelFavor} variant="destructive" disabled={isActionLoading} className="w-full sm:w-auto">
              {isActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />} Cancelar Favor
            </Button>
          )}
          {favor.status !== 'cancelled' && <Button variant="outline" className="w-full sm:w-auto"><MessageSquare className="mr-2 h-4 w-4" /> Chat (Em Breve)</Button>}
        </CardFooter>
      </Card>

      {favor.status === 'completed' && (isRequester || isExecutor) && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-headline">Avalie Sua Experiência</CardTitle>
            <CardDescription>Ajude a construir uma comunidade confiável fornecendo feedback.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {canRateExecutor && (
              <div>
                <h3 className="font-semibold mb-2">Avalie {favor.executor?.name || 'o Ajudante'}:</h3>
                <RatingForm favorId={favor.id} onRatedUserType="executor" onSubmitRating={(data) => submitRating('executor', data)} isSubmitting={isActionLoading} />
              </div>
            )}
            {canRateRequester && (
              <div>
                <h3 className="font-semibold mb-2">Avalie {favor.requester?.name || 'o Solicitante'}:</h3>
                <RatingForm favorId={favor.id} onRatedUserType="requester" onSubmitRating={(data) => submitRating('requester', data)} isSubmitting={isActionLoading} />
              </div>
            )}
            {favor.executorRating && isRequester && <p className="text-sm text-muted-foreground">Você avaliou o ajudante: {favor.executorRating}/5 estrelas.</p>}
            {favor.requesterRating && isExecutor && <p className="text-sm text-muted-foreground">Você avaliou o solicitante: {favor.requesterRating}/5 estrelas.</p>}

            {favor.status === 'completed' && !canRateExecutor && !canRateRequester && (isRequester || isExecutor) &&
              <p className="text-sm text-green-600 text-center">Obrigado pelo seu feedback!</p>
            }
          </CardContent>
        </Card>
      )}

      <AlertDialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Denunciar este favor</AlertDialogTitle>
            <AlertDialogDescription>
              Por favor, descreva por que você está denunciando este favor. Sua denúncia é anônima.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="report-comments" className="text-right">
                Motivo
              </Label>
              <Textarea
                id="report-comments"
                value={reportComments}
                onChange={(e) => setReportComments(e.target.value)}
                className="col-span-3"
                placeholder="Ex: É spam, conteúdo inadequado, etc."
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleReportSubmit} disabled={!reportComments.trim()}>Enviar Denúncia</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </article>
  );
}
