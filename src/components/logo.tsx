import Image from 'next/image';
import { cn } from '@/lib/utils';
import logo from '@/app/favor.png';

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "md", className }: LogoProps) {
  const sizeStyles = {
    sm: 'h-6 w-auto',
    md: 'h-8 w-auto',
    lg: 'h-10 w-auto',
  };

  return (
    <Image
      src={logo}
      alt="Projeto Favor Logo"
      className={cn(
        "object-contain",
        sizeStyles[size],
        className
      )}
      priority
    />
  );
}
