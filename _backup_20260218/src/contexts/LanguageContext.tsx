'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Import all locales
import kr from '@/locales/kr.json';
import en from '@/locales/en.json';
import jp from '@/locales/jp.json';
import cn from '@/locales/cn.json';

// Supported Languages
export type Language = 'kr' | 'en' | 'jp' | 'cn';

// Locales Map
const locales: Record<Language, any> = {
    kr,
    en,
    jp,
    cn
};

// Language Data Display Names
export const LANGUAGES: { code: Language; label: string; flag: string }[] = [
    { code: 'kr', label: '한국어', flag: '🇰🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'jp', label: '日本語', flag: '🇯🇵' },
    { code: 'cn', label: '中文', flag: '🇨🇳' }
];

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    // Default to 'kr'
    const [language, setLanguage] = useState<Language>('kr');

    // Load from localStorage on mount
    useEffect(() => {
        const savedLang = localStorage.getItem('myeongsim_language') as Language;
        if (savedLang && locales[savedLang]) {
            setLanguage(savedLang);
        }
    }, []);

    // Save to localStorage on change
    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('myeongsim_language', lang);
    };

    // Translation Function (Nested keys support: 'common.loading')
    const t = (key: string): string => {
        const keys = key.split('.');
        let current: any = locales[language];

        for (const k of keys) {
            if (current && current[k]) {
                current = current[k];
            } else {
                // [Fix] Return null if key missing to allow component-level fallbacks
                console.warn(`Missing translation key: ${key} in ${language}`);
                return null as any;
            }
        }

        return typeof current === 'string' ? current : null as any;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
