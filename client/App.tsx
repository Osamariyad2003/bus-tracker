import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Buses from "./pages/Buses";
import BusDetail from "./pages/BusDetail";
import Tracking from "./pages/Tracking";
import Schools from "./pages/Schools";
import Students from "./pages/Students";
import Routes from "./pages/Routes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AdminPage = ({ children }: { children: React.ReactNode }) => (
  <AdminLayout>{children}</AdminLayout>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AdminPage><Dashboard /></AdminPage>} />
          <Route path="/buses" element={<AdminPage><Buses /></AdminPage>} />
          <Route path="/buses/:busId" element={<AdminPage><BusDetail /></AdminPage>} />
          <Route path="/tracking" element={<AdminPage><Tracking /></AdminPage>} />
          <Route path="/schools" element={<AdminPage><Schools /></AdminPage>} />
          <Route path="/students" element={<AdminPage><Students /></AdminPage>} />
          <Route path="/routes" element={<AdminPage><Routes /></AdminPage>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
