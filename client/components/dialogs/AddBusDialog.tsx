import { useState, useEffect } from "react";
import { supabase, School } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

interface AddBusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddBusDialog({
  isOpen,
  onClose,
  onSuccess,
}: AddBusDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [formData, setFormData] = useState({
    school_id: "",
    supervisor_name: "",
    name: "",
    bus_number: "",
    license_plate: "",
    capacity: 40,
    model: "",
    manufacturer: "",
    year: new Date().getFullYear(),
    vin: "",
    color: "",
    status: "active",
    has_wheelchair_lift: false,
    has_gps: false,
    last_maintenance_date: "",
    current_mileage: 0,
  });

  useEffect(() => {
    if (isOpen) {
      fetchSchools();
    }
  }, [isOpen]);

  const fetchSchools = async () => {
    try {
      const { data, error } = await supabase
        .from("schools")
        .select("*")
        .order("name");

      if (error) throw error;
      setSchools(data || []);

      // Auto-select first school if available
      if (data && data.length > 0 && !formData.school_id) {
        setFormData((prev) => ({ ...prev, school_id: data[0].id }));
      }
    } catch (error) {
      console.error("Error fetching schools:", error);
      toast({
        title: "Error",
        description: "Failed to load schools. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (schools.length === 0) {
      toast({
        title: "No Schools Available",
        description: "Please add a school first before adding buses.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("buses")
        .insert([formData])
        .select();

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message || error.details || "Failed to add bus");
      }

      console.log("Bus added successfully:", data);

      // Show success toast
      toast({
        title: "Success!",
        description: `Bus "${formData.name}" has been added successfully.`,
        variant: "default",
      });

      // Reset form
      setFormData({
        school_id: schools[0]?.id || "",
        supervisor_name: "",
        name: "",
        bus_number: "",
        license_plate: "",
        capacity: 40,
        model: "",
        manufacturer: "",
        year: new Date().getFullYear(),
        vin: "",
        color: "",
        status: "active",
        has_wheelchair_lift: false,
        has_gps: false,
        last_maintenance_date: "",
        current_mileage: 0,
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error adding bus:", error);

      let errorMsg = "Failed to add bus. Please try again.";

      if (error?.message) {
        errorMsg = error.message;
      } else if (typeof error === "string") {
        errorMsg = error;
      }

      // Show error toast
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
          <h2 className="text-2xl font-bold text-foreground">Add New Bus</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* School Selection */}
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
                  placeholder="e.g., Bus A, Morning Route 1"
                  required
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
                  placeholder="e.g., 101"
                  required
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
                  Capacity (seats)
                </label>
                <Input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="40"
                  min="1"
                />
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

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>
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
                  placeholder="e.g., Blue Bird, Thomas"
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
                  placeholder="e.g., Vision, C2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Year
                </label>
                <Input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="2024"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  VIN (Vehicle Identification Number)
                </label>
                <Input
                  type="text"
                  name="vin"
                  value={formData.vin}
                  onChange={handleChange}
                  placeholder="17-digit VIN"
                  maxLength={17}
                />
              </div>
            </div>
          </div>

          {/* Maintenance & Features */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Maintenance & Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Current Mileage
                </label>
                <Input
                  type="number"
                  name="current_mileage"
                  value={formData.current_mileage}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                />
              </div>

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
            </div>

            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="has_gps"
                  checked={formData.has_gps}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm font-medium text-foreground">
                  GPS Tracking Enabled
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="has_wheelchair_lift"
                  checked={formData.has_wheelchair_lift}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm font-medium text-foreground">
                  Wheelchair Lift Available
                </span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || schools.length === 0}>
              {loading ? "Adding..." : "Add Bus"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

