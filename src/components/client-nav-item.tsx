"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface ClientNavItemProps {
  href: string;
  icon: LucideIcon;
  children: ReactNode;
  exact?: boolean;
}

export function ClientNavItem({ href, icon: Icon, children, exact = false }: ClientNavItemProps) {
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
    <Link href={href} passHref legacyBehavior>
      <SidebarMenuButton asChild isActive={isActive} tooltip={{ children: children, side: 'right', className: 'font-body' }} className="w-full justify-start">
        <a> {/* This 'a' tag is crucial when SidebarMenuButton has asChild */}
          <Icon className="mr-2" /> {/* Ensure icon is direct child */}
          <span>{children}</span> {/* Ensure span is direct child */}
        </a>
      </SidebarMenuButton>
    </Link>
  );
}
