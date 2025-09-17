
export interface User {
  id: string;
  name: string;
  displayName?: string;
  email: string;
  phone?: string;
  bio?: string;
  reputation: number; // 0-5 scale, can be calculated or stored
  favorsCompleted: number;
  favorsRequested: number;
  joinDate?: string; // ISO string for when the user joined
  // For the future invitation system
  invitedById?: string;
  sponsor?: User; // Populated for display
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
  location: string; // For simplicity, can be an address or general area
  type: FavorType;
  participationType: FavorParticipationType;
  numberOfPeople?: number; // For collective favors
  communityId?: string; // To link to a community, making it a restricted favor
  preferredDateTime?: string; // ISO string or a more structured date/time
  status: FavorStatus;
  requesterId: string;
  requester?: User; // Populated for display
  executorId?: string | null; // For individual favors
  executor?: User | null; // For individual favors
  executorIds?: string[]; // For collective favors
  executors?: User[]; // For collective favors
  createdAt: string; // ISO string
  acceptedAt?: string; // ISO string
  completedAt?: string; // ISO string
  amount?: number; // For paid favors
  // Feedback and rating can be separate or embedded
  requesterRating?: number; // Rating given by executor to requester (1-5)
  requesterFeedback?: string;
  executorRating?: number; // Rating given by requester to executor (1-5)
  executorFeedback?: string;
  // Optional evidence for completion
  completionProof?: string; // URL to image or text
}

export type CommunityType = 'public' | 'private';

export interface Community {
    id: string;
    name: string;
    description: string;
    type: CommunityType;
    creatorId: string;
    creator?: User; // Populated for display
    memberIds: string[];
    members?: User[]; // Populated for display
    createdAt: string; // ISO string
}

export type MissionNiche = 'streamer' | 'ong' | 'empresa';

export interface Mission {
    id: string;
    title: string;
    description: string;
    niche: MissionNiche;
    creatorId: string; // Could be a User ID or a Company ID
    goals: { description: string; completed: boolean }[];
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
  link?: string; // e.g., /favors/favor123
  read: boolean;
  createdAt: string; // ISO string
}

export type ReportStatus = 'pending' | 'resolved' | 'ignored';
export type ReportReason = 'spam' | 'inappropriate' | 'scam' | 'other';
export type ReportedItemType = 'favor' | 'user';

export interface Report {
    id: string;
    reportedById: string;
    reportedBy?: User;
    reportedItemId: string;
    reportedItemType: ReportedItemType;
    reportedItem?: Favor | User;
    reason: ReportReason;
    comments?: string;
    status: ReportStatus;
    createdAt: string; // ISO String
}
