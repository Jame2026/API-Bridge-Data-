import React, { useState } from 'react';
import { useProjectsQuery } from '../features/projects/api/projects.queries';
import { useUiStore } from '../state/uiStore';
import { Button } from '../ui/primitives/Button';
import { Code2, Copy, Check, Terminal, Layers } from 'lucide-react';

export const IngestGuide: React.FC = () => {
  const { data: projects = [] } = useProjectsQuery();
  const activeProjectId = useUiStore((s) => s.activeProjectId);
  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const [selectedLang, setSelectedLang] = useState<'typescript' | 'nextjs' | 'python' | 'curl'>('typescript');
  const [copied, setCopied] = useState(false);

  const targetId = activeProject ? activeProject.id : 'prj_billing_core';

  const snippets = {
    typescript: `// TypeScript / Node.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');

export async function logUserActivity(userId: string, featureName: string, userEmail?: string, metadata = {}) {
  await supabase.from('user_activities').insert([{
    project_id: '${targetId}',
    user_id: userId,
    user_email: userEmail,
    feature_name: featureName,
    action_type: 'feature_use',
    metadata: metadata,
    timestamp: new Date().toISOString()
  }]);
}`,

    nextjs: `// Next.js App Router / Server Action
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export async function POST(req: Request) {
  const { userId, userEmail, featureName, metadata } = await req.json();
  await supabase.from('user_activities').insert({
    project_id: '${targetId}',
    user_id: userId,
    user_email: userEmail,
    feature_name: featureName,
    action_type: 'feature_use',
    metadata: metadata || {},
    timestamp: new Date().toISOString()
  });
  return NextResponse.json({ success: true });
}`,

    python: `# Python / FastAPI / Django
from supabase import create_client

supabase = create_client("YOUR_SUPABASE_URL", "YOUR_SUPABASE_ANON_KEY")

def log_activity(user_id: str, feature_name: str, user_email: str = None, metadata: dict = None):
    supabase.table("user_activities").insert({
        "project_id": "${targetId}",
        "user_id": user_id,
        "user_email": user_email,
        "feature_name": feature_name,
        "action_type": "feature_use",
        "metadata": metadata or {},
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
    }).execute()`,

    curl: `# Direct REST Ingestion
curl -X POST 'https://YOUR_SUPABASE_URL.supabase.co/rest/v1/user_activities' \\
  -H "apikey: YOUR_SUPABASE_ANON_KEY" \\
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "project_id": "${targetId}",
    "user_id": "usr_9901",
    "user_email": "ops@internal.corp",
    "feature_name": "invoice_bulk_generator",
    "action_type": "feature_use",
    "metadata": { "batchSize": 50 }
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
        <h1 className="text-lg font-bold text-white tracking-tight">Internal Ingestion Developer Guide</h1>
        <p className="text-xs text-[#908fa0] mt-1">
          Add lightweight event telemetry hooks to your internal codebases to push user usage records directly into the reporting database.
        </p>
      </div>

      <div className="bg-[#141822] border border-[#262a33] rounded-2xl overflow-hidden shadow-lg">
        <div className="px-5 py-3 border-b border-[#262a33] bg-[#181c24]/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {(['typescript', 'nextjs', 'python', 'curl'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  selectedLang === lang
                    ? 'bg-[#8083ff] text-[#0d0096] font-bold'
                    : 'text-[#908fa0] hover:text-white hover:bg-[#141822]'
                }`}
              >
                {lang === 'typescript' ? 'TypeScript' : lang === 'nextjs' ? 'Next.js' : lang === 'python' ? 'Python' : 'cURL'}
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
