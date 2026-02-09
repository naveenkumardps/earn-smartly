import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { SkeletonStats } from '@/components/ui/skeleton-card';
import { Users, Gift, CreditCard, TrendingUp } from 'lucide-react';
import type { DashboardStats } from '@/services/api';

// Mock data
const mockStats: DashboardStats = {
  total_users: 12453,
  active_offers: 47,
  pending_redemptions: 23,
  total_points_distributed: 2456000,
};

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStats(mockStats);
      setIsLoading(false);
    };
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your Earnvra platform"
      />

      {/* Stats Grid */}
      {isLoading ? (
        <SkeletonStats />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={stats?.total_users.toLocaleString() || '0'}
            icon={Users}
            change={{ value: 8.2, label: 'from last month' }}
          />
          <StatCard
            title="Active Offers"
            value={stats?.active_offers.toString() || '0'}
            icon={Gift}
            variant="gradient"
          />
          <StatCard
            title="Pending Redemptions"
            value={stats?.pending_redemptions.toString() || '0'}
            icon={CreditCard}
            change={{ value: -12, label: 'from yesterday' }}
          />
          <StatCard
            title="Points Distributed"
            value={`${((stats?.total_points_distributed || 0) / 1000000).toFixed(1)}M`}
            icon={TrendingUp}
          />
        </div>
      )}

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          className="rounded-xl border bg-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { label: 'Review Redemptions', href: '/admin/redemptions', color: 'bg-primary/10 text-primary' },
              { label: 'Manage Providers', href: '/admin/providers', color: 'bg-accent/10 text-accent' },
              { label: 'Update Settings', href: '/admin/settings', color: 'bg-success/10 text-success' },
              { label: 'Edit Legal Pages', href: '/admin/legal-pages', color: 'bg-warning/10 text-warning' },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className={`rounded-lg p-4 font-medium transition-all hover:scale-[1.02] ${action.color}`}
              >
                {action.label}
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="rounded-xl border bg-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { text: 'New user registered', time: '2 minutes ago', type: 'user' },
              { text: 'Redemption request submitted', time: '15 minutes ago', type: 'redeem' },
              { text: 'Provider enabled: Survey Pro', time: '1 hour ago', type: 'provider' },
              { text: 'Settings updated', time: '3 hours ago', type: 'settings' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <span className="text-sm">{activity.text}</span>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
