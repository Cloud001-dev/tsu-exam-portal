import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TSU_BRANDING } from "@shared/constants";
import { BookOpen, Lock, Users, FileText } from "lucide-react";

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a472a] to-[#003d82] text-white py-12 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6 mb-6">
            <img src={TSU_BRANDING.logoUrl} alt="TSU Logo" className="h-24 w-24 rounded-full bg-white p-2 shadow-lg" />
            <div>
              <h1 className="text-4xl font-bold mb-2">{TSU_BRANDING.schoolName}</h1>
              <p className="text-lg text-gray-200 mb-1">{TSU_BRANDING.faculty}</p>
              <p className="text-lg text-gray-200">{TSU_BRANDING.department}</p>
            </div>
          </div>
          <div className="border-t border-gray-300 pt-4">
            <h2 className="text-2xl font-semibold">Examination Timetable Portal</h2>
            <p className="text-gray-200 mt-2">Access your exam schedule and manage academic records</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Welcome Section */}
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to TSU Exam Portal</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              This portal provides students with access to their examination timetables and allows administrators to manage exam schedules for the Faculty of Computing and Artificial Intelligence.
            </p>
          </div>

          {/* Main Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Student Section */}
            <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-r from-[#1a472a] to-[#003d82] text-white rounded-t-lg">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6" />
                  <CardTitle>Student Portal</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <CardDescription className="text-gray-600 mb-6">
                  Login or register to view your exam timetable, upload your profile photo, and access your academic information.
                </CardDescription>
                <div className="space-y-3">
                  <Button
                    onClick={() => navigate("/student-login", { replace: true })}
                    className="w-full bg-gradient-to-r from-[#1a472a] to-[#003d82] hover:from-[#0f2818] hover:to-[#002b5c] text-white font-semibold"
                  >
                    Student Login
                  </Button>
                  <Button
                    onClick={() => navigate("/student-register", { replace: true })}
                    variant="outline"
                    className="w-full border-[#1a472a] text-[#1a472a] hover:bg-[#1a472a] hover:text-white font-semibold"
                  >
                    New Student? Register
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Admin Section */}
            <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-r from-[#d4af37] to-[#1a472a] text-white rounded-t-lg">
                <div className="flex items-center gap-3">
                  <Lock className="h-6 w-6" />
                  <CardTitle>Admin Portal</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <CardDescription className="text-gray-600 mb-6">
                  Authorized administrators can login to manage exam timetables, upload schedules, and view registered students.
                </CardDescription>
                <Button
                  onClick={() => navigate("/admin-login", { replace: true })}
                  className="w-full bg-gradient-to-r from-[#d4af37] to-[#1a472a] hover:from-[#c99c2e] hover:to-[#0f2818] text-white font-semibold"
                >
                  Admin Login
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Features Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Portal Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <BookOpen className="h-8 w-8 text-[#1a472a] mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">View Timetable</h4>
                  <p className="text-sm text-gray-600">Access your personalized exam schedule with dates, times, and venues.</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <FileText className="h-8 w-8 text-[#003d82] mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Download PDF</h4>
                  <p className="text-sm text-gray-600">Generate and download your timetable as a professional PDF document.</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <Users className="h-8 w-8 text-[#1a472a] mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Student Profile</h4>
                  <p className="text-sm text-gray-600">Manage your profile information and upload your profile photo.</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <Lock className="h-8 w-8 text-[#003d82] mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Secure Access</h4>
                  <p className="text-sm text-gray-600">All data is protected with secure authentication and encryption.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Footer Info */}
          <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-[#1a472a]">
            <h3 className="text-xl font-bold text-gray-900 mb-3">About This Portal</h3>
            <p className="text-gray-600 mb-3">
              The TSU Examination Timetable Portal is an official platform designed to streamline the distribution and access of exam schedules for students and staff of the Faculty of Computing and Artificial Intelligence at Taraba State University.
            </p>
            <p className="text-gray-600">
              For technical support or inquiries, please contact the Faculty of Computing and Artificial Intelligence.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© 2026 Taraba State University. All rights reserved.</p>
          <p className="text-gray-500 text-sm mt-2">Faculty of Computing and Artificial Intelligence</p>
        </div>
      </footer>
    </div>
  );
}
