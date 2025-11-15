import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase, Bus, BusLocation, Student, StudentBusAssignment } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BusMap } from "@/components/map/BusMap";
import { ArrowLeft, AlertTriangle, CheckCircle, MapPin, Users, Zap } from "lucide-react";

export default function BusDetail() {
  const { busId } = useParams<{ busId: string }>();
  const [bus, setBus] = useState<Bus | null>(null);
  const [location, setLocation] = useState<BusLocation | null>(null);
  const [students, setStudents] = useState<(Student & { assignment: StudentBusAssignment })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (busId) {
      fetchBusDetails();
      const interval = setInterval(fetchBusDetails, 5000);
      return () => clearInterval(interval);
    }
  }, [busId]);

  const fetchBusDetails = async () => {
    try {
      setLoading(true);

      // Fetch bus
      const { data: busData, error: busError } = await supabase
        .from("buses")
        .select("*")
        .eq("id", busId)
        .single();

      if (busError) throw busError;
      setBus(busData);

      // Fetch location
      const { data: locData, error: locError } = await supabase
        .from("bus_locations")
        .select("*")
        .eq("bus_id", busId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!locError && locData) {
        setLocation(locData);
      }

      // Fetch students on this bus
      const { data: assignmentsData, error: assignError } = await supabase
        .from("student_bus_assignments")
        .select(`
          *,
          students:student_id (*)
        `)
        .eq("bus_id", busId)
        .eq("is_active", true);

      if (!assignError && assignmentsData) {
        const studentsWithAssignments = assignmentsData.map((a: any) => ({
          ...a.students[0],
          assignment: a,
        }));
        setStudents(studentsWithAssignments);
      }
    } catch (error) {
      console.error("Error fetching bus details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !bus) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading bus details...</p>
        </div>
      </div>
    );
  }

  if (!bus) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Bus Not Found</h1>
          <Link to="/buses">
            <Button variant="outline">Back to Buses</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/buses">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-foreground">{bus.name}</h1>
          <p className="text-muted-foreground">Bus #{bus.bus_number}</p>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <p className="text-muted-foreground text-sm font-medium mb-2">
            Status
          </p>
          <div className="flex items-center gap-2">
            {bus.status === "active" ? (
              <CheckCircle className="w-5 h-5 text-success" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-warning" />
            )}
            <p className="text-lg font-bold text-foreground capitalize">
              {bus.status}
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-muted-foreground text-sm font-medium mb-2">
            Students Onboard
          </p>
          <p className="text-3xl font-bold text-foreground">{students.length}</p>
        </Card>

        <Card className="p-6">
          <p className="text-muted-foreground text-sm font-medium mb-2">
            Capacity
          </p>
          <p className="text-3xl font-bold text-foreground">{bus.capacity}</p>
        </Card>

        <Card className="p-6">
          <p className="text-muted-foreground text-sm font-medium mb-2">
            GPS Status
          </p>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                location ? "bg-success animate-pulse" : "bg-muted"
              }`}
            />
            <p className="font-bold text-foreground">
              {location ? "Online" : "Offline"}
            </p>
          </div>
        </Card>
      </div>

      {/* Map and Location */}
      {location && (
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Live Location
          </h2>
          <BusMap
            buses={[{ bus, location }]}
            selectedBusId={bus.id}
          />
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Speed</p>
              <p className="text-xl font-bold text-foreground">
                {location.speed_kmh} km/h
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm mb-1">Heading</p>
              <p className="text-xl font-bold text-foreground">
                {location.heading_degrees}°
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm mb-1">Latitude</p>
              <p className="text-sm font-mono text-foreground">
                {location.location.lat.toFixed(6)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm mb-1">Longitude</p>
              <p className="text-sm font-mono text-foreground">
                {location.location.lng.toFixed(6)}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Bus Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="p-6">
          <h3 className="text-xl font-bold text-foreground mb-4">
            Vehicle Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-border pb-3">
              <span className="text-muted-foreground">Model</span>
              <span className="font-medium text-foreground">{bus.model}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-3">
              <span className="text-muted-foreground">Year</span>
              <span className="font-medium text-foreground">{bus.year}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-3">
              <span className="text-muted-foreground">Manufacturer</span>
              <span className="font-medium text-foreground">
                {bus.manufacturer}
              </span>
            </div>
            <div className="flex justify-between border-b border-border pb-3">
              <span className="text-muted-foreground">License Plate</span>
              <span className="font-medium text-foreground">
                {bus.license_plate}
              </span>
            </div>
            <div className="flex justify-between border-b border-border pb-3">
              <span className="text-muted-foreground">VIN</span>
              <span className="font-mono text-sm text-foreground">
                {bus.vin}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Color</span>
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded border border-border"
                  style={{ backgroundColor: bus.color }}
                />
                <span className="font-medium text-foreground capitalize">
                  {bus.color}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-bold text-foreground mb-4">
            Additional Features
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">
                  Wheelchair Lift
                </p>
                <p className="text-sm text-muted-foreground">
                  {bus.has_wheelchair_lift ? "Available" : "Not available"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">GPS System</p>
                <p className="text-sm text-muted-foreground">
                  {bus.has_gps ? "Installed" : "Not installed"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
              <Zap className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">
                  Last Maintenance
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(bus.last_maintenance_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Students List */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Students Onboard
        </h2>
        {students.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No students assigned to this bus
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Student ID
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Grade
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Boarding Stop
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-border hover:bg-secondary/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <p className="font-medium text-foreground">
                        {student.full_name}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">
                      {student.student_number}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">
                      {student.grade_level}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">
                      Stop {student.assignment.boarding_stop_id}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-success/20 text-success rounded-full text-xs font-semibold">
                        Onboard
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
