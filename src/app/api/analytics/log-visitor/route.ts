import { NextRequest, NextResponse } from 'next/server';

interface VisitorStore {
    today: string;
    uniqueIps: Set<string>;
    pageviews: number;
    sources: Record<string, number>;
    regions: Record<string, number>;
}

const visitorStore: VisitorStore = {
    today: new Date().toISOString().split('T')[0],
    uniqueIps: new Set<string>(),
    pageviews: 0,
    sources: {
        '네이버 (블로그/검색)': 0,
        '카카오톡 / 카카오': 0,
        '인스타그램 / FB': 0,
        '구글 / 유튜브': 0,
        '직접 접속 / 북마크': 0,
        '기타 웹사이트 유입': 0,
    },
    regions: {
        '서울 / 수도권': 0,
        '부산 / 경남': 0,
        '대구 / 경북': 0,
        '인천 / 경기': 0,
        '대전 / 충청': 0,
        '광주 / 전라': 0,
        '해외 / 기타': 0,
    },
};

function parseSource(referrer: string = '', search: string = ''): string {
    const ref = referrer.toLowerCase();
    const q = search.toLowerCase();

    if (q.includes('utm_source=naver') || ref.includes('naver.com')) {
        return '네이버 (블로그/검색)';
    }
    if (q.includes('utm_source=kakao') || ref.includes('kakao.com') || ref.includes('kakaotalk')) {
        return '카카오톡 / 카카오';
    }
    if (q.includes('utm_source=instagram') || q.includes('utm_source=facebook') || ref.includes('instagram.com') || ref.includes('facebook.com') || ref.includes('fb.com')) {
        return '인스타그램 / FB';
    }
    if (q.includes('utm_source=google') || q.includes('utm_source=youtube') || ref.includes('google.com') || ref.includes('youtube.com') || ref.includes('youtu.be')) {
        return '구글 / 유튜브';
    }
    if (!ref || ref.includes('localhost') || ref.includes('myeongsim') || ref.includes('vercel.app')) {
        return '직접 접속 / 북마크';
    }
    return '기타 웹사이트 유입';
}

function parseRegion(req: NextRequest): string {
    const city = req.headers.get('x-vercel-ip-city');
    const country = req.headers.get('x-vercel-ip-country');

    if (city) {
        const decodedCity = decodeURIComponent(city).toLowerCase();
        if (decodedCity.includes('seoul')) return '서울 / 수도권';
        if (decodedCity.includes('busan') || decodedCity.includes('ulsan') || decodedCity.includes('gyeongnam')) return '부산 / 경남';
        if (decodedCity.includes('daegu') || decodedCity.includes('gyeongbuk')) return '대구 / 경북';
        if (decodedCity.includes('incheon') || decodedCity.includes('suwon') || decodedCity.includes('seongnam') || decodedCity.includes('goyang')) return '인천 / 경기';
        if (decodedCity.includes('gwangju') || decodedCity.includes('jeonju')) return '광주 / 전라';
        if (decodedCity.includes('daejeon') || decodedCity.includes('cheongju')) return '대전 / 충청';
        return '서울 / 수도권';
    }
    if (country && country !== 'KR') {
        return '해외 / 기타';
    }
    return '서울 / 수도권';
}

export async function POST(req: NextRequest) {
    try {
        const todayStr = new Date().toISOString().split('T')[0];
        if (visitorStore.today !== todayStr) {
            visitorStore.today = todayStr;
            visitorStore.uniqueIps.clear();
            visitorStore.pageviews = 0;
            visitorStore.sources = {
                '네이버 (블로그/검색)': 0,
                '카카오톡 / 카카오': 0,
                '인스타그램 / FB': 0,
                '구글 / 유튜브': 0,
                '직접 접속 / 북마크': 0,
                '기타 웹사이트 유입': 0,
            };
            visitorStore.regions = {
                '서울 / 수도권': 0,
                '부산 / 경남': 0,
                '대구 / 경북': 0,
                '인천 / 경기': 0,
                '대전 / 충청': 0,
                '광주 / 전라': 0,
                '해외 / 기타': 0,
            };
        }

        const body = await req.json().catch(() => ({}));
        const reqReferrer = body.referrer || req.headers.get('referer') || '';
        const search = body.search || '';

        const sourceCategory = parseSource(reqReferrer, search);
        visitorStore.sources[sourceCategory] = (visitorStore.sources[sourceCategory] || 0) + 1;

        const regionCategory = parseRegion(req);
        visitorStore.regions[regionCategory] = (visitorStore.regions[regionCategory] || 0) + 1;

        const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'guest-ip';
        visitorStore.uniqueIps.add(ip);
        visitorStore.pageviews += 1;

        return NextResponse.json({
            success: true,
            todayVisitors: visitorStore.uniqueIps.size,
            todayPageviews: visitorStore.pageviews,
            sources: visitorStore.sources,
            regions: visitorStore.regions,
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function GET() {
    const todayStr = new Date().toISOString().split('T')[0];
    if (visitorStore.today !== todayStr) {
        visitorStore.today = todayStr;
        visitorStore.uniqueIps.clear();
        visitorStore.pageviews = 0;
        visitorStore.sources = {
            '네이버 (블로그/검색)': 0,
            '카카오톡 / 카카오': 0,
            '인스타그램 / FB': 0,
            '구글 / 유튜브': 0,
            '직접 접속 / 북마크': 0,
            '기타 웹사이트 유입': 0,
        };
        visitorStore.regions = {
            '서울 / 수도권': 0,
            '부산 / 경남': 0,
            '대구 / 경북': 0,
            '인천 / 경기': 0,
            '대전 / 충청': 0,
            '광주 / 전라': 0,
            '해외 / 기타': 0,
        };
    }
    return NextResponse.json({
        todayVisitors: Math.max(1, visitorStore.uniqueIps.size),
        todayPageviews: Math.max(1, visitorStore.pageviews),
        sources: visitorStore.sources,
        regions: visitorStore.regions,
    });
}
