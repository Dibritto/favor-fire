
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import type { ReactNode } from 'react';
import { useSidebar } from '@/components/ui/sidebar'; // Import useSidebar

interface ClientNavItemProps {
  href: string;
  label: string; 
  children: ReactNode; 
  exact?: boolean;
}

export function ClientNavItem({ href, label, children, exact = false }: ClientNavItemProps) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar(); // Get mobile state and setter
  let isActive: boolean;

  if (exact) {
    isActive = pathname === href;
  } else {
    if (href === "/favors") { 
      isActive = pathname === "/favors" || (pathname.startsWith("/favors/") && !pathname.startsWith("/favors/my") && !pathname.startsWith("/favors/submit"));
    } else if (href === "/") { 
        isActive = pathname === "/";
    }
    else { 
      isActive = pathname === href || pathname.startsWith(`${href}/`);
    }
  }

  const handleClick = () => {
    if (isMobile) {
      setOpenMobile(false); // Close mobile sidebar on click
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

