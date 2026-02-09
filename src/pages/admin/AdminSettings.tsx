import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SkeletonCard } from '@/components/ui/skeleton-card';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-screen';
import { Save, Settings, Gift, Users, CreditCard, TrendingUp } from 'lucide-react';
import type { Settings as SettingsType } from '@/services/api';

// Mock data
const mockSettings: SettingsType = {
  referral_bonus_points: 100,
  survey_point_multiplier: 1,
  video_ad_points: 25,
  min_redeem_points: 500,
  daily_earning_cap: 1000,
};

const settingsConfig = [
  { key: 'referral_bonus_points', label: 'Referral Bonus Points', description: 'Points awarded for each successful referral', icon: Users },
  { key: 'survey_point_multiplier', label: 'Survey Point Multiplier', description: 'Multiplier applied to survey points', icon: TrendingUp },
  { key: 'video_ad_points', label: 'Video Ad Points', description: 'Points awarded per video ad viewed', icon: Gift },
  { key: 'min_redeem_points', label: 'Minimum Redeem Points', description: 'Minimum points required for redemption', icon: CreditCard },
  { key: 'daily_earning_cap', label: 'Daily Earning Cap', description: 'Maximum points a user can earn per day', icon: Settings },
];

export function AdminSettings() {
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadSettings = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSettings(mockSettings);
      setIsLoading(false);
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast({
      title: 'Settings saved',
      description: 'Your settings have been updated successfully.',
    });
    setIsSaving(false);
  };

  const updateSetting = (key: keyof SettingsType, value: number) => {
    if (settings) {
      setSettings({ ...settings, [key]: value });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Settings" />
        <SkeletonCard lines={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure platform values and limits"
      >
        <Button variant="gradient" onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <LoadingSpinner size="sm" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </PageHeader>

      <motion.div
        className="rounded-xl border bg-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="space-y-6">
          {settingsConfig.map((config, index) => {
            const Icon = config.icon;
            const key = config.key as keyof SettingsType;
            return (
              <motion.div
                key={config.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col gap-4 border-b pb-6 last:border-0 last:pb-0 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <Label className="text-base font-medium">{config.label}</Label>
                    <p className="text-sm text-muted-foreground">{config.description}</p>
                  </div>
                </div>
                <div className="w-full md:w-32">
                  <Input
                    type="number"
                    value={settings?.[key] || 0}
                    onChange={(e) => updateSetting(key, parseFloat(e.target.value) || 0)}
                    className="text-right"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
