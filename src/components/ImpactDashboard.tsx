import React from 'react';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Globe2, 
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Award,
  BarChart3
} from 'lucide-react';
import type { SupportedLanguage } from '../types';

interface ImpactDashboardProps {
  currentLanguage: SupportedLanguage;
}

const LANGUAGE_DATA = [
  { name: 'Kannada (ಕನ್ನಡ)', value: 524, percentage: '42.0%', color: '#f59e0b' },
  { name: 'Hindi (हिन्दी)', value: 349, percentage: '28.0%', color: '#3b82f6' },
  { name: 'Telugu (తెలుగు)', value: 175, percentage: '14.0%', color: '#10b981' },
  { name: 'Tamil (தமிழ்)', value: 100, percentage: '8.0%', color: '#8b5cf6' },
  { name: 'Marathi (मराठी)', value: 62, percentage: '5.0%', color: '#ec4899' },
  { name: 'English', value: 38, percentage: '3.0%', color: '#64748b' }
];

const SKILL_SECTOR_DATA = [
  { sector: 'Agriculture & Agri-Tech', count: 480, nsqf: 'L3-L5' },
  { sector: 'IT & AI Development', count: 342, nsqf: 'L6-L7' },
  { sector: 'Solar & Renewable Energy', count: 290, nsqf: 'L4-L5' },
  { sector: 'Apparel & Fashion Tech', count: 215, nsqf: 'L3-L4' },
  { sector: 'Automotive & Logistics', count: 160, nsqf: 'L4-L5' },
  { sector: 'Construction & Masonry', count: 103, nsqf: 'L2-L4' }
];

const RADAR_COMPETENCY_DATA = [
  { subject: 'Core Trade Skill', value: 88, fullMark: 100 },
  { subject: 'Tool/Machine Handling', value: 76, fullMark: 100 },
  { subject: 'Digital / Automation', value: 64, fullMark: 100 },
  { subject: 'Safety & Compliance', value: 92, fullMark: 100 },
  { subject: 'NSQF Alignment', value: 95, fullMark: 100 },
  { subject: 'Govt Scheme Fit', value: 89, fullMark: 100 }
];

const MONTHLY_PROGRESSION_DATA = [
  { month: 'Apr', citizens: 140, stipendsDisbursed: 12.5 },
  { month: 'May', citizens: 290, stipendsDisbursed: 28.2 },
  { month: 'Jun', citizens: 470, stipendsDisbursed: 45.0 },
  { month: 'Jul', citizens: 720, stipendsDisbursed: 68.4 },
  { month: 'Aug', citizens: 980, stipendsDisbursed: 84.1 },
  { month: 'Sep', citizens: 1248, stipendsDisbursed: 102.6 }
];

const PROGRAM_BENEFICIARIES = [
  { name: 'PMKVY 4.0 Specialization & Upskilling', beneficiaries: 540, stipendDisbursed: '₹2.7 Lakhs', pct: '96%' },
  { name: 'PM Vishwakarma Artisan Toolkit Grant', beneficiaries: 412, stipendDisbursed: '₹61.8 Lakhs', pct: '94%' },
  { name: 'PM Surya Ghar Green Energy Solar Tech', beneficiaries: 296, stipendDisbursed: '₹5.9 Lakhs', pct: '92%' },
  { name: 'FutureSkills PRIME AI & Cloud Skilling', beneficiaries: 210, stipendDisbursed: '₹14.5 Lakhs', pct: '98%' }
];

export const ImpactDashboard: React.FC<ImpactDashboardProps> = () => {
  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-100">
                  National Livelihood Impact & Analytics
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live Telemetry
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time field metrics on voice-assisted skill mapping across Gram Panchayats and Taluks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-xl border border-emerald-500/30 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>96.4% Verification Accuracy</span>
          </div>
        </div>
      </div>

      {/* 4 Headline KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 shadow-sm">
          <span className="text-xs text-slate-400 font-medium block">Total Rural Citizens Mapped</span>
          <div className="flex items-baseline justify-between mt-1.5">
            <span className="text-2xl font-bold text-slate-100 font-mono">1,248</span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +18.4%
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Across 18 Karnataka & AP Taluks</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 shadow-sm">
          <span className="text-xs text-slate-400 font-medium block">Spoken Languages Supported</span>
          <div className="flex items-baseline justify-between mt-1.5">
            <span className="text-2xl font-bold text-amber-400 font-mono">6</span>
            <span className="text-xs text-amber-300 font-mono">Kannada #1 (42%)</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Zero English requirement</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 shadow-sm">
          <span className="text-xs text-slate-400 font-medium block">Govt Schemes Linked</span>
          <div className="flex items-baseline justify-between mt-1.5">
            <span className="text-2xl font-bold text-blue-400 font-mono">1,084</span>
            <span className="text-xs text-blue-300 font-mono">86.8% Linkage</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Direct DBT & Toolkits</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 shadow-sm">
          <span className="text-xs text-slate-400 font-medium block">Avg Voice Intake Time</span>
          <div className="flex items-baseline justify-between mt-1.5">
            <span className="text-2xl font-bold text-emerald-400 font-mono">2.4 m</span>
            <span className="text-xs text-emerald-300 font-mono">vs 25m Paper</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">10x faster accessibility</span>
        </div>
      </div>

      {/* Row 1 Charts: Sector Bar Chart + Language Ingestion Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Skill Sectors Bar Chart (7 cols) - Generous Height */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Identified Skill Sectors (NSQF Mapped)
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Total: 1,590 Competencies</span>
          </div>

          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SKILL_SECTOR_DATA} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="sector" type="category" stroke="#cbd5e1" fontSize={11} width={140} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#f59e0b" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Language Distribution Donut (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-blue-400" />
              Spoken Language Demographics
            </h3>
            <span className="text-[11px] text-emerald-400 font-mono">Native Audio</span>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={LANGUAGE_DATA}
                  cx="50%"
                  cy="45%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {LANGUAGE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
            {LANGUAGE_DATA.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300 truncate">{item.name}</span>
                <span className="text-slate-500 font-mono ml-auto text-[11px]">{item.percentage}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 Charts: NSQF Radar Chart + Monthly Growth Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: NSQF Radar Competency Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              NSQF Readiness Radar
            </h3>
            <span className="text-[11px] text-amber-400 font-mono">National Standard</span>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={RADAR_COMPETENCY_DATA} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
                <Radar name="Citizen Capability Index" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Cumulative Skilling & Direct Benefit Transfer Area Chart (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Monthly Trajectory & DBT Disbursements (₹ Lakhs)
            </h3>
            <span className="text-[11px] text-cyan-400 font-mono">6-Month Trend</span>
          </div>

          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_PROGRESSION_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCitizens" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorStipends" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="citizens" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCitizens)" name="Citizens Skilled" />
                <Area type="monotone" dataKey="stipendsDisbursed" stroke="#10b981" fillOpacity={1} fill="url(#colorStipends)" name="DBT Disbursed (₹ Lakhs)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Scheme Beneficiary Callout Grid */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Active Government Scheme Linkage Breakdown
          </h3>
          <span className="text-xs font-mono text-emerald-400">Total: ₹84.9 Lakhs Disbursed</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PROGRAM_BENEFICIARIES.map((prog, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 space-y-1.5">
              <span className="text-xs font-bold text-slate-200 line-clamp-1">{prog.name}</span>
              <div className="flex items-center justify-between text-slate-400 font-mono text-xs pt-1 border-t border-slate-700/40">
                <span>{prog.beneficiaries} Mapped</span>
                <span className="text-emerald-400 font-bold">{prog.stipendDisbursed}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Match Rate</span>
                <span className="text-amber-400">{prog.pct}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
