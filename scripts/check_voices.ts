// Used Native Fetch
const CHECK_VOICES_API_KEY = 'd57803311c9bb41c345af6d7aed8ad55';

async function checkVoices() {
    try {
        const response = await fetch('https://supertoneapi.com/v1/voices', {
            method: 'GET',
            headers: {
                'x-sup-api-key': CHECK_VOICES_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error('Error:', response.status, await response.text());
            return;
        }

        const data: any = await response.json();
        console.log('Keys:', Object.keys(data));
        console.log('Sample:', JSON.stringify(data).substring(0, 500));

        const items = data.items || [];
        console.log(`Checking ${items.length} items...`);

        const koVoices = items.filter((v: any) => {
            const lang = v.language || "";
            const specs = v.specifications || [];
            const isKo = lang.includes('ko') || specs.some((s: any) => s.language?.includes('ko'));
            const isMale = v.gender === 'male';
            return isKo && isMale;
        });

        console.log(`Korean Male voices found: ${koVoices.length}`);

        // Log ALL male voices to find a "Sage"
        koVoices.forEach((v: any) => {
            console.log(`- Name: ${v.name} | ID: ${v.voice_id} | Gender: ${v.gender}`);
        });

        if (koVoices.length === 0) {
            console.log("No Korean voices found. Printing first 3 items to inspect:");
            items.slice(0, 3).forEach((v: any) => console.log(JSON.stringify(v)));
        }

    } catch (error) {
        console.error('Failed:', error);
    }
}

checkVoices();
