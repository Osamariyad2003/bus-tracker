import { useState, useEffect } from "react";
import { supabase, Bus, BusLocation, isBusOnline } from "@/lib/supabase";
import { AlertCircle, CheckCircle2, TrendingUp, Users, Bus as BusIcon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { LoadingPage } from "@/components/ui/loading-spinner";
import { ErrorMessage, EmptyState } from "@/components/ui/error-message";

export default function Dashboard() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [busLocations, setBusLocations] = useState<Record<string, BusLocation>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    activeBuses: 0,
    totalBuses: 0,
    onlineNow: 0,
    totalStudents: 0,
  });

  useEffect(() => {
    fetchBuses();
    // Load data once on mount - no auto-refresh
  }, []);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("buses")
        .select("*")
        .limit(10);

      if (error) {
        console.error("Error fetching buses:", error.message || error);
        throw new Error(error.message || "Failed to fetch buses");
      }

      setBuses(data || []);

      // Fetch latest locations for all buses
      if (data && data.length > 0) {
        const { data: locationsData, error: locError } = await supabase
          .from("bus_locations")
          .select("*")
          .in(
            "bus_id",
            data.map((b) => b.id)
          );

        if (locError) {
          console.error("Error fetching bus locations:", locError.message || locError);
        } else if (locationsData) {
          const locMap: Record<string, BusLocation> = {};
          locationsData.forEach((loc: BusLocation) => {
            locMap[loc.bus_id] = loc;
          });
          setBusLocations(locMap);

          // Calculate stats with actual online detection
          const active = data.filter((b: Bus) => b.status === "active").length;
          const online = data.filter((b: Bus) => isBusOnline(locMap[b.id], b.has_gps)).length;

          setStats({
            activeBuses: active,
            totalBuses: data.length,
            onlineNow: online,
            totalStudents: 0,
          });
        }
      } else {
        setStats({
          activeBuses: 0,
          totalBuses: 0,
          onlineNow: 0,
          totalStudents: 0,
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("Error fetching buses:", errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingPage text="Loading dashboard..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to load dashboard"
        message={error}
        onRetry={fetchBuses}
      />
    );
  }

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your fleet overview.
          </p>
        </div>
        <Button 
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => fetchBuses()}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
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

        {buses.length === 0 ? (
          <EmptyState
            icon={<BusIcon className="w-16 h-16" />}
            title="No buses in your fleet"
            description="Start by adding your first bus to begin tracking."
            action={{
              label: "Add a Bus",
              onClick: () => window.location.href = "/buses",
            }}
          />
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
                      <p className="font-semibold text-foreground">
                        {bus.name}
                      </p>
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
                        isBusOnline(busLocations[bus.id], bus.has_gps) 
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
