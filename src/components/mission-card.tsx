
import type { Mission } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Trophy, Rocket, Building, Mic, Star } from 'lucide-react';
import Image from 'next/image';

interface MissionCardProps {
  mission: Mission;
}

const getNicheIcon = (niche: Mission['niche']) => {
    switch(niche) {
        case 'ong': return <Building className="h-4 w-4 text-muted-foreground"/>;
        case 'streamer': return <Mic className="h-4 w-4 text-muted-foreground" />;
        case 'empresa': return <Rocket className="h-4 w-4 text-muted-foreground" />;
        default: return <Star className="h-4 w-4 text-muted-foreground" />;
    }
}

export function MissionCard({ mission }: MissionCardProps) {
  const completedGoals = mission.goals.filter(g => g.completed).length;
  const totalGoals = mission.goals.length;
  const progress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
  const isCompleted = progress === 100;

  return (
    <Card as="article" className={`flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden ${isCompleted ? 'opacity-60' : ''}`}>
        <div className="relative h-24 w-full bg-muted">
             <Image
                src={`https://picsum.photos/seed/mission${mission.id}/400/150`}
                alt={`Imagem da missão ${mission.title}`}
                fill
                className="object-cover"
                data-ai-hint="mission abstract"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-2 right-2 flex items-center gap-2 text-xs text-white bg-black/50 px-2 py-1 rounded-full">
                {getNicheIcon(mission.niche)}
                <span className="capitalize">{mission.niche}</span>
            </div>
        </div>
      <CardHeader>
        <CardTitle className="font-headline text-lg">{mission.title}</CardTitle>
        <CardDescription className="text-xs line-clamp-2">{mission.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div>
            <h4 className="text-sm font-semibold mb-3">Metas da Missão</h4>
            <ul className="space-y-3">
                {mission.goals.map((goal, index) => (
                    <li key={index} className="flex items-center gap-3 text-sm">
                        <Checkbox id={`goal-${mission.id}-${index}`} checked={goal.completed} disabled aria-label={goal.description} />
                        <label 
                            htmlFor={`goal-${mission.id}-${index}`}
                            className={`flex-1 ${goal.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}
                        >
                            {goal.description}
                        </label>
                    </li>
                ))}
            </ul>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-3 bg-muted/50 p-4 border-t">
         <div className="space-y-1 w-full">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Progresso</span>
                <span>{completedGoals} de {totalGoals}</span>
            </div>
            <Progress value={progress} aria-label={`${Math.round(progress)}% concluído`}/>
        </div>
         <div className="flex items-center gap-2 pt-3">
            <Trophy className={`h-5 w-5 ${isCompleted ? 'text-yellow-400' : 'text-muted-foreground'}`} />
            <div>
                 <p className="text-sm font-semibold">Recompensa</p>
                 <p className="text-xs text-muted-foreground">{mission.reward}</p>
            </div>
         </div>
      </CardFooter>
    </Card>
  );
}

    