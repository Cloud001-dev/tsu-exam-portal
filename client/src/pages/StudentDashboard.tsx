import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { TSU_BRANDING } from "@shared/constants";
import { LogOut, User, Calendar, FileText } from "lucide-react";

export default function StudentDashboard() {
  const [, navigate] = useLocation();
  const [studentId, setStudentId] = useState<number | null>(null);
  const [studentInfo, setStudentInfo] = useState<any>(null);

  useEffect(() => {
    const id = localStorage.getItem("studentId");
    if (!id) {
      navigate("/student-login", { replace: true });
      return;
    }
    setStudentId(parseInt(id));
  }, [navigate]);

  const { data: profile, isLoading } = trpc.student.getProfile.useQuery(
    { studentId: studentId || 0 },
    { enabled: !!studentId }
  );

  useEffect(() => {
    if (profile) {
      setStudentInfo(profile);
    }
  }, [profile]);

  const handleLogout = () => {
    localStorage.removeItem("studentId");
    localStorage.removeItem("studentMatricNumber");
    toast.success("Logged out successfully");
    navigate("/", { replace: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a472a] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a472a] to-[#003d82] text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={TSU_BRANDING.logoUrl} alt="TSU Logo" className="h-14 w-14 rounded-full bg-white p-1" />
              <div>
                <h1 className="text-2xl font-bold">{TSU_BRANDING.schoolName}</h1>
                <p className="text-sm text-gray-200">{TSU_BRANDING.department}</p>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {studentInfo?.fullName}</h2>
            <p className="text-gray-600">Manage your profile and view your exam timetable</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="shadow-md border-0">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Matric Number</p>
                    <p className="text-xl font-bold text-gray-900">{studentInfo?.matricNumber}</p>
                  </div>
                  <User className="h-8 w-8 text-[#1a472a]" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-0">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Department</p>
                    <p className="text-xl font-bold text-gray-900">{studentInfo?.department}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-[#003d82]" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-0">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Profile Status</p>
                    <p className="text-xl font-bold text-gray-900">{studentInfo?.profilePhotoUrl ? "Complete" : "Incomplete"}</p>
                  </div>
                  <FileText className="h-8 w-8 text-[#d4af37]" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Card */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-[#1a472a] to-[#003d82] text-white rounded-t-lg">
                <CardTitle>My Profile</CardTitle>
                <CardDescription className="text-gray-200">Update your profile information and photo</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Full Name</p>
                    <p className="text-lg font-semibold text-gray-900">{studentInfo?.fullName}</p>
                  </div>
                  {studentInfo?.profilePhotoUrl && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Profile Photo</p>
                      <img
                        src={studentInfo.profilePhotoUrl}
                        alt="Profile"
                        className="h-24 w-24 rounded-lg object-cover border-2 border-[#1a472a]"
                      />
                    </div>
                  )}
                  <Button
                    onClick={() => navigate("/student-profile", { replace: true })}
                    className="w-full bg-gradient-to-r from-[#1a472a] to-[#003d82] hover:from-[#0f2818] hover:to-[#002b5c] text-white font-semibold"
                  >
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Timetable Card */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-[#003d82] to-[#1a472a] text-white rounded-t-lg">
                <CardTitle>Exam Timetable</CardTitle>
                <CardDescription className="text-gray-200">View and download your exam schedule</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Access your personalized exam timetable with dates, times, venues, and course information.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Tip:</strong> You can download your timetable as a PDF with the official TSU logo and header.
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate("/student-timetable", { replace: true })}
                    className="w-full bg-gradient-to-r from-[#003d82] to-[#1a472a] hover:from-[#002b5c] hover:to-[#0f2818] text-white font-semibold"
                  >
                    View Timetable
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Information Section */}
          <Card className="mt-8 shadow-md border-0">
            <CardHeader className="bg-gray-100 rounded-t-lg">
              <CardTitle>Important Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-[#1a472a] font-bold mt-1">•</span>
                  <span>Please ensure your profile information is complete and up-to-date.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#1a472a] font-bold mt-1">•</span>
                  <span>Upload a clear profile photo for identification purposes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#1a472a] font-bold mt-1">•</span>
                  <span>Check your timetable regularly for any updates or changes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#1a472a] font-bold mt-1">•</span>
                  <span>Keep your login credentials secure and do not share them with anyone.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
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
