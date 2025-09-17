"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Bell, CheckCheck, Handshake, Star, ShieldAlert } from 'lucide-react';
import { mockNotifications } from '@/lib/mock-data';
import type { Notification, NotificationType } from '@/types';
import { getCurrentUser } from '@/lib/auth';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case 'favor_accepted':
      return <Handshake className="h-5 w-5 text-purple-500" />;
    case 'favor_completed':
      return <CheckCheck className="h-5 w-5 text-green-500" />;
    case 'favor_rated':
      return <Star className="h-5 w-5 text-yellow-500" />;
    case 'admin_announcement':
      return <ShieldAlert className="h-5 w-5 text-red-500" />;
    default:
      return <Bell className="h-5 w-5 text-muted-foreground" />;
  }
}

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // In a real app, you would fetch notifications for the current user
    const fetchNotifications = async () => {
      const user = await getCurrentUser();
      if (user) {
        const userNotifications = mockNotifications.filter(n => n.userId === user.id);
        setNotifications(userNotifications);
        setUnreadCount(userNotifications.filter(n => !n.read).length);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    // Here you would also send a request to your backend to update the status
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Abrir notificações</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <h3 className="font-medium text-lg">Notificações</h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map(notif => (
              <div
                key={notif.id}
                className={cn(
                  'p-4 border-b text-sm flex items-start gap-3',
                  !notif.read && 'bg-accent/50'
                )}
              >
                <div className="shrink-0 mt-1">{getNotificationIcon(notif.type)}</div>
                <div className="flex-1">
                  <p className="font-semibold">{notif.title}</p>
                  <p className="text-muted-foreground text-xs leading-snug">{notif.message}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: ptBR })}
                    </p>
                    {notif.link && (
                        <Button variant="link" asChild className="h-auto p-0 text-xs">
                            <Link href={notif.link}>Ver</Link>
                        </Button>
                    )}
                  </div>
                </div>
                {!notif.read && <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary mt-1" />}
              </div>
            ))
          ) : (
            <p className="p-4 text-center text-muted-foreground">Nenhuma notificação nova.</p>
          )}
        </div>
        {notifications.length > 0 && (
            <div className="p-2 border-t flex justify-end">
                <Button variant="link" size="sm" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
                    Marcar todas como lidas
                </Button>
            </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
