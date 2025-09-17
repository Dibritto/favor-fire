import { cn } from '@/lib/utils';

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "md", className }: LogoProps) {
  const sizeStyles = {
    sm: 'h-6', // Adjust height as needed
    md: 'h-8', // Adjust height as needed
    lg: 'h-10', // Adjust height as needed
  };

  return (
    <img
      src="https://i.ibb.co/VvZVj2S/favor-logo-1.png"
      alt="Projeto Favor Logo"
      className={cn(
        "object-contain",
        sizeStyles[size],
        className
      )}
    />
  );
}
