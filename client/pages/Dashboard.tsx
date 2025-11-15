import { useState, useEffect } from "react";
import { supabase, Bus } from "@/lib/supabase";
import { AlertCircle, CheckCircle2, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeBuses: 0,
    totalBuses: 0,
    onlineNow: 0,
    totalStudents: 0,
  });

  useEffect(() => {
    fetchBuses();
    const interval = setInterval(fetchBuses, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("buses")
        .select("*")
        .limit(10);

      if (error) throw error;

      setBuses(data || []);
      
      // Calculate stats
      const active = data?.filter((b: Bus) => b.status === "active").length || 0;
      const online = data?.filter((b: Bus) => b.has_gps).length || 0;

      setStats({
        activeBuses: active,
        totalBuses: data?.length || 0,
        onlineNow: online,
        totalStudents: 0,
      });
    } catch (error) {
      console.error("Error fetching buses:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your fleet overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium mb-2">
                Total Buses
              </p>
              <p className="text-3xl font-bold text-foreground">
                {stats.totalBuses}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium mb-2">
                Active Buses
              </p>
              <p className="text-3xl font-bold text-foreground">
                {stats.activeBuses}
              </p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium mb-2">
                Online Now
              </p>
              <p className="text-3xl font-bold text-foreground">
                {stats.onlineNow}
              </p>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-accent" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium mb-2">
                Students Tracked
              </p>
              <p className="text-3xl font-bold text-foreground">0</p>
            </div>
            <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-info" />
            </div>
          </div>
        </Card>
      </div>

      {/* Buses Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Active Buses</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Real-time fleet status
            </p>
          </div>
          <Link to="/buses">
            <Button variant="default">View All Buses</Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading buses...</div>
          </div>
        ) : buses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No buses found</p>
            <Link to="/buses">
              <Button variant="outline">Add a Bus</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {buses.map((bus) => (
              <Link key={bus.id} to={`/buses/${bus.id}`}>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">
                        {bus.bus_number}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{bus.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {bus.model} • {bus.year}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {bus.capacity} seats
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {bus.status}
                      </p>
                    </div>
                    <div
                      className={`w-3 h-3 rounded-full ${
                        bus.has_gps
                          ? "bg-success animate-pulse"
                          : "bg-muted"
                      }`}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
