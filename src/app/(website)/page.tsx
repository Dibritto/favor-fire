
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center flex-1 p-6 text-center">
        <div className="max-w-4xl mx-auto w-full">
            <div className="mb-12 mt-8 text-center">
                <h1 className="text-4xl sm:text-6xl font-headline font-bold text-primary mb-6">
                    Conecte-se, Compartilhe e Ajude
                </h1>
                <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-10">
                    Uma plataforma para vizinhos solicitarem e oferecerem favores, construindo comunidades mais fortes e solidárias.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button asChild size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-primary/30 transition-shadow">
                        <Link href="/auth/signup">Comece a Ajudar</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                        <Link href="/favors">Explorar Favores</Link>
                    </Button>
                </div>
            </div>

            <div className="rounded-xl shadow-2xl overflow-hidden border">
                <Image 
                    src="https://picsum.photos/seed/hero/1200/600"
                    alt="Pessoas da comunidade se ajudando"
                    width={1200}
                    height={600}
                    className="object-cover w-full"
                    data-ai-hint="community helping"
                    priority
                />
            </div>
        </div>
    </main>
  );
}
