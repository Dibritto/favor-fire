
"use client";

import { useState, useEffect } from 'react';
import { mockMissions } from '@/lib/mock-data';
import type { Mission } from '@/types';
import { Rocket, Trophy } from 'lucide-react';
import { MissionCard } from '@/components/mission-card';

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([]);

  useEffect(() => {
    // Simula a busca de dados
    setMissions(mockMissions);
  }, []);

  return (
    <main className="space-y-8">
      <header className="bg-card p-6 rounded-lg shadow-sm border">
        <h1 className="text-3xl font-headline font-bold flex items-center gap-3 text-primary">
          <Rocket className="h-8 w-8" />
          Central de Missões
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Complete missões, ganhe recompensas exclusivas e ajude a fortalecer ainda mais a nossa comunidade! Cada meta alcançada é um passo para um ambiente mais colaborativo.
        </p>
      </header>

      <section aria-labelledby="missions-list-heading">
        <h2 id="missions-list-heading" className="sr-only">Lista de Missões Disponíveis</h2>
        {missions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {missions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg bg-card">
            <Trophy className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold">Nenhuma missão disponível no momento.</h3>
            <p className="mt-2 text-muted-foreground">Você é um membro exemplar! Volte em breve para novos desafios.</p>
          </div>
        )}
      </section>
    </main>
  );
}

    