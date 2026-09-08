const https = require('https');

const KEY = 'sb_publishable_6YeWRdHxBY8LlVXKLWelsw_Wfb4GSWk';
const BASE = 'https://blcvtbzwpwmqkphlcjji.supabase.co';

const TABLES = [
  "announcement_acknowledgements",
  "announcements",
  "app_access",
  "app_roles",
  "app_usage_logs",
  "attendance_records",
  "audit_logs",
  "benefit_enrollments",
  "benefit_plans",
  "biometric_device_commands",
  "biometric_devices",
  "branch_finance_policies",
  "branch_payroll_policies",
  "branches",
  "candidates",
  "disciplinary_records",
  "document_folders",
  "documents",
  "employees",
  "expense_records",
  "fcm_tokens",
  "hiring_requests",
  "interviews",
  "it_assets",
  "it_tickets",
  "job_postings",
  "leave_requests",
  "leave_type_policies",
  "meeting_rooms",
  "notifications",
  "offboarding_requests",
  "offboarding_tasks",
  "onboarding_checklist_tasks",
  "onboarding_documents",
  "onboarding_requests",
  "password_reset_requests",
  "payroll_approvals",
  "payroll_records",
  "payroll_runs",
  "performance_goals",
  "performance_reviews",
  "room_bookings",
  "shift_assignments",
  "shifts",
  "system_settings",
  "task_activities",
  "tasks",
  "tool_assignments",
  "tool_usages",
  "tools",
  "training_courses",
  "training_enrollments",
  "unity_apps",
  "user_role_assignments",
  "user_roles",
  "work_locations",
  "work_logs"
];

async function checkTable(table) {
  return new Promise((resolve) => {
    const url = `${BASE}/rest/v1/${table}?select=*&limit=5`;
    const req = https.get(url, {
      headers: {
        'apikey': KEY,
        'Authorization': `Bearer ${KEY}`
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const parsed = JSON.parse(data);
            resolve({ table, status: 200, rowCount: parsed.length, sample: parsed[0] });
          } catch {
            resolve({ table, status: 200, rowCount: 0 });
          }
        } else {
          resolve({ table, status: res.statusCode });
        }
      });
    });
    req.on('error', (e) => resolve({ table, status: 500, error: e.message }));
  });
}

async function run() {
  const existing = [];
  const populated = [];
  const missing = [];

  for (const t of TABLES) {
    const res = await checkTable(t);
    if (res.status === 200) {
      existing.push(t);
      if (res.rowCount > 0) {
        populated.push({ table: t, count: res.rowCount, sample: res.sample });
      }
    } else {
      missing.push({ table: t, status: res.status });
    }
  }

  console.log('\n=== TABLES WITH LIVE DATA (ROWS > 0) ===');
  populated.forEach(p => console.log(`✓ ${p.table}: ${p.count} rows (keys: ${Object.keys(p.sample).join(', ')})`));

  console.log(`\nTotal verified live tables (HTTP 200): ${existing.length} / ${TABLES.length}`);
  console.log('Existing tables:', existing);

  if (missing.length > 0) {
    console.log('\nTables returning non-200:', missing);
  }
}

run();
