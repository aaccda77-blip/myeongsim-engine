import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getPendingWireTransfers, getApprovedUsers } from '@/lib/pendingWireTransfers';
import { maskPhoneNumber } from '@/lib/phoneSecurity';
import { isUserDeleted } from '@/lib/deletedUsers';

export const dynamic = 'force-dynamic'; // Prevent caching

export async function GET(request: NextRequest) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let users: any[] = [];
    let authUserMap: Record<string, { email?: string; name?: string; phone?: string }> = {};

    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        // 1. Fetch Supabase Auth Users for accurate emails, providers, and names
        try {
            const { data: authData } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
            if (authData?.users) {
                authData.users.forEach(au => {
                    // Skip deleted users immediately
                    if (isUserDeleted(au.id, au.email)) return;

                    const meta = au.user_metadata || {};
                    const socialName = meta.full_name || meta.name || meta.display_name || meta.userName || meta.user_name || '';
                    authUserMap[au.id] = {
                        email: au.email || '',
                        name: socialName,
                        phone: au.phone || meta.phone || '',
                    };
                });
            }
        } catch (authErr) {
            console.warn('[AdminUsers] listUsers error:', authErr);
        }

        // 2. Fetch database `profiles` table for real names submitted via saju analysis
        let profileMap: Record<string, { name?: string; birth_date?: string; gender?: string }> = {};
        try {
            const { data: profData } = await supabaseAdmin.from('profiles').select('id, name, birth_date, gender');
            if (profData) {
                profData.forEach(p => {
                    if (p.id && p.name) {
                        profileMap[p.id] = { name: p.name, birth_date: p.birth_date, gender: p.gender };
                    }
                });
            }
        } catch (e) {
            console.warn('[AdminUsers] profiles fetch error:', e);
        }

        // 3. Fetch database `users` table
        const { data, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            users = data
                .filter(u => !isUserDeleted(u.id, u.email))
                .map(u => {
                    const authInfo = authUserMap[u.id] || {};
                    const profInfo = profileMap[u.id] || {};
                    const resolvedEmail = u.email || authInfo.email || '';
                    const emailPrefix = resolvedEmail.includes('@') ? resolvedEmail.split('@')[0] : '';
                    
                    // 실제 사용자가 직접 입력한 실명 (사주 화면, 프로필, 입금자명)
                    const realName = u.name || profInfo.name || u.depositor_name || u.depositorName || '';
                    // 구글 소셜 계정 닉네임
                    const googleName = authInfo.name || '';
                    
                    // 이름 우선순위: 사용자가 직접 입력한 실명(#1) > 구글 소셜 닉네임 > 이메일 ID > 기본 식별자
                    let resolvedName = realName || googleName;
                    if (!resolvedName && emailPrefix) {
                        resolvedName = `${emailPrefix}`;
                    }
                    if (!resolvedName) {
                        resolvedName = `회원_${u.id.slice(0, 8)}`;
                    }

                    return {
                        ...u,
                        email: resolvedEmail,
                        name: resolvedName,
                        realName: realName,
                        googleName: googleName,
                        birth_date: u.birth_date || profInfo.birth_date || '',
                        gender: u.gender || profInfo.gender || '',
                        phone: u.phone || authInfo.phone || '',
                        raw_id: u.id,
                        approved_at: u.approved_at || undefined,
                        approved_by: u.approved_by || (u.approved_at ? '관리자 (Admin)' : undefined),
                        is_approved: !!u.approved_at || (u.is_active && u.membership_tier !== 'TRIAL'),
                    };
                });
        }

        // 4. Add any Auth Users who are not yet in the `users` table
        if (authUserMap) {
            Object.entries(authUserMap).forEach(([authId, info]) => {
                if (isUserDeleted(authId, info.email)) return;

                const exists = users.some(u => u.id === authId);
                if (!exists) {
                    const profInfo = profileMap[authId] || {};
                    const emailPrefix = (info.email && info.email.includes('@')) ? info.email.split('@')[0] : '';
                    const realName = profInfo.name || '';
                    const googleName = info.name || '';
                    const resolvedName = realName || googleName || (emailPrefix ? `${emailPrefix}` : `가입자_${authId.slice(0, 8)}`);
                    users.push({
                        id: authId,
                        email: info.email || '',
                        name: resolvedName,
                        realName: realName,
                        googleName: googleName,
                        phone: info.phone || '',
                        membership_tier: 'TRIAL',
                        is_active: true,
                        created_at: new Date().toISOString(),
                    });
                }
            });
        }
    }

    // 5. Merge in-memory pending wire transfers
    const pendingMemoryItems = getPendingWireTransfers();
    pendingMemoryItems.forEach(pending => {
        if (isUserDeleted(pending.id)) return;

        const existingIndex = users.findIndex(u => 
            u.id === pending.id || 
            (pending.email && u.email && u.email.toLowerCase() === pending.email.toLowerCase()) ||
            u.name === pending.depositorName || 
            (u.depositorName && u.depositorName === pending.depositorName)
        );
        if (existingIndex === -1) {
            users.unshift({
                id: pending.id,
                email: pending.email || '무통장 입금 신청',
                name: pending.depositorName ? (pending.is_active ? pending.depositorName : `[입금신청] ${pending.depositorName}`) : '입금 신청자',
                depositorName: pending.depositorName,
                phone: pending.phone || pending.maskedPhone || '',
                membership_tier: pending.membership_tier || 'CHAT_PASS',
                is_active: pending.is_active || false,
                payment_amount: pending.amount || 890,
                chat_turns_left: 10,
                created_at: pending.created_at,
            });
        } else {
            if (pending.depositorName) {
                users[existingIndex].depositorName = pending.depositorName;
                if (!users[existingIndex].is_active && !users[existingIndex].approved_at) {
                    users[existingIndex].name = `[입금신청] ${pending.depositorName}`;
                }
            }
            if (pending.email && (!users[existingIndex].email || !users[existingIndex].email.includes('@'))) {
                users[existingIndex].email = pending.email;
            }
            if (pending.phone && !users[existingIndex].phone) {
                users[existingIndex].phone = pending.phone;
            }
            if (pending.is_active) {
                users[existingIndex].is_active = true;
            }
        }
    });

    // 6. Merge approved users (from persistent file & memory store)
    const approvedList = getApprovedUsers();
    approvedList.forEach(approved => {
        if (isUserDeleted(approved.userId, approved.email)) return;

        const cleanEmail = (approved.email || '').toLowerCase().trim();
        const cleanPhone = (approved.phone || '').replace(/[^0-9]/g, '');
        const cleanName = (approved.name || approved.depositorName || '').trim().toLowerCase();

        const existingIndex = users.findIndex(u => {
            if (approved.userId && (u.id === approved.userId || (u.raw_id && u.raw_id === approved.userId))) return true;
            if (cleanEmail && u.email && u.email.toLowerCase() === cleanEmail) return true;
            if (cleanPhone && u.phone && u.phone.replace(/[^0-9]/g, '') === cleanPhone) return true;
            if (cleanName && u.depositorName && u.depositorName.trim().toLowerCase() === cleanName) return true;
            if (cleanName && u.realName && u.realName.trim().toLowerCase() === cleanName) return true;
            return false;
        });

        const isUserActive = approved.status !== 'LOCKED';

        if (existingIndex !== -1) {
            users[existingIndex].is_active = isUserActive;
            if (isUserActive) {
                users[existingIndex].membership_tier = approved.tier || users[existingIndex].membership_tier;
                users[existingIndex].approved_at = approved.approvedAt;
                users[existingIndex].approved_by = approved.approvedBy || '관리자 (Admin)';
                users[existingIndex].is_approved = true;
                if (approved.amount) {
                    users[existingIndex].payment_amount = Math.max(users[existingIndex].payment_amount || 0, approved.amount);
                }
                if (users[existingIndex].name && users[existingIndex].name.startsWith('[입금신청]')) {
                    users[existingIndex].name = users[existingIndex].name.replace('[입금신청]', '').trim();
                }
            } else {
                users[existingIndex].is_active = false;
                users[existingIndex].membership_tier = 'GUEST';
            }
        } else {
            // New approved user not yet in DB
            users.unshift({
                id: approved.userId,
                email: approved.email || '',
                name: approved.name || approved.depositorName || `승인회원_${approved.userId.slice(0, 8)}`,
                depositorName: approved.depositorName || approved.name,
                phone: approved.phone || '',
                membership_tier: approved.tier || 'MONTHLY_98K',
                is_active: isUserActive,
                payment_amount: approved.amount || (approved.tier === 'MONTHLY_98K' ? 98000 : 19800),
                chat_turns_left: approved.tier === 'MONTHLY_98K' ? 50 : 20,
                created_at: approved.approvedAt,
                approved_at: approved.approvedAt,
                approved_by: approved.approvedBy || '관리자 (Admin)',
                is_approved: isUserActive
            });
        }
    });

    // 최종 삭제된 회원 2차 필터링
    users = users.filter(u => !isUserDeleted(u.id, u.email));

    // 정렬 우선순위:
    // 1순위: 승인 대기(is_active === false) 회원 최상단 (#1)
    // 2순위: 최근 승인 완료 회원(approved_at 최신순)
    // 3순위: 가입 일시(created_at 최신순)
    users.sort((a, b) => {
        const pendingA = a.is_active === false ? 1 : 0;
        const pendingB = b.is_active === false ? 1 : 0;
        if (pendingA !== pendingB) {
            return pendingB - pendingA; // is_active === false 우선 노출
        }
        const approvedA = a.approved_at ? new Date(a.approved_at).getTime() : 0;
        const approvedB = b.approved_at ? new Date(b.approved_at).getTime() : 0;
        if (approvedA !== approvedB) {
            return approvedB - approvedA; // 최근 승인순 우선 노출
        }
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });

    // PRIVACY ENCRYPTION: Mask only real phone numbers (not names)
    const securedUsers = users.map(user => {
        const rawPhone = user.phone || '';
        return {
            ...user,
            name: user.name || user.depositorName || (user.email ? user.email.split('@')[0] : `가입자_${user.id.slice(0, 8)}`),
            phone: rawPhone ? maskPhoneNumber(rawPhone) : '',
            originalPhoneMasked: rawPhone ? maskPhoneNumber(rawPhone) : '',
        };
    });

    return NextResponse.json(securedUsers);
}
