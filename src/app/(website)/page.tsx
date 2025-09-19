
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 sm:p-8 flex items-center justify-center min-h-screen font-body">
      <main className="w-full max-w-5xl bg-card text-card-foreground rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Seção Superior (Hero) */}
        <section className="relative min-h-[500px] md:min-h-full hero-banner-clipped">
          <Image
            src="https://picsum.photos/seed/hero-favor/800/1200"
            alt="Pessoas da comunidade colaborando e se ajudando"
            fill
            className="object-cover"
            data-ai-hint="community helping together"
            priority
          />
          <div className="absolute inset-0 bg-pink-600/30 dark:bg-purple-600/30 mix-blend-multiply"></div>
          <div className="absolute inset-0 p-8 sm:p-12 flex items-center justify-center md:justify-start">
            <h1 className="text-5xl md:text-6xl font-headline font-bold text-white text-center md:text-left">
              Conecte-se,<br />
              Compartilhe<br />
              e Ajude.
            </h1>
          </div>
        </section>

        {/* Seção Inferior (Conteúdo) */}
        <section className="p-8 sm:p-12 space-y-10 flex flex-col">
          <div className="flex-grow space-y-10">
            {/* Bloco de Guias */}
            <div>
              <h2 className="text-xl font-bold uppercase text-foreground">NOSSOS GUIAS ESTARÃO COM VOCÊ</h2>
              <p className="mt-2 text-muted-foreground">Junte-se a uma comunidade de apoio onde a ajuda está sempre ao seu alcance.</p>
              <div className="flex -space-x-2 mt-4">
                <Avatar className="h-10 w-10 border-2 border-card">
                  <AvatarImage src="https://picsum.photos/seed/guide1/64" alt="Guia 1" data-ai-hint="person face" />
                  <AvatarFallback>G1</AvatarFallback>
                </Avatar>
                <Avatar className="h-10 w-10 border-2 border-card">
                  <AvatarImage src="https://picsum.photos/seed/guide2/64" alt="Guia 2" data-ai-hint="person face" />
                  <AvatarFallback>G2</AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Galeria de Imagens */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group">
              <Image
                src="https://picsum.photos/seed/gallery-favor/400/300"
                alt="Membros da comunidade interagindo"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                data-ai-hint="community interaction"
              />
              <div className="absolute top-4 right-4 bg-black/70 text-white rounded-full p-2 group-hover:bg-primary transition-colors">
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Bloco de Ação */}
          <div className="text-center md:text-right">
            <h3 className="text-2xl md:text-3xl font-bold uppercase text-foreground">
              Comece<br/>Sua<br/>Jornada
            </h3>
            <Button variant="outline" className="mt-4 border-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-300" asChild>
              <Link href="/auth/cadastrar">
                Descubra a Comunidade
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
