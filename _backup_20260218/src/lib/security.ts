// Environment variable validation and security checks
const requiredEnvVars = [
    'GOOGLE_AI_API_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
] as const;

const optionalEnvVars = [
    'GOOGLE_APPLICATION_CREDENTIALS_JSON',
    'PAYPAL_CLIENT_ID',
    'PAYPAL_CLIENT_SECRET',
] as const;

export function validateEnvironment() {
    const missing: string[] = [];
    const warnings: string[] = [];

    // Check required variables
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            missing.push(envVar);
        }
    }

    // Check optional variables
    for (const envVar of optionalEnvVars) {
        if (!process.env[envVar]) {
            warnings.push(`Optional: ${envVar}`);
        }
    }

    // Security checks
    const securityIssues: string[] = [];

    // Check if API keys are properly formatted (not placeholder values)
    if (process.env.GOOGLE_AI_API_KEY?.includes('YOUR_') ||
        process.env.GOOGLE_AI_API_KEY?.includes('REPLACE_')) {
        securityIssues.push('GOOGLE_AI_API_KEY appears to be a placeholder value');
    }

    // Check key length (Google AI keys should be ~39 characters)
    if (process.env.GOOGLE_AI_API_KEY && process.env.GOOGLE_AI_API_KEY.length < 30) {
        securityIssues.push('GOOGLE_AI_API_KEY appears to be too short');
    }

    // Log results
    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:', missing);
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    if (warnings.length > 0) {
        console.warn('⚠️  Missing optional environment variables:', warnings);
    }

    if (securityIssues.length > 0) {
        console.error('🔒 Security issues detected:', securityIssues);
        if (process.env.NODE_ENV === 'production') {
            throw new Error('Security validation failed in production');
        }
    }

    console.log('✅ Environment validation passed');
}

// Sanitize error messages to prevent information leakage
export function sanitizeError(error: any, isProduction: boolean = process.env.NODE_ENV === 'production'): string {
    if (!isProduction) {
        return error.message || 'Unknown error';
    }

    // In production, return generic messages
    const errorString = error.toString().toLowerCase();

    if (errorString.includes('api key') || errorString.includes('credentials')) {
        return '인증 오류가 발생했습니다. 관리자에게 문의해주세요.';
    }

    if (errorString.includes('rate limit') || errorString.includes('quota')) {
        return '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
    }

    if (errorString.includes('network') || errorString.includes('timeout')) {
        return '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }

    return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
}

// Mask sensitive data in logs
export function maskSensitiveData(data: any): any {
    if (typeof data === 'string') {
        // Mask API keys
        return data.replace(/AIza[0-9A-Za-z_-]{35}/g, 'AIza***MASKED***');
    }

    if (typeof data === 'object' && data !== null) {
        const masked: any = Array.isArray(data) ? [] : {};
        for (const key in data) {
            if (key.toLowerCase().includes('key') ||
                key.toLowerCase().includes('secret') ||
                key.toLowerCase().includes('password') ||
                key.toLowerCase().includes('token')) {
                masked[key] = '***MASKED***';
            } else {
                masked[key] = maskSensitiveData(data[key]);
            }
        }
        return masked;
    }

    return data;
}

// Run validation on module load (server-side only)
if (typeof window === 'undefined') {
    validateEnvironment();
}
