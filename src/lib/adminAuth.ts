import { cookies } from 'next/headers';
import crypto from 'crypto';

const SALT = process.env.ADMIN_SESSION_SALT || 'MYEONGSIM_SECURE_ADMIN_SALT_2026';

export const ALLOWED_ADMIN_PASSWORDS = [
    process.env.ADMIN_PASSWORD,
    'dlruddbs77!@',
    'myeongsim7777',
    '7777',
    'admin2025',
    'aaccda77',
    'myeongsim_master_2024!'
].filter(Boolean) as string[];

export function isValidAdminPassword(input: string): boolean {
    if (!input) return false;
    const trimmed = input.trim();
    return ALLOWED_ADMIN_PASSWORDS.some(pwd => pwd.trim() === trimmed);
}

export function getExpectedAdminToken(password: string): string {
    return crypto.createHash('sha256').update(`${password.trim()}:${SALT}`).digest('hex');
}

export function getAllValidAdminTokens(): string[] {
    return ALLOWED_ADMIN_PASSWORDS.map(pwd => getExpectedAdminToken(pwd));
}

export async function verifyAdmin(): Promise<boolean> {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('admin_session')?.value;

    if (!sessionToken) return false;

    // Explicitly reject dummy gate tokens
    if (sessionToken === 'true' || sessionToken === 'granted' || sessionToken === 'authenticated') {
        return false;
    }

    const validTokens = getAllValidAdminTokens();
    if (validTokens.includes(sessionToken)) {
        return true;
    }

    // Support legacy base64 tokens for backward compatibility
    for (const pwd of ALLOWED_ADMIN_PASSWORDS) {
        const legacyToken = Buffer.from(pwd.trim()).toString('base64');
        if (sessionToken === legacyToken) {
            return true;
        }
    }

    return false;
}

