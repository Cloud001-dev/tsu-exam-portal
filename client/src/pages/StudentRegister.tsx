import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { TSU_BRANDING } from "@shared/constants";

const departments = [
  "Computer Science",
  "Computer Science Education",
  "Information Technology",
  "Software Engineering",
  "Cybersecurity",
];

export default function StudentRegister() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    matricNumber: "",
    fullName: "",
    department: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const registerMutation = trpc.student.register.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDepartmentChange = (value: string) => {
    setFormData(prev => ({ ...prev, department: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!formData.matricNumber || !formData.fullName || !formData.department || !formData.password) {
      toast.error("All fields are required");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      await registerMutation.mutateAsync({
        matricNumber: formData.matricNumber,
        fullName: formData.fullName,
        department: formData.department,
        password: formData.password,
      });

      toast.success("Registration successful! Please login.");
      navigate("/student-login", { replace: true });
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a472a] to-[#003d82] text-white py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <img src={TSU_BRANDING.logoUrl} alt="TSU Logo" className="h-16 w-16 rounded-full bg-white p-1" />
            <div>
              <h1 className="text-3xl font-bold">{TSU_BRANDING.schoolName}</h1>
              <p className="text-sm text-gray-200">{TSU_BRANDING.faculty}</p>
              <p className="text-sm text-gray-200">{TSU_BRANDING.department}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-[#1a472a] to-[#003d82] text-white rounded-t-lg">
            <CardTitle className="text-2xl">Student Registration</CardTitle>
            <CardDescription className="text-gray-200">Create your account to access exam timetables</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Matric Number</label>
                <Input
                  type="text"
                  name="matricNumber"
                  placeholder="e.g., TSU/FSC/CS/24/1282"
                  value={formData.matricNumber}
                  onChange={handleChange}
                  className="border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <Input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <Select value={formData.department} onValueChange={handleDepartmentChange}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <Input
                  type="password"
                  name="password"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className="border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="border-gray-300"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#1a472a] to-[#003d82] hover:from-[#0f2818] hover:to-[#002b5c] text-white font-semibold py-2"
              >
                {isLoading ? "Registering..." : "Register"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/student-login", { replace: true })}
                  className="text-[#1a472a] font-semibold hover:underline"
                >
                  Login here
                </button>
              </p>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => navigate("/", { replace: true })}
                className="text-gray-500 text-sm hover:text-gray-700"
              >
                Back to Home
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
