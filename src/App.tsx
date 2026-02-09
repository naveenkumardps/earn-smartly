import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { RoleGuard, GuestGuard } from "@/components/guards/RoleGuard";

// Layouts
import { UserLayout } from "@/layouts/UserLayout";
import { AdminLayout } from "@/layouts/AdminLayout";

// User Pages
import { UserHome } from "@/pages/user/UserHome";
import { UserLogin } from "@/pages/user/UserLogin";
import { UserSignup } from "@/pages/user/UserSignup";
import { UserOffers } from "@/pages/user/UserOffers";
import { UserWallet } from "@/pages/user/UserWallet";
import { UserRedeem } from "@/pages/user/UserRedeem";
import { UserProfile } from "@/pages/user/UserProfile";
import { UserReferrals } from "@/pages/user/UserReferrals";
import { UserLegalPage } from "@/pages/user/UserLegalPage";
import { UserContact } from "@/pages/user/UserContact";

// Admin Pages
import { AdminLogin } from "@/pages/admin/AdminLogin";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { AdminProviders } from "@/pages/admin/AdminProviders";
import { AdminOffers } from "@/pages/admin/AdminOffers";
import { AdminSettings } from "@/pages/admin/AdminSettings";
import { AdminLegalPages } from "@/pages/admin/AdminLegalPages";
import { AdminUsers } from "@/pages/admin/AdminUsers";
import { AdminRedemptions } from "@/pages/admin/AdminRedemptions";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/user" replace />} />

            {/* User Auth Routes */}
            <Route path="/user/login" element={
              <GuestGuard redirectTo="/user">
                <UserLogin />
              </GuestGuard>
            } />
            <Route path="/user/signup" element={
              <GuestGuard redirectTo="/user">
                <UserSignup />
              </GuestGuard>
            } />

            {/* User App Routes */}
            <Route path="/user" element={
              <RoleGuard allowedRole="user">
                <UserLayout />
              </RoleGuard>
            }>
              <Route index element={<UserHome />} />
              <Route path="offers" element={<UserOffers />} />
              <Route path="wallet" element={<UserWallet />} />
              <Route path="redeem" element={<UserRedeem />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="referrals" element={<UserReferrals />} />
              <Route path="contact" element={<UserContact />} />
            </Route>

            {/* User Public Legal Pages */}
            <Route path="/user/privacy-policy" element={<UserLegalPage />} />
            <Route path="/user/terms" element={<UserLegalPage />} />

            {/* Admin Auth Routes */}
            <Route path="/admin/login" element={
              <GuestGuard redirectTo="/admin/dashboard">
                <AdminLogin />
              </GuestGuard>
            } />

            {/* Admin App Routes */}
            <Route path="/admin" element={
              <RoleGuard allowedRole="admin">
                <AdminLayout />
              </RoleGuard>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="providers" element={<AdminProviders />} />
              <Route path="offers" element={<AdminOffers />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="legal-pages" element={<AdminLegalPages />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="redemptions" element={<AdminRedemptions />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;