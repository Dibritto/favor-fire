
import type { Community } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, Globe } from 'lucide-react';
import Image from 'next/image';

interface CommunityCardProps {
  community: Community;
}

export function CommunityCard({ community }: CommunityCardProps) {
  return (
    <Card as="article" className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden">
        <div className="relative h-32 w-full">
            <Image
                src={`https://picsum.photos/seed/comm${community.id}/400/200`}
                alt={`Imagem da comunidade ${community.name}`}
                fill
                className="object-cover"
                data-ai-hint="comunidade abstrato"
            />
        </div>
      <CardHeader className="pt-4 pb-3">
        <CardTitle className="font-headline text-lg md:text-xl line-clamp-2">{community.name}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground flex items-center">
          <Globe className="h-3 w-3 mr-1.5" />
          Comunidade Pública
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pt-0 pb-4">
        <p className="text-sm text-foreground mb-3 line-clamp-3">{community.description}</p>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="h-4 w-4 mr-2 text-primary" />
          <span>{community.memberIds.length} membro(s)</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild className="w-full">
          <Link href={`/comunidades/${community.id}`}>Ver Detalhes</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
