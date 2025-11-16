import { Bus, School, Student } from "./supabase";

/**
 * Export data to CSV format
 */
export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) {
    alert("No data to export");
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    headers.join(","), // Header row
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values with commas, quotes, or newlines
        if (value === null || value === undefined) return "";
        const stringValue = String(value);
        if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(",")
    )
  ].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export buses to CSV
 */
export function exportBuses(buses: Bus[], schools: School[]) {
  const schoolMap = new Map(schools.map(s => [s.id, s.name]));
  
  const exportData = buses.map(bus => ({
    "Bus Number": bus.bus_number,
    "Bus Name": bus.name,
    "School": schoolMap.get(bus.school_id) || "N/A",
    "Supervisor": bus.supervisor_name || "N/A",
    "Status": bus.status,
    "Model": bus.model,
    "Manufacturer": bus.manufacturer,
    "Year": bus.year,
    "Capacity": bus.capacity,
    "License Plate": bus.license_plate,
    "VIN": bus.vin,
    "Has GPS": bus.has_gps ? "Yes" : "No",
    "Has Wheelchair Lift": bus.has_wheelchair_lift ? "Yes" : "No",
    "Current Mileage": bus.current_mileage,
    "Last Maintenance": bus.last_maintenance_date || "N/A",
  }));

  exportToCSV(exportData, "buses");
}

/**
 * Export schools to CSV
 */
export function exportSchools(schools: School[]) {
  const exportData = schools.map(school => ({
    "School Name": school.name,
    "Address": school.address,
    "City": school.city,
    "State": school.state,
    "Postal Code": school.postal_code,
    "Country": school.country,
    "Phone": school.phone,
    "Email": school.email,
    "Website": school.website,
    "Timezone": school.timezone,
  }));

  exportToCSV(exportData, "schools");
}

/**
 * Export students to CSV
 */
export function exportStudents(students: Student[]) {
  const exportData = students.map(student => ({
    "Student Number": student.student_number,
    "Full Name": student.full_name,
    "Date of Birth": student.date_of_birth,
    "Grade Level": student.grade_level,
    "Gender": student.gender,
    "Is Active": student.is_active ? "Yes" : "No",
    "Medical Notes": student.medical_notes || "N/A",
    "Special Needs": student.special_needs || "N/A",
  }));

  exportToCSV(exportData, "students");
}

/**
 * Print current page
 */
export function printPage() {
  window.print();
}

