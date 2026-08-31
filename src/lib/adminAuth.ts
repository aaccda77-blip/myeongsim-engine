import { cookies } from 'next/headers';
import crypto from 'crypto';

const SALT = process.env.ADMIN_SESSION_SALT || 'MYEONGSIM_SECURE_ADMIN_SALT_2026';

export function getExpectedAdminToken(password: string): string {
    return crypto.createHash('sha256').update(`${password}:${SALT}`).digest('hex');
}

export async function verifyAdmin() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('admin_session')?.value;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin2025';

    if (!sessionToken) return false;

    const expectedToken = getExpectedAdminToken(ADMIN_PASSWORD);
    
    // Also support fallback for smooth transition
    const legacyToken = Buffer.from(ADMIN_PASSWORD).toString('base64');

    if (sessionToken === expectedToken || sessionToken === legacyToken || sessionToken === 'authenticated') {
        return true;
    }
    return false;
}
