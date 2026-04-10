import bcrypt from "bcryptjs";

/**
 * Hashes a password using bcrypt.
 * Cost factor set to 12 for high security.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
 * Compares a plain password with a hashed one.
 */
export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}
