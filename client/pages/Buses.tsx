import { useState, useEffect } from "react";
import { supabase, Bus, BusLocation, School, isBusOnline, getTimeSinceUpdate } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BusMap } from "@/components/map/BusMap";
import { AddBusDialog } from "@/components/dialogs/AddBusDialog";
import { exportBuses } from "@/lib/export";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Filter,
  Plus,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Building2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Download,
  SortAsc,
  SortDesc,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BusBySchool {
  school: School;
  buses: Bus[];
}

export default function Buses() {
  const { toast } = useToast();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [busLocations, setBusLocations] = useState<Record<string, BusLocation>>(
    {},
  );
  const [selectedBusId, setSelectedBusId] = useState<string | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSchool, setFilterSchool] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isAddBusDialogOpen, setIsAddBusDialogOpen] = useState(false);
  const [expandedSchools, setExpandedSchools] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchBuses();
    // Load data once on mount - no auto-refresh
  }, []);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      
      // Fetch schools
      const { data: schoolsData, error: schoolsError } = await supabase
        .from("schools")
        .select("*")
        .order("name");

      if (schoolsError) {
        console.error("Error fetching schools:", schoolsError.message || schoolsError);
      } else {
        setSchools(schoolsData || []);
        // Expand all schools by default
        setExpandedSchools(new Set((schoolsData || []).map((s) => s.id)));
      }

      // Fetch buses
      const { data: busesData, error: busesError } = await supabase
        .from("buses")
        .select("*")
        .order("name");

      if (busesError) {
        console.error(
          "Error fetching buses:",
          busesError.message || busesError,
        );
        throw new Error(busesError.message || "Failed to fetch buses");
      }

      setBuses(busesData || []);

      // Fetch latest locations for all buses
      const { data: locationsData, error: locError } = await supabase
        .from("bus_locations")
        .select("*")
        .in(
          "bus_id",
          (busesData || []).map((b) => b.id),
        );

      if (locError) {
        console.error(
          "Error fetching bus locations:",
          locError.message || locError,
        );
      } else if (locationsData) {
        const locMap: Record<string, BusLocation> = {};
        locationsData.forEach((loc: BusLocation) => {
          locMap[loc.bus_id] = loc;
        });
        setBusLocations(locMap);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("Error fetching buses:", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const toggleSchool = (schoolId: string) => {
    setExpandedSchools((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(schoolId)) {
        newSet.delete(schoolId);
      } else {
        newSet.add(schoolId);
      }
      return newSet;
    });
  };

  const handleExport = () => {
    exportBuses(buses, schools);
    toast({
      title: "Export Successful",
      description: `${buses.length} buses exported to CSV`,
      variant: "default",
    });
  };

  const toggleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  let filteredBuses = buses.filter((bus) => {
    const matchesSearch =
      bus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.bus_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bus.supervisor_name && bus.supervisor_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && bus.status === "active") ||
      (filterStatus === "maintenance" && bus.status === "maintenance") ||
      (filterStatus === "online" && isBusOnline(busLocations[bus.id], bus.has_gps)) ||
      (filterStatus === "offline" && !isBusOnline(busLocations[bus.id], bus.has_gps));

    const matchesSchool =
      filterSchool === "all" || bus.school_id === filterSchool;

    return matchesSearch && matchesStatus && matchesSchool;
  });

  // Sort buses
  filteredBuses = [...filteredBuses].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "number":
        comparison = a.bus_number.localeCompare(b.bus_number);
        break;
      case "status":
        comparison = a.status.localeCompare(b.status);
        break;
      case "school":
        const schoolA = schools.find(s => s.id === a.school_id)?.name || "";
        const schoolB = schools.find(s => s.id === b.school_id)?.name || "";
        comparison = schoolA.localeCompare(schoolB);
        break;
      case "capacity":
        comparison = a.capacity - b.capacity;
        break;
    }
    
    return sortOrder === "asc" ? comparison : -comparison;
  });

  // Group buses by school
  const busesBySchool: BusBySchool[] = schools.map((school) => ({
    school,
    buses: filteredBuses.filter((bus) => bus.school_id === school.id),
  })).filter((group) => group.buses.length > 0);

  // Buses without a school (orphaned)
  const orphanedBuses = filteredBuses.filter(
    (bus) => !schools.find((s) => s.id === bus.school_id)
  );

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
          <p className="text-muted-foreground">Manage and monitor your fleet</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => fetchBuses()}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={() => setIsAddBusDialogOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Add Bus
          </Button>
        </div>
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

      {/* Buses List - Grouped by School */}
      <div className="space-y-4">
        {loading ? (
          <Card className="p-12">
            <div className="flex items-center justify-center">
              <p className="text-muted-foreground">Loading buses...</p>
            </div>
          </Card>
        ) : busesBySchool.length === 0 && orphanedBuses.length === 0 ? (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center">
              <p className="text-muted-foreground mb-4">No buses found</p>
            </div>
          </Card>
        ) : (
          <>
            {/* Buses grouped by school */}
            {busesBySchool.map(({ school, buses }) => (
              <Card key={school.id} className="overflow-hidden">
                {/* School Header */}
                <button
                  onClick={() => toggleSchool(school.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-foreground">
                        {school.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {school.city}, {school.state} • {buses.length} {buses.length === 1 ? 'bus' : 'buses'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
                      {buses.filter((b) => b.status === "active").length} Active
                    </span>
                    {expandedSchools.has(school.id) ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Buses Grid */}
                {expandedSchools.has(school.id) && (
                  <div className="p-6 pt-0 border-t border-border">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {buses.map((bus) => {
                        const location = busLocations[bus.id];
                        const isOnline = isBusOnline(location, bus.has_gps);
                        const timeSince = getTimeSinceUpdate(location);

                        return (
                          <Link key={bus.id} to={`/buses/${bus.id}`}>
                            <Card className="p-4 border-2 hover:border-primary hover:shadow-lg transition-all cursor-pointer h-full">
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <h4 className="font-bold text-lg text-foreground">
                                    {bus.name}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    Bus #{bus.bus_number}
                                  </p>
                                  {bus.supervisor_name && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      👤 {bus.supervisor_name}
                                    </p>
                                  )}
                                </div>
                                <div className="flex flex-col items-end gap-1">
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
                                  {location && (
                                    <span className="text-xs text-muted-foreground">
                                      {timeSince}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-2 mb-4 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Model:</span>
                                  <span className="font-medium text-foreground">
                                    {bus.model || 'N/A'}
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
                  </div>
                )}
              </Card>
            ))}

            {/* Orphaned buses (no school assigned) */}
            {orphanedBuses.length > 0 && (
              <Card className="p-6 border-warning/50">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      Unassigned Buses
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {orphanedBuses.length} {orphanedBuses.length === 1 ? 'bus' : 'buses'} without a school
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {orphanedBuses.map((bus) => {
                    const location = busLocations[bus.id];
                    const isOnline = isBusOnline(location, bus.has_gps);
                    const timeSince = getTimeSinceUpdate(location);

                    return (
                      <Link key={bus.id} to={`/buses/${bus.id}`}>
                        <Card className="p-4 border-2 hover:border-primary hover:shadow-lg transition-all cursor-pointer">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="font-bold text-lg text-foreground">
                                {bus.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Bus #{bus.bus_number}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
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
                              {location && (
                                <span className="text-xs text-muted-foreground">
                                  {timeSince}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-sm text-center py-2 bg-warning/10 rounded">
                            <p className="text-warning font-medium">No school assigned</p>
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Add Bus Dialog */}
      <AddBusDialog
        isOpen={isAddBusDialogOpen}
        onClose={() => setIsAddBusDialogOpen(false)}
        onSuccess={fetchBuses}
      />
    </div>
  );
}
