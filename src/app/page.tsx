import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6 text-center">
      <Logo size="md" className="mb-8" />
      <Image 
        src="https://picsum.photos/seed/community/500/300"
        alt="Membros da comunidade colaborando e ajudando uns aos outros"
        width={500}
        height={300}
        className="mb-8 rounded-lg shadow-xl object-cover"
        data-ai-hint="community collaboration"
        priority
      />
      <h1 className="text-4xl sm:text-5xl font-headline font-bold text-primary mt-4 mb-6">
        Conecte-se, Compartilhe e Ajude Sua Comunidade
      </h1>
      <p className="text-base text-foreground max-w-xl mx-auto mb-10">
        Conexão Solidária é uma plataforma para vizinhos solicitarem e oferecerem favores, 
        construindo comunidades mais fortes e solidárias. Se você precisa de uma mão ou quer dar uma,
        você está no lugar certo.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/auth/signup">Começar</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
          <Link href="/auth/login">Entrar</Link>
        </Button>
      </div>
      <p className="mt-16 text-xs text-muted-foreground">
        Fomentando a colaboração, um favor de cada vez.
      </p>
    </div>
  );
}
