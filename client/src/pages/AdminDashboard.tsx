import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { TSU_BRANDING } from "@shared/constants";
import { LogOut, Users, FileText, UploadCloud } from "lucide-react";

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [timetables, setTimetables] = useState<any[]>([]);
  const [timetableFiles, setTimetableFiles] = useState<any[]>([]);

  const { data: studentsData } = trpc.admin.getAllStudents.useQuery();
  const { data: timetablesData } = trpc.admin.getAllTimetables.useQuery();
  const { data: filesData } = trpc.admin.getTimetableFiles.useQuery();

  useEffect(() => {
    // Check if admin is logged in (in a real app, this would be checked via session)
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
          <Tabs defaultValue="students" className="space-y-4">
            <TabsList className="bg-white border border-gray-200">
              <TabsTrigger value="students">Registered Students</TabsTrigger>
              <TabsTrigger value="timetables">Exam Timetables</TabsTrigger>
              <TabsTrigger value="files">Uploaded Files</TabsTrigger>
              <TabsTrigger value="upload">Upload New</TabsTrigger>
            </TabsList>

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
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Profile Photo</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Registered</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((student, index) => (
                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="px-4 py-3 font-semibold text-gray-900">{student.matricNumber}</td>
                              <td className="px-4 py-3 text-gray-700">{student.fullName}</td>
                              <td className="px-4 py-3 text-gray-700">{student.department}</td>
                              <td className="px-4 py-3">
                                {student.profilePhotoUrl ? (
                                  <span className="text-green-600 font-semibold">✓ Uploaded</span>
                                ) : (
                                  <span className="text-gray-500">Not uploaded</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {new Date(student.createdAt).toLocaleDateString()}
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

            {/* Timetables Tab */}
            <TabsContent value="timetables">
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-[#1a472a] to-[#003d82] text-white rounded-t-lg">
                  <CardTitle>Exam Timetables</CardTitle>
                  <CardDescription className="text-gray-200">All scheduled exams in the system</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {timetables.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600">No timetables scheduled yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Course Code</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Course Name</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Date</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Time</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Venue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {timetables.map((exam, index) => (
                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="px-4 py-3 font-semibold text-gray-900">{exam.courseCode}</td>
                              <td className="px-4 py-3 text-gray-700">{exam.courseName}</td>
                              <td className="px-4 py-3 text-gray-700">{exam.examDate}</td>
                              <td className="px-4 py-3 text-gray-700">
                                {exam.startTime} - {exam.endTime}
                              </td>
                              <td className="px-4 py-3 text-gray-700">{exam.venue}</td>
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
                <CardHeader className="bg-gradient-to-r from-[#1a472a] to-[#003d82] text-white rounded-t-lg">
                  <CardTitle>Uploaded Timetable Files</CardTitle>
                  <CardDescription className="text-gray-200">Files uploaded by administrators</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {timetableFiles.length === 0 ? (
                    <div className="text-center py-8">
                      <UploadCloud className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600">No files uploaded yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {timetableFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div className="flex-1">
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

            {/* Upload Tab */}
            <TabsContent value="upload">
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-[#d4af37] to-[#1a472a] text-white rounded-t-lg">
                  <CardTitle>Upload New Timetable</CardTitle>
                  <CardDescription className="text-gray-100">Upload exam timetable files or add exam entries</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800">
                        <strong>Upload Feature:</strong> File upload functionality is coming soon. You can currently add exam entries manually through the system.
                      </p>
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <UploadCloud className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-2">Drag and drop your timetable file here</p>
                      <p className="text-sm text-gray-500">Supported formats: PDF, Excel, Images</p>
                    </div>

                    <Button
                      disabled
                      className="w-full bg-gray-400 text-white font-semibold"
                    >
                      Upload File
                    </Button>
                  </div>
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
