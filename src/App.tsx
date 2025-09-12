import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import { AuthGuard } from "./components/auth/AuthGuard";
import { AdminGuard } from "./components/auth/AdminGuard";
import { RoleBasedRouter } from "./components/auth/RoleBasedRouter";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { VendorLayout } from "./components/layout/VendorLayout";
import { ManageVendorsLayout } from "./components/layout/ManageVendorsLayout";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Evaluation from "./pages/Evaluation";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import VendorDashboard from "./pages/VendorDashboard";
import VendorProfileCompletion from "./pages/VendorProfileCompletion";
import VendorOnboarding from "./pages/VendorOnboarding";
import ManageVendors from "./pages/ManageVendors";
import VendorApplicationPortal from "./pages/VendorApplicationPortal";
import AddVendor from "./pages/AddVendor";
import RemoveVendor from "./pages/RemoveVendor";
import RecommendationDetails from "./pages/RecommendationDetails";
import EchoAI from "./pages/EchoAI";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RoleBasedRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<AuthGuard><DashboardLayout /></AuthGuard>}>
                <Route index element={<Dashboard />} />
                <Route path="recommendations/:id" element={<RecommendationDetails />} />
                <Route path="evaluation" element={<Evaluation />} />
                <Route path="onboarding" element={<Onboarding />} />
                <Route path="active-management" element={<div className="p-8 text-center text-muted-foreground">Active Management page coming soon...</div>} />
                <Route path="renewal-exit" element={<div className="p-8 text-center text-muted-foreground">Renewal/Exit page coming soon...</div>} />
                <Route path="offboarding" element={<div className="p-8 text-center text-muted-foreground">Offboarding page coming soon...</div>} />
                <Route path="echo-ai" element={<EchoAI />} />
              </Route>
              
              <Route path="/manage-vendors" element={<AdminGuard><ManageVendorsLayout /></AdminGuard>}>
                <Route index element={<ManageVendors />} />
                <Route path="application-portal" element={<VendorApplicationPortal />} />
                <Route path="add-vendor" element={<AddVendor />} />
                <Route path="remove-vendor" element={<RemoveVendor />} />
              </Route>
              
              <Route path="/vendors" element={<AuthGuard><VendorLayout /></AuthGuard>}>
                <Route index element={<VendorDashboard />} />
                <Route path="complete-profile" element={<VendorProfileCompletion />} />
                <Route path="onboarding" element={<VendorOnboarding />} />
              </Route>
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </RoleBasedRouter>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
