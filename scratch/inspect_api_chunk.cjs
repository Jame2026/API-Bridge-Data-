const https = require('https');

async function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  const js = await get('https://hrsystem-quit.onrender.com/assets/api-B56Fc5NK.js');
  console.log('API chunk length:', js.length);

  // Search for supabase URLs
  const sbUrls = js.match(/https:\/\/[a-z0-9]+\.supabase\.co/g);
  console.log('Supabase URLs:', sbUrls ? Array.from(new Set(sbUrls)) : 'None');

  // Search for API keys
  const keys = js.match(/sb_publishable_[a-zA-Z0-9_-]+/g);
  console.log('Publishable keys:', keys ? Array.from(new Set(keys)) : 'None');

  // Find all .from('...')
  const fromRegex = /\.from\(['"]([a-zA-Z0-9_-]+)['"]\)/g;
  let match;
  const tables = new Set();
  while ((match = fromRegex.exec(js)) !== null) {
    tables.add(match[1]);
  }
  console.log('\n--- ALL SUPABASE TABLES IN API CHUNK ---');
  console.log(Array.from(tables).sort());

  // Also check other potential endpoints or services
  const apiUrls = js.match(/https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=-]*/g) || [];
  console.log('\n--- ALL URLS IN API CHUNK ---');
  Array.from(new Set(apiUrls)).forEach(u => console.log(' -', u));
}

run();
