
import fs from 'fs';
import https from 'https';

const constants = fs.readFileSync('constants.ts', 'utf8');
const urls = [];
const regex = /imageUrl:\s*"(https?:\/\/[^"]+)"/g;
let match;

while ((match = regex.exec(constants)) !== null) {
    urls.push(match[1]);
}

console.log(`Found ${urls.length} images. Checking...`);

const checkUrl = (url) => {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            console.log(`${res.statusCode} - ${url.substring(0, 50)}...`);
            resolve({ url, status: res.statusCode });
        }).on('error', (e) => {
            console.log(`ERROR - ${url.substring(0, 50)}...: ${e.message}`);
            resolve({ url, status: 'error' });
        });
    });
};

(async () => {
    for (const url of urls) {
        await checkUrl(url);
    }
})();
