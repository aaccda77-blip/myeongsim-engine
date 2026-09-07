import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const { 
            name = '', 
            birthDate = '', 
            birthTime = '', 
            gender = '', 
            calendarType = '',
            userId = '', 
            phone = '',
            email = '' 
        } = body;

        const cleanName = (name || '').trim();
        if (!cleanName && !userId && !email) {
            return NextResponse.json({ error: 'Name or User identification is required' }, { status: 400 });
        }

        const nowIso = new Date().toISOString();

        // 1. Supabase Auth 세션 또는 유저 확인
        let targetUserId = userId;
        let targetEmail = email;

        // If no targetUserId provided, check Supabase Auth Cookie / Header
        if (!targetUserId && process.env.SUPABASE_SERVICE_ROLE_KEY) {
            const authHeader = req.headers.get('authorization');
            if (authHeader) {
                const token = authHeader.replace('Bearer ', '');
                const { data: authUser } = await supabaseAdmin.auth.getUser(token);
                if (authUser?.user) {
                    targetUserId = authUser.user.id;
                    targetEmail = authUser.user.email || targetEmail;
                }
            }
        }

        // If still no targetUserId but email exists, find user by email
        if (!targetUserId && targetEmail && process.env.SUPABASE_SERVICE_ROLE_KEY) {
            const { data: usersByEmail } = await supabaseAdmin
                .from('users')
                .select('id')
                .eq('email', targetEmail)
                .limit(1);
            if (usersByEmail && usersByEmail.length > 0) {
                targetUserId = usersByEmail[0].id;
            }
        }

        console.log('[SyncProfile] Syncing real user name:', cleanName, 'User ID:', targetUserId || 'guest');

        if (process.env.SUPABASE_SERVICE_ROLE_KEY && targetUserId) {
            // Update or Upsert in Supabase users table
            const updatePayload: any = {
                id: targetUserId,
                updated_at: nowIso,
            };
            if (cleanName) updatePayload.name = cleanName;
            if (targetEmail) updatePayload.email = targetEmail;
            if (phone) updatePayload.phone = phone;
            if (birthDate) updatePayload.birth_date = birthDate;
            if (gender) updatePayload.gender = gender;

            const { error: upsertErr } = await supabaseAdmin
                .from('users')
                .upsert(updatePayload, { onConflict: 'id' });

            if (upsertErr) {
                console.warn('[SyncProfile] Users upsert error:', upsertErr.message);
                // Fallback: simple update if upsert failed due to missing columns
                if (cleanName) {
                    await supabaseAdmin
                        .from('users')
                        .update({ name: cleanName })
                        .eq('id', targetUserId);
                }
            }

            // Also update profiles table if present
            try {
                await supabaseAdmin
                    .from('profiles')
                    .upsert({
                        id: targetUserId,
                        name: cleanName || undefined,
                        birth_date: birthDate || undefined,
                        gender: gender || undefined,
                        updated_at: nowIso,
                    }, { onConflict: 'id' });
            } catch (_) {}

            // Also update Supabase Auth User Metadata (full_name / real_name)
            try {
                await supabaseAdmin.auth.admin.updateUserById(targetUserId, {
                    user_metadata: {
                        real_name: cleanName,
                        full_name: cleanName,
                        user_name: cleanName,
                    }
                });
            } catch (_) {}
        }

        return NextResponse.json({
            success: true,
            message: '사용자 실명이 성공적으로 동기화되었습니다.',
            name: cleanName,
            userId: targetUserId
        });

    } catch (e: any) {
        console.error('[SyncProfile] Error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
