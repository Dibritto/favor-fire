
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Send, History, Bell, Users, User } from 'lucide-react';
import { mockNotifications } from '@/lib/mock-data';
import type { Notification } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ClientFormattedDate } from '@/components/client-formatted-date';

export default function AdminManageNotificationsPage() {
  const { toast } = useToast();
  const [sentNotifications, setSentNotifications] = useState<Notification[]>(
    mockNotifications.filter(n => n.type === 'admin_announcement')
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Em um app real, aqui você enviaria a notificação para o backend
    toast({
      title: "Notificação Enviada!",
      description: "A notificação foi enviada para os usuários selecionados.",
    });
    // Aqui você poderia resetar o formulário
  };

  return (
    <main className="space-y-8">
      <section aria-labelledby="send-notification-heading">
        <Card>
          <CardHeader>
            <CardTitle id="send-notification-heading" className="flex items-center gap-2">
              <Send className="h-6 w-6" />
              Enviar Nova Notificação
            </CardTitle>
            <CardDescription>
              Crie e envie notificações para os usuários da plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input id="title" placeholder="Ex: Manutenção Agendada" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipient">Destinatário</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="recipient">
                      <SelectValue placeholder="Selecione o destinatário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" /> Todos os Usuários
                        </div>
                      </SelectItem>
                      <SelectItem value="specific" disabled>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" /> Usuário Específico (Em breve)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <Textarea id="message" placeholder="Descreva a notificação em detalhes..." required rows={4} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link">Link (Opcional)</Label>
                <Input id="link" placeholder="Ex: /blog/nova-funcionalidade" />
              </div>
              <Button type="submit" className="w-full sm:w-auto">
                <Send className="mr-2 h-4 w-4" /> Enviar Notificação
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="notification-history-heading">
        <Card>
          <CardHeader>
            <CardTitle id="notification-history-heading" className="flex items-center gap-2">
              <History className="h-6 w-6" />
              Histórico de Notificações
            </CardTitle>
            <CardDescription>
              Visualize as notificações administrativas que já foram enviadas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead className="hidden md:table-cell">Mensagem</TableHead>
                  <TableHead className="hidden sm:table-cell">Data de Envio</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sentNotifications.length > 0 ? sentNotifications.map(notif => (
                  <TableRow key={notif.id}>
                    <TableCell className="font-medium">{notif.title}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground max-w-sm truncate">{notif.message}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <ClientFormattedDate dateString={notif.createdAt} formatString="P 'às' p" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Ver</Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">Nenhuma notificação enviada ainda.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

    
    