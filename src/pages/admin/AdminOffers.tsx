import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/page-header';
import { SkeletonTable } from '@/components/ui/skeleton-card';
import { Gift, Clock, PlayCircle, ClipboardList } from 'lucide-react';
import type { Offer } from '@/services/api';

// Mock data
const mockOffers: Offer[] = [
  { id: '1', title: 'Quick Survey', description: 'Share your opinion on shopping habits.', points: 50, type: 'survey', estimated_time: '3 min' },
  { id: '2', title: 'Product Review Survey', description: 'Help brands improve their products.', points: 150, type: 'survey', estimated_time: '10 min' },
  { id: '3', title: 'Watch & Earn', description: 'Watch a short promotional video.', points: 25, type: 'video', estimated_time: '1 min' },
  { id: '4', title: 'Lifestyle Survey', description: 'Tell us about your daily routine.', points: 75, type: 'survey', estimated_time: '5 min' },
  { id: '5', title: 'Premium Video Ad', description: 'Watch this premium advertisement.', points: 40, type: 'video', estimated_time: '2 min' },
  { id: '6', title: 'Market Research', description: 'Participate in market research.', points: 200, type: 'survey', estimated_time: '15 min' },
];

export function AdminOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOffers = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setOffers(mockOffers);
      setIsLoading(false);
    };
    loadOffers();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Offers"
        description="View all available offers (read-only)"
      />

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
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Offer</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Points</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {offers.map((offer, index) => (
                  <motion.tr
                    key={offer.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <Gift className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{offer.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{offer.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary capitalize">
                        {offer.type === 'survey' ? <ClipboardList className="h-3 w-3" /> : <PlayCircle className="h-3 w-3" />}
                        {offer.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-primary">{offer.points}</span>
                      <span className="text-muted-foreground"> pts</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {offer.estimated_time}
                      </div>
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
