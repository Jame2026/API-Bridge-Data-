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

const CHUNKS = [
  'assets/page-DX2Lt9v0.js',
  'assets/rolldown-runtime-B0Z9INg1.js',
  'assets/jsx-runtime-BGJTQIfp.js',
  'assets/AuthContext-CBxjKmbw.js',
  'assets/browser-C2g0zDt6.js',
  'assets/usePermissions-DqCgiptR.js',
  'assets/CartesianChart-CuUQMEi7.js',
  'assets/BarChart-BZSAzGUK.js',
  'assets/AreaChart-BWUUciSU.js',
  'assets/PieChart-CYE_Gsdy.js',
  'assets/CartesianGrid-BAKHvaMq.js',
  'assets/PartnerBranchPrivacyShield-B6HWRQS5.js',
  'assets/NotFound-DjMFgNp9.js',
  'assets/login-Dc1b18eS.js',
  'assets/forgot-password-BpMKKVMz.js',
  'assets/reset-password-DbOQZThd.js',
  'assets/telegramInvite-CUDHXxDb.js',
  'assets/page-CW7sgbWd.js',
  'assets/api-B56Fc5NK.js',
  'assets/audit-5VGPwLuG.js',
  'assets/constants-C_FCNWbZ.js',
  'assets/EmployeeProfile-kt1p8l97.js',
  'assets/storage-CLuYlSHB.js',
  'assets/s3-storage-B7O74zPS.js',
  'assets/page-CqvkNHuj.js',
  'assets/onboarding-Dgel9Mhf.js',
  'assets/page-DQdDsn29.js',
  'assets/EmployeeSearchSelect-D_m0JwAm.js',
  'assets/page-67IOVCWn.js',
  'assets/Legend-CXeED4am.js',
  'assets/page-BD0HB_tc.js',
  'assets/page-CWiFxxOZ.js',
  'assets/page-BiL18r5O.js',
  'assets/FeedbackModal-pBzQsmcp.js',
  'assets/CandidateDetail-lnErL7m1.js',
  'assets/page-CQsI10dg.js',
  'assets/page-Ci1uxrfD.js',
  'assets/page-wm3tFxpx.js',
  'assets/page-0HqXFn9v.js',
  'assets/page-ZXJVmPpj.js',
  'assets/page-55BdqEes.js',
  'assets/page-uXXL6gIY.js',
  'assets/geocode-DOY7m5_o.js',
  'assets/page-DVU_RF_f.js',
  'assets/page-XSdmgY4Z.js',
  'assets/page-BBcUqR48.js',
  'assets/xlsx-CE8xGrpF.js',
  'assets/page-Vtynaf7z.js',
  'assets/page-C_hvuuBA.js',
  'assets/page-BY1-W759.js',
  'assets/page-CHNcUznp.js',
  'assets/page-avWU7aXc.js',
  'assets/page-C4j5As9O.js',
  'assets/page-CDHGNvDu.js',
  'assets/page-BpQUBLka.js',
  'assets/page-DcmiE6sy.js',
  'assets/courseModalUtils-BiY161zP.js',
  'assets/page-DeM650BD.js',
  'assets/page-CGJjAa20.js',
  'assets/page-CDJ0arHR.js',
  'assets/page-B3NPq7wY.js',
  'assets/page-DPDX9wqO.js',
  'assets/r2-storage-vqbJO0c5.js',
  'assets/page-DR-KqIkj.js',
  'assets/page-B46GJYGo.js',
  'assets/page-CFNWb1yl.js'
];

async function run() {
  const allTables = new Set();
  const tablesPerChunk = {};

  for (const chunk of CHUNKS) {
    try {
      const url = `https://hrsystem-quit.onrender.com/${chunk}`;
      const code = await get(url);

      const fromRegex = /\.from\(['"]([a-zA-Z0-9_-]+)['"]\)/g;
      let match;
      const foundInChunk = [];
      while ((match = fromRegex.exec(code)) !== null) {
        allTables.add(match[1]);
        foundInChunk.push(match[1]);
      }
      if (foundInChunk.length > 0) {
        tablesPerChunk[chunk] = Array.from(new Set(foundInChunk));
      }
    } catch (e) {
      console.error('Error fetching', chunk, e.message);
    }
  }

  console.log('=== CHUNKS AND THEIR TABLES ===');
  console.log(JSON.stringify(tablesPerChunk, null, 2));

  console.log('\n=== COMPLETE UNIQUE LIST OF ALL MODULE TABLES IN HRSYSTEM ===');
  const sorted = Array.from(allTables).sort();
  console.log(JSON.stringify(sorted, null, 2));
}

run();
