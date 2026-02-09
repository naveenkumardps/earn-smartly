import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Gift, Wallet, Users, ArrowRight, Sparkles, TrendingUp, Shield } from 'lucide-react';

export function UserHome() {
  const { user } = useAuth();

  const features = [
    {
      icon: Gift,
      title: 'Complete Offers',
      description: 'Earn points by completing surveys and watching videos',
      href: '/user/offers',
    },
    {
      icon: Wallet,
      title: 'Track Earnings',
      description: 'Monitor your points and transaction history',
      href: '/user/wallet',
    },
    {
      icon: Users,
      title: 'Refer Friends',
      description: 'Invite friends and earn bonus points',
      href: '/user/referrals',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.section
        className="relative overflow-hidden rounded-2xl gradient-hero p-8 md:p-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Welcome back{user?.name ? `, ${user.name}` : ''}!
            </span>
          </motion.div>

          <motion.h1
            className="mt-6 text-3xl font-bold text-white md:text-5xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Start Earning
            <br />
            Rewards Today
          </motion.h1>

          <motion.p
            className="mt-4 text-lg text-white/80"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Complete simple tasks, earn points, and redeem for real rewards.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button asChild size="lg" variant="glass">
              <Link to="/user/offers">
                Browse Offers
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="glass">
              <Link to="/user/wallet">View Wallet</Link>
            </Button>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
      </motion.section>

      {/* Quick Stats */}
      <section className="grid gap-4 md:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Link
                to={feature.href}
                className="group block rounded-xl border bg-card p-6 shadow-soft transition-all hover:shadow-medium hover:-translate-y-1"
              >
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
                <span className="mt-4 inline-flex items-center text-sm font-medium text-primary">
                  Get started
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          );
        })}
      </section>

      {/* Trust Section */}
      <motion.section
        className="rounded-xl border bg-card p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex flex-col items-center gap-6 md:flex-row">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-success/10 p-3">
              <Shield className="h-6 w-6 text-success" />
            </div>
            <div>
              <h4 className="font-semibold">Secure & Trusted</h4>
              <p className="text-sm text-muted-foreground">Your data is protected</p>
            </div>
          </div>
          <div className="h-px flex-1 bg-border md:h-12 md:w-px" />
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold">Fast Payouts</h4>
              <p className="text-sm text-muted-foreground">Redeem points instantly</p>
            </div>
          </div>
          <div className="h-px flex-1 bg-border md:h-12 md:w-px" />
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-accent/10 p-3">
              <Gift className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h4 className="font-semibold">Daily Offers</h4>
              <p className="text-sm text-muted-foreground">New ways to earn daily</p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
