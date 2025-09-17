
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6">
        <section className="text-center py-20 lg:py-32">
            <h1 className="text-4xl sm:text-6xl font-headline font-bold text-primary mb-6 leading-tight">
                Conecte-se, Compartilhe e Ajude
            </h1>
            <p className="text-lg text-foreground/80 max-w-3xl mx-auto mb-10">
                Projeto Favor é a sua plataforma comunitária para solicitar e oferecer ajuda, construindo laços mais fortes na sua vizinhança. Se precisa de uma mão ou quer estender a sua, este é o lugar.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-primary/30 transition-shadow">
                    <Link href="/auth/cadastrar">Comece Agora</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                    <Link href="/favores">Explorar Favores</Link>
                </Button>
            </div>
        </section>

        <section className="pb-20 lg:pb-32">
            <div className="relative rounded-xl shadow-2xl overflow-hidden border-4 border-card aspect-video">
                <Image 
                    src="https://picsum.photos/seed/community/1200/675"
                    alt="Pessoas da comunidade se ajudando em diversas atividades"
                    fill
                    className="object-cover"
                    data-ai-hint="community helping together"
                    priority
                />
            </div>
        </section>
    </div>
  );
}

    