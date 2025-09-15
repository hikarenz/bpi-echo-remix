import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, CheckCircle, Clock, AlertTriangle, FileText, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  type: 'renewal' | 'application' | 'risk' | 'document' | 'general';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
  targetRoute?: string;
  metadata?: {
    vendorId?: string;
    documentId?: string;
    applicationId?: string;
  };
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'renewal',
    title: 'Vendor Renewal Alert',
    description: 'TechCorp contract expires in 7 days. Review renewal terms.',
    timestamp: '2 hours ago',
    isRead: false,
    priority: 'high',
    targetRoute: '/renewal-exit',
    metadata: { vendorId: 'techcorp-123' }
  },
  {
    id: '2',
    type: 'application',
    title: 'New Vendor Application',
    description: 'CloudSolutions Inc. submitted application for review.',
    timestamp: '5 hours ago',
    isRead: false,
    priority: 'medium',
    targetRoute: '/manage-vendors/application-portal',
    metadata: { applicationId: 'app-456' }
  },
  {
    id: '3',
    type: 'risk',
    title: 'Risk Assessment Due',
    description: 'DataFlow Ltd risk assessment needs immediate attention.',
    timestamp: '1 day ago',
    isRead: false,
    priority: 'high',
    targetRoute: '/evaluation',
    metadata: { vendorId: 'dataflow-789' }
  },
  {
    id: '4',
    type: 'document',
    title: 'Document Review Required',
    description: 'Compliance documents from SecureNet need approval.',
    timestamp: '2 days ago',
    isRead: true,
    priority: 'medium',
    targetRoute: '/evaluation',
    metadata: { documentId: 'doc-321' }
  },
  {
    id: '5',
    type: 'general',
    title: 'System Maintenance',
    description: 'Scheduled maintenance window this weekend.',
    timestamp: '3 days ago',
    isRead: true,
    priority: 'low'
  }
];

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive';
      case 'medium': return 'bg-primary';
      case 'low': return 'bg-muted-foreground';
      default: return 'bg-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'renewal': return <Clock className="h-4 w-4" />;
      case 'application': return <Users className="h-4 w-4" />;
      case 'risk': return <AlertTriangle className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
    );

    // Navigate to specific page if target route exists
    if (notification.targetRoute) {
      const route = notification.metadata 
        ? `${notification.targetRoute}?context=notification&id=${notification.id}`
        : notification.targetRoute;
      navigate(route);
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.isRead;
    return notification.type === activeTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated on vendor activities and system alerts
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount} unread</Badge>
          )}
          <Button onClick={markAllAsRead} variant="outline">
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="renewal">Renewals</TabsTrigger>
          <TabsTrigger value="application">Applications</TabsTrigger>
          <TabsTrigger value="risk">Risk</TabsTrigger>
          <TabsTrigger value="document">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No notifications</h3>
                <p className="text-muted-foreground">You're all caught up!</p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card 
                key={notification.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !notification.isRead ? 'border-l-4 border-l-primary bg-primary/5' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {getTypeIcon(notification.type)}
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`}></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className={`font-semibold text-sm ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </h3>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {notification.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.description}
                      </p>
                      {notification.targetRoute && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            Click to view details
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;