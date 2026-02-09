import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { SkeletonStats, SkeletonTable } from '@/components/ui/skeleton-card';
import { Wallet, TrendingUp, ArrowDownRight, ArrowUpRight, Gift, Clock } from 'lucide-react';
import type { WalletData, Transaction } from '@/services/api';
import { cn } from '@/lib/utils';

// Mock data
const mockWalletData: WalletData = {
  balance: 1250,
  lifetime_earned: 5420,
  transactions: [
    { id: '1', type: 'earned', points: 50, description: 'Quick Survey completed', created_at: '2025-02-09T10:30:00Z' },
    { id: '2', type: 'referral', points: 100, description: 'Referral bonus from john@email.com', created_at: '2025-02-08T14:20:00Z' },
    { id: '3', type: 'earned', points: 25, description: 'Video ad watched', created_at: '2025-02-08T09:15:00Z' },
    { id: '4', type: 'redeemed', points: -500, description: 'Redeemed for gift card', created_at: '2025-02-07T16:45:00Z' },
    { id: '5', type: 'earned', points: 150, description: 'Product Review Survey completed', created_at: '2025-02-06T11:00:00Z' },
    { id: '6', type: 'bonus', points: 50, description: 'Daily login bonus', created_at: '2025-02-05T08:00:00Z' },
  ],
};

export function UserWallet() {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWallet = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setWalletData(mockWalletData);
      setIsLoading(false);
    };
    loadWallet();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'earned':
        return <ArrowUpRight className="h-4 w-4" />;
      case 'redeemed':
        return <ArrowDownRight className="h-4 w-4" />;
      case 'referral':
        return <Gift className="h-4 w-4" />;
      case 'bonus':
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'earned':
      case 'referral':
      case 'bonus':
        return 'text-success bg-success/10';
      case 'redeemed':
        return 'text-primary bg-primary/10';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Your Wallet"
        description="Track your earnings and transactions"
      />

      {/* Stats */}
      {isLoading ? (
        <SkeletonStats />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <StatCard
            variant="gradient"
            title="Current Balance"
            value={`${walletData?.balance.toLocaleString()} pts`}
            icon={Wallet}
          />
          <StatCard
            title="Lifetime Earned"
            value={`${walletData?.lifetime_earned.toLocaleString()} pts`}
            icon={TrendingUp}
            change={{ value: 12, label: 'this month' }}
          />
        </div>
      )}

      {/* Transaction History */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Transaction History</h2>

        {isLoading ? (
          <SkeletonTable rows={5} />
        ) : (
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="divide-y">
              {walletData?.transactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "rounded-full p-2",
                      getTransactionColor(transaction.type)
                    )}>
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDate(transaction.created_at)}
                      </p>
                    </div>
                  </div>
                  <span className={cn(
                    "font-semibold",
                    transaction.points > 0 ? 'text-success' : 'text-foreground'
                  )}>
                    {transaction.points > 0 ? '+' : ''}{transaction.points} pts
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
