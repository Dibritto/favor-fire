"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import type { ReactNode } from 'react';
import { useSidebar } from '@/components/ui/sidebar';

interface ClientNavItemProps {
  href: string;
  label: string; 
  children: ReactNode; 
  exact?: boolean;
}

export function ClientNavItem({ href, label, children, exact = false }: ClientNavItemProps) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  let isActive: boolean;

  if (exact) {
    isActive = pathname === href;
  } else {
    // Lógica para destacar o item de menu pai
    // Ex: /favores/meus deve ativar o link /favores
    isActive = pathname.startsWith(href);
  }
  
  // Casos especiais para não ativar múltiplos itens
  if (href === "/favores" && (pathname.startsWith("/favores/meus") || pathname.startsWith("/favores/pedir"))) {
      isActive = false;
  }
  if(href === "/inicio" && pathname !== "/inicio") {
      isActive = false;
  }


  const handleClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };
  
  return (
    <Link href={href} passHref legacyBehavior aria-label={label} onClick={handleClick}>
      <SidebarMenuButton 
        asChild 
        isActive={isActive} 
        tooltip={{ children: label, side: 'right', className: 'font-body' }} 
        className="w-full justify-start"
      >
        <a> 
          {children}
        </a>
      </SidebarMenuButton>
    </Link>
  );
}
