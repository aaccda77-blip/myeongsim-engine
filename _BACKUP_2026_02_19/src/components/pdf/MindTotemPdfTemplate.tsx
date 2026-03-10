'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { UserSoulProfile } from '@/types/akashic_records';

interface MindTotemPdfTemplateProps {
    content: string;
    profile?: UserSoulProfile;
    date: string;
    tier?: 'DELUXE' | 'PREMIUM';
}

// Define all colors as HEX to avoid 'lab()' parsing errors in html2canvas
const COLORS = {
    bgLight: '#F3F0FF',
    bgGradient1: '#ECE6FF',
    bgGradient2: '#D8CCFF',
    purplePrimary: '#7C5CFF',
    purpleSecondary: '#9F85FF',
    purpleLight: '#C4B5FD',
    purplePale: '#EDE9FE', // purple-50
    purpleText: '#6B21A8', // purple-800
    gray800: '#1f2937',
    gray700: '#374151',
    purpleAccent: '#A78BFA', // purple-400
    white: '#FFFFFF',
    yellow: '#FFFBEB',
    yellowBorder: '#FACC15', // yellow-400
};

export const MindTotemPdfTemplate = ({ content, profile, date, tier = 'DELUXE' }: MindTotemPdfTemplateProps) => {

    const pillars = profile?.nativity?.saju_characters || { year: '?', month: '?', day: '?', hour: '?' };

    // ★★ 사주 년·월·일·시 표 ★★
    const PillarTable = () => (
        <table
            style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginTop: '24px',
                marginBottom: '40px',
            }}
        >
            <thead>
                <tr>
                    {['년', '월', '일', '시'].map((label) => (
                        <th
                            key={label}
                            style={{
                                borderBottom: `2px solid ${COLORS.purpleAccent}`,
                                padding: '8px 0',
                                fontSize: '14px',
                                color: COLORS.purplePrimary,
                            }}
                        >
                            {label}주
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                <tr>
                    {['year', 'month', 'day', 'hour'].map((key) => (
                        <td
                            key={key}
                            style={{
                                borderBottom: `1px solid ${COLORS.purplePale}`,
                                padding: '12px 0',
                                textAlign: 'center',
                                fontSize: '18px',
                                fontWeight: 700,
                                color: COLORS.purplePrimary,
                            }}
                        >
                            {(pillars as any)[key]}
                        </td>
                    ))}
                </tr>
            </tbody>
        </table>
    );

    return (
        <div id="mind-totem-pdf-container" style={{ width: '210mm', minHeight: '297mm', backgroundColor: COLORS.bgLight, fontFamily: 'sans-serif', color: COLORS.gray800 }}>

            {/* COVER PAGE */}
            <div style={{ width: '100%', height: '297mm', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(to bottom, ${COLORS.bgGradient1}, ${COLORS.bgGradient2})`, pageBreakAfter: 'always' }}>

                {/* Main Card */}
                <div style={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '3rem', padding: '48px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: `6px solid ${COLORS.purpleLight}`, width: '85%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden', marginTop: '80px' }}>

                    {/* Header Badge */}
                    <div style={{ backgroundColor: tier === 'PREMIUM' ? COLORS.purplePrimary : COLORS.purpleSecondary, color: COLORS.white, padding: '12px 32px', borderRadius: '9999px', fontWeight: 'bold', letterSpacing: '0.2em', fontSize: '14px', marginBottom: '48px' }}>
                        {tier} REPORT
                    </div>

                    {/* Title */}
                    <h1 style={{ fontSize: '4rem', fontWeight: 900, color: COLORS.purplePrimary, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '-0.05em', lineHeight: '1' }}>
                        MYEONGSIM<br />SAJU NOTE
                    </h1>

                    {/* Name Card */}
                    <div style={{ width: '100%', maxWidth: '384px', backgroundColor: COLORS.white, borderRadius: '16px', border: `5px solid ${COLORS.purpleLight}`, padding: '24px', margin: '40px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', transform: 'rotate(-1deg)' }}>
                        <span style={{ position: 'absolute', left: '-16px', top: '-16px', fontSize: '3rem' }}>✨</span>
                        <span style={{ fontSize: '2rem', fontWeight: 800, color: COLORS.gray800 }}>{profile?.name || '소중한 당신'}</span>
                        <span style={{ position: 'absolute', right: '-16px', bottom: '-16px', fontSize: '3rem' }}>✨</span>
                    </div>

                    {/* Saju Pillars Table */}
                    <PillarTable />

                    {/* Footer */}
                    <div style={{ marginTop: 'auto', color: COLORS.purpleAccent, fontSize: '12px', fontWeight: 500 }}>
                        Copyright 2025. Oracle Studio. All rights reserved.<br />
                        {tier === 'PREMIUM' ? 'Premium 80P Volume Analysis' : 'Deluxe 25P Volume Analysis'} | {date}
                    </div>

                    {/* Decorative Icons */}
                    <div style={{ position: 'absolute', bottom: '40px', right: '40px', fontSize: '128px', opacity: 0.1, transform: 'rotate(12deg)' }}>🔮</div>
                    <div style={{ position: 'absolute', top: '128px', left: '40px', fontSize: '96px', opacity: 0.1, transform: 'rotate(-12deg)' }}>🌙</div>
                </div>
            </div>

            {/* CONTENT PAGES */}
            <div style={{ width: '100%', backgroundColor: COLORS.white, position: 'relative' }}>
                <div style={{ padding: '48px' }}>
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: ({ node, ...props }) => (
                                <div style={{ pageBreakBefore: 'always', marginTop: '32px', marginBottom: '24px', borderBottom: `4px solid ${COLORS.purpleLight}`, paddingBottom: '8px' }}>
                                    <h1 style={{ fontSize: '1.875rem', fontWeight: 900, color: COLORS.purplePrimary, textTransform: 'uppercase' }} {...props} />
                                </div>
                            ),
                            h2: ({ node, ...props }) => (
                                <div style={{ marginTop: '48px', marginBottom: '24px', backgroundColor: COLORS.bgLight, borderLeft: `8px solid ${COLORS.purpleSecondary}`, paddingLeft: '24px', paddingTop: '16px', paddingBottom: '16px', borderRadius: '0 12px 12px 0', pageBreakInside: 'avoid' }}>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: COLORS.purpleText, margin: 0 }} {...props} />
                                </div>
                            ),
                            h3: ({ node, ...props }) => (
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: COLORS.purplePrimary, marginTop: '32px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }} {...props}>
                                    <span style={{ fontSize: '1rem' }}>✨</span>
                                    {props.children}
                                </h3>
                            ),
                            p: ({ node, ...props }) => (
                                <p style={{ color: COLORS.gray700, lineHeight: '1.75', marginBottom: '16px', fontWeight: 500 }} {...props} />
                            ),
                            ul: ({ node, ...props }) => (
                                <ul style={{ marginBottom: '24px', backgroundColor: COLORS.white, borderRadius: '12px', border: `2px dashed ${COLORS.purplePale}`, padding: '24px' }} {...props} />
                            ),
                            li: ({ node, ...props }) => (
                                <li style={{ display: 'flex', gap: '8px', color: COLORS.gray700, marginBottom: '8px' }} {...props}>
                                    <span style={{ color: COLORS.purpleAccent, marginTop: '4px' }}>•</span>
                                    <span>{props.children}</span>
                                </li>
                            ),
                            blockquote: ({ node, ...props }) => (
                                <blockquote style={{ backgroundColor: COLORS.yellow, borderLeft: `4px solid ${COLORS.yellowBorder}`, padding: '16px', margin: '24px 0', borderRadius: '0 8px 8px 0', fontStyle: 'italic', color: COLORS.gray700 }} {...props} />
                            ),
                            strong: ({ node, ...props }) => (
                                <strong style={{ color: COLORS.purplePrimary, fontWeight: 800, backgroundColor: COLORS.purplePale, padding: '0 4px', borderRadius: '4px' }} {...props} />
                            ),
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
};
