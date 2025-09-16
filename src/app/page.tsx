
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6">
      <div className="w-full max-w-lg bg-card p-6 sm:p-10 rounded-2xl shadow-xl text-center">
        
        <div className="mb-8 overflow-hidden rounded-lg shadow-lg">
           <Image 
            src="https://picsum.photos/seed/musiclover/600/400"
            alt="Mulher sorrindo enquanto toca uma guitarra em uma loja de música."
            width={600}
            height={400}
            className="w-full h-auto object-cover"
            data-ai-hint="woman guitar"
            priority
          />
        </div>

        <p className="mb-3 text-sm text-muted-foreground">
          Fomentando a colaboração, um favor de cada vez.
        </p>

        <h1 className="text-4xl sm:text-5xl font-headline font-bold text-primary mb-6 leading-tight">
          Conecte-se, Compartilhe e Ajude Sua Comunidade
        </h1>

        <p className="text-base text-foreground max-w-md mx-auto mb-10">
          Conexão Solidária é uma plataforma para vizinhos solicitarem e oferecerem favores, 
          construindo comunidades mais fortes e solidárias. Se você precisa de uma mão ou quer dar uma,
          você está no lugar certo.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/auth/signup">Começar</Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="w-full sm:w-auto text-primary">
            <Link href="/auth/login">Entrar</Link>
          </Button>
        </div>

      </div>
    </div>
  );
}
