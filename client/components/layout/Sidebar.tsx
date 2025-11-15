import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Bus,
  MapPin,
  Building2,
  Users,
  Settings,
  LogOut,
  BarChart3,
  Navigation,
} from "lucide-react";

export function Sidebar() {
  const location = useLocation();

  const navigationItems = [
    {
      label: "Dashboard",
      href: "/",
      icon: BarChart3,
    },
    {
      label: "Buses",
      href: "/buses",
      icon: Bus,
    },
    {
      label: "Live Tracking",
      href: "/tracking",
      icon: Navigation,
    },
    {
      label: "Schools",
      href: "/schools",
      icon: Building2,
    },
    {
      label: "Students",
      href: "/students",
      icon: Users,
    },
    {
      label: "Routes",
      href: "/routes",
      icon: MapPin,
    },
  ];

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Bus className="w-6 h-6 text-sidebar-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-sidebar-foreground">
              BusTrack
            </h1>
            <p className="text-xs text-sidebar-foreground/60">Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/10"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/10 transition-all duration-200">
          <Settings className="w-5 h-5" />
          <span className="font-medium text-sm">Settings</span>
        </button>
        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-red-500/10 transition-all duration-200">
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}
