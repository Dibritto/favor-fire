import { Handshake } from 'lucide-react';

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "md", className }: LogoProps) {
  const iconSizeClass = size === "sm" ? "h-5 w-5" : size === "md" ? "h-6 w-6" : "h-8 w-8";
  const textSizeClass = size === "sm" ? "text-xl" : size === "md" ? "text-2xl" : "text-3xl";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Handshake className={`text-primary ${iconSizeClass}`} />
      <span className={`font-headline font-bold ${textSizeClass}`}>Conexão Solidária</span>
    </div>
  );
}
