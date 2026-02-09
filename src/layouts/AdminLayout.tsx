import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Building2,
  Gift,
  Settings,
  FileText,
  Users,
  CreditCard,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/providers', label: 'Providers', icon: Building2 },
  { href: '/admin/offers', label: 'Offers', icon: Gift },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/redemptions', label: 'Redemptions', icon: CreditCard },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { href: '/admin/legal-pages', label: 'Legal Pages', icon: FileText },
];

export function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 hidden h-screen bg-sidebar transition-all duration-300 md:block",
          sidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
            {sidebarOpen && (
              <Link to="/admin/dashboard" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg gradient-primary" />
                <span className="text-lg font-bold text-sidebar-foreground">
                  Earnvra
                </span>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <ChevronLeft className={cn("h-4 w-4 transition-transform", !sidebarOpen && 'rotate-180')} />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="border-t border-sidebar-border p-4">
            {sidebarOpen && (
              <div className="mb-3 text-sm">
                <p className="font-medium text-sidebar-foreground">{user?.name || 'Admin'}</p>
                <p className="text-xs text-sidebar-foreground/70">{user?.email}</p>
              </div>
            )}
            <Button
              variant="ghost"
              size={sidebarOpen ? 'default' : 'icon'}
              onClick={logout}
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <LogOut className="h-5 w-5" />
              {sidebarOpen && <span className="ml-2">Logout</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b bg-card px-4 md:hidden">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg gradient-primary" />
          <span className="text-lg font-bold text-gradient">Earnvra Admin</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, x: -300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          className="fixed inset-0 z-40 bg-sidebar pt-16 md:hidden"
        >
          <nav className="space-y-1 p-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors",
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
            <Button
              variant="ghost"
              onClick={logout}
              className="mt-4 w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </nav>
        </motion.div>
      )}

      {/* Main Content */}
      <main
        className={cn(
          "min-h-screen pt-16 transition-all duration-300 md:pt-0",
          sidebarOpen ? 'md:ml-64' : 'md:ml-20'
        )}
      >
        <div className="container py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
