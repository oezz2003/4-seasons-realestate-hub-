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
            <div className="p-3 bg-primary/5 rounded-xl">
              <Icon className="h-7 w-7 text-primary" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-editorial-label text-muted-foreground truncate">{name}</dt>
              <dd className="flex items-baseline mt-1">
                <div className="text-3xl font-display text-foreground">{value}</div>
                <div
                  className={cn(
                    'ml-2 flex items-baseline text-sm font-bold',
                    changeType === 'positive' && 'text-primary',
                    changeType === 'negative' && 'text-destructive',
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

