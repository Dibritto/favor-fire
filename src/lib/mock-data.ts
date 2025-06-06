
import type { User, Favor } from '@/types';

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
