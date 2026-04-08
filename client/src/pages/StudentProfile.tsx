import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { TSU_BRANDING } from "@shared/constants";
import { ArrowLeft, Upload } from "lucide-react";

export default function StudentProfile() {
  const [, navigate] = useLocation();
  const [studentId, setStudentId] = useState<number | null>(null);
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { data: profile } = trpc.student.getProfile.useQuery(
    { studentId: studentId || 0 },
    { enabled: !!studentId }
  );

  const updateProfileMutation = trpc.student.updateProfile.useMutation();

  useEffect(() => {
    const id = localStorage.getItem("studentId");
    if (!id) {
      navigate("/student-login", { replace: true });
      return;
    }
    setStudentId(parseInt(id));
  }, [navigate]);

  useEffect(() => {
    if (profile) {
      setStudentInfo(profile);
      setFullName(profile.fullName);
      if (profile.profilePhotoUrl) {
        setPreviewUrl(profile.profilePhotoUrl);
      }
    }
  }, [profile]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setProfilePhoto(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!studentId) return;

    setIsSaving(true);

    try {
      let photoUrl = studentInfo?.profilePhotoUrl;

      // Upload photo if selected
      if (profilePhoto) {
        try {
          const formData = new FormData();
          formData.append("file", profilePhoto);

          // Upload to backend which will handle S3 upload
          const uploadResponse = await fetch("/api/trpc/student.uploadProfilePhoto", {
            method: "POST",
            body: formData,
          });

          if (!uploadResponse.ok) {
            throw new Error("Upload failed");
          }

          const uploadData = await uploadResponse.json();
          photoUrl = uploadData.url || previewUrl;
          toast.success("Photo uploaded successfully!");
        } catch (error) {
          toast.error("Failed to upload photo");
          console.error("Upload error:", error);
        }
      }

      // Update profile
      await updateProfileMutation.mutateAsync({
        studentId,
        fullName: fullName || studentInfo?.fullName,
        profilePhotoUrl: photoUrl,
      });

      toast.success("Profile updated successfully!");
      navigate("/student-dashboard", { replace: true });
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (!studentInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a472a] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
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
              onClick={() => navigate("/student-dashboard", { replace: true })}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-[#1a472a]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-[#1a472a] to-[#003d82] text-white rounded-t-lg">
              <CardTitle className="text-2xl">Edit Profile</CardTitle>
              <CardDescription className="text-gray-200">Update your personal information and profile photo</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form className="space-y-6">
                {/* Matric Number (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Matric Number</label>
                  <Input
                    type="text"
                    value={studentInfo.matricNumber}
                    disabled
                    className="bg-gray-100 border-gray-300"
                  />
                  <p className="text-xs text-gray-500 mt-1">This field cannot be changed</p>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <Input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="border-gray-300"
                  />
                </div>

                {/* Department (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <Input
                    type="text"
                    value={studentInfo.department}
                    disabled
                    className="bg-gray-100 border-gray-300"
                  />
                  <p className="text-xs text-gray-500 mt-1">This field cannot be changed</p>
                </div>

                {/* Profile Photo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                  <div className="space-y-4">
                    {previewUrl && (
                      <>
                        <div className="flex justify-center">
                          <img
                            src={previewUrl}
                            alt="Profile Preview"
                            className="h-32 w-32 rounded-lg object-cover border-2 border-[#1a472a] shadow-md"
                          />
                        </div>
                        <p className="text-sm text-gray-600 mt-2">Photo selected - click below to upload a new one</p>
                      </>
                    )}

                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#1a472a] transition-colors cursor-pointer" 
                      onClick={() => document.getElementById('photoInput')?.click()}
                    >
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <span className="text-[#1a472a] font-semibold hover:underline">Click to upload</span>
                      <span className="text-gray-600"> or drag and drop</span>
                      <Input
                        id="photoInput"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                      <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  </div>
                </div>

                {/* Account Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 mb-2">
                    <strong>Member Since:</strong> {new Date(studentInfo.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> Your profile photo will be stored securely and used for identification purposes.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 bg-gradient-to-r from-[#1a472a] to-[#003d82] hover:from-[#0f2818] hover:to-[#002b5c] text-white font-semibold"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => navigate("/student-dashboard", { replace: true })}
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
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
