import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest changes and updates across the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockActivities.map((activity) => {
            const Icon = getActivityIcon(activity.type, activity.entity);
            const colorClass = getActivityColor(activity.type);
            const actionText = getActivityText(activity.type, activity.entity);

            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`flex-shrink-0 p-2 rounded-full ${colorClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.name}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {activity.entity}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    {actionText} by {activity.user} • {activity.timestamp}
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

