


import type { User, Favor, Notification, Report } from '@/types';

export const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'Alice Wonderland',
    email: 'alice@example.com',
    phone: '555-1234',
    reputation: 4.5,
    favorsCompleted: 10,
    favorsRequested: 5,
    joinDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(), // Joined 100 days ago
  },
  {
    id: 'user2',
    name: 'Bob The Builder',
    email: 'bob@example.com',
    phone: '555-5678',
    reputation: 4.8,
    favorsCompleted: 15,
    favorsRequested: 3,
    joinDate: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(), // Joined 200 days ago
  },
  {
    id: 'user3',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    reputation: 3.9,
    favorsCompleted: 3,
    favorsRequested: 8,
    joinDate: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(), // Joined 50 days ago
  },
];

export const mockFavors: Favor[] = [
  {
    id: 'favor1',
    title: 'Ajuda para mover um sofá',
    description: 'Preciso de ajuda para carregar um sofá por 2 lances de escada neste sábado de manhã. Pizza e gratidão eterna fornecidas!',
    urgency: 'medium',
    location: 'Rua Principal, 123, Qualquer Cidade',
    type: 'volunteer',
    participationType: 'individual',
    preferredDateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    status: 'open',
    requesterId: 'user1',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: 'favor2',
    title: 'Passear com cachorro por uma semana',
    description: 'Estou saindo de férias e preciso de alguém para passear com meu amigável golden retriever, Max, duas vezes por dia durante uma semana.',
    urgency: 'high',
    location: 'Proximidades do Parque Oak Drive',
    type: 'paid',
    amount: 100,
    participationType: 'individual',
    preferredDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    status: 'open',
    requesterId: 'user3',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'favor3',
    title: 'Revisar um conto',
    description: 'Procurando alguém para revisar meu conto de 10 páginas para erros gramaticais ou de digitação. Agradeço rapidez.',
    urgency: 'low',
    location: 'Remoto/Online',
    type: 'volunteer',
    participationType: 'individual',
    status: 'accepted',
    requesterId: 'user2',
    executorId: 'user1',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    acceptedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'favor4',
    title: 'Regar plantas durante as férias',
    description: 'Preciso de alguém para regar minhas plantas de interior por 2 semanas enquanto estou fora. Instruções serão fornecidas.',
    urgency: 'medium',
    location: 'Condomínio Greenwood',
    type: 'paid',
    amount: 30,
    participationType: 'individual',
    status: 'completed',
    requesterId: 'user1',
    executorId: 'user2',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    acceptedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    requesterRating: 5,
    executorRating: 5,
    executorFeedback: 'Alice foi ótima, as plantas ficaram felizes!',
    requesterFeedback: 'Bob fez um excelente trabalho!',
  },
  {
    id: 'favor5',
    title: 'Suporte técnico para vizinha idosa',
    description: 'Minha vizinha idosa precisa de ajuda para configurar seu novo tablet e conectar ao Wi-Fi. Paciência é fundamental.',
    urgency: 'medium',
    location: 'Lar de Idosos Sunshine',
    type: 'volunteer',
    participationType: 'individual',
    status: 'open',
    requesterId: 'user2',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Populate requester/executor objects for easier access in components
mockFavors.forEach(favor => {
  favor.requester = mockUsers.find(u => u.id === favor.requesterId);
  if (favor.executorId) {
    favor.executor = mockUsers.find(u => u.id === favor.executorId);
  }
});

export const mockNotifications: Notification[] = [
  {
    id: 'notif1',
    userId: 'user1',
    type: 'favor_accepted',
    title: 'Favor Aceito!',
    message: 'Bob aceitou seu pedido "Ajuda para mover um sofá".',
    link: '/favores/favor3',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
  },
  {
    id: 'notif2',
    userId: 'user1',
    type: 'favor_completed',
    title: 'Favor Concluído!',
    message: 'Você marcou o favor "Regar plantas durante as férias" como concluído. Não se esqueça de avaliar Bob!',
    link: '/favores/favor4',
    read: false,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
  },
  {
    id: 'notif3',
    userId: 'user1',
    type: 'admin_announcement',
    title: 'Atualização da Plataforma',
    message: 'Uma nova atualização de manutenção está agendada para este fim de semana. A plataforma pode ficar temporariamente indisponível.',
    read: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: 'notif4',
    userId: 'user1',
    type: 'favor_rated',
    title: 'Você recebeu uma nova avaliação!',
    message: 'Bob avaliou sua interação no favor "Regar plantas durante as férias".',
    link: '/perfil',
    read: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
];

export const mockReports: Report[] = [
    {
        id: 'report1',
        reportedById: 'user1',
        reportedItemId: 'favor2',
        reportedItemType: 'favor',
        reason: 'spam',
        comments: 'O valor parece alto demais e a descrição é vaga.',
        status: 'pending',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'report2',
        reportedById: 'user2',
        reportedItemId: 'user3',
        reportedItemType: 'user',
        reason: 'inappropriate',
        comments: 'O usuário enviou mensagens rudes no chat (funcionalidade em breve).',
        status: 'pending',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'report3',
        reportedById: 'user3',
        reportedItemId: 'favor4',
        reportedItemType: 'favor',
        reason: 'other',
        comments: 'O favor já foi concluído, mas ainda está aparecendo como aberto em alguns lugares.',
        status: 'resolved',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    }
];

// Populate related data for reports
mockReports.forEach(report => {
    report.reportedBy = mockUsers.find(u => u.id === report.reportedById);
    if (report.reportedItemType === 'favor') {
        report.reportedItem = mockFavors.find(f => f.id === report.reportedItemId);
    } else {
        report.reportedItem = mockUsers.find(u => u.id === report.reportedItemId);
    }
});
