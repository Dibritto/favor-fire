import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/footer';
import Link from 'next/link';

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/">
            <Logo size="md" />
          </Link>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/auth/entrar">Entrar</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/cadastrar">Começar</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
