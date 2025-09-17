import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, DollarSign, Users, Zap } from 'lucide-react';

export default function AdminManageSubscriptionsPage() {
  return (
    <main>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-6 w-6" />
              Gerenciar Assinaturas
          </CardTitle>
          <CardDescription>
              Esta seção está em desenvolvimento.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
              No futuro, esta área permitirá o gerenciamento completo de planos de assinatura, recursos premium e transações da plataforma.
          </p>
          <div className="p-6 rounded-lg bg-muted/50 border-l-4 border-primary">
              <h4 className="font-semibold text-lg mb-2">Funcionalidades Planejadas:</h4>
              <ul className="list-inside list-disc space-y-2 text-sm text-foreground">
                  <li className="flex items-start"><Zap className="h-4 w-4 mr-2 mt-0.5 text-primary shrink-0"/> Criação e edição de diferentes níveis de assinatura (ex: Básico, Pro).</li>
                  <li className="flex items-start"><DollarSign className="h-4 w-4 mr-2 mt-0.5 text-primary shrink-0"/> Visualização de todas as transações e status de pagamento.</li>
                  <li className="flex items-start"><Users className="h-4 w-4 mr-2 mt-0.5 text-primary shrink-0"/> Atribuição manual de planos a usuários específicos.</li>
              </ul>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
