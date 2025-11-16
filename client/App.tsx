import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Buses from "./pages/Buses";
import BusDetail from "./pages/BusDetail";
import Tracking from "./pages/Tracking";
import Schools from "./pages/Schools";
import Students from "./pages/Students";
import RoutesPage from "./pages/Routes";
import StudentPortal from "./pages/StudentPortal";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AdminPage = ({ children }: { children: React.ReactNode }) => (
  <AdminLayout>{children}</AdminLayout>
);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/student-portal" element={<StudentPortal />} />

              {/* Protected Admin Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AdminPage>
                      <Dashboard />
                    </AdminPage>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/buses"
                element={
                  <ProtectedRoute>
                    <AdminPage>
                      <Buses />
                    </AdminPage>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/buses/:busId"
                element={
                  <ProtectedRoute>
                    <AdminPage>
                      <BusDetail />
                    </AdminPage>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tracking"
                element={
                  <ProtectedRoute>
                    <AdminPage>
                      <Tracking />
                    </AdminPage>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/schools"
                element={
                  <ProtectedRoute>
                    <AdminPage>
                      <Schools />
                    </AdminPage>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/students"
                element={
                  <ProtectedRoute>
                    <AdminPage>
                      <Students />
                    </AdminPage>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/routes"
                element={
                  <ProtectedRoute>
                    <AdminPage>
                      <RoutesPage />
                    </AdminPage>
                  </ProtectedRoute>
                }
              />

              {/* 404 - Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
