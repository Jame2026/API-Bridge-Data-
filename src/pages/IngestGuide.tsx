import React, { useState } from 'react';
import { useProjectsQuery } from '../features/projects/api/projects.queries';
import { useUiStore } from '../state/uiStore';
import { Button } from '../ui/primitives/Button';
import { Copy, Check } from 'lucide-react';

export const IngestGuide: React.FC = () => {
  const { data: projects = [] } = useProjectsQuery();
  const activeProjectId = useUiStore((s) => s.activeProjectId);
  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const [selectedLang, setSelectedLang] = useState<'tracker' | 'typescript' | 'nextjs' | 'curl'>('tracker');
  const [copied, setCopied] = useState(false);

  const targetId = activeProject ? activeProject.id : 'prj_unt_website';

  const snippets = {
    tracker: `<!-- Drop-in User View Counter Tracker for https://unt-website.onrender.com/ -->
<script>
(function() {
  const SUPABASE_URL = "YOUR_SUPABASE_URL";
  const SUPABASE_KEY = "YOUR_SUPABASE_ANON_KEY";
  let vid = localStorage.getItem('unt_visitor_id');
  if (!vid) {
    vid = 'vis_' + Math.random().toString(36).substring(2, 10);
    localStorage.setItem('unt_visitor_id', vid);
  }

  fetch(SUPABASE_URL + '/rest/v1/user_activities', {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({
      project_id: '${targetId}',
      user_id: vid,
      user_email: 'visitor@unt-website.public',
      feature_name: 'view_' + (window.location.pathname === '/' ? 'home' : window.location.pathname.replace(/^\\//, '').replace(/\\//g, '_')),
      action_type: 'page_view',
      metadata: {
        path: window.location.pathname,
        title: document.title,
        referrer: document.referrer || 'direct',
        resolution: window.screen.width + 'x' + window.screen.height
      },
      timestamp: new Date().toISOString()
    })
  }).catch(function(e) { console.debug('Tracker notice:', e); });
})();
</script>`,

    typescript: `// TypeScript / React User View Counter Hook
import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');

export function useViewCounter(pageName: string) {
  useEffect(() => {
    const visitorId = localStorage.getItem('unt_vid') || ('vis_' + Math.random().toString(36).slice(2));
    localStorage.setItem('unt_vid', visitorId);

    supabase.from('user_activities').insert([{
      project_id: '${targetId}',
      user_id: visitorId,
      feature_name: \`view_\${pageName}\`,
      action_type: 'page_view',
      metadata: { path: window.location.pathname },
      timestamp: new Date().toISOString()
    }]).then();
  }, [pageName]);
}`,

    nextjs: `// Next.js App Router Page View Ingestion (app/layout.tsx or route.ts)
export async function trackPageView(path: string, visitorId: string) {
  await fetch('YOUR_SUPABASE_URL/rest/v1/user_activities', {
    method: 'POST',
    headers: {
      apikey: 'YOUR_SUPABASE_ANON_KEY',
      Authorization: 'Bearer YOUR_SUPABASE_ANON_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      project_id: '${targetId}',
      user_id: visitorId,
      feature_name: \`view_\${path.replace(/^\\//, '') || 'home'}\`,
      action_type: 'page_view',
      timestamp: new Date().toISOString()
    })
  });
}`,

    curl: `# Direct REST Ingestion Test
curl -X POST 'YOUR_SUPABASE_URL/rest/v1/user_activities' \\
  -H "apikey: YOUR_SUPABASE_ANON_KEY" \\
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "project_id": "${targetId}",
    "user_id": "visitor_test_01",
    "feature_name": "view_product_catalog",
    "action_type": "page_view",
    "metadata": { "path": "/products" }
  }'`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[selectedLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-[#141822] border border-[#262a33] p-5 rounded-2xl shadow-lg">
        <h1 className="text-lg font-bold text-white tracking-tight">UNT Website Ingestion Guide</h1>
        <p className="text-xs text-[#908fa0] mt-1">
          Extract and log user view counter events from <strong className="text-[#7bd0ff]">https://unt-website.onrender.com/</strong> into Supabase in real-time.
        </p>
      </div>

      <div className="bg-[#141822] border border-[#262a33] rounded-2xl overflow-hidden shadow-lg">
        <div className="px-5 py-3 border-b border-[#262a33] bg-[#181c24]/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {(['tracker', 'typescript', 'nextjs', 'curl'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  selectedLang === lang ? 'bg-[#8083ff] text-[#0d0096] font-bold' : 'text-[#908fa0] hover:text-white'
                }`}
              >
                {lang === 'tracker' ? 'Option A: View Counter Script' : lang === 'typescript' ? 'React / TypeScript' : lang === 'nextjs' ? 'Next.js' : 'cURL'}
              </button>
            ))}
          </div>
          <Button size="sm" variant="secondary" onClick={handleCopy} icon={copied ? <Check className="w-3.5 h-3.5 text-[#4edea3]" /> : <Copy className="w-3.5 h-3.5" />}>
            {copied ? 'Copied' : 'Copy Code'}
          </Button>
        </div>

        <div className="p-5 bg-[#090d14] overflow-x-auto">
          <pre className="text-xs font-mono text-[#dfe2ee] leading-relaxed">
            <code>{snippets[selectedLang]}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
export default IngestGuide;
