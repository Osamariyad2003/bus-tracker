import { useState, useEffect } from "react";
import { supabase, School } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, MapPin, Phone, Mail, Globe } from "lucide-react";

export default function Schools() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("Error fetching schools:", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const filteredSchools = schools.filter((school) =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.city.toLowerCase().includes(searchTerm.toLowerCase())
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
        <Button className="flex items-center gap-2">
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
          {filteredSchools.map((school) => (
            <Card
              key={school.id}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary"
            >
              <h3 className="text-xl font-bold text-foreground mb-2">
                {school.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {school.city}, {school.state}
              </p>

              <div className="space-y-3 mb-6">
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
              </div>

              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
