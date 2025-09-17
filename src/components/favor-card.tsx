import type { Favor, UrgencyLevel, FavorStatus } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MapPin, Clock, DollarSign, Sparkles, AlertTriangle, Users, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FavorCardProps {
  favor: Favor;
}

const urgencyTranslations: Record<UrgencyLevel, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
};

const statusTranslations: Record<FavorStatus, string> = {
  open: 'Aberto',
  accepted: 'Aceito',
  completed: 'Concluído',
  cancelled: 'Cancelado',
};

export function FavorCard({ favor }: FavorCardProps) {
  const getUrgencyStyles = (urgency: Favor['urgency']) => {
    switch (urgency) {
      case 'high':
        return "border-red-500 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700";
      case 'medium':
        return "border-yellow-500 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700";
      case 'low':
        return "border-green-500 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700";
      default:
        return "border-gray-500 bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-700";
    }
  };

  const getStatusStyles = (status: Favor['status']) => {
    switch (status) {
      case 'open':
        return "border-blue-500 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700";
      case 'accepted':
        return "border-purple-500 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700";
      case 'completed':
        return "border-teal-500 bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700";
      case 'cancelled':
        return "border-gray-500 bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-700";
      default:
        return "";
    }
  }

  return (
    <Card as="article" className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
            <CardTitle className="font-headline text-lg md:text-xl line-clamp-2">{favor.title}</CardTitle>
            <Badge variant={favor.type === 'paid' ? 'default' : 'secondary'} className="capitalize shrink-0 ml-2">
                {favor.type === 'paid' ? <DollarSign className="mr-1 h-3 w-3" /> : <Sparkles className="mr-1 h-3 w-3" />}
                {favor.type === 'paid' ? 'Pago' : 'Voluntário'} {favor.type === 'paid' && favor.amount ? ` (R$${favor.amount})` : ''}
            </Badge>
        </div>
        <CardDescription className="text-xs text-muted-foreground flex items-center">
          <Users className="h-3 w-3 mr-1.5" />
          Pedido por: {favor.requester?.name || 'Uma Alma Bondosa'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pt-0 pb-4">
        <p className="text-sm text-foreground mb-3 line-clamp-3">{favor.description}</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 text-primary shrink-0" />
            <span>{favor.location}</span>
          </div>
          {favor.preferredDateTime && (
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-2 text-primary shrink-0" />
              <span>{format(new Date(favor.preferredDateTime), "P", { locale: ptBR })} às {format(new Date(favor.preferredDateTime), "p", { locale: ptBR })}</span>
            </div>
          )}
          <div className="flex flex-wrap gap-2 pt-1">
            <Badge variant="outline" className={`capitalize text-xs px-2 py-0.5 ${getUrgencyStyles(favor.urgency)}`}>
              <AlertTriangle className="h-3 w-3 mr-1" /> {urgencyTranslations[favor.urgency]} Urgência
            </Badge>
            <Badge variant="outline" className={`capitalize text-xs px-2 py-0.5 ${getStatusStyles(favor.status)}`}>
              <CheckCircle className="h-3 w-3 mr-1" /> {statusTranslations[favor.status]}
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild className="w-full">
          <Link href={`/favors/${favor.id}`}>Ver Detalhes</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
