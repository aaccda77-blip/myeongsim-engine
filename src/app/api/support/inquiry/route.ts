import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            type,
            typeLabel,
            title,
            content,
            rating,
            paymentMethod,
            paymentAmount,
            paymentDate,
            agreeMarketing,
            email,
            phone,
            createdAt
        } = body;

        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();
        const userEmail = session?.user?.email || email || '미입력';

        // 1. Save to Supabase `inquiries` table
        try {
            await supabase.from('inquiries').insert({
                user_id: session?.user?.id || null,
                user_email: userEmail,
                inquiry_type: typeLabel || type || '일반 문의',
                title: title || '문의사항 접수',
                content: content || '',
                rating: rating || null,
                payment_method: paymentMethod || null,
                payment_amount: paymentAmount || null,
                payment_date: paymentDate || null,
                agree_marketing: agreeMarketing || false,
                status: 'pending',
                created_at: new Date().toISOString()
            });
        } catch (dbError) {
            console.warn('[Inquiry API] DB insert warning:', dbError);
        }

        // 2. Email Notification to admin@mindflowlab.co.kr
        const targetEmail = process.env.SUPPORT_EMAIL || 'admin@mindflowlab.co.kr';
        const smtpUser = process.env.SMTP_USER || process.env.NAVER_EMAIL || 'mindflowlabbooks@naver.com';
        const smtpPass = process.env.SMTP_PASS || process.env.NAVER_PASSWORD;
        const smtpHost = process.env.SMTP_HOST || 'smtp.naver.com';
        const smtpPort = Number(process.env.SMTP_PORT) || 465;

        if (smtpPass) {
            try {
                const transporter = nodemailer.createTransport({
                    host: smtpHost,
                    port: smtpPort,
                    secure: smtpPort === 465, // true for 465, false for other ports
                    auth: {
                        user: smtpUser,
                        pass: smtpPass
                    }
                });

                const htmlContent = `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background-color: #ffffff;">
                        <h2 style="color: #1e293b; border-bottom: 2px solid #f59e0b; padding-bottom: 12px;">📩 명심코칭 새로운 고객 문의 접수</h2>
                        
                        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
                            <tr><td style="padding: 8px; font-weight: bold; width: 120px; color: #475569;">문의 유형</td><td style="padding: 8px; color: #0f172a;">${typeLabel || type || '일반 문의'}</td></tr>
                            <tr><td style="padding: 8px; font-weight: bold; color: #475569;">제목</td><td style="padding: 8px; color: #0f172a; font-weight: bold;">${title || '제목 없음'}</td></tr>
                            <tr><td style="padding: 8px; font-weight: bold; color: #475569;">작성일시</td><td style="padding: 8px; color: #64748b;">${createdAt || new Date().toLocaleString('ko-KR')}</td></tr>
                            <tr><td style="padding: 8px; font-weight: bold; color: #475569;">작성자 이메일</td><td style="padding: 8px; color: #2563eb;">${userEmail}</td></tr>
                            ${phone ? `<tr><td style="padding: 8px; font-weight: bold; color: #475569;">연락처</td><td style="padding: 8px; color: #0f172a;">${phone}</td></tr>` : ''}
                            ${paymentAmount ? `<tr><td style="padding: 8px; font-weight: bold; color: #475569;">결제정보</td><td style="padding: 8px; color: #0f172a;">${paymentAmount}원 (${paymentMethod || '미지정'}) / 일시: ${paymentDate || '-'}</td></tr>` : ''}
                        </table>

                        <div style="margin-top: 20px; background-color: #f8fafc; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px;">
                            <h4 style="margin: 0 0 8px 0; color: #334155;">문의 내용:</h4>
                            <p style="margin: 0; white-space: pre-wrap; color: #1e293b; line-height: 1.6;">${content || '내용 없음'}</p>
                        </div>
                        <p style="margin-top: 20px; font-size: 12px; color: #94a3b8;">본 메일은 명심코칭 앱 문의하기 시스템에서 자동 발송되었습니다.</p>
                    </div>
                `;

                await transporter.sendMail({
                    from: `"명심코칭 문의알림" <${smtpUser}>`,
                    to: targetEmail,
                    subject: `[명심코칭 문의] ${typeLabel || type || '일반문의'} - ${title || '제목없음'}`,
                    html: htmlContent
                });

                console.log(`[Inquiry API] Email successfully sent to ${targetEmail}`);
            } catch (mailError) {
                console.error('[Inquiry API] Failed to send email:', mailError);
            }
        } else {
            console.log(`[Inquiry API] Inquiry logged. (SMTP_PASS missing, email notification skipped). Target: ${targetEmail}`);
        }

        return NextResponse.json({
            success: true,
            message: 'Inquiry processed successfully'
        });
    } catch (error) {
        console.error('[Inquiry API] Error processing inquiry:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
