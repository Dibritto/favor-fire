





export interface User {
  id: string;
  name: string;
  displayName?: string;
  email: string;
  phone?: string;
  bio?: string;
  reputation: number; // escala de 0-5, pode ser calculado ou armazenado
  favorsCompleted: number;
  favorsRequested: number;
  joinDate?: string; // string ISO para quando o usuário entrou
  // Para o futuro sistema de convites
  invitedById?: string;
  sponsor?: User; // Preenchido para exibição
  inviteCode?: string;
}

export type UrgencyLevel = 'low' | 'medium' | 'high';
export type FavorType = 'volunteer' | 'paid';
export type FavorStatus = 'open' | 'accepted' | 'completed' | 'cancelled';
export type FavorParticipationType = 'individual' | 'collective';

export interface Favor {
  id: string;
  title: string;
  description: string;
  urgency: UrgencyLevel;
  location: string; // Para simplicidade, pode ser um endereço ou área geral
  type: FavorType;
  participationType: FavorParticipationType;
  numberOfPeople?: number; // Para favores coletivos
  communityId?: string; // Para vincular a uma comunidade, tornando-o um favor restrito
  community?: Community; // Preenchido para exibição
  preferredDateTime?: string; // string ISO ou uma data/hora mais estruturada
  status: FavorStatus;
  requesterId: string;
  requester?: User; // Preenchido para exibição
  executorId?: string | null; // Para favores individuais
  executor?: User | null; // Preenchido para exibição
  executorIds?: string[]; // Para favores coletivos
  executors?: User[]; // Preenchido para exibição
  createdAt: string; // string ISO
  acceptedAt?: string; // string ISO
  completedAt?: string; // string ISO
  amount?: number; // Para favores pagos
  // Feedback e avaliação podem ser separados ou incorporados
  requesterRating?: number; // Avaliação dada pelo executor ao solicitante (1-5)
  requesterFeedback?: string;
  executorRating?: number; // Avaliação dada pelo solicitante ao executor (1-5)
  executorFeedback?: string;
  // Prova opcional para conclusão
  completionProof?: string; // URL para imagem ou texto
}

export type CommunityType = 'public' | 'private';

export interface Community {
    id: string;
    name: string;
    description: string;
    type: CommunityType;
    creatorId: string;
    creator?: User; // Preenchido para exibição
    memberIds: string[];
    members?: User[]; // Preenchido para exibição
    createdAt: string; // string ISO
}

export type MissionNiche = 'streamer' | 'ong' | 'empresa';

export interface Mission {
    id: string;
    title: string;
    description: string;
    niche: MissionNiche;
    creatorId: string; // Pode ser um ID de usuário ou de empresa
    creator?: User | { name: string; avatar: string };
    goals: { description: string; completed: boolean }[];
    reward: string;
}

export type NotificationType = 
  | 'favor_accepted' 
  | 'favor_completed' 
  | 'favor_rated' 
  | 'new_favor_in_community'
  | 'admin_announcement';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string; // ex: /favores/favor123
  read: boolean;
  createdAt: string; // string ISO
}

export type ReportStatus = 'pending' | 'resolved' | 'ignored';
export type ReportReason = 'spam' | 'inappropriate' | 'scam' | 'other';
export type ReportedItemType = 'favor' | 'user' | 'community';

export interface Report {
    id: string;
    reportedById: string;
    reportedBy?: User;
    reportedItemId: string;
    reportedItemType: ReportedItemType;
    reportedItem?: Favor | User | Community;
    reason: ReportReason;
    comments?: string;
    status: ReportStatus;
    createdAt: string; // String ISO
}

    