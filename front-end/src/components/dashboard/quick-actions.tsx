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
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Common tasks and shortcuts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action) => (
          <Button
            key={action.name}
            variant="outline"
            className="w-full justify-start h-auto p-4"
            asChild
          >
            <Link href={action.href}>
              <div className="flex items-center space-x-3">
                <action.icon className="h-5 w-5 text-gray-400" />
                <div className="text-left">
                  <div className="font-medium">{action.name}</div>
                  <div className="text-sm text-gray-500">{action.description}</div>
                </div>
              </div>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

