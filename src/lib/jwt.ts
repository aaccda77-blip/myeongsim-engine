// src/lib/jwt.ts
/**
 * JWT Token Management
 * 안전한 인증 토큰 생성 및 검증
 */

import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'myeongsim-secret-key-change-in-production-2025'
);

export interface JWTPayload {
    userId: string;
    phoneHash: string;
    membershipTier: string;
    iat?: number;
    exp?: number;
}

export const createToken = async (payload: JWTPayload): Promise<string> => {
    const token = await new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d') // 7일 유효
        .sign(JWT_SECRET);

    return token;
};

export const verifyToken = async (token: string): Promise<JWTPayload | null> => {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as unknown as JWTPayload;
    } catch (error) {
        console.error('JWT verification failed:', error);
        return null;
    }
};
