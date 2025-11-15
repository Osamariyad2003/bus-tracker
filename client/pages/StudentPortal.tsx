import { useState, useEffect } from "react";
import { supabase, School, Bus, BusLocation } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { BusMap } from "@/components/map/BusMap";
import {
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  Navigation,
} from "lucide-react";

export default function StudentPortal() {
  const [schoolId, setSchoolId] = useState<string>("");
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [busLocations, setBusLocations] = useState<Record<string, BusLocation>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [selectedBusId, setSelectedBusId] = useState<string | undefined>();

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    if (schoolId) {
      fetchBusesForSchool(schoolId);
      const interval = setInterval(() => fetchBusesForSchool(schoolId), 5000);
      return () => clearInterval(interval);
    }
  }, [schoolId]);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("schools")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching schools:", error.message || error);
        throw new Error(error.message || "Failed to fetch schools");
      }

      setSchools(data || []);
      if (data && data.length > 0) {
        setSchoolId(data[0].id);
        setSelectedSchool(data[0]);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("Error fetching schools:", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const fetchBusesForSchool = async (schoolId: string) => {
    try {
      const { data: busesData, error: busesError } = await supabase
        .from("buses")
        .select("*")
        .eq("school_id", schoolId);

      if (busesError) {
        console.error("Error fetching buses:", busesError.message || busesError);
        throw new Error(busesError.message || "Failed to fetch buses");
      }

      setBuses(busesData || []);

      // Fetch locations
      if (busesData && busesData.length > 0) {
        const { data: locationsData, error: locError } = await supabase
          .from("bus_locations")
          .select("*")
          .in("bus_id", busesData.map((b) => b.id));

        if (locError) {
          console.error("Error fetching locations:", locError.message || locError);
        } else if (locationsData) {
          const locMap: Record<string, BusLocation> = {};
          locationsData.forEach((loc: BusLocation) => {
            locMap[loc.bus_id] = loc;
          });
          setBusLocations(locMap);
        }
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("Error fetching buses:", errorMsg);
    }
  };

  const buswithLocations = buses.map((bus) => ({
    bus,
    location: busLocations[bus.id],
  }));

  const onlineBuses = buswithLocations.filter((b) => b.location);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Student Bus Portal</h1>
          <p className="text-white/90">
            Track your school bus and see real-time location updates
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* School Selection */}
        {schools.length > 0 && (
          <div className="mb-8">
            <label className="block text-sm font-semibold text-foreground mb-3">
              Select Your School
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {schools.map((school) => (
                <button
                  key={school.id}
                  onClick={() => {
                    setSchoolId(school.id);
                    setSelectedSchool(school);
                  }}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    schoolId === school.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary"
                  }`}
                >
                  <p className="font-semibold text-foreground">{school.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {school.city}, {school.state}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground text-lg">Loading buses...</p>
          </div>
        ) : buses.length === 0 ? (
          <Card className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              No buses assigned to this school yet
            </p>
          </Card>
        ) : (
          <>
            {/* Map Section */}
            <Card className="p-6 mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6" />
                Live Bus Locations
              </h2>
              <BusMap
                buses={buswithLocations}
                selectedBusId={selectedBusId}
                onBusSelect={setSelectedBusId}
              />
            </Card>

            {/* Bus Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium mb-2">
                      Total Buses
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {buses.length}
                    </p>
                  </div>
                  <Navigation className="w-8 h-8 text-primary" />
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
                  <AlertCircle className="w-8 h-8 text-muted-foreground/30" />
                </div>
              </Card>
            </div>

            {/* Buses Grid */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Available Buses
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {buses.map((bus) => {
                  const location = busLocations[bus.id];
                  const isOnline = location !== undefined;

                  return (
                    <div
                      key={bus.id}
                      className={`p-4 border-2 rounded-lg transition-all cursor-pointer ${
                        selectedBusId === bus.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary"
                      }`}
                      onClick={() => setSelectedBusId(bus.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-foreground">
                            {bus.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Bus #{bus.bus_number}
                          </p>
                        </div>
                        <div
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
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

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Model:</span>
                          <span className="font-medium text-foreground">
                            {bus.model}
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
                        <div className="pt-3 border-t border-border mt-3">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <Clock className="w-3 h-3" />
                            <span>Speed: {location.speed_kmh} km/h</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Navigation className="w-3 h-3" />
                            <span>Heading: {location.heading_degrees}°</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
