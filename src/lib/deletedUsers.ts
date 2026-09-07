import fs from 'fs';
import path from 'path';

export interface DeletedUserRecord {
    userId: string;
    email?: string;
    deletedAt: string;
}

const memoryDeletedSet = new Set<string>();

function getStoragePath(): string {
    return path.join(process.cwd(), 'src', 'data', 'deleted_users.json');
}

export function getDeletedUsers(): DeletedUserRecord[] {
    try {
        const filePath = getStoragePath();
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            const data = JSON.parse(content);
            if (Array.isArray(data)) {
                data.forEach(item => {
                    if (item.userId) memoryDeletedSet.add(item.userId.toLowerCase());
                    if (item.email) memoryDeletedSet.add(item.email.toLowerCase());
                });
                return data;
            }
        }
    } catch (e) {
        console.warn('[DeletedUsers] Read warning:', e);
    }
    return [];
}

export function recordDeletedUser(userId: string, email?: string): void {
    if (!userId && !email) return;

    if (userId) memoryDeletedSet.add(userId.toLowerCase());
    if (email) memoryDeletedSet.add(email.toLowerCase());

    try {
        const dirPath = path.join(process.cwd(), 'src', 'data');
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        const filePath = getStoragePath();
        let list: DeletedUserRecord[] = [];
        if (fs.existsSync(filePath)) {
            try {
                list = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            } catch (_) {
                list = [];
            }
        }

        const cleanEmail = (email || '').trim().toLowerCase();
        const exists = list.some(item => 
            (userId && item.userId === userId) || 
            (cleanEmail && item.email && item.email.toLowerCase() === cleanEmail)
        );

        if (!exists) {
            list.unshift({
                userId,
                email: cleanEmail || undefined,
                deletedAt: new Date().toISOString()
            });
            fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');
        }
    } catch (e) {
        console.error('[DeletedUsers] Write error:', e);
    }
}

export function isUserDeleted(userId?: string, email?: string): boolean {
    const cleanId = (userId || '').trim().toLowerCase();
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanId && !cleanEmail) return false;

    if (cleanId && memoryDeletedSet.has(cleanId)) return true;
    if (cleanEmail && memoryDeletedSet.has(cleanEmail)) return true;

    // Load from disk if not in memory
    const list = getDeletedUsers();
    return list.some(item => {
        const itemUid = (item.userId || '').toLowerCase();
        const itemEmail = (item.email || '').toLowerCase();

        if (cleanEmail && itemEmail && cleanEmail === itemEmail) {
            return true;
        }
        if (cleanId && itemUid && (cleanId === itemUid || (itemUid.length >= 8 && cleanId.startsWith(itemUid)) || (cleanId.length >= 8 && itemUid.startsWith(cleanId)))) {
            return true;
        }
        return false;
    });
}
