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
  const js = await get('https://hrsystem-quit.onrender.com/assets/AuthContext-CBxjKmbw.js');

  // Find occurrences of .from(
  const matches = [...js.matchAll(/\.from\(([^)]+)\)/g)].map(m => m[0]);
  console.log('.from matches:', matches.slice(0, 20));

  // Find string literals passed to from
  const fromLiteral = [...js.matchAll(/\.from\(['"`]([a-zA-Z0-9_-]+)['"`]\)/g)].map(m => m[1]);
  console.log('fromLiteral:', Array.from(new Set(fromLiteral)));

  // Search for table names in quotes
  const quotes = [...js.matchAll(/["']([a-zA-Z0-9_]{3,30})["']/g)].map(m => m[1]);
  const knownWords = ['branches', 'employees', 'attendance', 'payroll', 'leaves', 'leave_requests', 'users', 'roles', 'profiles', 'tasks', 'departments'];
  const foundKnown = quotes.filter(q => knownWords.some(kw => q.toLowerCase().includes(kw)));
  console.log('Found known keywords in strings:', Array.from(new Set(foundKnown)));
}

run();
