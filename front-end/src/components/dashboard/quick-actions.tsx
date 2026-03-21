import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface QuickAction {
  name: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader className="pb-4">
        <span className="text-secondary text-xs font-bold uppercase tracking-widest">Management</span>
        <CardTitle className="text-2xl font-display mt-1">Quick Actions</CardTitle>
        <CardDescription className="text-muted-foreground/80">
          Common shortcuts for curators.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action) => (
          <Button
            key={action.name}
            variant="outline"
            className="w-full justify-start h-auto p-4 hover:bg-accent/50 transition-colors"
            asChild
          >
            <Link href={action.href}>
              <div className="flex items-center space-x-3">
                <action.icon className="h-5 w-5 text-muted-foreground" />
                <div className="text-left">
                  <div className="font-medium text-foreground">{action.name}</div>
                  <div className="text-sm text-muted-foreground">{action.description}</div>
                </div>
              </div>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

