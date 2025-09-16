import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-blue-50 p-6 text-center">
      <div className="absolute top-8">
        <Logo size="md" />
      </div>
      <div className="flex flex-col items-center">
        <Image 
          src="https://picsum.photos/seed/desolate/600/400"
          alt="Paisagem desolada ao amanhecer representando a necessidade de ajuda comunitária"
          width={600}
          height={400}
          className="mb-8 rounded-lg shadow-xl object-cover"
          data-ai-hint="desolate landscape"
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
          <Button asChild size="lg" variant="ghost" className="w-full sm:w-auto">
            <Link href="/auth/login">Entrar</Link>
          </Button>
        </div>
      </div>
      <p className="absolute bottom-8 text-xs text-muted-foreground">
        Fomentando a colaboração, um favor de cada vez.
      </p>
    </div>
  );
}
