import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  ChevronDown, 
  ChevronUp,
  CheckCircle,
  AlertTriangle,
  Info,
  Mail
} from 'lucide-react';
import { format } from 'date-fns';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read_at: string;
  created_at: string;
}

interface VendorNotificationsPanelProps {
  userId: string;
}

export function VendorNotificationsPanel({ userId }: VendorNotificationsPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('recipient_id', userId)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        setNotifications(data || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, [userId]);

  const markAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', notificationId);

      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, read_at: new Date().toISOString() } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <Info className="h-4 w-4 text-info" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case 'success':
        return <Badge variant="default" className="bg-success/10 text-success border-success/20">Success</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">Warning</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Info</Badge>;
    }
  };

  const unreadCount = notifications.filter(n => !n.read_at).length;

  if (loading) {
    return (
      <Card className="card-glossy-hover">
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-glossy-hover">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Recent Notifications
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      {(isExpanded || unreadCount > 0) && (
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-6">
              <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.slice(0, isExpanded ? 10 : 3).map((notification) => (
                <div
                  key={notification.id}
                  className={`
                    p-3 rounded-lg border transition-colors cursor-pointer
                    ${!notification.read_at ? 'bg-primary/5 border-primary/20' : 'bg-muted/5 border-muted-foreground/10'}
                  `}
                  onClick={() => !notification.read_at && markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className={`font-medium text-sm ${!notification.read_at ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </h4>
                          {!notification.read_at && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {format(new Date(notification.created_at), 'MMM dd, yyyy h:mm a')}
                        </p>
                      </div>
                    </div>
                    {getNotificationBadge(notification.type)}
                  </div>
                </div>
              ))}
              
              {!isExpanded && notifications.length > 3 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => setIsExpanded(true)}
                >
                  View all notifications ({notifications.length})
                </Button>
              )}
            </div>
          )}

          {/* Communication Section */}
          <div className="mt-6 p-4 bg-info/5 border border-info/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 text-info mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-sm text-info">Need Support?</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Contact our vendor support team for assistance with your application or account.
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}