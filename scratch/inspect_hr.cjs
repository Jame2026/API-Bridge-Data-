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
  try {
    const html = await get('https://hrsystem-quit.onrender.com/');
    console.log('HTML Length:', html.length);
    console.log('HTML snippet:', html.slice(0, 400));

    // Find script src
    const regex = /src=["']([^"']+\.js)["']/g;
    let match;
    const scripts = [];
    while ((match = regex.exec(html)) !== null) {
      scripts.push(match[1]);
    }
    console.log('Scripts:', scripts);

    for (const s of scripts) {
      const fullUrl = s.startsWith('http') ? s : 'https://hrsystem-quit.onrender.com' + (s.startsWith('/') ? '' : '/') + s;
      console.log('\n--- Fetching script:', fullUrl);
      const js = await get(fullUrl);
      console.log('JS length:', js.length);

      // Search supabase url
      const sbUrls = js.match(/https:\/\/[a-z0-9]+\.supabase\.co/g);
      if (sbUrls) console.log('Supabase URLs:', Array.from(new Set(sbUrls)));

      // Search supabase key
      const keys = js.match(/sb_publishable_[a-zA-Z0-9_-]+/g);
      if (keys) console.log('Supabase publishable keys:', Array.from(new Set(keys)));

      // Search from('...')
      const fromRegex = /\.from\(['"]([a-zA-Z0-9_-]+)['"]\)/g;
      let fromMatch;
      const tables = new Set();
      while ((fromMatch = fromRegex.exec(js)) !== null) {
        tables.add(fromMatch[1]);
      }
      console.log('Tables used in code:', Array.from(tables));
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
