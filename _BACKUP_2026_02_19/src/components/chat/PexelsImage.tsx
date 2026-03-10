'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { searchPexelsImage, optimizePexelsQuery } from '@/utils/pexelsClient';

interface PexelsImageProps {
    prompt: string;
}

/**
 * Pexels Image Component
 * Loads image only once per unique prompt to prevent reload on typing
 */
export function PexelsImage({ prompt }: PexelsImageProps) {
    const [imageUrl, setImageUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const loadedPromptRef = useRef<string>('');

    // Memoize the optimized query to prevent recalculation
    const optimizedQuery = useMemo(() => optimizePexelsQuery(prompt), [prompt]);

    useEffect(() => {
        // Only load if this is a new prompt (not already loaded)
        if (loadedPromptRef.current === prompt) {
            return; // Skip if already loaded this exact prompt
        }

        const loadImage = async () => {
            setIsLoading(true);
            const apiKey = process.env.NEXT_PUBLIC_PEXELS_API_KEY;
            const url = await searchPexelsImage(optimizedQuery, apiKey);
            setImageUrl(url);
            setIsLoading(false);
            loadedPromptRef.current = prompt; // Mark as loaded
        };

        loadImage();
    }, [prompt, optimizedQuery]);

    return (
        <div className="pl-4 md:pl-12 pr-4 w-full max-w-[95%] md:max-w-[400px] mt-3 mb-4 animate-fade-in-up">
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                {isLoading ? (
                    <div className="w-full h-64 bg-gradient-to-br from-emerald-900/20 to-teal-900/20 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                    </div>
                ) : (
                    <img
                        src={imageUrl}
                        alt="상담 이미지"
                        className="w-full h-auto object-cover"
                        loading="lazy"
                    />
                )}
                <div className="bg-gradient-to-r from-emerald-900/80 to-teal-900/80 px-3 py-2">
                    <p className="text-xs text-emerald-100 text-center">🌿 치유 이미지 (Pexels)</p>
                </div>
            </div>
        </div>
    );
}
