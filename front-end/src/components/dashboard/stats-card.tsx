import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  name: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
}

export function StatsCard({ name, value, change, changeType, icon: Icon }: StatsCardProps) {
  return (
    <Card className="bg-card text-card-foreground">
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-muted-foreground truncate">{name}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-foreground">{value}</div>
                <div
                  className={cn(
                    'ml-2 flex items-baseline text-sm font-semibold',
                    changeType === 'positive' && 'text-green-600 dark:text-green-400',
                    changeType === 'negative' && 'text-red-600 dark:text-red-400',
                    changeType === 'neutral' && 'text-muted-foreground'
                  )}
                >
                  {change}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

