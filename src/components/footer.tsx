
"use client";

import { BookOpen, Users2, ShieldCheck, Phone } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="mt-auto pt-10 border-t border-border bg-card text-sm text-muted-foreground">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8 px-4">
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground text-base flex items-center"><BookOpen className="mr-2 h-5 w-5 text-primary"/>Recursos</h4>
          <Link href="#" className="block hover:text-primary transition-colors">Documentação</Link>
          <Link href="#" className="block hover:text-primary transition-colors">Ajuda & Suporte</Link>
          <Link href="#" className="block hover:text-primary transition-colors">FAQ</Link>
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground text-base flex items-center"><Users2 className="mr-2 h-5 w-5 text-primary"/>Sobre</h4>
          <Link href="#" className="block hover:text-primary transition-colors">Sobre Nós</Link>
          <Link href="#" className="block hover:text-primary transition-colors">Dicas da Comunidade</Link>
          <Link href="#" className="block hover:text-primary transition-colors">Informações Adicionais</Link> 
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground text-base flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-primary"/>Legal</h4>
          <Link href="#" className="block hover:text-primary transition-colors">Política de Privacidade</Link>
          <Link href="#" className="block hover:text-primary transition-colors">Termos de Uso</Link>
        </div>
         <div className="space-y-3">
          <h4 className="font-semibold text-foreground text-base flex items-center"><Phone className="mr-2 h-5 w-5 text-primary"/>Conecte-se</h4>
          <Link href="#" className="block hover:text-primary transition-colors">Contate-nos</Link>
        </div>
      </div>
      <div className="text-center py-6 border-t border-border/50">
        <p>
          &copy; {currentYear || new Date().getFullYear()} Favor. Todos os direitos reservados.
        </p>
        <p className="text-xs mt-1">
          Construindo comunidades mais fortes, um favor de cada vez.
        </p>
      </div>
    </footer>
  );
}
