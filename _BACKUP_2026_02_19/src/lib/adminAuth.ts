import { cookies } from 'next/headers';

export async function verifyAdmin() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('admin_session')?.value;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin2025';

    // In our simple "hash" scheme:
    const expectedToken = Buffer.from(ADMIN_PASSWORD).toString('base64');

    if (sessionToken === expectedToken) {
        return true;
    }
    return false;
}
