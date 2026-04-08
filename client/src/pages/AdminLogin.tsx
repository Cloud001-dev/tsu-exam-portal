import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { TSU_BRANDING } from "@shared/constants";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const loginMutation = trpc.admin.login.useMutation();

  useEffect(() => {
    const adminSession = localStorage.getItem("adminSession");
    if (adminSession) {
      navigate("/admin-dashboard", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.login || !formData.password) {
      toast.error("Login credentials are required");
      setIsLoading(false);
      return;
    }

    try {
      const result = await loginMutation.mutateAsync({
        login: formData.login,
        password: formData.password,
      });

      if (result.success) {
        toast.success("Admin login successful!");
        localStorage.setItem("adminSession", "true");
        navigate("/admin-dashboard", { replace: true });
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
          <CardHeader className="bg-gradient-to-r from-[#d4af37] to-[#1a472a] text-white rounded-t-lg">
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription className="text-gray-100">Manage exam timetables and students</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Admin Access Only</strong><br />
                This portal is restricted to authorized administrators only.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Login ID</label>
                <Input
                  type="text"
                  name="login"
                  placeholder="e.g., TSU\FSC\CS\24\1282"
                  value={formData.login}
                  onChange={handleChange}
                  className="border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <Input
                  type="password"
                  name="password"
                  placeholder="Enter admin password"
                  value={formData.password}
                  onChange={handleChange}
                  className="border-gray-300"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#d4af37] to-[#1a472a] hover:from-[#c99c2e] hover:to-[#0f2818] text-white font-semibold py-2"
              >
                {isLoading ? "Logging in..." : "Admin Login"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Student?{" "}
                <button
                  onClick={() => navigate("/student-login", { replace: true })}
                  className="text-[#1a472a] font-semibold hover:underline"
                >
                  Login as student
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
