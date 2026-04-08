# TSU Exam Timetable Portal - TODO

## Database & Schema
- [x] Create students table (matric_number, full_name, department, password_hash, profile_photo_url, created_at, updated_at)
- [x] Create timetables table (exam_id, course_code, course_name, date, start_time, end_time, venue, created_at)
- [x] Create student_timetables table (student_id, timetable_id, created_at)
- [x] Create timetable_files table (file_url, file_name, uploaded_by_admin, uploaded_at)
- [x] Upload TSU logo to S3 and save CDN URL

## Backend Authentication & APIs
- [x] Student login endpoint (matric_number + password)
- [x] Student registration endpoint (matric_number, full_name, department, password)
- [x] Admin login endpoint (hardcoded credentials: TSU\FSC\CS\24\1282 / bethshuah123)
- [x] Session/JWT management for both student and admin
- [x] Verify matric number uniqueness during registration
- [x] Hash passwords securely

## Backend File Management APIs
- [ ] Student profile photo upload endpoint (S3 upload, save CDN URL to DB)
- [ ] Admin timetable file upload endpoint (PDF/image, S3 upload, save to DB)
- [x] Retrieve student timetable data
- [x] PDF generation with logo watermark endpoint

## Frontend - Authentication Pages
- [x] Student login page (matric_number, password fields, remember me option)
- [x] Student registration page (matric_number, full_name, department dropdown, password, confirm password)
- [x] Admin login page (login field, password field)
- [ ] Session/auth state management using useAuth hook

## Frontend - Student Pages
- [x] Student dashboard/home page (welcome message, quick links)
- [x] Student profile page (display profile info, photo upload, edit details)
- [x] Student timetable view page (display personal exam schedule in table/calendar format)
- [x] PDF download button on timetable page (generates PDF with logo watermark)

## Frontend - Admin Pages
- [x] Admin dashboard (overview, quick actions)
- [ ] Timetable upload page (file upload, preview, confirmation)
- [x] Timetable management page (list uploaded timetables, edit, delete)
- [x] View all students (admin can see registered students)

## Frontend - Navigation & Layout
- [x] Header with TSU logo, school name, faculty/department info
- [x] Navigation menu (different for student vs admin)
- [x] Logout functionality
- [x] Responsive design for mobile/tablet/desktop

## Styling & Branding
- [x] Apply TSU green/blue color scheme to Tailwind config
- [x] Design official university aesthetic (formal typography, institutional layout)
- [x] TSU logo displayed in header and footer
- [x] Consistent styling across all pages
- [x] Professional form styling
- [x] Table styling for timetable display

## PDF Generation
- [x] PDF library integration (jsPDF or similar)
- [x] PDF header with faculty and department names
- [x] TSU logo watermark on PDF
- [x] Timetable data formatted in PDF
- [x] Professional PDF layout

## Testing & Deployment
- [ ] Test student registration flow
- [ ] Test student login flow
- [ ] Test admin login with hardcoded credentials
- [ ] Test profile photo upload
- [ ] Test timetable upload (admin)
- [ ] Test timetable view (student)
- [ ] Test PDF generation and download
- [ ] Test responsive design
- [ ] Browser compatibility testing

## Implementation Notes
- Home page created with TSU branding and navigation to student/admin portals
- Student registration and login pages fully functional with validation
- Admin login with hardcoded credentials (TSU\FSC\CS\24\1282 / bethshuah123)
- Student dashboard showing profile and timetable quick links
- Student profile page with photo upload UI (backend integration pending)
- Student timetable view with PDF export functionality and TSU watermark
- Admin dashboard with tabs for students, timetables, and files
- All pages styled with TSU green/blue color scheme
- Responsive design for mobile, tablet, and desktop
