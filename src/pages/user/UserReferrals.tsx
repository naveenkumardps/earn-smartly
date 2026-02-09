import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { SkeletonCard } from '@/components/ui/skeleton-card';
import { Users, Gift, Copy, Share2, CheckCircle } from 'lucide-react';
import type { ReferralData, Settings } from '@/services/api';

// Mock data
const mockReferralData: ReferralData = {
  referral_code: 'EARN7X9K2M',
  referral_link: 'https://earnvra.com/join?ref=EARN7X9K2M',
  referral_count: 5,
  bonus_points: 500,
};

const mockSettings: Settings = {
  referral_bonus_points: 100,
  min_redeem_points: 500,
  daily_earning_cap: 1000,
  survey_point_multiplier: 1,
  video_ad_points: 25,
};

export function UserReferrals() {
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState<'code' | 'link' | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setReferralData(mockReferralData);
      setSettings(mockSettings);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const copyToClipboard = async (text: string, type: 'code' | 'link') => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    toast({
      title: 'Copied!',
      description: `${type === 'code' ? 'Referral code' : 'Referral link'} copied to clipboard.`,
    });
    setTimeout(() => setCopied(null), 2000);
  };

  const shareReferral = async () => {
    if (navigator.share && referralData) {
      try {
        await navigator.share({
          title: 'Join Earnvra',
          text: `Join Earnvra and start earning rewards! Use my referral code: ${referralData.referral_code}`,
          url: referralData.referral_link,
        });
      } catch {
        copyToClipboard(referralData.referral_link, 'link');
      }
    } else if (referralData) {
      copyToClipboard(referralData.referral_link, 'link');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Referrals" />
        <SkeletonCard lines={4} />
        <SkeletonCard lines={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Refer & Earn"
        description="Invite friends and earn bonus points"
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          className="rounded-xl gradient-primary p-6 text-primary-foreground shadow-glow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">You earn per referral</p>
              <p className="text-3xl font-bold">{settings?.referral_bonus_points} pts</p>
            </div>
            <Gift className="h-10 w-10 opacity-50" />
          </div>
        </motion.div>

        <motion.div
          className="rounded-xl border bg-card p-6 shadow-soft"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total referrals</p>
              <p className="text-3xl font-bold">{referralData?.referral_count}</p>
              <p className="text-sm text-success">+{referralData?.bonus_points} pts earned</p>
            </div>
            <div className="rounded-full bg-primary/10 p-3">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Referral Code & Link */}
      <motion.div
        className="rounded-xl border bg-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="mb-6 text-lg font-semibold">Your Referral Details</h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Referral Code
            </label>
            <div className="flex gap-2">
              <Input
                value={referralData?.referral_code || ''}
                readOnly
                className="font-mono text-lg font-semibold tracking-wider"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(referralData?.referral_code || '', 'code')}
              >
                {copied === 'code' ? (
                  <CheckCircle className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Referral Link
            </label>
            <div className="flex gap-2">
              <Input
                value={referralData?.referral_link || ''}
                readOnly
                className="text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(referralData?.referral_link || '', 'link')}
              >
                {copied === 'link' ? (
                  <CheckCircle className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Button variant="gradient" size="lg" className="w-full" onClick={shareReferral}>
            <Share2 className="h-4 w-4" />
            Share with Friends
          </Button>
        </div>
      </motion.div>

      {/* How it Works */}
      <motion.div
        className="rounded-xl border bg-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="mb-6 text-lg font-semibold">How It Works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { step: 1, title: 'Share Your Code', description: 'Send your unique referral code or link to friends' },
            { step: 2, title: 'Friends Sign Up', description: 'They create an account using your referral' },
            { step: 3, title: 'Earn Points', description: `You get ${settings?.referral_bonus_points} points when they complete their first offer` },
          ].map((item, index) => (
            <div key={item.step} className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full gradient-primary text-xl font-bold text-primary-foreground">
                {item.step}
              </div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
