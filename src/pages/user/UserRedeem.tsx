import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-screen';
import { SkeletonCard } from '@/components/ui/skeleton-card';
import { CreditCard, Wallet, Gift, AlertCircle, CheckCircle } from 'lucide-react';
import type { Settings } from '@/services/api';

// Mock settings
const mockSettings: Settings = {
  referral_bonus_points: 100,
  min_redeem_points: 500,
  daily_earning_cap: 1000,
  survey_point_multiplier: 1,
  video_ad_points: 25,
};

const redeemMethods = [
  { id: 'paypal', name: 'PayPal', icon: CreditCard, description: 'Receive funds via PayPal' },
  { id: 'giftcard', name: 'Gift Card', icon: Gift, description: 'Amazon, Visa, and more' },
  { id: 'crypto', name: 'Crypto', icon: Wallet, description: 'Bitcoin, Ethereum, USDT' },
];

export function UserRedeem() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [balance] = useState(1250); // Would come from wallet API
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [points, setPoints] = useState('');
  const [accountDetails, setAccountDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadSettings = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSettings(mockSettings);
      setIsLoading(false);
    };
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const pointsNum = parseInt(points);
    
    if (!selectedMethod) {
      toast({
        title: 'Select a method',
        description: 'Please choose a redemption method.',
        variant: 'destructive',
      });
      return;
    }

    if (!settings || pointsNum < settings.min_redeem_points) {
      toast({
        title: 'Minimum not met',
        description: `Minimum redemption is ${settings?.min_redeem_points} points.`,
        variant: 'destructive',
      });
      return;
    }

    if (pointsNum > balance) {
      toast({
        title: 'Insufficient balance',
        description: 'You don\'t have enough points.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: 'Redemption submitted!',
      description: 'Your request is being processed. You\'ll receive your reward soon.',
    });

    setSelectedMethod(null);
    setPoints('');
    setAccountDetails('');
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Redeem Points" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} lines={2} />
          ))}
        </div>
        <SkeletonCard lines={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Redeem Points"
        description="Convert your points into real rewards"
      />

      {/* Balance Card */}
      <motion.div
        className="rounded-xl gradient-primary p-6 text-primary-foreground shadow-glow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">Available to redeem</p>
            <p className="text-3xl font-bold">{balance.toLocaleString()} points</p>
          </div>
          <Wallet className="h-10 w-10 opacity-50" />
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm opacity-80">
          <AlertCircle className="h-4 w-4" />
          Minimum redemption: {settings?.min_redeem_points} points
        </div>
      </motion.div>

      {/* Redemption Methods */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Choose Redemption Method</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {redeemMethods.map((method, index) => {
            const Icon = method.icon;
            const isSelected = selectedMethod === method.id;

            return (
              <motion.button
                key={method.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedMethod(method.id)}
                className={`relative rounded-xl border p-6 text-left transition-all hover:shadow-medium ${
                  isSelected
                    ? 'border-primary bg-primary/5 ring-2 ring-primary'
                    : 'bg-card hover:border-primary/50'
                }`}
              >
                {isSelected && (
                  <CheckCircle className="absolute right-4 top-4 h-5 w-5 text-primary" />
                )}
                <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">{method.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {method.description}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Redemption Form */}
      {selectedMethod && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="rounded-xl border bg-card p-6"
          onSubmit={handleSubmit}
        >
          <h2 className="mb-4 text-lg font-semibold">Redemption Details</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="points">Points to Redeem</Label>
              <Input
                id="points"
                type="number"
                min={settings?.min_redeem_points}
                max={balance}
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                placeholder={`Min: ${settings?.min_redeem_points}`}
                required
              />
              <p className="text-xs text-muted-foreground">
                Maximum: {balance.toLocaleString()} points
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="account">
                {selectedMethod === 'paypal' && 'PayPal Email'}
                {selectedMethod === 'giftcard' && 'Email for Gift Card'}
                {selectedMethod === 'crypto' && 'Wallet Address'}
              </Label>
              <Input
                id="account"
                type={selectedMethod === 'crypto' ? 'text' : 'email'}
                value={accountDetails}
                onChange={(e) => setAccountDetails(e.target.value)}
                placeholder={
                  selectedMethod === 'crypto'
                    ? 'Enter your wallet address'
                    : 'Enter your email'
                }
                required
              />
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  Processing...
                </>
              ) : (
                'Submit Redemption Request'
              )}
            </Button>
          </div>
        </motion.form>
      )}
    </div>
  );
}
