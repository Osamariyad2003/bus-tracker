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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AdminLayout><Routes /></AdminLayout>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/buses" element={<Buses />} />
            <Route path="/buses/:busId" element={<BusDetail />} />
            <Route path="/tracking" element={<Tracking />} />
            <Route path="/schools" element={<Schools />} />
            <Route path="/students" element={<Students />} />
            <Route path="/routes" element={<Routes />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
