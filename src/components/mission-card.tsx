
import type { Mission } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Trophy, Rocket, Building, Mic } from 'lucide-react';

interface MissionCardProps {
  mission: Mission;
}

const getNicheIcon = (niche: Mission['niche']) => {
    switch(niche) {
        case 'ong': return <Building className="h-4 w-4 text-muted-foreground"/>;
        case 'streamer': return <Mic className="h-4 w-4 text-muted-foreground" />;
        case 'empresa': return <Rocket className="h-4 w-4 text-muted-foreground" />;
        default: return <Rocket className="h-4 w-4 text-muted-foreground" />;
    }
}

export function MissionCard({ mission }: MissionCardProps) {
  const completedGoals = mission.goals.filter(g => g.completed).length;
  const totalGoals = mission.goals.length;
  const progress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
  const isCompleted = progress === 100;

  return (
    <Card as="article" className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
            <CardTitle className="font-headline text-lg md:text-xl">{mission.title}</CardTitle>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {getNicheIcon(mission.niche)}
                <span className="capitalize">{mission.niche}</span>
            </div>
        </div>
        <CardDescription className="line-clamp-2">{mission.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div>
            <h4 className="text-sm font-semibold mb-2">Metas da Missão</h4>
            <ul className="space-y-2">
                {mission.goals.map((goal, index) => (
                    <li key={index} className="flex items-center gap-3 text-sm">
                        <Checkbox id={`goal-${mission.id}-${index}`} checked={goal.completed} disabled />
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
        <div className="space-y-1">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Progresso</span>
                <span>{completedGoals} / {totalGoals}</span>
            </div>
            <Progress value={progress} aria-label={`${progress}% concluído`}/>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-3 bg-muted/50 p-4">
         <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <div>
                 <p className="text-sm font-semibold">Recompensa</p>
                 <p className="text-xs text-muted-foreground">{mission.reward}</p>
            </div>
         </div>
         {mission.creator && (
             <div className="flex items-center gap-2 pt-2 border-t w-full">
                <Avatar className="h-6 w-6">
                    <AvatarImage src={(mission.creator as any).avatar} alt={(mission.creator as any).name} />
                    <AvatarFallback>{(mission.creator as any).name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="text-xs text-muted-foreground">
                    Criado por <span className="font-medium text-foreground">{(mission.creator as any).name}</span>
                </p>
            </div>
         )}
      </CardFooter>
    </Card>
  );
}
