import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  Cpu, 
  Layers, 
  Sparkles 
} from 'lucide-react';
import type { AgentNode, AgentNodeId, SupportedLanguage } from '../types';
import { I18N_DATA } from '../data/i18n';

interface AgentWorkflowVisualizerProps {
  nodes: AgentNode[];
  activeNodeId: AgentNodeId;
  currentLanguage: SupportedLanguage;
}

export const AgentWorkflowVisualizer: React.FC<AgentWorkflowVisualizerProps> = ({
  nodes,
  activeNodeId,
  currentLanguage
}) => {
  const t = I18N_DATA[currentLanguage] || I18N_DATA.kn;

  return (
    <div className="w-full bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
            <span className="p-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Cpu className="w-4 h-4" />
            </span>
            {t.workflowTitle}
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {t.workflowSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
            <Layers className="w-3 h-3 text-amber-400" />
            8 Sequential Agents
          </span>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px]">
            <Sparkles className="w-3 h-3" />
            Autonomous Pipeline
          </span>
        </div>
      </div>

      {/* Grid of 8 Nodes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {nodes.map((node, index) => {
          const isActive = node.id === activeNodeId;
          const isCompleted = node.status === 'completed';

          return (
            <div
              key={node.id}
              className={`relative rounded-xl p-2.5 flex flex-col justify-between border transition-all duration-200 ${
                isActive
                  ? 'bg-amber-500/15 border-amber-500/60 shadow-sm ring-1 ring-amber-400/40'
                  : isCompleted
                  ? 'bg-slate-800/70 border-emerald-500/30 text-slate-200'
                  : 'bg-slate-900/40 border-slate-800/80 text-slate-500'
              }`}
            >
              {/* Step indicator */}
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[9px] font-mono font-bold px-1 py-0.2 rounded ${
                  isActive
                    ? 'bg-amber-500 text-slate-950'
                    : isCompleted
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-slate-800 text-slate-500'
                }`}>
                  0{index + 1}
                </span>

                {isCompleted ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                ) : isActive ? (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                ) : (
                  <Clock className="w-3 h-3 text-slate-600" />
                )}
              </div>

              {/* Icon & Name */}
              <div className="space-y-0.5">
                <span className="text-lg block">{node.icon}</span>
                <h4 className={`text-[11px] font-bold leading-tight line-clamp-1 ${
                  isActive ? 'text-amber-300' : isCompleted ? 'text-slate-100' : 'text-slate-400'
                }`}>
                  {node.name}
                </h4>
                <p className="text-[9px] text-slate-400 line-clamp-2 leading-tight">
                  {node.role}
                </p>
              </div>

              {/* Status Badge */}
              <div className="mt-2 pt-1 border-t border-slate-800/60 flex items-center justify-between text-[8px] font-mono">
                <span className={isActive ? 'text-amber-400 font-bold' : isCompleted ? 'text-emerald-400 font-semibold' : 'text-slate-600'}>
                  {isActive ? 'ACTIVE' : isCompleted ? 'DONE' : 'QUEUED'}
                </span>
                {index < 7 && (
                  <ArrowRight className="w-2 h-2 text-slate-600 hidden lg:block" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
