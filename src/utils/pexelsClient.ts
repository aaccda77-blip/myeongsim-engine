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
        // [FIX] Randomize page to get different images for same query
        const randomPage = Math.floor(Math.random() * 20) + 1; // 1 ~ 20 pages
        const response = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=15&page=${randomPage}&orientation=landscape`,
            {
                headers: {
                    Authorization: apiKey,
                },
            }
        );

        if (!response.ok) {
            // If random page is empty (search result < page), try page 1
            if (response.status === 400 || response.status === 404) {
                const retryResponse = await fetch(
                    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=15&page=1&orientation=landscape`,
                    { headers: { Authorization: apiKey } }
                );
                if (!retryResponse.ok) throw new Error(`Pexels API error: ${retryResponse.status}`);
                const retryData: PexelsResponse = await retryResponse.json();
                if (retryData.photos && retryData.photos.length > 0) {
                    const randomIndex = Math.floor(Math.random() * Math.min(retryData.photos.length, 10));
                    return retryData.photos[randomIndex].src.large;
                }
            }
            throw new Error(`Pexels API error: ${response.status}`);
        }

        const data: PexelsResponse = await response.json();

        if (data.photos && data.photos.length > 0) {
            // Pick a random photo from results for variety
            const randomIndex = Math.floor(Math.random() * data.photos.length);
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
 * Get optimized search query based on conversation context
 * @param originalPrompt - Original image prompt (includes conversation content)
 * @returns Optimized search keyword for nature-themed images
 */
export function optimizePexelsQuery(originalPrompt: string): string {
    const text = originalPrompt.toLowerCase();

    // [FIX] If the prompt is already a fully constructed visual prompt (from ChatInterface), use it as is.
    // This allows dynamic styles (e.g. 'zen garden', 'soft sunlight') to pass through.
    if (text.startsWith('beautiful healing nature')) {
        return originalPrompt;
    }

    // 감정/상태 키워드 매핑 (한국어 + 영어)
    const emotionKeywords: Record<string, string> = {
        // 긍정적 감정
        '기쁨|행복|즐거움|happy|joy': 'sunrise golden light happiness',
        '평화|평온|고요|peace|calm|tranquil': 'peaceful lake reflection calm',
        '희망|꿈|미래|hope|dream|future': 'sunrise mountain hope new beginning',
        '사랑|애정|따뜻|love|warm|affection': 'warm sunset heart nature',
        '감사|축복|grateful|blessing': 'blooming flowers gratitude spring',

        // 부정적 감정 → 치유 이미지
        '불안|걱정|anxiety|worry': 'calm forest peaceful meditation',
        '슬픔|우울|sad|depression': 'gentle rain nature healing',
        '분노|화|anger|frustration': 'ocean waves calming blue',
        '외로움|고독|lonely|alone': 'starry night peaceful solitude',
        '스트레스|피곤|stress|tired': 'misty forest relaxation zen',

        // 주제별 키워드
        '돈|재물|부|wealth|money': 'golden wheat abundance harvest',
        '관계|인연|사랑|relationship|love': 'intertwined trees nature connection',
        '건강|치유|health|healing': 'green forest healing nature',
        '성공|성취|success|achievement': 'mountain peak sunrise victory',
        '변화|전환|change|transformation': 'butterfly nature transformation',
        '시작|출발|beginning|start': 'sunrise new day beginning',
        '끝|마무리|ending|closure': 'sunset peaceful ending',

        // 자연 요소
        '산|mountain': 'mountain landscape peaceful',
        '바다|ocean|sea': 'ocean waves peaceful sunset',
        '숲|forest|tree': 'forest sunlight peaceful',
        '꽃|flower|bloom': 'blooming flowers nature',
        '하늘|sky|cloud': 'peaceful clouds sky',
        '강|river|stream': 'river flowing nature peaceful',
        '별|star|night': 'starry night peaceful',
        '해|sun|sunrise|sunset': 'golden hour sunset sunrise',

        // 구체적 식물/자연 요소
        '덩쿨|vine|ivy': 'green vines climbing plants nature',
        '이끼|moss': 'moss covered stones forest peaceful',
        '뿌리|root': 'tree roots nature grounding',
        '나뭇잎|leaf|leaves': 'green leaves nature fresh',
        '풀|grass': 'grass field meadow peaceful',
        '나무|wood': 'wooden texture nature organic',
        '돌|stone|rock': 'stones rocks nature zen',
        '물결|wave|ripple': 'water ripples peaceful reflection',
        '안개|fog|mist': 'misty forest peaceful morning',
        '이슬|dew': 'morning dew drops nature fresh',
    };

    // 키워드 매칭
    for (const [pattern, query] of Object.entries(emotionKeywords)) {
        const regex = new RegExp(pattern);
        if (regex.test(text)) {
            return query;
        }
    }

    // 계절 감지
    if (/봄|spring/.test(text)) return 'spring flowers blooming nature';
    if (/여름|summer/.test(text)) return 'summer green nature vibrant';
    if (/가을|autumn|fall/.test(text)) return 'autumn leaves golden nature';
    if (/겨울|winter/.test(text)) return 'winter snow peaceful nature';

    // 시간대 감지
    if (/아침|morning|dawn/.test(text)) return 'morning sunrise peaceful nature';
    if (/저녁|evening|dusk/.test(text)) return 'evening sunset peaceful nature';
    if (/밤|night/.test(text)) return 'night starry sky peaceful';

    // 기본값: 평화로운 자연
    return 'peaceful nature landscape meditation';
}

