import type { User } from '@/types';
import { mockUsers } from './mock-data';

export const getCurrentUser = async (): Promise<User | null> => {
  // Simula um usuário logado. Altere o ID para testar diferentes usuários.
  // Para simular não estar logado, retorne null.
  return mockUsers[0] || null;
};

export const getUserById = async (id: string): Promise<User | null> => {
  return mockUsers.find(user => user.id === id) || null;
};
