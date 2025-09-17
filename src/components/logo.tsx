interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "md", className }: LogoProps) {
  const iconSizeClass = size === "sm" ? "h-5 w-5" : size === "md" ? "h-6 w-6" : "h-8 w-8";
  const textSizeClass = size === "sm" ? "text-xl" : size === "md" ? "text-2xl" : "text-3xl";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`text-primary ${iconSizeClass}`}
      >
        <path d="M5 20c0-3.5 3-6.5 7-6.5s7 3 7 6.5"/>
        <path d="M12 14V8"/>
        <path d="M9 10l3-3 3 3"/>
      </svg>
      <span className={`font-headline font-bold ${textSizeClass}`}>Conexão Solidária</span>
    </div>
  );
}
