import type { User } from '@/types';
import { mockUsers } from './mock-data';

export const getCurrentUser = async (): Promise<User | null> => {
  // Simula um usuário logado. Altere o ID para testar diferentes usuários.
  // Para simular não estar logado, retorne null.
  // Vamos usar 'user2' que tem um padrinho (sponsor) para testar a nova UI.
  const user = mockUsers.find(u => u.id === 'user2') || null;

  if (user && user.invitedById) {
      user.sponsor = mockUsers.find(u => u.id === user.invitedById);
  }

  return user;
};

export const getUserById = async (id: string): Promise<User | null> => {
    const user = mockUsers.find(user => user.id === id) || null;
    if (user && user.invitedById) {
        user.sponsor = mockUsers.find(u => u.id === user.invitedById);
    }
    return user;
};
