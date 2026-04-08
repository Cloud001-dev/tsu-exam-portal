import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { TSU_BRANDING } from "@shared/constants";
import { LogOut, Users, FileText, UploadCloud, Plus, Trash2 } from "lucide-react";

// Department list
const DEPARTMENTS = [
  "Computer Science",
  "Computer Science Education",
  "Information Technology",
  "Software Engineering",
];

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [timetables, setTimetables] = useState<any[]>([]);
  const [timetableFiles, setTimetableFiles] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    examId: "",
    courseCode: "",
    courseName: "",
    department: "",
    examDate: "",
    startTime: "",
    endTime: "",
    venue: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: studentsData } = trpc.admin.getAllStudents.useQuery();
  const { data: timetablesData } = trpc.admin.getAllTimetables.useQuery();
  const { data: filesData } = trpc.admin.getTimetableFiles.useQuery();
  const uploadMutation = trpc.admin.uploadTimetableData.useMutation();
  const deleteMutation = trpc.admin.deleteTimetable.useMutation();

  useEffect(() => {
    // Check if admin is logged in
    const adminSession = localStorage.getItem("adminSession");
    if (!adminSession) {
      navigate("/admin-login", { replace: true });
      return;
    }
    setIsAdmin(true);
  }, [navigate]);

  useEffect(() => {
    if (studentsData) setStudents(studentsData);
    if (timetablesData) setTimetables(timetablesData);
    if (filesData) setTimetableFiles(filesData);
  }, [studentsData, timetablesData, filesData]);

  const handleLogout = () => {
    localStorage.removeItem("adminSession");
    toast.success("Logged out successfully");
    navigate("/", { replace: true });
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddExam = async () => {
    if (!formData.examId || !formData.courseCode || !formData.courseName || !formData.department || !formData.examDate || !formData.startTime || !formData.endTime || !formData.venue) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await uploadMutation.mutateAsync(formData);
      toast.success("Exam schedule added successfully!");
      setFormData({
        examId: "",
        courseCode: "",
        courseName: "",
        department: "",
        examDate: "",
        startTime: "",
        endTime: "",
        venue: "",
      });
      // Refresh timetables
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error: any) {
      toast.error(error.message || "Failed to add exam schedule");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExam = async (id: number) => {
    if (!confirm("Are you sure you want to delete this exam schedule?")) return;
    
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Exam schedule deleted successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete exam schedule");
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a472a] mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#d4af37] to-[#1a472a] text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={TSU_BRANDING.logoUrl} alt="TSU Logo" className="h-14 w-14 rounded-full bg-white p-1" />
              <div>
                <h1 className="text-2xl font-bold">{TSU_BRANDING.schoolName}</h1>
                <p className="text-sm text-gray-100">Admin Dashboard</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-[#1a472a]"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
            <p className="text-gray-600">Manage exam timetables, students, and uploaded files</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="shadow-md border-0">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Students</p>
                    <p className="text-3xl font-bold text-gray-900">{students.length}</p>
                  </div>
                  <Users className="h-10 w-10 text-[#1a472a]" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-0">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Exams Scheduled</p>
                    <p className="text-3xl font-bold text-gray-900">{timetables.length}</p>
                  </div>
                  <FileText className="h-10 w-10 text-[#003d82]" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-0">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Files Uploaded</p>
                    <p className="text-3xl font-bold text-gray-900">{timetableFiles.length}</p>
                  </div>
                  <UploadCloud className="h-10 w-10 text-[#d4af37]" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="schedule" className="space-y-4">
            <TabsList className="bg-white border border-gray-200">
              <TabsTrigger value="schedule">Add Exam Schedule</TabsTrigger>
              <TabsTrigger value="timetables">Exam Timetables</TabsTrigger>
              <TabsTrigger value="students">Registered Students</TabsTrigger>
              <TabsTrigger value="files">Uploaded Files</TabsTrigger>
            </TabsList>

            {/* Add Exam Schedule Tab */}
            <TabsContent value="schedule">
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-[#d4af37] to-[#1a472a] text-white rounded-t-lg">
                  <CardTitle>Add Exam Schedule</CardTitle>
                  <CardDescription className="text-gray-100">Manually add exam schedules for each department</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4 max-w-2xl">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="examId" className="text-gray-700 font-semibold">Exam ID</Label>
                        <Input
                          id="examId"
                          placeholder="e.g., CS101-2026-05"
                          value={formData.examId}
                          onChange={(e) => handleFormChange("examId", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="courseCode" className="text-gray-700 font-semibold">Course Code</Label>
                        <Input
                          id="courseCode"
                          placeholder="e.g., CS101"
                          value={formData.courseCode}
                          onChange={(e) => handleFormChange("courseCode", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="courseName" className="text-gray-700 font-semibold">Course Name</Label>
                      <Input
                        id="courseName"
                        placeholder="e.g., Introduction to Programming"
                        value={formData.courseName}
                        onChange={(e) => handleFormChange("courseName", e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="department" className="text-gray-700 font-semibold">Department</Label>
                      <Select value={formData.department} onValueChange={(value) => handleFormChange("department", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {DEPARTMENTS.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="examDate" className="text-gray-700 font-semibold">Exam Date</Label>
                        <Input
                          id="examDate"
                          type="date"
                          value={formData.examDate}
                          onChange={(e) => handleFormChange("examDate", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="venue" className="text-gray-700 font-semibold">Venue</Label>
                        <Input
                          id="venue"
                          placeholder="e.g., Hall A"
                          value={formData.venue}
                          onChange={(e) => handleFormChange("venue", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startTime" className="text-gray-700 font-semibold">Start Time</Label>
                        <Input
                          id="startTime"
                          type="time"
                          value={formData.startTime}
                          onChange={(e) => handleFormChange("startTime", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="endTime" className="text-gray-700 font-semibold">End Time</Label>
                        <Input
                          id="endTime"
                          type="time"
                          value={formData.endTime}
                          onChange={(e) => handleFormChange("endTime", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleAddExam}
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-[#1a472a] to-[#003d82] text-white font-semibold hover:shadow-lg disabled:opacity-50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {isSubmitting ? "Adding..." : "Add Exam Schedule"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Timetables Tab */}
            <TabsContent value="timetables">
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-[#003d82] to-[#1a472a] text-white rounded-t-lg">
                  <CardTitle>Exam Timetables</CardTitle>
                  <CardDescription className="text-gray-200">All scheduled exams by department</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {timetables.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600">No exams scheduled yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Course Code</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Course Name</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Department</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Exam Date</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Time</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Venue</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {timetables.map((timetable) => (
                            <tr key={timetable.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="px-4 py-3 text-gray-900">{timetable.courseCode}</td>
                              <td className="px-4 py-3 text-gray-900">{timetable.courseName}</td>
                              <td className="px-4 py-3 text-gray-900 text-sm font-medium text-[#1a472a]">{timetable.department}</td>
                              <td className="px-4 py-3 text-gray-900">{timetable.examDate}</td>
                              <td className="px-4 py-3 text-gray-900">{timetable.startTime}-{timetable.endTime}</td>
                              <td className="px-4 py-3 text-gray-900">{timetable.venue}</td>
                              <td className="px-4 py-3">
                                <Button
                                  onClick={() => handleDeleteExam(timetable.id)}
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:bg-red-50 border-red-200"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Students Tab */}
            <TabsContent value="students">
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-[#1a472a] to-[#003d82] text-white rounded-t-lg">
                  <CardTitle>Registered Students</CardTitle>
                  <CardDescription className="text-gray-200">All students registered in the system</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {students.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600">No students registered yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Matric Number</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Full Name</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Department</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Registered</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((student) => (
                            <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="px-4 py-3 text-gray-900 font-mono text-sm">{student.matricNumber}</td>
                              <td className="px-4 py-3 text-gray-900">{student.fullName}</td>
                              <td className="px-4 py-3 text-gray-900 text-sm">{student.department}</td>
                              <td className="px-4 py-3 text-gray-600 text-sm">{new Date(student.createdAt).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Files Tab */}
            <TabsContent value="files">
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-[#d4af37] to-[#003d82] text-white rounded-t-lg">
                  <CardTitle>Uploaded Files</CardTitle>
                  <CardDescription className="text-gray-100">Timetable files uploaded to the system</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {timetableFiles.length === 0 ? (
                    <div className="text-center py-8">
                      <UploadCloud className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600">No files uploaded yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {timetableFiles.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div>
                            <p className="font-semibold text-gray-900">{file.fileName}</p>
                            <p className="text-sm text-gray-600">
                              Type: {file.fileType} | Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            onClick={() => window.open(file.fileUrl)}
                            variant="outline"
                            className="ml-4"
                          >
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-4 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© 2026 Taraba State University. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
