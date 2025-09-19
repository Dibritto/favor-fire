
"use client";

import { useState, useEffect } from 'react';
import type { Report, User, Favor, Community, ReportReason } from '@/types';
import { mockReports } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, MessageSquare, User as UserIcon, ShieldCheck, Users } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { ClientFormattedDate } from '@/components/client-formatted-date';

// Função para obter o estilo do status para consistência
const getStatusStyles = (status: Report['status']) => {
    switch (status) {
      case 'pending':
        return "border-yellow-500 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700";
      case 'resolved':
        return "border-green-500 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700";
      case 'ignored':
        return "border-gray-500 bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-700";
      default:
        return "";
    }
}

const statusTranslations: { [key in Report['status']]: string } = {
    pending: 'Pendente',
    resolved: 'Resolvido',
    ignored: 'Ignorado',
};

const reasonTranslations: { [key in ReportReason]: string } = {
    spam: 'Spam ou Propaganda',
    inappropriate: 'Conteúdo Inadequado',
    scam: 'Fraude ou Golpe',
    other: 'Outro',
};


export default function AdminManageReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Em um app real, você buscaria os dados da sua API
    setReports(mockReports);
  }, []);
  
  const handleMarkAsResolved = (reportId: string) => {
    setReports(prevReports => 
        prevReports.map(r => r.id === reportId ? {...r, status: 'resolved'} : r)
    );
    toast({ title: 'Denúncia Resolvida', description: 'A denúncia foi marcada como resolvida.'});
  }

  const getReportedItemName = (report: Report) => {
    if (report.reportedItemType === 'favor') {
        const favor = report.reportedItem as Favor;
        return favor?.title || 'Favor não encontrado';
    }
    if (report.reportedItemType === 'user') {
        const user = report.reportedItem as User;
        return user?.name || 'Usuário não encontrado';
    }
    if (report.reportedItemType === 'community') {
        const community = report.reportedItem as Community;
        return community?.name || 'Comunidade não encontrada';
    }
    return 'Item desconhecido';
  }

  const getReportedItemLink = (report: Report) => {
    if (report.reportedItemType === 'favor') {
      return `/favores/${report.reportedItemId}`;
    }
     if (report.reportedItemType === 'user') {
      return `/perfil/${report.reportedItemId}`;
    }
     if (report.reportedItemType === 'community') {
      return `/comunidades/${report.reportedItemId}`;
    }
    return '#';
  };

  const getItemIcon = (type: Report['reportedItemType']) => {
    switch (type) {
        case 'favor': return <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />;
        case 'user': return <UserIcon className="h-4 w-4 mr-2 text-muted-foreground" />;
        case 'community': return <Users className="h-4 w-4 mr-2 text-muted-foreground" />;
        default: return null;
    }
  }

  return (
    <main>
        <section aria-labelledby="reports-heading">
            <Card>
                <CardHeader>
                <CardTitle id="reports-heading">Gerenciar Denúncias</CardTitle>
                <CardDescription>Visualize e gerencie as denúncias feitas por usuários na plataforma.</CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Item Denunciado</TableHead>
                        <TableHead className="hidden md:table-cell">Motivo</TableHead>
                        <TableHead className="hidden lg:table-cell">Denunciado Por</TableHead>
                        <TableHead className="hidden sm:table-cell">Data</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {reports.map(report => (
                        <TableRow key={report.id}>
                        <TableCell>
                            <div className="font-medium flex items-center">
                                {getItemIcon(report.reportedItemType)}
                                <Link href={getReportedItemLink(report)} className="hover:underline">
                                    {getReportedItemName(report)}
                                </Link>
                            </div>
                            <div className="text-xs text-muted-foreground ml-6 line-clamp-1">{report.comments}</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell capitalize">
                            {reasonTranslations[report.reason]}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{report.reportedBy?.name || 'N/A'}</TableCell>
                        <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                            <ClientFormattedDate
                                dateString={report.createdAt}
                                formatFunction="formatDistanceToNow"
                                addSuffix={true}
                                formatString=''
                            />
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline" className={`capitalize ${getStatusStyles(report.status)}`}>
                            {statusTranslations[report.status]}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações de Moderação</DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                <Link href={getReportedItemLink(report)}>Ver Item Denunciado</Link> 
                                </DropdownMenuItem>
                                {report.status === 'pending' && (
                                    <DropdownMenuItem onClick={() => handleMarkAsResolved(report.id)}>
                                        <ShieldCheck className="mr-2 h-4 w-4" />
                                        Marcar como Resolvido
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem className="text-destructive">Suspender Item</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Suspender Usuário Denunciante</DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </section>
    </main>
  );
}
