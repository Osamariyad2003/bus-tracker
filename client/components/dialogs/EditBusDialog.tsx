import { useState, useEffect } from "react";
import { supabase, School, Bus } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

interface EditBusDialogProps {
  bus: Bus;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditBusDialog({
  bus,
  isOpen,
  onClose,
  onSuccess,
}: EditBusDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [formData, setFormData] = useState({
    school_id: bus.school_id,
    supervisor_name: bus.supervisor_name || "",
    name: bus.name,
    bus_number: bus.bus_number,
    license_plate: bus.license_plate,
    capacity: bus.capacity,
    model: bus.model,
    manufacturer: bus.manufacturer,
    year: bus.year,
    vin: bus.vin,
    color: bus.color,
    status: bus.status,
    has_wheelchair_lift: bus.has_wheelchair_lift,
    has_gps: bus.has_gps,
    last_maintenance_date: bus.last_maintenance_date || "",
    current_mileage: bus.current_mileage,
  });

  useEffect(() => {
    if (isOpen) {
      fetchSchools();
      // Reset form data when bus changes
      setFormData({
        school_id: bus.school_id,
        supervisor_name: bus.supervisor_name || "",
        name: bus.name,
        bus_number: bus.bus_number,
        license_plate: bus.license_plate,
        capacity: bus.capacity,
        model: bus.model,
        manufacturer: bus.manufacturer,
        year: bus.year,
        vin: bus.vin,
        color: bus.color,
        status: bus.status,
        has_wheelchair_lift: bus.has_wheelchair_lift,
        has_gps: bus.has_gps,
        last_maintenance_date: bus.last_maintenance_date || "",
        current_mileage: bus.current_mileage,
      });
    }
  }, [isOpen, bus]);

  const fetchSchools = async () => {
    try {
      const { data, error } = await supabase
        .from("schools")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching schools:", error);
      } else {
        setSchools(data || []);
      }
    } catch (error) {
      console.error("Error fetching schools:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("buses")
        .update(formData)
        .eq("id", bus.id)
        .select();

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message || error.details || "Failed to update bus");
      }

      toast({
        title: "Success!",
        description: `Bus "${formData.name}" has been updated successfully.`,
        variant: "default",
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error updating bus:", error);

      let errorMsg = "Failed to update bus. Please try again.";
      if (error?.message) {
        errorMsg = error.message;
      } else if (typeof error === "string") {
        errorMsg = error;
      }

      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-card z-10">
          <h2 className="text-2xl font-bold text-foreground">Edit Bus</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* School & Supervisor Information */}
          <div className="mb-6 pb-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              School & Supervisor Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Select School *
                </label>
                {schools.length === 0 ? (
                  <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                    <p className="text-sm text-warning-foreground">
                      No schools available. Please add a school first.
                    </p>
                  </div>
                ) : (
                  <select
                    name="school_id"
                    value={formData.school_id}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {schools.map((school) => (
                      <option key={school.id} value={school.id}>
                        {school.name} - {school.city}, {school.state}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Supervisor Name
                </label>
                <Input
                  type="text"
                  name="supervisor_name"
                  value={formData.supervisor_name}
                  onChange={handleChange}
                  placeholder="e.g., John Smith"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Name of the person responsible for this bus
                </p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="mb-6 pb-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Bus Name *
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., School Bus A"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Bus Number *
                </label>
                <Input
                  type="text"
                  name="bus_number"
                  value={formData.bus_number}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 101"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  License Plate
                </label>
                <Input
                  type="text"
                  name="license_plate"
                  value={formData.license_plate}
                  onChange={handleChange}
                  placeholder="e.g., ABC-1234"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Capacity (seats) *
                </label>
                <Input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="e.g., 40"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                  <option value="retired">Retired</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Color
                </label>
                <Input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="e.g., Yellow"
                />
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="mb-6 pb-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Vehicle Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Manufacturer
                </label>
                <Input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  placeholder="e.g., Blue Bird"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Model
                </label>
                <Input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="e.g., Vision"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Year *
                </label>
                <Input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  placeholder="e.g., 2023"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  VIN
                </label>
                <Input
                  type="text"
                  name="vin"
                  value={formData.vin}
                  onChange={handleChange}
                  placeholder="e.g., 1HGBH41JXMN109186"
                />
              </div>
            </div>
          </div>

          {/* Maintenance & Mileage */}
          <div className="mb-6 pb-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Maintenance & Mileage
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Last Maintenance Date
                </label>
                <Input
                  type="date"
                  name="last_maintenance_date"
                  value={formData.last_maintenance_date}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Current Mileage
                </label>
                <Input
                  type="number"
                  name="current_mileage"
                  value={formData.current_mileage}
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g., 45000"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Features
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="has_gps"
                  name="has_gps"
                  checked={formData.has_gps}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, has_gps: checked as boolean }))
                  }
                />
                <label
                  htmlFor="has_gps"
                  className="text-sm font-medium text-foreground cursor-pointer"
                >
                  GPS Tracking System
                </label>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  id="has_wheelchair_lift"
                  name="has_wheelchair_lift"
                  checked={formData.has_wheelchair_lift}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      has_wheelchair_lift: checked as boolean,
                    }))
                  }
                />
                <label
                  htmlFor="has_wheelchair_lift"
                  className="text-sm font-medium text-foreground cursor-pointer"
                >
                  Wheelchair Lift
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Bus"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

