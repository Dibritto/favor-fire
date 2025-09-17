

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  reputation: number; // 0-5 scale, can be calculated or stored
  favorsCompleted: number;
  favorsRequested: number;
  joinDate?: string; // ISO string for when the user joined
  // avatarUrl?: string; // If avatars are to be included
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
    memberIds: string[];
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
