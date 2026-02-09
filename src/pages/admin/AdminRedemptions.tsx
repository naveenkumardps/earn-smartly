import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { SkeletonTable } from '@/components/ui/skeleton-card';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Check, X, Clock, User } from 'lucide-react';
import type { Redemption } from '@/services/api';

// Mock data
const mockRedemptions: Redemption[] = [
  { id: '1', user_id: '1', user_email: 'john@example.com', points: 500, method: 'paypal', status: 'pending', created_at: '2025-02-09T08:30:00Z' },
  { id: '2', user_id: '2', user_email: 'jane@example.com', points: 1000, method: 'giftcard', status: 'pending', created_at: '2025-02-09T07:15:00Z' },
  { id: '3', user_id: '3', user_email: 'mike@example.com', points: 750, method: 'crypto', status: 'approved', created_at: '2025-02-08T16:45:00Z' },
  { id: '4', user_id: '4', user_email: 'sarah@example.com', points: 500, method: 'paypal', status: 'rejected', created_at: '2025-02-08T14:20:00Z' },
  { id: '5', user_id: '5', user_email: 'alex@example.com', points: 2000, method: 'giftcard', status: 'pending', created_at: '2025-02-08T10:00:00Z' },
];

export function AdminRedemptions() {
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadRedemptions = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setRedemptions(mockRedemptions);
      setIsLoading(false);
    };
    loadRedemptions();
  }, []);

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    setRedemptions((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    toast({
      title: status === 'approved' ? 'Redemption approved' : 'Redemption rejected',
      description: `The redemption request has been ${status}.`,
    });
  };

  const getStatusBadge = (status: Redemption['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-warning/10 text-warning';
      case 'approved':
        return 'bg-success/10 text-success';
      case 'rejected':
        return 'bg-destructive/10 text-destructive';
    }
  };

  const pendingCount = redemptions.filter((r) => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Redemptions"
        description={`${pendingCount} pending requests`}
      />

      {isLoading ? (
        <SkeletonTable rows={5} />
      ) : (
        <motion.div
          className="rounded-xl border bg-card overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">User</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Points</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Method</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Date</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {redemptions.map((redemption, index) => (
                  <motion.tr
                    key={redemption.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {redemption.user_email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-primary" />
                        <span className="font-semibold">{redemption.points.toLocaleString()}</span>
                        <span className="text-muted-foreground">pts</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize">{redemption.method}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusBadge(redemption.status)}`}>
                        {redemption.status === 'pending' && <Clock className="h-3 w-3" />}
                        {redemption.status === 'approved' && <Check className="h-3 w-3" />}
                        {redemption.status === 'rejected' && <X className="h-3 w-3" />}
                        {redemption.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(redemption.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {redemption.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => updateStatus(redemption.id, 'approved')}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateStatus(redemption.id, 'rejected')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
