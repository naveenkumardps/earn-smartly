import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MobileNav } from '@/components/ui/mobile-nav';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Home,
  Gift,
  Wallet,
  CreditCard,
  User,
  Users,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/user', label: 'Home', icon: Home },
  { href: '/user/offers', label: 'Offers', icon: Gift },
  { href: '/user/wallet', label: 'Wallet', icon: Wallet },
  { href: '/user/redeem', label: 'Redeem', icon: CreditCard },
  { href: '/user/profile', label: 'Profile', icon: User },
];

const mobileNavItems = [
  { href: '/user', label: 'Home', icon: Home },
  { href: '/user/offers', label: 'Offers', icon: Gift },
  { href: '/user/wallet', label: 'Wallet', icon: Wallet },
  { href: '/user/profile', label: 'Profile', icon: User },
];

export function UserLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/user" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-primary" />
              <span className="text-xl font-bold text-gradient">Earnvra</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium transition-colors rounded-lg",
                      isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-0 rounded-lg bg-primary/10"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative">{item.label}</span>
                  </Link>
                );
              })}
              <Link
                to="/user/referrals"
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-colors rounded-lg",
                  location.pathname === '/user/referrals' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {location.pathname === '/user/referrals' && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-lg bg-primary/10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative">Referrals</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-muted-foreground md:block">
              {user?.email}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="hidden md:flex"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t bg-card md:hidden"
          >
            <div className="container py-4 space-y-2">
              <Link
                to="/user/referrals"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium hover:bg-muted"
              >
                <Users className="h-5 w-5" />
                Referrals
              </Link>
              <Link
                to="/user/redeem"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium hover:bg-muted"
              >
                <CreditCard className="h-5 w-5" />
                Redeem
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                onClick={logout}
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </div>
          </motion.div>
        )}
      </header>

      {/* Main Content */}
      <main className="container pb-24 pt-6 md:pb-8">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <MobileNav items={mobileNavItems} />
    </div>
  );
}
