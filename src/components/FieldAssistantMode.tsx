import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle, 
  Award, 
  PlusCircle, 
  Printer, 
  Sparkles, 
  MapPin, 
  Clock 
} from 'lucide-react';
import type { SupportedLanguage } from '../types';

interface FieldAssistantModeProps {
  currentLanguage: SupportedLanguage;
  onLaunchCitizenSession: (name: string, trade: string) => void;
}

export const FieldAssistantMode: React.FC<FieldAssistantModeProps> = ({
  currentLanguage: _currentLanguage,
  onLaunchCitizenSession
}) => {
  const [citizenName, setCitizenName] = useState('');
  const [citizenTrade, setCitizenTrade] = useState('');

  const [recentAssisted, setRecentAssisted] = useState([
    { id: '1', name: 'Basavaraj Patil', trade: 'Farmer / Tractor Operator', time: '10:45 AM', match: 'PMKVY 4.0 (94%)', status: 'Completed' },
    { id: '2', name: 'Lakshmi Bai', trade: 'Tailor & Handicrafts', time: '11:15 AM', match: 'PM Vishwakarma (91%)', status: 'Completed' },
    { id: '3', name: 'Ramesh Kumar', trade: 'Mason / Concrete Worker', time: '12:00 PM', match: 'PMAY Skill (88%)', status: 'Completed' },
    { id: '4', name: 'Manjula S.', trade: 'Dairy Farm Worker', time: '01:30 PM', match: 'Rashtriya Gokul (92%)', status: 'Completed' },
    { id: '5', name: 'Mallikarjun', trade: 'Electrician / Wireman', time: '02:15 PM', match: 'PM Surya Ghar (86%)', status: 'Completed' }
  ]);

  const handleStartRapidSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (citizenName.trim()) {
      onLaunchCitizenSession(citizenName.trim(), citizenTrade.trim() || 'Agriculture Worker');
      setRecentAssisted(prev => [
        {
          id: String(Date.now()),
          name: citizenName.trim(),
          trade: citizenTrade.trim() || 'Agriculture Worker',
          time: 'Just Now',
          match: 'PMKVY 4.0 (94%)',
          status: 'In Progress'
        },
        ...prev
      ]);
      setCitizenName('');
      setCitizenTrade('');
    }
  };

  return (
    <div className="w-full space-y-5 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/60 border border-blue-800/50 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 flex-shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-100">
                  Field Assistant & Gram Panchayat Desk
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  CSC / NGO Portal
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Assisted Voice-Intake Mode for Village Mobilizers, CSC VLEs & Social Field Workers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>KVK Center, Dharwad Hub</span>
          </div>
        </div>
      </div>

      {/* 3 Metric Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Total Citizens Assisted Today</span>
            <span className="text-xl font-bold text-slate-100 font-mono mt-0.5 block">27</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Profiles Confirmed & Mapped</span>
            <span className="text-xl font-bold text-emerald-400 font-mono mt-0.5 block">24</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Govt Schemes Recommended</span>
            <span className="text-xl font-bold text-amber-400 font-mono mt-0.5 block">21</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Rapid Intake Bar + Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Rapid Intake Form (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-amber-400" />
            Start Voice Intake for Walk-in Citizen
          </h3>
          <p className="text-xs text-slate-400">
            Register the citizen and hand over the mic for natural multilingual voice exploration.
          </p>

          <form onSubmit={handleStartRapidSession} className="space-y-2.5 pt-1">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Citizen Full Name</label>
              <input
                type="text"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                placeholder="e.g. Basavaraj Patil / ರಮೇಶ್"
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Primary Known Trade (Optional)</label>
              <input
                type="text"
                value={citizenTrade}
                onChange={(e) => setCitizenTrade(e.target.value)}
                placeholder="e.g. Farming / Carpentry / Welding"
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all mt-3"
            >
              <Sparkles className="w-4 h-4" />
              Launch Voice-First Session
            </button>
          </form>
        </div>

        {/* Right: Today's Intake Queue Table (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              Today's Field Queue
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {recentAssisted.length} Records
            </span>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[300px] pr-1">
            {recentAssisted.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-slate-100 text-xs sm:text-sm">{item.name}</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">{item.trade} • {item.time}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-300 font-semibold text-[10px] border border-emerald-500/30">
                    {item.match}
                  </span>
                  <button
                    onClick={() => alert(`Printing Kaushal Card for ${item.name}`)}
                    className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-amber-300 transition-colors"
                    title="Print Citizen Summary Card"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
