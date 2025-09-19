
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Handshake, Heart, MessageSquarePlus, Star, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-background via-blue-50/50 to-primary/10 dark:from-background dark:via-blue-950/20 dark:to-primary/10 py-20 md:py-32 text-center">
          <div className="container px-4 md:px-6">
            <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight text-foreground">
              Conecte-se, Compartilhe e Ajude
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
              Sua comunidade a um favor de distância. Peça ajuda, ofereça suas habilidades e construa laços mais fortes com seus vizinhos.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/auth/cadastrar">
                  Comece Agora <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#recursos">
                  Saiba Mais
                </Link>
              </Button>
            </div>
            <div className="mt-12 flex justify-center items-center">
                <div className="flex -space-x-2">
                    <Avatar className="h-10 w-10 border-2 border-background">
                        <AvatarImage src="https://picsum.photos/seed/user1/64" alt="Usuário 1" data-ai-hint="person face" />
                        <AvatarFallback>U1</AvatarFallback>
                    </Avatar>
                     <Avatar className="h-10 w-10 border-2 border-background">
                        <AvatarImage src="https://picsum.photos/seed/user2/64" alt="Usuário 2" data-ai-hint="person face" />
                        <AvatarFallback>U2</AvatarFallback>
                    </Avatar>
                     <Avatar className="h-10 w-10 border-2 border-background">
                        <AvatarImage src="https://picsum.photos/seed/user3/64" alt="Usuário 3" data-ai-hint="person face" />
                        <AvatarFallback>U3</AvatarFallback>
                    </Avatar>
                </div>
                <p className="ml-3 text-sm text-muted-foreground font-medium">Junte-se a centenas de membros da comunidade!</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="recursos" className="py-24 bg-background">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold text-foreground">Como Funciona?</h2>
              <p className="mt-3 max-w-xl mx-auto text-muted-foreground">
                A ajuda mútua nunca foi tão fácil. Veja como você pode participar.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center shadow-md hover:shadow-xl transition-shadow">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                        <MessageSquarePlus className="h-8 w-8 text-primary" />
                    </div>
                  <CardTitle className="font-headline mt-4">Peça um Favor</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Precisa de ajuda com jardinagem, uma carona ou um conselho? Crie um pedido e deixe a comunidade saber.</p>
                </CardContent>
              </Card>
              <Card className="text-center shadow-md hover:shadow-xl transition-shadow">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                        <Handshake className="h-8 w-8 text-primary" />
                    </div>
                  <CardTitle className="font-headline mt-4">Ofereça Ajuda</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Explore os pedidos e ofereça suas habilidades, tempo ou recursos para ajudar um vizinho.</p>
                </CardContent>
              </Card>
              <Card className="text-center shadow-md hover:shadow-xl transition-shadow">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                        <Users className="h-8 w-8 text-primary" />
                    </div>
                  <CardTitle className="font-headline mt-4">Conecte-se</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Construa sua reputação, conheça pessoas e fortaleça os laços na sua comunidade local.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-muted/50">
             <div className="container px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-headline font-bold text-foreground">Amado pela nossa comunidade</h2>
                    <p className="mt-3 max-w-xl mx-auto text-muted-foreground">
                        Veja o que nossos membros estão dizendo sobre a plataforma.
                    </p>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <Card className="bg-card">
                        <CardContent className="pt-6">
                            <div className="flex mb-2">
                                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                            </div>
                            <p className="text-foreground italic mb-4">"O Projeto Favor mudou a forma como eu interajo com meus vizinhos. Consegui ajuda para minha mudança e fiz novos amigos!"</p>
                             <div className="flex items-center">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src="https://picsum.photos/seed/test1/64" alt="Alice W." data-ai-hint="person face" />
                                    <AvatarFallback>AW</AvatarFallback>
                                </Avatar>
                                <div className="ml-4">
                                    <p className="font-semibold text-foreground">Alice W.</p>
                                    <p className="text-sm text-muted-foreground">Membro desde 2023</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                     <Card className="bg-card">
                        <CardContent className="pt-6">
                            <div className="flex mb-2">
                                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                            </div>
                            <p className="text-foreground italic mb-4">"É incrível poder ajudar e ser ajudado de forma tão simples. A plataforma é segura e muito fácil de usar. Recomendo a todos!"</p>
                            <div className="flex items-center">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src="https://picsum.photos/seed/test2/64" alt="Bob" data-ai-hint="person face" />
                                    <AvatarFallback>B</AvatarFallback>
                                </Avatar>
                                <div className="ml-4">
                                    <p className="font-semibold text-foreground">Bob</p>
                                    <p className="text-sm text-muted-foreground">Membro desde 2022</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>


        {/* Final CTA Section */}
        <section className="py-24 bg-background">
          <div className="container px-4 md:px-6 text-center">
             <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-foreground">
                    Pronto para fazer parte?
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    Cadastre-se gratuitamente e comece a transformar sua comunidade hoje mesmo. A próxima boa ação está a um clique de distância.
                </p>
                <div className="mt-8">
                <Button asChild size="lg">
                    <Link href="/auth/cadastrar">
                    Junte-se à Comunidade <Heart className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
                </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
