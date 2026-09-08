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
  const js = await get('https://hrsystem-quit.onrender.com/assets/index-CVv1VHjj.js');
  console.log('JS loaded, length:', js.length);

  // Look for any URLs or endpoints
  const urls = js.match(/https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=-]*/g) || [];
  const uniqueUrls = Array.from(new Set(urls));
  console.log('Detected URLs:');
  uniqueUrls.forEach(u => console.log(' -', u));

  // Look for supabase or api calls: e.g. /api/, /rest/v1/, etc.
  const apiPaths = js.match(/["'](\/(?:api|rest)\/[a-zA-Z0-9_/-]+)["']/g) || [];
  console.log('\nDetected API paths:');
  Array.from(new Set(apiPaths)).forEach(p => console.log(' -', p));

  // Look for table names in postgrest / supabase syntax or fetch
  // E.g., .from("...") or from:
  const fromMatches = js.match(/from\s*:\s*["']([a-zA-Z0-9_-]+)["']/g) || [];
  console.log('from: matches:', fromMatches);

  // Search for keywords like "attendance", "employees", "payroll", "leave", "branches"
  const keywords = ['branches', 'attendance', 'employees', 'leave', 'payroll', 'departments', 'candidates', 'recruitment', 'performance', 'overtime', 'shifts'];
  console.log('\nKeyword search in bundle:');
  keywords.forEach(kw => {
    const count = (js.match(new RegExp(kw, 'gi')) || []).length;
    console.log(` - ${kw}: ${count} occurrences`);
  });

  // Search for VITE_ or env keys
  const envMatches = js.match(/[A-Z0-9_]{4,}_URL|[A-Z0-9_]{4,}_KEY/g) || [];
  console.log('\nENV name matches:', Array.from(new Set(envMatches)));
}

run();
