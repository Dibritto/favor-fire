
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Heart, Handshake, Users, MessageSquarePlus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { HeroSlider } from '@/components/hero-slider';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Slider Section */}
        <HeroSlider />

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
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <Card className="bg-card">
                        <CardContent className="pt-6">
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
                            <p className="text-foreground italic mb-4">"É incrível poder ajudar e ser ajudado de forma tão simples. A plataforma é segura e muito fácil de usar. Recomendo a todos!"</p>
                            <div className="flex items-center">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src="https://picsum.photos/seed/test2/64" alt="Bob" data-ai-hint="person face" />
                                    <AvatarFallback>B</AvatarFallback>
                                </Avatar>
                                <div className="ml-4">
                                    <p className="font-semibold text-foreground">Bob M.</p>
                                    <p className="text-sm text-muted-foreground">Membro desde 2022</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                     <Card className="bg-card">
                        <CardContent className="pt-6">
                            <p className="text-foreground italic mb-4">"Encontrei uma pessoa para me ajudar a montar meus móveis em menos de um dia. Economia de tempo e dinheiro. Fantástico!"</p>
                            <div className="flex items-center">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src="https://picsum.photos/seed/test3/64" alt="Charlie" data-ai-hint="person face" />
                                    <AvatarFallback>C</AvatarFallback>
                                </Avatar>
                                <div className="ml-4">
                                    <p className="font-semibold text-foreground">Charlie S.</p>
                                    <p className="text-sm text-muted-foreground">Membro desde 2024</p>
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
