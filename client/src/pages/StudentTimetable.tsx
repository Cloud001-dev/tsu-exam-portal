import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { TSU_BRANDING } from "@shared/constants";
import { ArrowLeft, Download, Calendar } from "lucide-react";

export default function StudentTimetable() {
  const [, navigate] = useLocation();
  const [studentId, setStudentId] = useState<number | null>(null);
  const [timetables, setTimetables] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: timetableData } = trpc.student.getTimetable.useQuery(
    { studentId: studentId || 0 },
    { enabled: !!studentId }
  );

  useEffect(() => {
    const id = localStorage.getItem("studentId");
    if (!id) {
      navigate("/student-login", { replace: true });
      return;
    }
    setStudentId(parseInt(id));
  }, [navigate]);

  useEffect(() => {
    if (timetableData) {
      setTimetables(timetableData);
      setIsLoading(false);
    }
  }, [timetableData]);

  const handleDownloadPDF = async () => {
    if (timetables.length === 0) {
      toast.error("No timetable data available to download");
      return;
    }

    setIsDownloading(true);

    try {
      // Dynamic import of jsPDF
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();

      // Set colors
      const primaryColor: [number, number, number] = [26, 71, 42]; // TSU Green
      const secondaryColor: [number, number, number] = [0, 61, 130]; // TSU Blue

      // Add header background
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 210, 40, "F");

      // Add logo (placeholder - in real app, load from URL)
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.text(TSU_BRANDING.schoolName, 15, 15 as any);

      // Add faculty and department info
      doc.setFontSize(10);
      doc.text(TSU_BRANDING.faculty, 15, 22 as any);
      doc.text(TSU_BRANDING.department, 15, 28 as any);

      // Add watermark (TSU text - logo image watermark would require additional setup)
      doc.setTextColor(200, 200, 200);
      doc.setFontSize(60);
      doc.setFont("helvetica" as any, "bold" as any);
      doc.text("TSU", 100, 150, { align: "center" } as any);
      doc.setFontSize(12);
      doc.text("Examination Timetable", 100, 160, { align: "center" } as any);

      // Reset for content
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont("helvetica" as any, "bold" as any);
      doc.text("Examination Timetable", 15, 52 as any);

      // Add timetable data
      let yPosition = 62;
      doc.setFontSize(10);
      doc.setFont("helvetica" as any, "normal" as any);

      // Table headers
      doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica" as any, "bold" as any);
      const headers = ["Course Code", "Course Name", "Date", "Time", "Venue"];
      const columnWidths = [30, 50, 30, 25, 35];
      let xPosition = 15;

      headers.forEach((header, index) => {
        doc.text(header, xPosition, yPosition as any);
        xPosition += columnWidths[index];
      });

      yPosition += 8;
      doc.setFont("helvetica" as any, "normal" as any);

      // Table rows
      doc.setTextColor(0, 0, 0);
      let rowCount = 0;
      timetables.forEach((exam) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
          // Repeat header on new page
          doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
          doc.setTextColor(255, 255, 255);
          doc.setFont("helvetica" as any, "bold" as any);
          xPosition = 15;
          headers.forEach((header, index) => {
            doc.text(header, xPosition, yPosition as any);
            xPosition += columnWidths[index];
          });
          yPosition += 8;
          doc.setFont("helvetica" as any, "normal" as any);
          doc.setTextColor(0, 0, 0);
        }

        // Alternate row colors
        if (rowCount % 2 === 0) {
          doc.setFillColor(240, 240, 240);
          doc.rect(15, yPosition - 5, 170, 7, "F");
        }

        xPosition = 15;
        const rowData = [
          exam.courseCode,
          exam.courseName,
          exam.examDate,
          `${exam.startTime || ""}-${exam.endTime || ""}`,
          exam.venue,
        ];

        rowData.forEach((data, index) => {
          doc.text(data, xPosition, yPosition as any, { maxWidth: columnWidths[index] - 2 } as any);
          xPosition += columnWidths[index];
        });

        yPosition += 8;
        rowCount++;
      });

      // Add summary
      yPosition += 5;
      doc.setFont("helvetica" as any, "normal" as any);
      doc.setFontSize(9);
      doc.text(`Total Exams: ${timetables.length}`, 15, yPosition as any);

      // Add footer
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text("© 2026 Taraba State University. All rights reserved.", 15, 285 as any);
      doc.text(`Generated on ${new Date().toLocaleDateString()} | Official Document`, 15, 290 as any);

      // Download
      const fileName = `TSU_Exam_Timetable_${new Date().getTime()}.pdf`;
      doc.save(fileName as any);
      toast.success("Timetable downloaded successfully!");
    } catch (error: any) {
      console.error("PDF generation error:", error);
      toast.error(error.message || "Failed to generate PDF");
    } finally {
      setIsDownloading(false);
    }
  };

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
        <div className="container mx-auto max-w-6xl">
          {/* Page Title */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Examination Timetable</h2>
            <p className="text-gray-600">Your personalized exam schedule for this academic session</p>
          </div>

          {/* Download Button */}
          <div className="mb-6">
            <Button
              onClick={handleDownloadPDF}
              disabled={isDownloading || timetables.length === 0}
              className="bg-gradient-to-r from-[#d4af37] to-[#1a472a] hover:from-[#c99c2e] hover:to-[#0f2818] text-white font-semibold"
            >
              <Download className="h-4 w-4 mr-2" />
              {isDownloading ? "Generating PDF..." : "Download as PDF"}
            </Button>
          </div>

          {/* Timetable Display */}
          {isLoading ? (
            <Card className="shadow-lg border-0">
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a472a] mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading timetable...</p>
                </div>
              </CardContent>
            </Card>
          ) : timetables.length === 0 ? (
            <Card className="shadow-lg border-0">
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Exams Scheduled</h3>
                  <p className="text-gray-600">Your exam timetable will appear here once it's published by the administration.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <Card className="shadow-lg border-0">
                  <CardContent className="pt-0">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-[#1a472a] to-[#003d82] text-white">
                          <th className="px-6 py-4 text-left font-semibold">Course Code</th>
                          <th className="px-6 py-4 text-left font-semibold">Course Name</th>
                          <th className="px-6 py-4 text-left font-semibold">Exam Date</th>
                          <th className="px-6 py-4 text-left font-semibold">Time</th>
                          <th className="px-6 py-4 text-left font-semibold">Venue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {timetables.map((exam, index) => (
                          <tr
                            key={index}
                            className={`border-b border-gray-200 ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            } hover:bg-blue-50 transition-colors`}
                          >
                            <td className="px-6 py-4 font-semibold text-gray-900">{exam.courseCode}</td>
                            <td className="px-6 py-4 text-gray-700">{exam.courseName}</td>
                            <td className="px-6 py-4 text-gray-700">{exam.examDate}</td>
                            <td className="px-6 py-4 text-gray-700">
                              {exam.startTime || ""} - {exam.endTime || ""}
                            </td>
                            <td className="px-6 py-4 text-gray-700">{exam.venue}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </div>

              {/* Mobile View */}
              <div className="md:hidden space-y-4">
                {timetables.map((exam, index) => (
                  <Card key={index} className="shadow-md border-0">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">Course Code</p>
                          <p className="text-lg font-bold text-gray-900">{exam.courseCode}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">Course Name</p>
                          <p className="text-gray-700">{exam.courseName}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Date</p>
                            <p className="text-gray-700">{exam.examDate}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Time</p>
                            <p className="text-gray-700">
                              {exam.startTime} - {exam.endTime}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">Venue</p>
                          <p className="text-gray-700">{exam.venue}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Information Box */}
          <Card className="mt-8 shadow-md border-0">
            <CardHeader className="bg-blue-50 rounded-t-lg">
              <CardTitle className="text-lg">Important Notes</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-[#1a472a] font-bold">•</span>
                  <span>Please arrive at the examination venue at least 15 minutes before the scheduled time.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#1a472a] font-bold">•</span>
                  <span>Bring your student ID card and any required examination materials.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#1a472a] font-bold">•</span>
                  <span>Check the venue information carefully as it may change before the examination.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#1a472a] font-bold">•</span>
                  <span>For any changes or clarifications, contact the Faculty office immediately.</span>
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
