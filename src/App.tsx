import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="evaluation" element={<div className="p-8 text-center text-muted-foreground">Evaluation page coming soon...</div>} />
            <Route path="onboarding" element={<div className="p-8 text-center text-muted-foreground">Onboarding page coming soon...</div>} />
            <Route path="active-management" element={<div className="p-8 text-center text-muted-foreground">Active Management page coming soon...</div>} />
            <Route path="renewal-exit" element={<div className="p-8 text-center text-muted-foreground">Renewal/Exit page coming soon...</div>} />
            <Route path="offboarding" element={<div className="p-8 text-center text-muted-foreground">Offboarding page coming soon...</div>} />
            <Route path="echo-ai" element={<div className="p-8 text-center text-muted-foreground">Echo AI page coming soon...</div>} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
