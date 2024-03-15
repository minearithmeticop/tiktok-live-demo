const express = require('express');
const LRU = require('lru-cache');

const app = express();
const PORT = process.env.PORT;
const cache = new LRU.LRUCache({ max: 100, maxAge: 1000 * 60 * 3 }); // Max items: 100, Max age: 10 minutes

app.get('/fetch-data', async (req, res) => {
    try {
        const cachedData = cache.get('data');

        if (cachedData) {
            // If data is cached, return it
            console.log('Data retrieved from cache');
            res.json(cachedData);
        } else {

            console.log('Data fetched from URL');
            const url = 'https://webcast.tiktok.com/webcast/feed/?aid=1988&app_language=en&app_name=tiktok_web&battery_info=0.95&browser_language=en-GB&browser_name=Mozilla&browser_online=true&browser_platform=MacIntel&browser_version=5.0%20%28Macintosh%3B%20Intel%20Mac%20OS%20X%2010_15_7%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F107.0.0.0%20Safari%2F537.36&channel=tiktok_web&channel_id=86&content_type=0&cookie_enabled=true&device_id=7134872442754188802&device_platform=web_pc&focus_state=false&from_page=user&hidden_banner=true&history_len=16&is_fullscreen=false&is_page_visible=true&max_time=0&os=mac&priority_region=AU&referer=&region=AU&req_from=pc_web_suggested_host&screen_height=982&screen_width=1512&tz_name=Australia%2FSydney&webcast_language=en&msToken=qqL_LL1SgBvIGmZAf9LW7luKyQhm7WHYCW0g4OZ7AqZq2CESkHZ0EKfNQoHWxPVn0XXMCo93CAPunyzFH3csp0iEbotTFEsxw0mDDmyxU9RBbHn11Rqywbs0iyDsoT9so0BvyJJaQliJM74=&X-Bogus=DFSzswVuGnJAN9jsS0il1p7TlqSA&_signature=_02B4Z6wo00001W0AuAwAAIDC-dbjA01oJeVtALyAADgw06';

            const got = await import('got');
            const data = await got.default(url).json();

            cache.set('data', data);

            res.json(data);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT || 8080, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
