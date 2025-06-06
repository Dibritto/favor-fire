"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mockFavors, mockUsers } from '@/lib/mock-data';
import type { Favor, User } from '@/types';
import { getCurrentUser } from '@/lib/auth'; // Mock auth
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, CalendarDays, Check, CheckCircle, DollarSign, Handshake, HelpingHand, Loader2, MapPin, MessageSquare, Sparkles, Star, UserCircle, X } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { RatingForm } from '@/components/rating-form';
import Image from 'next/image';

export default function FavorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const favorId = params.id as string;

  const [favor, setFavor] = useState<Favor | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const user = await getCurrentUser();
      setCurrentUser(user);
      
      // Simulate API call to fetch favor details
      const foundFavor = mockFavors.find(f => f.id === favorId);
      if (foundFavor) {
        setFavor({
          ...foundFavor,
          requester: mockUsers.find(u => u.id === foundFavor.requesterId),
          executor: foundFavor.executorId ? mockUsers.find(u => u.id === foundFavor.executorId) : null,
        });
      }
      setIsLoading(false);
    };
    fetchData();
  }, [favorId]);

  const handleAcceptFavor = async () => {
    if (!favor || !currentUser || favor.status !== 'open') return;
    setIsActionLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setFavor(prev => prev ? { ...prev, status: 'accepted', executorId: currentUser.id, executor: currentUser } : null);
    toast({ title: "Favor Accepted!", description: "You've agreed to help. Contact the requester to coordinate." });
    setIsActionLoading(false);
  };

  const handleMarkAsComplete = async () => {
    if (!favor || (favor.status !== 'accepted' && favor.status !== 'open')) return; // Allow completing even if open, if user is requester/executor
    setIsActionLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setFavor(prev => prev ? { ...prev, status: 'completed', completedAt: new Date().toISOString() } : null);
    toast({ title: "Favor Completed!", description: "Great job! You can now rate the interaction." });
    setIsActionLoading(false);
  };
  
  const handleCancelFavor = async () => {
    if (!favor || favor.status === 'completed' || favor.status === 'cancelled') return;
    setIsActionLoading(true);
    // Simulate API call to cancel
    await new Promise(resolve => setTimeout(resolve, 1000));
    setFavor(prev => prev ? { ...prev, status: 'cancelled' } : null);
    toast({ title: "Favor Cancelled", description: "The favor request has been cancelled.", variant: "destructive" });
    setIsActionLoading(false);
  };

  const submitRating = async (forUserType: 'requester' | 'executor', ratingData: { rating: number, feedback?: string }) => {
    if(!favor) return;
    console.log(`Rating for ${forUserType}:`, ratingData, "Favor ID:", favor.id);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (forUserType === 'requester') {
      setFavor(prev => prev ? {...prev, requesterRating: ratingData.rating, requesterFeedback: ratingData.feedback} : null);
    } else {
      setFavor(prev => prev ? {...prev, executorRating: ratingData.rating, executorFeedback: ratingData.feedback} : null);
    }
  }


  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /> <span className="ml-2">Loading favor details...</span></div>;
  }

  if (!favor) {
    return <div className="text-center py-10"><AlertTriangle className="mx-auto h-12 w-12 text-destructive" /><h1 className="mt-4 text-2xl font-bold">Favor Not Found</h1><p className="text-muted-foreground">The favor you are looking for does not exist or has been removed.</p><Button asChild className="mt-6"><Link href="/favors">Back to Discover</Link></Button></div>;
  }

  const isRequester = currentUser?.id === favor.requesterId;
  const isExecutor = currentUser?.id === favor.executorId;
  const canAccept = favor.status === 'open' && currentUser && !isRequester;
  const canComplete = favor.status === 'accepted' && currentUser && (isRequester || isExecutor);
  const canCancel = (favor.status === 'open' || favor.status === 'accepted') && currentUser && isRequester;


  const getUrgencyStyles = (urgency: Favor['urgency']) => {
    switch (urgency) {
      case 'high': return "border-red-500 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700";
      case 'medium': return "border-yellow-500 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700";
      case 'low': return "border-green-500 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700";
      default: return "";
    }
  };

  const canRateRequester = favor.status === 'completed' && isExecutor && !favor.requesterRating;
  const canRateExecutor = favor.status === 'completed' && isRequester && !favor.executorRating;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-3xl font-headline">{favor.title}</CardTitle>
            <Badge variant={favor.type === 'paid' ? 'default' : 'secondary'} className="capitalize shrink-0 text-sm px-3 py-1">
              {favor.type === 'paid' ? <DollarSign className="mr-1.5 h-4 w-4" /> : <Sparkles className="mr-1.5 h-4 w-4" />}
              {favor.type} {favor.type === 'paid' && favor.amount ? ` ($${favor.amount})` : ''}
            </Badge>
          </div>
          <CardDescription className="text-sm text-muted-foreground">
            Posted on {new Date(favor.createdAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground text-base leading-relaxed">{favor.description}</p>
          
          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
                <h3 className="font-semibold mb-1 text-primary">Details:</h3>
                <div className="space-y-1">
                    <p className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-muted-foreground" /> <strong>Location:</strong> {favor.location}</p>
                    {favor.preferredDateTime && <p className="flex items-center"><CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" /> <strong>Preferred:</strong> {new Date(favor.preferredDateTime).toLocaleString()}</p>}
                    <p className="flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2 text-muted-foreground" /> <strong>Urgency:</strong>
                        <Badge variant="outline" className={`ml-2 capitalize ${getUrgencyStyles(favor.urgency)}`}>{favor.urgency}</Badge>
                    </p>
                     <p className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-muted-foreground" /> <strong>Status:</strong> <span className="ml-1 capitalize font-medium">{favor.status}</span></p>
                </div>
            </div>
            <div>
                <h3 className="font-semibold mb-2 text-primary">Participants:</h3>
                {favor.requester && (
                    <div className="flex items-center space-x-3 mb-2">
                        <Avatar>
                            <AvatarImage src={`https://placehold.co/40x40.png?text=${favor.requester.name.charAt(0)}`} data-ai-hint="avatar person" />
                            <AvatarFallback>{favor.requester.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{favor.requester.name} (Requester)</p>
                            <p className="text-xs text-muted-foreground">Reputation: {favor.requester.reputation.toFixed(1)} <Star className="inline h-3 w-3 text-yellow-400 fill-yellow-400" /></p>
                        </div>
                    </div>
                )}
                {favor.executor && (
                    <div className="flex items-center space-x-3">
                        <Avatar>
                            <AvatarImage src={`https://placehold.co/40x40.png?text=${favor.executor.name.charAt(0)}`} data-ai-hint="avatar person" />
                            <AvatarFallback>{favor.executor.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{favor.executor.name} (Helper)</p>
                            <p className="text-xs text-muted-foreground">Reputation: {favor.executor.reputation.toFixed(1)} <Star className="inline h-3 w-3 text-yellow-400 fill-yellow-400" /></p>
                        </div>
                    </div>
                )}
                 {!favor.executor && favor.status === 'open' && (
                    <p className="text-sm text-muted-foreground italic">Waiting for a helper...</p>
                 )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2 pt-4">
          {canAccept && (
            <Button onClick={handleAcceptFavor} disabled={isActionLoading} className="w-full sm:w-auto">
              {isActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Handshake className="mr-2 h-4 w-4" />} Accept Favor
            </Button>
          )}
          {canComplete && (
            <Button onClick={handleMarkAsComplete} disabled={isActionLoading} className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
              {isActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />} Mark as Complete
            </Button>
          )}
           {canCancel && (
            <Button onClick={handleCancelFavor} variant="destructive" disabled={isActionLoading} className="w-full sm:w-auto">
              {isActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />} Cancel Favor
            </Button>
          )}
          {favor.status !== 'cancelled' && <Button variant="outline" className="w-full sm:w-auto"><MessageSquare className="mr-2 h-4 w-4" /> Chat (Coming Soon)</Button>}
        </CardFooter>
      </Card>

      {favor.status === 'completed' && (isRequester || isExecutor) && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-headline">Rate Your Experience</CardTitle>
            <CardDescription>Help build a trustworthy community by providing feedback.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {canRateExecutor && (
              <div>
                <h3 className="font-semibold mb-2">Rate {favor.executor?.name || 'the Helper'}:</h3>
                <RatingForm favorId={favor.id} onRatedUserType="executor" onSubmitRating={(data) => submitRating('executor', data)} isSubmitting={isActionLoading} />
              </div>
            )}
            {canRateRequester && (
              <div>
                <h3 className="font-semibold mb-2">Rate {favor.requester?.name || 'the Requester'}:</h3>
                <RatingForm favorId={favor.id} onRatedUserType="requester" onSubmitRating={(data) => submitRating('requester', data)} isSubmitting={isActionLoading} />
              </div>
            )}
            {favor.executorRating && isRequester && <p className="text-sm text-muted-foreground">You rated the helper: {favor.executorRating}/5 stars.</p>}
            {favor.requesterRating && isExecutor && <p className="text-sm text-muted-foreground">You rated the requester: {favor.requesterRating}/5 stars.</p>}

            {favor.status === 'completed' && !canRateExecutor && !canRateRequester && (isRequester || isExecutor) &&
              <p className="text-sm text-green-600 text-center">Thank you for your feedback!</p>
            }
          </CardContent>
        </Card>
      )}
    </div>
  );
}
