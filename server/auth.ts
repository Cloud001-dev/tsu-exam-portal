import crypto from "crypto";

/**
 * Hash a password using SHA-256 with a salt
 * In production, use bcrypt or argon2, but for this demo we use crypto
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verify a password against a hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  const [salt, storedHash] = hash.split(":");
  if (!salt || !storedHash) return false;

  const computedHash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");

  return computedHash === storedHash;
}

/**
 * Generate a session token
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Validate matric number format (basic validation)
 * Format: TSU/XXX/CS/YY/NNNN or similar variations
 */
export function isValidMatricNumber(matricNumber: string): boolean {
  // Allow various formats like: TSU/FSC/CS/24/1282, 24/1282, etc.
  return matricNumber.length >= 5 && matricNumber.length <= 50;
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): boolean {
  // At least 6 characters
  return password.length >= 6;
}
