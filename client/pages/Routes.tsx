import { useState, useEffect } from "react";
import { supabase, BusRoute } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Navigation } from "lucide-react";

export default function Routes() {
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("bus_routes")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching routes:", error.message || error);
        throw new Error(error.message || "Failed to fetch routes");
      }
      setRoutes(data || []);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("Error fetching routes:", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const filteredRoutes = routes.filter((route) =>
    route.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Routes</h1>
          <p className="text-muted-foreground">Manage bus routes and stops</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Route
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search routes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Routes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading routes...</p>
          </div>
        ) : filteredRoutes.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <Navigation className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-4">No routes found</p>
          </div>
        ) : (
          filteredRoutes.map((route) => (
            <Card
              key={route.id}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {route.name}
                  </h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {route.route_type}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    route.is_active
                      ? "bg-success/20 text-success"
                      : "bg-muted/20 text-muted-foreground"
                  }`}
                >
                  {route.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="mb-4 text-sm text-muted-foreground">
                <p>Route ID: {route.id}</p>
              </div>

              <Button variant="outline" className="w-full">
                View Route Details
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
