import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6 text-center">
      <Logo size="lg" className="mb-8" />
      <Image 
        src="https://placehold.co/500x300.png" 
        alt="Community members collaborating and helping each other"
        width={500}
        height={300}
        className="mb-8 rounded-lg shadow-xl object-cover"
        data-ai-hint="community collaboration"
        priority
      />
      <h1 className="text-4xl sm:text-5xl font-headline font-bold text-primary mt-4 mb-6">
        Connect, Share, and Help Your Community
      </h1>
      <p className="text-lg text-foreground max-w-2xl mx-auto mb-10">
        Kindred Connect is a platform for neighbors to request and offer favors, 
        building stronger, more supportive communities. Whether you need a hand or want to lend one,
        you&apos;re in the right place.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/auth/signup">Get Started</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
          <Link href="/auth/login">Login</Link>
        </Button>
      </div>
      <p className="mt-16 text-sm text-muted-foreground">
        Fostering collaboration, one favor at a time.
      </p>
    </div>
  );
}
