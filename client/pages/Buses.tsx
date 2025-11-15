import { useState, useEffect } from "react";
import { supabase, Bus, BusLocation } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BusMap } from "@/components/map/BusMap";
import { Search, Filter, Plus, MapPin, AlertTriangle, CheckCircle } from "lucide-react";

export default function Buses() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [busLocations, setBusLocations] = useState<Record<string, BusLocation>>({});
  const [selectedBusId, setSelectedBusId] = useState<string | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchBuses();
    const interval = setInterval(fetchBuses, 5000); // Real-time updates every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const { data: busesData, error: busesError } = await supabase
        .from("buses")
        .select("*");

      if (busesError) throw busesError;

      setBuses(busesData || []);

      // Fetch latest locations for all buses
      const { data: locationsData, error: locError } = await supabase
        .from("bus_locations")
        .select("*")
        .in("bus_id", (busesData || []).map((b) => b.id));

      if (!locError && locationsData) {
        const locMap: Record<string, BusLocation> = {};
        locationsData.forEach((loc: BusLocation) => {
          locMap[loc.bus_id] = loc;
        });
        setBusLocations(locMap);
      }
    } catch (error) {
      console.error("Error fetching buses:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBuses = buses.filter((bus) => {
    const matchesSearch =
      bus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.bus_number.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && bus.status === "active") ||
      (filterStatus === "online" && bus.has_gps && busLocations[bus.id]);

    return matchesSearch && matchesStatus;
  });

  const buswithLocations = filteredBuses.map((bus) => ({
    bus,
    location: busLocations[bus.id],
  }));

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Buses</h1>
          <p className="text-muted-foreground">
            Manage and monitor your fleet
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Bus
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search buses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Buses</option>
          <option value="active">Active</option>
          <option value="online">Online Now</option>
        </select>
      </div>

      {/* Map Section */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">
          Real-Time Tracking Map
        </h2>
        <BusMap
          buses={buswithLocations}
          selectedBusId={selectedBusId}
          onBusSelect={setSelectedBusId}
        />
      </Card>

      {/* Buses List */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Bus Fleet</h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading buses...</p>
          </div>
        ) : filteredBuses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No buses found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBuses.map((bus) => {
              const location = busLocations[bus.id];
              const isOnline = bus.has_gps && location;

              return (
                <Link key={bus.id} to={`/buses/${bus.id}`}>
                  <Card className="p-4 border-2 hover:border-primary hover:shadow-lg transition-all cursor-pointer h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-foreground">
                          {bus.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Bus #{bus.bus_number}
                        </p>
                      </div>
                      <div
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          isOnline
                            ? "bg-success/20 text-success"
                            : "bg-muted/20 text-muted-foreground"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isOnline ? "bg-success" : "bg-muted-foreground"
                          } ${isOnline ? "animate-pulse" : ""}`}
                        />
                        {isOnline ? "Online" : "Offline"}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Model:</span>
                        <span className="font-medium text-foreground">
                          {bus.model}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Year:</span>
                        <span className="font-medium text-foreground">
                          {bus.year}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Capacity:</span>
                        <span className="font-medium text-foreground">
                          {bus.capacity} seats
                        </span>
                      </div>
                    </div>

                    {location && (
                      <div className="pt-4 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>Speed: {location.speed_kmh} km/h</span>
                      </div>
                    )}

                    {bus.status !== "active" && (
                      <div className="pt-4 border-t border-border flex items-center gap-2 text-xs text-warning">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Status: {bus.status}</span>
                      </div>
                    )}
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
