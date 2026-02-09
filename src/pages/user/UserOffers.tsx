import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/page-header';
import { SkeletonCard } from '@/components/ui/skeleton-card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Gift, Clock, ArrowRight, PlayCircle, ClipboardList } from 'lucide-react';
import type { Offer } from '@/services/api';

// Mock data for demo
const mockOffers: Offer[] = [
  {
    id: '1',
    title: 'Quick Survey',
    description: 'Share your opinion on shopping habits and earn points instantly.',
    points: 50,
    type: 'survey',
    estimated_time: '3 min',
  },
  {
    id: '2',
    title: 'Product Review Survey',
    description: 'Help brands improve their products by completing this detailed survey.',
    points: 150,
    type: 'survey',
    estimated_time: '10 min',
  },
  {
    id: '3',
    title: 'Watch & Earn',
    description: 'Watch a short promotional video and earn bonus points.',
    points: 25,
    type: 'video',
    estimated_time: '1 min',
  },
  {
    id: '4',
    title: 'Lifestyle Survey',
    description: 'Tell us about your daily routine and preferences.',
    points: 75,
    type: 'survey',
    estimated_time: '5 min',
  },
  {
    id: '5',
    title: 'Premium Video Ad',
    description: 'Watch this premium advertisement and earn extra points.',
    points: 40,
    type: 'video',
    estimated_time: '2 min',
  },
  {
    id: '6',
    title: 'Market Research',
    description: 'Participate in market research and influence future products.',
    points: 200,
    type: 'survey',
    estimated_time: '15 min',
  },
];

export function UserOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'survey' | 'video'>('all');
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call
    const loadOffers = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOffers(mockOffers);
      setIsLoading(false);
    };
    loadOffers();
  }, []);

  const filteredOffers = offers.filter((offer) => {
    if (filter === 'all') return true;
    return offer.type === filter;
  });

  const handleStartOffer = (offer: Offer) => {
    toast({
      title: 'Offer Started',
      description: `Starting "${offer.title}". Complete it to earn ${offer.points} points!`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Available Offers"
        description="Complete offers to earn points"
      />

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'survey', 'video'] as const).map((tab) => (
          <Button
            key={tab}
            variant={filter === tab ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(tab)}
            className="capitalize"
          >
            {tab === 'survey' && <ClipboardList className="mr-1 h-4 w-4" />}
            {tab === 'video' && <PlayCircle className="mr-1 h-4 w-4" />}
            {tab === 'all' && <Gift className="mr-1 h-4 w-4" />}
            {tab}
          </Button>
        ))}
      </div>

      {/* Offers Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} lines={3} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredOffers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-soft transition-all hover:shadow-medium hover:-translate-y-1"
            >
              {/* Type Badge */}
              <div className="absolute right-4 top-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  {offer.type === 'survey' ? (
                    <ClipboardList className="h-3 w-3" />
                  ) : (
                    <PlayCircle className="h-3 w-3" />
                  )}
                  {offer.type}
                </span>
              </div>

              {/* Content */}
              <div className="mb-4">
                <div className="mb-2 inline-flex rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 p-3">
                  <Gift className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{offer.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {offer.description}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Gift className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-primary">{offer.points}</span> pts
                  </span>
                  {offer.estimated_time && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {offer.estimated_time}
                    </span>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="gradient"
                  onClick={() => handleStartOffer(offer)}
                >
                  Start
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!isLoading && filteredOffers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Gift className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No offers available</h3>
          <p className="text-muted-foreground">Check back later for new opportunities!</p>
        </div>
      )}
    </div>
  );
}
