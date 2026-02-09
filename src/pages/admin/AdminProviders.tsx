import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { SkeletonTable } from '@/components/ui/skeleton-card';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Building2, Gift } from 'lucide-react';
import type { Provider } from '@/services/api';

// Mock data
const mockProviders: Provider[] = [
  { id: '1', name: 'Survey Provider A', is_enabled: true, offer_count: 15, created_at: '2025-01-15T00:00:00Z' },
  { id: '2', name: 'Video Ads Network', is_enabled: true, offer_count: 8, created_at: '2025-01-20T00:00:00Z' },
  { id: '3', name: 'Research Panel B', is_enabled: false, offer_count: 22, created_at: '2025-01-25T00:00:00Z' },
  { id: '4', name: 'Ad Network Pro', is_enabled: true, offer_count: 12, created_at: '2025-02-01T00:00:00Z' },
  { id: '5', name: 'Survey Connect', is_enabled: false, offer_count: 5, created_at: '2025-02-05T00:00:00Z' },
];

export function AdminProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadProviders = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setProviders(mockProviders);
      setIsLoading(false);
    };
    loadProviders();
  }, []);

  const toggleProvider = async (providerId: string, enabled: boolean) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === providerId ? { ...p, is_enabled: enabled } : p))
    );
    toast({
      title: enabled ? 'Provider enabled' : 'Provider disabled',
      description: `Provider has been ${enabled ? 'enabled' : 'disabled'} successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Providers"
        description="Manage offer providers"
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
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Provider</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Offers</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Added</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {providers.map((provider, index) => (
                  <motion.tr
                    key={provider.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <Building2 className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">{provider.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Gift className="h-4 w-4 text-muted-foreground" />
                        {provider.offer_count}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(provider.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          provider.is_enabled
                            ? 'bg-success/10 text-success'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {provider.is_enabled ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Switch
                        checked={provider.is_enabled}
                        onCheckedChange={(checked) => toggleProvider(provider.id, checked)}
                      />
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
