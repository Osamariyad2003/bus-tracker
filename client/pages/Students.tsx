import { useState, useEffect } from "react";
import { supabase, Student } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, User } from "lucide-react";

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("full_name");

      if (error) {
        console.error("Error fetching students:", error.message || error);
        throw new Error(error.message || "Failed to fetch students");
      }
      setStudents(data || []);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("Error fetching students:", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((student) =>
    student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Students</h1>
          <p className="text-muted-foreground">
            Manage student records and assignments
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Student
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Students Table */}
      <Card className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading students...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <User className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-4">No students found</p>
          </div>
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
                    DOB
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-border hover:bg-secondary/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <p className="font-medium text-foreground">
                        {student.full_name}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground font-mono text-sm">
                      {student.student_number}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">
                      {student.grade_level}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">
                      {new Date(student.date_of_birth).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          student.is_active
                            ? "bg-success/20 text-success"
                            : "bg-muted/20 text-muted-foreground"
                        }`}
                      >
                        {student.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
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
