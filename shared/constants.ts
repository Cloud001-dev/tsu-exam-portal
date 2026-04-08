// TSU Branding & Configuration
export const TSU_BRANDING = {
  schoolName: "Taraba State University",
  faculty: "Faculty of Computing and Artificial Intelligence",
  department: "Department of Computer Science and Computer Science Education",
  logoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663529057486/kNDnkfCpgASE9UieewCHv2/logo-2026-04-08T134402.874_13744bbf.png",
  colors: {
    primary: "#1a472a", // TSU Green
    secondary: "#003d82", // TSU Blue
    accent: "#d4af37", // Gold accent
    light: "#f5f5f5",
    dark: "#1a1a1a",
  },
};

// Admin Credentials (Hardcoded)
export const ADMIN_CREDENTIALS = {
  login: "TSU\\FSC\\CS\\24\\1282",
  password: "bethshuah123",
};

// Session Configuration
export const SESSION_CONFIG = {
  maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  studentSessionPrefix: "student_",
  adminSessionPrefix: "admin_",
};

// File Upload Configuration
export const FILE_UPLOAD_CONFIG = {
  maxFileSize: 50 * 1024 * 1024, // 50MB
  allowedImageTypes: ["image/jpeg", "image/png", "image/gif"],
  allowedDocumentTypes: ["application/pdf", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
};

// PDF Configuration
export const PDF_CONFIG = {
  pageSize: "A4",
  margin: 10,
  headerHeight: 50,
  footerHeight: 20,
};
