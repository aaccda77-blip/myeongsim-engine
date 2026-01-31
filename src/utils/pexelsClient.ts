/**
 * Pexels API Client
 * Replaces Pollinations.ai to eliminate rate limit popups
 */

interface PexelsPhoto {
    id: number;
    src: {
        original: string;
        large2x: string;
        large: string;
        medium: string;
        small: string;
    };
    alt: string;
}

interface PexelsResponse {
    photos: PexelsPhoto[];
}

/**
 * Search for photos on Pexels
 * @param query - Search keyword (Korean supported)
 * @param apiKey - Pexels API key from environment
 * @returns Image URL or fallback
 */
export async function searchPexelsImage(
    query: string,
    apiKey?: string
): Promise<string> {
    // Fallback to placeholder if no API key
    if (!apiKey) {
        console.warn('Pexels API key not found, using placeholder');
        return `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop`;
    }

    try {
        const response = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=15&orientation=landscape`,
            {
                headers: {
                    Authorization: apiKey,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Pexels API error: ${response.status}`);
        }

        const data: PexelsResponse = await response.json();

        if (data.photos && data.photos.length > 0) {
            // Pick a random photo from results for variety
            const randomIndex = Math.floor(Math.random() * Math.min(data.photos.length, 10));
            return data.photos[randomIndex].src.large;
        }

        // Fallback if no results
        return `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop`;
    } catch (error) {
        console.error('Pexels API error:', error);
        // Fallback to Unsplash placeholder
        return `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop`;
    }
}

/**
 * Get optimized search query for healing/meditation context
 * @param originalPrompt - Original image prompt
 * @returns Optimized search keyword
 */
export function optimizePexelsQuery(originalPrompt: string): string {
    // Extract key themes
    const keywords = originalPrompt.toLowerCase();

    if (keywords.includes('healing') || keywords.includes('치유')) {
        return 'peaceful nature healing meditation';
    }
    if (keywords.includes('meditation') || keywords.includes('명상')) {
        return 'meditation zen peaceful';
    }
    if (keywords.includes('nature') || keywords.includes('자연')) {
        return 'beautiful nature landscape peaceful';
    }
    if (keywords.includes('ocean') || keywords.includes('바다')) {
        return 'ocean waves peaceful sunset';
    }
    if (keywords.includes('mountain') || keywords.includes('산')) {
        return 'mountain landscape peaceful';
    }

    // Default: peaceful nature
    return 'peaceful nature meditation';
}
