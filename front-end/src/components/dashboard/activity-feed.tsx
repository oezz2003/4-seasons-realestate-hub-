import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Building2,
  MapPin,
  Users,
  FileText
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'created' | 'updated' | 'deleted' | 'viewed';
  entity: 'property' | 'compound' | 'developer' | 'blog';
  name: string;
  timestamp: string;
  user: string;
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'created',
    entity: 'property',
    name: 'Luxury Apartment in New Cairo',
    timestamp: '2 hours ago',
    user: 'Admin User',
  },
  {
    id: '2',
    type: 'updated',
    entity: 'compound',
    name: 'Palm Hills New Cairo',
    timestamp: '4 hours ago',
    user: 'Admin User',
  },
  {
    id: '3',
    type: 'created',
    entity: 'blog',
    name: 'Real Estate Market Trends 2024',
    timestamp: '6 hours ago',
    user: 'Admin User',
  },
  {
    id: '4',
    type: 'updated',
    entity: 'developer',
    name: 'Palm Hills Development',
    timestamp: '8 hours ago',
    user: 'Admin User',
  },
  {
    id: '5',
    type: 'viewed',
    entity: 'property',
    name: 'Villa in North Coast',
    timestamp: '1 day ago',
    user: 'Admin User',
  },
];

const getActivityIcon = (type: ActivityItem['type'], entity: ActivityItem['entity']) => {
  const iconMap = {
    created: Plus,
    updated: Edit,
    deleted: Trash2,
    viewed: Eye,
  };

  const entityMap = {
    property: Building2,
    compound: MapPin,
    developer: Users,
    blog: FileText,
  };

  return iconMap[type];
};

const getActivityColor = (type: ActivityItem['type']) => {
  const colorMap = {
    created: 'bg-green-100 text-green-800',
    updated: 'bg-blue-100 text-blue-800',
    deleted: 'bg-red-100 text-red-800',
    viewed: 'bg-gray-100 text-gray-800',
  };

  return colorMap[type];
};

const getActivityText = (type: ActivityItem['type'], entity: ActivityItem['entity']) => {
  const actionMap = {
    created: 'created',
    updated: 'updated',
    deleted: 'deleted',
    viewed: 'viewed',
  };

  return actionMap[type];
};

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <span className="text-secondary text-xs font-bold uppercase tracking-widest">Platform Pulse</span>
        <CardTitle className="text-2xl font-display mt-1">Recent Activity</CardTitle>
        <CardDescription className="text-muted-foreground/80">
          Latest changes and heartbeat of the Digital Curator.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockActivities.map((activity) => {
            const Icon = getActivityIcon(activity.type, activity.entity);
            const colorClass = getActivityColor(activity.type);
            const actionText = getActivityText(activity.type, activity.entity);

            return (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-surface-low transition-colors">
                <div className={cn("flex-shrink-0 p-2 rounded-xl bg-primary/5 text-primary")}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-display text-foreground truncate">
                      {activity.name}
                    </p>
                    <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter border-primary/20 text-primary">
                      {activity.entity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {actionText} by <span className="text-foreground font-medium">{activity.user}</span> • {activity.timestamp}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

