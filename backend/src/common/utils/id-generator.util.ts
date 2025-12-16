import { Repository } from 'typeorm';
import { UserMain, RolePrefixMap } from '../../entities/user-main.entity';

/**
 * Generate a unique public_id based on role
 * Format: {role_prefix}-{sequential_number}
 * Example: gus-001, sup-002, digi-003
 */
export async function generatePublicId(
  role: string,
  userRepository: Repository<UserMain>,
): Promise<string> {
  const prefix = RolePrefixMap[role as keyof typeof RolePrefixMap];
  if (!prefix) {
    throw new Error(`Invalid role: ${role}`);
  }

  // Get the highest number across ALL roles to ensure uniqueness
  const result = await userRepository
    .createQueryBuilder('user')
    .select(
      "MAX(CAST(SUBSTRING(user.public_id FROM '-(\\d+)$') AS INTEGER))",
      'max_number',
    )
    .getRawOne<{ max_number: number | null }>();

  const nextNumber = (result?.max_number ?? 0) + 1;
  const paddedNumber = String(nextNumber).padStart(3, '0');

  return `${prefix}-${paddedNumber}`;
}

/**
 * Generate a unique private_id
 * Format: 1 letter + 14 alphanumeric characters
 * Example: A1B2C3D4E5F6G7H
 */
export async function generatePrivateId(
  userRepository: Repository<UserMain>,
): Promise<string> {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let privateId = '';
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;

  while (!isUnique && attempts < maxAttempts) {
    // Generate: 1 letter + 14 random chars
    privateId = letters.charAt(Math.floor(Math.random() * letters.length));
    for (let i = 0; i < 14; i++) {
      privateId += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Check if unique
    const existing = await userRepository.findOne({
      where: { private_id: privateId },
    });
    if (!existing) {
      isUnique = true;
    }
    attempts++;
  }

  if (!isUnique) {
    throw new Error(
      'Failed to generate unique private_id after multiple attempts',
    );
  }

  return privateId;
}

/**
 * Generate a unique inventory ID
 * Format: INV-{timestamp}-{random}
 */
export function generateInventoryId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `INV-${timestamp}-${random}`;
}

/**
 * Generate next invoice number from sequence
 * Format: 10+ digit sequential number
 */
export function generateInvoiceNumber(sequenceValue: number): string {
  return String(sequenceValue).padStart(10, '0');
}
