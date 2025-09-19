
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  return (
    <main>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-6 w-6" />
              Configurações
          </CardTitle>
          <CardDescription>
              Configurações gerais da plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
              Esta seção está em desenvolvimento. A personalização de cores foi desativada temporariamente.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
