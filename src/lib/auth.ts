import type { User } from '@/types';
import { mockUsers } from './mock-data';

// Mock current user - in a real app, this would come from a session/token
export const getCurrentUser = async (): Promise<User | null> => {
  // Simulate a logged-in user. Change the ID to test different users.
  // To simulate not logged in, return null.
  // return null;
  return mockUsers[0] || null; // Defaults to Alice
};

export const getUserById = async (id: string): Promise<User | null> => {
  return mockUsers.find(user => user.id === id) || null;
};
