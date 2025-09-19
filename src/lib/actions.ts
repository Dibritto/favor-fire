
'use server';

import type { Favor } from '@/types';
import { getCurrentUser } from './auth';

// Esta é uma Server Action. Ela é executada de forma segura no servidor.
// No futuro, vamos substituir o console.log por uma chamada ao banco de dados (Firestore).

/**
 * Cria um novo favor.
 * @param favorData - Os dados do favor a serem criados, sem informações do solicitante.
 */
export async function createFavor(favorData: Omit<Favor, 'id' | 'requesterId' | 'createdAt' | 'status'>): Promise<{ success: boolean; message: string; }> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error('Você precisa estar logado para criar um favor.');
    }

    const newFavor: Omit<Favor, 'id'> = {
      ...favorData,
      requesterId: currentUser.id,
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    // Simulação de salvamento no banco de dados
    console.log('Salvando o seguinte favor no banco de dados:', newFavor);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simula a latência da rede

    return {
      success: true,
      message: 'Favor criado com sucesso!',
    };
  } catch (error) {
    console.error('Erro ao criar o favor:', error);
    const message = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
    return {
      success: false,
      message: message,
    };
  }
}
