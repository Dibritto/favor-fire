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
  },
  {
    id: 'user2',
    name: 'Bob The Builder',
    email: 'bob@example.com',
    phone: '555-5678',
    reputation: 4.8,
    favorsCompleted: 15,
    favorsRequested: 3,
  },
  {
    id: 'user3',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    reputation: 3.9,
    favorsCompleted: 3,
    favorsRequested: 8,
  },
];

export const mockFavors: Favor[] = [
  {
    id: 'favor1',
    title: 'Help moving a couch',
    description: 'Need help carrying a couch down 2 flights of stairs this Saturday morning. Pizza and eternal gratitude provided!',
    urgency: 'medium',
    location: '123 Main St, Anytown',
    type: 'volunteer',
    preferredDateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    status: 'open',
    requesterId: 'user1',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: 'favor2',
    title: 'Dog walking for a week',
    description: 'I am going on vacation and need someone to walk my friendly golden retriever, Max, twice a day for a week.',
    urgency: 'high',
    location: 'Oak Drive Park vicinity',
    type: 'paid',
    amount: 100,
    preferredDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    status: 'open',
    requesterId: 'user3',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'favor3',
    title: 'Proofread a short story',
    description: 'Looking for someone to proofread my 10-page short story for any grammatical errors or typos. Quick turnaround appreciated.',
    urgency: 'low',
    location: 'Remote/Online',
    type: 'volunteer',
    status: 'accepted',
    requesterId: 'user2',
    executorId: 'user1',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    acceptedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'favor4',
    title: 'Water plants during vacation',
    description: 'Need someone to water my indoor plants for 2 weeks while I am away. Instructions will be provided.',
    urgency: 'medium',
    location: 'Greenwood Apartment Complex',
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
    executorFeedback: 'Alice was great, plants were happy!',
    requesterFeedback: 'Bob did an excellent job!',
  },
  {
    id: 'favor5',
    title: 'Tech support for elderly neighbor',
    description: 'My elderly neighbor needs help setting up her new tablet and connecting to Wi-Fi. Patience is key.',
    urgency: 'medium',
    location: 'Sunshine Senior Living',
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
