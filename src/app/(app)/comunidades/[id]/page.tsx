
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { mockCommunities, mockFavors, mockUsers } from '@/lib/mock-data';
import type { Community, Favor, User } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Lock, Users, MessageSquare, Rss, PlusCircle, UserPlus, Star, MoreVertical, ShieldAlert } from 'lucide-react';
import Image from 'next/image';
import { FavorCard } from '@/components/favor-card';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function CommunityDetailPage() {
  const params = useParams();
  const communityId = params.id as string;
  const { toast } = useToast();

  const [community, setCommunity] = useState<Community | null>(null);
  const [favors, setFavors] = useState<Favor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportComments, setReportComments] = useState("");

  useEffect(() => {
    // Simula busca de dados
    const foundCommunity = mockCommunities.find(c => c.id === communityId);
    if (foundCommunity) {
      setCommunity(foundCommunity);
      // Simula a busca de favores da comunidade. Em um app real, isso seria uma query.
      setFavors(mockFavors.filter(f => f.communityId === communityId));
    }
    setIsLoading(false);
  }, [communityId]);
  
  const handleJoinCommunity = () => {
    if(!community) return;
    // Lógica de simulação
     toast({
      title: 'Você entrou na comunidade!',
      description: `Bem-vindo(a) à comunidade ${community.name}.`,
    });
  }

  const handleReportSubmit = () => {
    console.log("Denúncia enviada:", { communityId: community?.id, comments: reportComments });
    toast({
        title: "Denúncia Enviada",
        description: "Agradecemos o seu feedback. Nossa equipe de moderação irá analisar a denúncia.",
    });
    setReportComments("");
    setIsReportDialogOpen(false);
  }

  if (isLoading) {
    return <div className="text-center p-10">Carregando...</div>;
  }

  if (!community) {
    return <div className="text-center p-10">Comunidade não encontrada.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Card as="header" className="shadow-lg overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-accent to-primary/80 relative">
          <Image
            src={`https://picsum.photos/seed/header${community.id}/1200/300`}
            alt={`Banner da comunidade ${community.name}`}
            fill
            className="object-cover"
            priority
            data-ai-hint="community abstract"
          />
        </div>
        <div className="bg-card p-6 space-y-4">
          <div>
            <CardTitle className="text-3xl font-headline">{community.name}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              {community.type === 'public' ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              <span className="capitalize">{community.type === 'public' ? 'Pública' : 'Privada'}</span>
              <span className="mx-1">·</span>
              <Users className="h-4 w-4" />
              <span>{community.memberIds.length} membro(s)</span>
            </CardDescription>
          </div>
          <p className="text-muted-foreground flex-grow">{community.description}</p>
        </div>
        <CardFooter className="p-4 bg-muted/50 border-t flex justify-end gap-2">
            <Button onClick={handleJoinCommunity}><UserPlus className="mr-2 h-4 w-4" /> Entrar na Comunidade</Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Mais opções</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsReportDialogOpen(true)} className="text-destructive">
                        <ShieldAlert className="mr-2 h-4 w-4" />
                        Denunciar Comunidade
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </CardFooter>
      </Card>

      <main>
        <Tabs defaultValue="favors" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 mx-auto">
            <TabsTrigger value="favors">
              <MessageSquare className="mr-2 h-4 w-4"/> Favores da Comunidade
            </TabsTrigger>
            <TabsTrigger value="members">
              <Users className="mr-2 h-4 w-4"/> Membros
            </TabsTrigger>
          </TabsList>
          <TabsContent value="favors" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-headline">Favores Ativos</h2>
              <Button variant="outline" asChild>
                <Link href={`/favores/pedir?communityId=${community.id}`}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Pedir Favor na Comunidade
                </Link>
              </Button>
            </div>
            {favors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favors.map(favor => <FavorCard key={favor.id} favor={favor} />)}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <Rss className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-xl font-semibold">Nenhum favor por aqui ainda.</h3>
                <p className="mt-2 text-muted-foreground">Seja o primeiro a pedir algo nesta comunidade!</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="members" className="mt-6">
             <h2 className="text-2xl font-headline mb-6">Membros da Comunidade</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {community.members?.map(member => (
                    <Card key={member.id} className="flex items-center p-4 gap-4">
                      <Link href={`/perfil/${member.id}`} className="flex items-center gap-4 w-full">
                        <Avatar className="h-12 w-12">
                             <AvatarImage src={`https://picsum.photos/seed/avatar${member.id}/128/128`} alt={member.name} data-ai-hint="profile picture" />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold hover:underline">{member.displayName || member.name}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" /> {member.reputation.toFixed(1)} de reputação
                            </p>
                        </div>
                      </Link>
                    </Card>
                ))}
             </div>
          </TabsContent>
        </Tabs>
      </main>

       <AlertDialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Denunciar esta comunidade</AlertDialogTitle>
            <AlertDialogDescription>
              Por favor, descreva por que você está denunciando esta comunidade. Sua denúncia é anônima.
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
                placeholder="Ex: Conteúdo inadequado, spam, etc."
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleReportSubmit} disabled={!reportComments.trim()}>Enviar Denúncia</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
