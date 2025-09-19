
import type { User } from '@/types';
import { mockUsers } from './mock-data';

// NOTA: Este é um serviço de autenticação simulado.
// Em uma aplicação real, você integraria com um provedor de autenticação real.

/**
 * Obtém o usuário atualmente logado.
 * Nesta simulação, estamos sempre retornando o usuário 'user2' para ter uma experiência consistente.
 * Para simular um estado de logout, você pode retornar null.
 * @returns Uma promessa que resolve para o usuário atual ou nulo.
 */
export const getCurrentUser = async (): Promise<User | null> => {
  // Usaremos 'user2' como o usuário logado padrão porque ele tem um padrinho,
  // o que nos permite testar mais recursos da interface.
  const user = mockUsers.find(u => u.id === 'user2') || null;

  // Se o usuário tiver um 'invitedById', preencheremos o campo 'sponsor'.
  if (user && user.invitedById) {
      user.sponsor = mockUsers.find(u => u.id === user.invitedById);
  }

  return user;
};


/**
 * Obtém um usuário pelo seu ID.
 * @param id - O ID do usuário a ser recuperado.
 * @returns Uma promessa que resolve para o usuário ou nulo se não for encontrado.
 */
export const getUserById = async (id: string): Promise<User | null> => {
    const user = mockUsers.find(user => user.id === id) || null;
    
    // Também preenche o padrinho se existir para o usuário recuperado.
    if (user && user.invitedById) {
        user.sponsor = mockUsers.find(u => u.id === user.invitedById);
    }

    return user;
};
