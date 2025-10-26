'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProperties } from '@/store/slices/propertiesSlice';
import { fetchCompounds } from '@/store/slices/compoundsSlice';
import { fetchDevelopers } from '@/store/slices/developersSlice';
import { fetchBlogPosts } from '@/store/slices/blogSlice';
import { StatsCard } from '@/components/dashboard/stats-card';
import { RecentProperties } from '@/components/dashboard/recent-properties';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { 
  Building2, 
  MapPin, 
  Users, 
  FileText,
  TrendingUp,
  Eye,
  Plus
} from 'lucide-react';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { properties, totalCount: propertiesCount } = useAppSelector((state) => state.properties);
  const { compounds, totalCount: compoundsCount } = useAppSelector((state) => state.compounds);
  const { developers, totalCount: developersCount } = useAppSelector((state) => state.developers);
  const { posts, totalCount: postsCount } = useAppSelector((state) => state.blog);

  useEffect(() => {
    // Fetch initial data
    dispatch(fetchProperties({ page: 1, filters: {} }));
    dispatch(fetchCompounds({ page: 1, filters: {} }));
    dispatch(fetchDevelopers({ page: 1, filters: {} }));
    dispatch(fetchBlogPosts({ page: 1, filters: {} }));
  }, [dispatch]);

  const stats = [
    {
      name: 'Total Properties',
      value: propertiesCount.toString(),
      change: '+12%',
      changeType: 'positive' as const,
      icon: Building2,
    },
    {
      name: 'Total Compounds',
      value: compoundsCount.toString(),
      change: '+8%',
      changeType: 'positive' as const,
      icon: MapPin,
    },
    {
      name: 'Total Developers',
      value: developersCount.toString(),
      change: '+5%',
      changeType: 'positive' as const,
      icon: Users,
    },
    {
      name: 'Blog Posts',
      value: postsCount.toString(),
      change: '+15%',
      changeType: 'positive' as const,
      icon: FileText,
    },
  ];

  const quickActions = [
    {
      name: 'Add Property',
      href: '/admin/dashboard/properties/new',
      icon: Plus,
      description: 'Create a new property listing',
    },
    {
      name: 'Add Compound',
      href: '/admin/dashboard/compounds/new',
      icon: MapPin,
      description: 'Create a new compound',
    },
    {
      name: 'Add Developer',
      href: '/admin/dashboard/developers/new',
      icon: Users,
      description: 'Add a new developer',
    },
    {
      name: 'Write Blog Post',
      href: '/admin/dashboard/blog/new',
      icon: FileText,
      description: 'Create a new blog post',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's what's happening with your real estate platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard key={stat.name} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Properties */}
        <div className="lg:col-span-2">
          <RecentProperties properties={properties.slice(0, 5)} />
        </div>

        {/* Quick Actions */}
        <div>
          <QuickActions actions={quickActions} />
        </div>
      </div>

      {/* Activity Feed */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ActivityFeed />
      </div>
    </div>
  );
}

