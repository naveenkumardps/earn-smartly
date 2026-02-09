import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/types/auth';
import { LoadingScreen } from '@/components/ui/loading-screen';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRole: UserRole;
  redirectTo?: string;
}

export function RoleGuard({ children, allowedRole, redirectTo }: RoleGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    // Redirect to appropriate login page
    const loginPath = allowedRole === 'admin' ? '/admin/login' : '/user/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (user?.role !== allowedRole) {
    // Redirect to the appropriate app based on user's actual role
    const redirect = redirectTo || (user?.role === 'admin' ? '/admin/dashboard' : '/user');
    return <Navigate to={redirect} replace />;
  }

  return <>{children}</>;
}

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isLoading, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/user/login" state={{ from: location }} replace />;
  }

  // Redirect to correct app based on role
  if (user?.role === 'admin' && !location.pathname.startsWith('/admin')) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user?.role === 'user' && location.pathname.startsWith('/admin')) {
    return <Navigate to="/user" replace />;
  }

  return <>{children}</>;
}

interface GuestGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function GuestGuard({ children, redirectTo }: GuestGuardProps) {
  const { isLoading, isAuthenticated, user } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated && user) {
    const redirect = redirectTo || (user.role === 'admin' ? '/admin/dashboard' : '/user');
    return <Navigate to={redirect} replace />;
  }

  return <>{children}</>;
}
