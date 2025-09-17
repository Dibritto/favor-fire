
import type { User } from '@/types';
import { mockUsers } from './mock-data';

// NOTE: This is a mock authentication service.
// In a real application, you would integrate with a real authentication provider.

/**
 * Gets the currently logged-in user.
 * In this mock, we are always returning user 'user2' to have a consistent experience.
 * To simulate a logged-out state, you can return null.
 * @returns A promise that resolves to the current user or null.
 */
export const getCurrentUser = async (): Promise<User | null> => {
  // We'll use 'user2' as the default logged-in user because they have a sponsor,
  // which allows us to test more UI features.
  const user = mockUsers.find(u => u.id === 'user2') || null;

  // If the user has an 'invitedById', we'll populate the 'sponsor' field.
  if (user && user.invitedById) {
      user.sponsor = mockUsers.find(u => u.id === user.invitedById);
  }

  return user;
};


/**
 * Gets a user by their ID.
 * @param id - The ID of the user to retrieve.
 * @returns A promise that resolves to the user or null if not found.
 */
export const getUserById = async (id: string): Promise<User | null> => {
    const user = mockUsers.find(user => user.id === id) || null;
    
    // Also populate the sponsor if it exists for the retrieved user.
    if (user && user.invitedById) {
        user.sponsor = mockUsers.find(u => u.id === user.invitedById);
    }

    return user;
};
