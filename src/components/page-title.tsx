"use client";

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

const routeTitles: { [key: string]: string } = {
  '/inicio': 'Início',
  '/favores': 'Descobrir Favores',
  '/favores/meus': 'Meus Favores',
  '/favores/pedir': 'Pedir um Favor',
  '/perfil': 'Perfil',
  '/admin/painel': 'Painel Administrativo',
  '/admin/usuarios': 'Gerenciar Usuários',
  '/admin/favores': 'Gerenciar Favores',
  '/admin/comunidades': 'Gerenciar Comunidades',
  '/admin/assinaturas': 'Gerenciar Assinaturas',
  '/admin/denuncias': 'Gerenciar Denúncias',
  '/admin/notificacoes': 'Gerenciar Notificações',
};

export function PageTitle() {
  const pathname = usePathname();

  const title = useMemo(() => {
    // Para rotas dinâmicas como /favores/[id]
    if (pathname.startsWith('/favores/')) {
        const parts = pathname.split('/');
        if(parts.length === 3 && parts[2] !== 'meus' && parts[2] !== 'pedir') {
            return 'Detalhes do Favor';
        }
    }
    return routeTitles[pathname] || 'Projeto Favor';
  }, [pathname]);

  return (
    <h1 className="font-semibold text-xl font-headline text-foreground">
      {title}
    </h1>
  );
}
