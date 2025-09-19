
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Check, Gem, Star, Ticket } from 'lucide-react';

export default function SubscriptionPage() {
  const { toast } = useToast();

  const handleSubscription = (plan: string) => {
    toast({
      title: 'Funcionalidade Futura',
      description: `O fluxo de assinatura para o plano ${plan} será implementado em breve!`,
    });
  };

  const handleInviteCode = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = (e.currentTarget.elements.namedItem('invite-code') as HTMLInputElement).value;
    toast({
      title: 'Código de Convite Aplicado!',
      description: `O código "${code}" foi aplicado. Bem-vindo(a) ao plano de assinatura! (Simulação)`,
    });
  };

  return (
    <main className="max-w-4xl mx-auto space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-headline font-bold text-primary mb-2">Minha Assinatura</h1>
        <p className="text-lg text-muted-foreground">
          Desbloqueie recursos exclusivos e apoie a comunidade.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-lg border-primary border-2 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-headline">
              <Gem className="text-primary" /> Plano Mensal
            </CardTitle>
            <CardDescription>Acesso a todos os recursos com flexibilidade.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
            <p className="text-4xl font-bold">R$ 19,90<span className="text-base font-normal text-muted-foreground">/mês</span></p>
            <ul className="space-y-2 text-sm text-foreground">
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" />Criação de Comunidades Privadas</li>
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" />Gere até 5 Códigos de Convite</li>
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" />Selo de Assinante no Perfil</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button onClick={() => handleSubscription('Mensal')} className="w-full" size="lg">Assinar Plano Mensal</Button>
          </CardFooter>
        </Card>
        <Card className="shadow-lg flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-headline">
              <Star className="text-yellow-500" /> Plano Anual
            </CardTitle>
            <CardDescription>O melhor custo-benefício com 2 meses de desconto.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
            <p className="text-4xl font-bold">R$ 199,00<span className="text-base font-normal text-muted-foreground">/ano</span></p>
             <ul className="space-y-2 text-sm text-foreground">
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" />Criação de Comunidades Privadas</li>
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" />Gere até 5 Códigos de Convite</li>
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" />Selo de Assinante no Perfil</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button onClick={() => handleSubscription('Anual')} className="w-full" size="lg">Assinar Plano Anual</Button>
          </CardFooter>
        </Card>
      </section>

      <section>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Ticket className="h-5 w-5" /> Já tem um convite?
            </CardTitle>
            <CardDescription>
              Se você recebeu um código de convite de outro membro, insira-o abaixo para ativar seu plano.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInviteCode} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-grow space-y-2">
                <Label htmlFor="invite-code" className="sr-only">Código de Convite</Label>
                <Input id="invite-code" name="invite-code" placeholder="Insira seu código de convite" required />
              </div>
              <Button type="submit">Ativar com Código</Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
