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
  const chunks = [
    'assets/AuthContext-CBxjKmbw.js',
    'assets/page-DX2Lt9v0.js',
    'assets/page-CW7sgbWd.js',
    'assets/page-CqvkNHuj.js',
    'assets/EmployeeProfile-kt1p8l97.js'
  ];

  for (const c of chunks) {
    const js = await get('https://hrsystem-quit.onrender.com/' + c);
    console.log('\n=== ' + c + ' (length: ' + js.length + ') ===');
    
    // Look for firebase firestore: collection(, doc(, getDocs, onSnapshot
    const firestoreMatches = js.match(/collection\([^)]+\)|getDocs\(|onSnapshot\(|doc\([^)]+\)/g) || [];
    console.log('Firestore calls:', firestoreMatches.slice(0, 5));

    // Look for fetch( or axios(
    const fetchMatches = js.match(/fetch\([^)]+\)|axios\.[a-z]+\([^)]+\)/g) || [];
    console.log('Fetch / Axios calls:', fetchMatches.slice(0, 5));

    // Look for any string table/collection names
    const colRegex = /collection\([a-zA-Z0-9_$,\s]+["']([a-zA-Z0-9_-]+)["']\)/g;
    let m;
    const collections = [];
    while ((m = colRegex.exec(js)) !== null) {
      collections.push(m[1]);
    }
    console.log('Firestore collections:', collections);
    
    // Supabase keywords?
    const sb = js.match(/supabase/gi) || [];
    console.log('supabase occurrences:', sb.length);
  }
}

run();
