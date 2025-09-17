
"use client";

import { BookOpen, Users2, ShieldCheck, Phone } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Logo } from './logo';

export function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    // This effect runs only on the client, after hydration
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="mt-auto border-t border-border bg-card text-card-foreground">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-sm text-muted-foreground max-w-xs">
              Uma plataforma para vizinhos solicitarem e oferecerem favores, construindo comunidades mais fortes e solidárias.
            </p>
          </div>
          <nav aria-label="Recursos">
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground text-base flex items-center"><BookOpen className="mr-2 h-5 w-5 text-primary"/>Recursos</h4>
              <Link href="#" className="block hover:text-primary transition-colors text-sm text-muted-foreground">Documentação</Link>
              <Link href="#" className="block hover:text-primary transition-colors text-sm text-muted-foreground">Ajuda & Suporte</Link>
              <Link href="#" className="block hover:text-primary transition-colors text-sm text-muted-foreground">FAQ</Link>
            </div>
          </nav>
          <nav aria-label="Sobre">
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground text-base flex items-center"><Users2 className="mr-2 h-5 w-5 text-primary"/>Sobre</h4>
              <Link href="#" className="block hover:text-primary transition-colors text-sm text-muted-foreground">Sobre Nós</Link>
              <Link href="#" className="block hover:text-primary transition-colors text-sm text-muted-foreground">Dicas da Comunidade</Link>
              <Link href="#" className="block hover:text-primary transition-colors text-sm text-muted-foreground">Informações Adicionais</Link> 
            </div>
          </nav>
          <nav aria-label="Legal">
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground text-base flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-primary"/>Legal</h4>
              <Link href="#" className="block hover:text-primary transition-colors text-sm text-muted-foreground">Política de Privacidade</Link>
              <Link href="#" className="block hover:text-primary transition-colors text-sm text-muted-foreground">Termos de Uso</Link>
            </div>
          </nav>
        </div>
      </div>
      <div className="text-center py-6 border-t border-border/50 bg-muted/50">
        <p className="text-sm text-muted-foreground">
          {currentYear ? `© ${currentYear} Conexão Solidária. Todos os direitos reservados.` : `\u00A0`}
        </p>
      </div>
    </footer>
  );
}
