import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { TSU_BRANDING } from "@shared/constants";

export default function StudentLogin() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    matricNumber: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const loginMutation = trpc.student.login.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.matricNumber || !formData.password) {
      toast.error("Matric number and password are required");
      setIsLoading(false);
      return;
    }

    try {
      const result = await loginMutation.mutateAsync({
        matricNumber: formData.matricNumber,
        password: formData.password,
      });

      if (result.success) {
        toast.success("Login successful!");
        // Store student info in localStorage if rememberMe is checked
        if (formData.rememberMe) {
          localStorage.setItem("studentId", result.student.id.toString());
          localStorage.setItem("studentMatricNumber", result.student.matricNumber);
        }
        navigate("/student-dashboard", { replace: true });
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed");
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
            <CardTitle className="text-2xl">Student Login</CardTitle>
            <CardDescription className="text-gray-200">Access your exam timetable and profile</CardDescription>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <Input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="border-gray-300"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                  }
                />
                <label htmlFor="rememberMe" className="text-sm text-gray-600 cursor-pointer">
                  Remember me
                </label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#1a472a] to-[#003d82] hover:from-[#0f2818] hover:to-[#002b5c] text-white font-semibold py-2"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/student-register", { replace: true })}
                  className="text-[#1a472a] font-semibold hover:underline"
                >
                  Register here
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
