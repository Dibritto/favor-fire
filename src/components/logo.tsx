
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "md", className }: LogoProps) {
  const width = size === "sm" ? 100 : size === "md" ? 120 : 150;
  const height = size === "sm" ? 25 : size === "md" ? 30 : 38;

  return (
      <Image
        src="https://i.ibb.co/VvZVj2S/favor-logo-1.png"
        alt="Projeto Favor Logo"
        width={width}
        height={height}
        className={cn(className)}
        style={{ objectFit: 'contain' }}
        priority
      />
  );
}
