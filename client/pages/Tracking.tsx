import { useState, useEffect } from "react";
import { supabase, Bus, BusLocation } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { BusMap } from "@/components/map/BusMap";
import { MapPin, Radio } from "lucide-react";

export default function Tracking() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [busLocations, setBusLocations] = useState<Record<string, BusLocation>>({});
  const [selectedBusId, setSelectedBusId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTracking();
    const interval = setInterval(fetchTracking, 3000); // Update every 3 seconds for real-time
    return () => clearInterval(interval);
  }, []);

  const fetchTracking = async () => {
    try {
      setLoading(true);
      const { data: busesData, error: busesError } = await supabase
        .from("buses")
        .select("*")
        .eq("has_gps", true);

      if (busesError) {
        console.error("Error fetching buses for tracking:", busesError.message || busesError);
        throw new Error(busesError.message || "Failed to fetch buses");
      }

      setBuses(busesData || []);

      // Fetch latest locations
      const { data: locationsData, error: locError } = await supabase
        .from("bus_locations")
        .select("*")
        .in("bus_id", (busesData || []).map((b) => b.id));

      if (locError) {
        console.error("Error fetching tracking locations:", locError.message || locError);
      } else if (locationsData) {
        const locMap: Record<string, BusLocation> = {};
        locationsData.forEach((loc: BusLocation) => {
          locMap[loc.bus_id] = loc;
        });
        setBusLocations(locMap);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("Error fetching tracking data:", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const buswithLocations = buses.map((bus) => ({
    bus,
    location: busLocations[bus.id],
  }));

  const onlineBuses = buswithLocations.filter((b) => b.location);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Live Tracking</h1>
        <p className="text-muted-foreground">
          Real-time GPS tracking for all buses in your fleet
        </p>
      </div>

      {/* Status Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium mb-2">
                Total Tracked
              </p>
              <p className="text-3xl font-bold text-foreground">
                {buses.length}
              </p>
            </div>
            <Radio className="w-8 h-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium mb-2">
                Online Now
              </p>
              <p className="text-3xl font-bold text-success">
                {onlineBuses.length}
              </p>
            </div>
            <div className="w-4 h-4 rounded-full bg-success animate-pulse" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium mb-2">
                Offline
              </p>
              <p className="text-3xl font-bold text-muted-foreground">
                {buses.length - onlineBuses.length}
              </p>
            </div>
            <div className="w-4 h-4 rounded-full bg-muted" />
          </div>
        </Card>
      </div>

      {/* Map */}
      <Card className="p-6 mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <MapPin className="w-6 h-6" />
          Fleet Locations
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <p className="text-muted-foreground">Loading live tracking data...</p>
          </div>
        ) : buses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <MapPin className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-lg">
              No buses with GPS tracking
            </p>
          </div>
        ) : (
          <BusMap
            buses={buswithLocations}
            selectedBusId={selectedBusId}
            onBusSelect={setSelectedBusId}
          />
        )}
      </Card>

      {/* Active Buses List */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Active Buses
        </h2>

        {onlineBuses.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No buses currently online
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {onlineBuses.map((busData) => (
              <div
                key={busData.bus.id}
                className={`p-4 border-2 rounded-lg transition-all cursor-pointer ${
                  selectedBusId === busData.bus.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary"
                }`}
                onClick={() => setSelectedBusId(busData.bus.id)}
              >
                <h3 className="font-bold text-foreground mb-2">
                  {busData.bus.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Bus #{busData.bus.bus_number}
                </p>

                {busData.location && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Speed:</span>
                      <span className="font-medium text-foreground">
                        {busData.location.speed_kmh} km/h
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Heading:</span>
                      <span className="font-medium text-foreground">
                        {busData.location.heading_degrees}°
                      </span>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        Last update:{" "}
                        {new Date(
                          busData.location.updated_at
                        ).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
