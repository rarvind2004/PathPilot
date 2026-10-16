
// some authentication helper functions for hashing and verifying passwords

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

//hash a plain text password before storing it in the DB
export async function hashPassword(plainPassword) {

  if (!plainPassword || typeof plainPassword !== 'string') {
    throw new Error('Password is required');
  }
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

//compare a plain password to a stored hash
export async function verifyPassword(plainPassword, passwordHash) {

  if (!passwordHash) return false;

  return bcrypt.compare(plainPassword, passwordHash);
}
