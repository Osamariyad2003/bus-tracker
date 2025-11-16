import { useState, useEffect } from "react";
import { supabase, School, Bus, BusLocation, isBusOnline, getTimeSinceUpdate } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddSchoolDialog } from "@/components/dialogs/AddSchoolDialog";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  MapPin,
  Phone,
  Mail,
  Globe,
  Bus as BusIcon,
} from "lucide-react";

interface SchoolWithBuses extends School {
  busCount?: number;
}

export default function Schools() {
  const [schools, setSchools] = useState<SchoolWithBuses[]>([]);
  const [schoolBuses, setSchoolBuses] = useState<Record<string, Bus[]>>({});
  const [busLocations, setBusLocations] = useState<Record<string, BusLocation>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchSchools();
  }, []);

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

      // Fetch buses for each school
      if (data && data.length > 0) {
        const { data: busesData, error: busesError } = await supabase
          .from("buses")
          .select("*")
          .in(
            "school_id",
            data.map((s) => s.id),
          );

        if (busesError) {
          console.error(
            "Error fetching buses:",
            busesError.message || busesError,
          );
        } else if (busesData) {
          const busMap: Record<string, Bus[]> = {};
          busesData.forEach((bus: Bus) => {
            if (!busMap[bus.school_id]) {
              busMap[bus.school_id] = [];
            }
            busMap[bus.school_id].push(bus);
          });
          setSchoolBuses(busMap);

          // Fetch latest locations for all buses
          const { data: locationsData, error: locError } = await supabase
            .from("bus_locations")
            .select("*")
            .in(
              "bus_id",
              busesData.map((b) => b.id)
            );

          if (locError) {
            console.error(
              "Error fetching bus locations:",
              locError.message || locError
            );
          } else if (locationsData) {
            const locMap: Record<string, BusLocation> = {};
            locationsData.forEach((loc: BusLocation) => {
              locMap[loc.bus_id] = loc;
            });
            setBusLocations(locMap);
          }
        }
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("Error fetching schools:", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const filteredSchools = schools.filter(
    (school) =>
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.city.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Schools</h1>
          <p className="text-muted-foreground">
            Manage schools and their bus tracking
          </p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add School
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search schools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Schools Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading schools...</p>
        </div>
      ) : filteredSchools.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">No schools found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchools.map((school) => {
            const buses = schoolBuses[school.id] || [];
            return (
              <Card
                key={school.id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary flex flex-col h-full"
              >
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {school.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {school.city}, {school.state}
                </p>

                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      {school.address}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                    <p className="text-sm text-foreground">{school.phone}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                    <p className="text-sm text-foreground">{school.email}</p>
                  </div>
                  {school.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-primary flex-shrink-0" />
                      <a
                        href={school.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {school.website}
                      </a>
                    </div>
                  )}

                  {/* Buses Section */}
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <BusIcon className="w-4 h-4 text-primary" />
                        <p className="text-sm font-semibold text-foreground">
                          School Buses ({buses.length})
                        </p>
                      </div>
                      {buses.length > 0 && (
                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
                          {buses.filter((b) => b.status === "active").length} Active
                        </span>
                      )}
                    </div>

                    {buses.length === 0 ? (
                      <div className="text-center py-6 bg-muted/30 rounded-lg border-2 border-dashed border-border">
                        <BusIcon className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground font-medium">
                          No buses assigned
                        </p>
                        <p className="text-xs text-muted-foreground/60 mt-1">
                          Add buses to this school
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                            {buses.map((bus) => {
                              const location = busLocations[bus.id];
                              const isOnline = isBusOnline(location, bus.has_gps);
                              const timeSince = getTimeSinceUpdate(location);

                              return (
                                <Link
                                  key={bus.id}
                                  to={`/buses/${bus.id}`}
                                  className="block"
                                >
                                  <div className="group flex items-center justify-between p-3 bg-secondary/30 hover:bg-secondary/60 rounded-lg border border-border hover:border-primary transition-all cursor-pointer">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                      <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                                        <BusIcon className="w-4 h-4 text-primary" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm text-foreground truncate">
                                          {bus.name}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                          <span className="text-xs text-muted-foreground">
                                            Bus #{bus.bus_number}
                                          </span>
                                          {bus.supervisor_name && (
                                            <>
                                              <span className="text-xs text-muted-foreground">•</span>
                                              <span className="text-xs text-muted-foreground truncate">
                                                👤 {bus.supervisor_name}
                                              </span>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      {bus.has_gps && (
                                        <div className="flex flex-col items-end gap-0.5">
                                          <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                                            isOnline
                                              ? "bg-success/20 text-success"
                                              : "bg-muted/20 text-muted-foreground"
                                          }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                              isOnline ? "bg-success animate-pulse" : "bg-muted-foreground"
                                            }`}></span>
                                            {isOnline ? "Online" : "Offline"}
                                          </div>
                                          {location && (
                                            <span className="text-xs text-muted-foreground">
                                              {timeSince}
                                            </span>
                                          )}
                                        </div>
                                      )}
                                      <div
                                        className={`px-2 py-1 rounded text-xs font-medium ${
                                          bus.status === "active"
                                            ? "bg-success/10 text-success"
                                            : bus.status === "maintenance"
                                            ? "bg-warning/10 text-warning"
                                            : "bg-muted text-muted-foreground"
                                        }`}
                                      >
                                        {bus.status}
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              );
                            })}
                      </div>
                    )}
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add School Dialog */}
      <AddSchoolDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={fetchSchools}
      />
    </div>
  );
}
