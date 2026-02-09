import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/page-header';
import { SkeletonTable } from '@/components/ui/skeleton-card';
import { Input } from '@/components/ui/input';
import { Users, Wallet, Search, Mail } from 'lucide-react';
import type { AdminUser } from '@/services/api';

// Mock data
const mockUsers: AdminUser[] = [
  { id: '1', email: 'john@example.com', name: 'John Doe', wallet_balance: 1250, status: 'active', created_at: '2025-01-15T00:00:00Z' },
  { id: '2', email: 'jane@example.com', name: 'Jane Smith', wallet_balance: 3420, status: 'active', created_at: '2025-01-18T00:00:00Z' },
  { id: '3', email: 'mike@example.com', name: 'Mike Johnson', wallet_balance: 890, status: 'active', created_at: '2025-01-20T00:00:00Z' },
  { id: '4', email: 'sarah@example.com', name: 'Sarah Williams', wallet_balance: 0, status: 'suspended', created_at: '2025-01-22T00:00:00Z' },
  { id: '5', email: 'alex@example.com', name: 'Alex Brown', wallet_balance: 2100, status: 'active', created_at: '2025-02-01T00:00:00Z' },
  { id: '6', email: 'emma@example.com', name: 'Emma Davis', wallet_balance: 560, status: 'active', created_at: '2025-02-05T00:00:00Z' },
];

export function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setUsers(mockUsers);
      setIsLoading(false);
    };
    loadUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="View and manage user accounts"
      />

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <SkeletonTable rows={6} />
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
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Balance</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary text-sm font-bold text-primary-foreground">
                          {user.name.charAt(0)}
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-primary" />
                        <span className="font-semibold">{user.wallet_balance.toLocaleString()}</span>
                        <span className="text-muted-foreground">pts</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.status === 'active'
                            ? 'bg-success/10 text-success'
                            : 'bg-destructive/10 text-destructive'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">No users found</h3>
              <p className="text-muted-foreground">Try adjusting your search query</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
