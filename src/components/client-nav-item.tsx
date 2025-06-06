
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import type { LucideIcon } from 'lucide-react'; // Keep for reference, though not directly used as prop type now
import type { ReactNode } from 'react';

interface ClientNavItemProps {
  href: string;
  label: string; // Used for tooltip and ARIA attributes
  children: ReactNode; // Expected to be an Icon component instance + a <span> for text
  exact?: boolean;
}

export function ClientNavItem({ href, label, children, exact = false }: ClientNavItemProps) {
  const pathname = usePathname();
  let isActive: boolean;

  if (exact) {
    isActive = pathname === href;
  } else {
    if (href === "/favors") { // Main discover page and individual favor details
      isActive = pathname === "/favors" || (pathname.startsWith("/favors/") && !pathname.startsWith("/favors/my") && !pathname.startsWith("/favors/submit"));
    } else if (href === "/") { // Exact match for root/dashboard
        isActive = pathname === "/";
    }
    else { // General case for other pages like /profile, /favors/my, /favors/submit
      isActive = pathname === href || pathname.startsWith(`${href}/`);
    }
  }
  
  return (
    <Link href={href} passHref legacyBehavior aria-label={label}>
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
