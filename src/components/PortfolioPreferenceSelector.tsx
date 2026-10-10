import React from "react";
import {
  Code,
  CreditCard,
  Calendar,
  PenTool,
  Check,
  ArrowUp,
  ArrowDown,
  X,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { PortfolioType } from "../lib/validators";

interface PortfolioConfig {
  id: PortfolioType;
  title: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  borderColor: string;
  bgColor: string;
}

const PORTFOLIO_CARDS: PortfolioConfig[] = [
  {
    id: "TECHNICAL",
    title: "Technical Team",
    tagline: "Coding, Website Development & Architecture",
    icon: Code,
    accentColor: "text-blue-400",
    borderColor: "border-blue-500/40",
    bgColor: "bg-blue-500/10",
  },
  {
    id: "FINANCE",
    title: "Finance Team",
    tagline: "Budgeting, Outreach & Sponsorship Pitching",
    icon: CreditCard,
    accentColor: "text-emerald-400",
    borderColor: "border-emerald-500/40",
    bgColor: "bg-emerald-500/10",
  },
  {
    id: "EVENTS",
    title: "Events Team",
    tagline: "Event Planning, Execution & Stage Logistics",
    icon: Calendar,
    accentColor: "text-purple-400",
    borderColor: "border-purple-500/40",
    bgColor: "bg-purple-500/10",
  },
  {
    id: "DESIGN",
    title: "Design Team",
    tagline: "Visual Identity, UI/UX, Posters & Video Production",
    icon: PenTool,
    accentColor: "text-amber-400",
    borderColor: "border-amber-500/40",
    bgColor: "bg-amber-500/10",
  },
];

interface PortfolioPreferenceSelectorProps {
  preferences: PortfolioType[];
  onChange: (newPreferences: PortfolioType[]) => void;
  error?: string;
}

export function PortfolioPreferenceSelector({
  preferences,
  onChange,
  error,
}: PortfolioPreferenceSelectorProps) {
  const handleSelectPortfolio = (portfolio: PortfolioType) => {
    if (preferences.includes(portfolio)) {
      onChange(preferences.filter((p) => p !== portfolio));
    } else {
      if (preferences.length < 3) {
        onChange([...preferences, portfolio]);
      }
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newPrefs = [...preferences];
    const temp = newPrefs[index - 1];
    newPrefs[index - 1] = newPrefs[index];
    newPrefs[index] = temp;
    onChange(newPrefs);
  };

  const handleMoveDown = (index: number) => {
    if (index >= preferences.length - 1) return;
    const newPrefs = [...preferences];
    const temp = newPrefs[index + 1];
    newPrefs[index + 1] = newPrefs[index];
    newPrefs[index] = temp;
    onChange(newPrefs);
  };

  const handleRemove = (portfolio: PortfolioType) => {
    onChange(preferences.filter((p) => p !== portfolio));
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-xs sm:text-sm text-indigo-200 flex items-start sm:items-center gap-3 shadow-inner">
        <HelpCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5 sm:mt-0" />
        <div className="leading-relaxed">
          Click any portfolio card below to assign your <strong>1st, 2nd, and 3rd preferences</strong>. Use the <strong>↑ / ↓</strong> arrow buttons anytime to reorder.
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300">
            Your Ordered Preferences
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {preferences.length} / 3 Ranked
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {[0, 1, 2].map((slotIndex) => {
            const assignedPortfolio = preferences[slotIndex];
            const portfolioObj = PORTFOLIO_CARDS.find((c) => c.id === assignedPortfolio);
            const slotLabels = ["1st Preference (Primary)", "2nd Preference (Secondary)", "3rd Preference (Tertiary)"];
            const slotBadgeColors = [
              "bg-indigo-600 text-white border-indigo-500 shadow-indigo-600/30",
              "bg-purple-600 text-white border-purple-500 shadow-purple-600/30",
              "bg-slate-800 text-slate-200 border-slate-700",
            ];

            return (
              <div
                key={slotIndex}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  portfolioObj
                    ? "bg-slate-900/90 border-slate-700 shadow-lg shadow-black/40 ring-1 ring-white/5"
                    : "bg-slate-950/40 border-dashed border-slate-800/80"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black border shadow-sm ${slotBadgeColors[slotIndex]}`}
                  >
                    #{slotIndex + 1}
                  </span>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      {slotLabels[slotIndex]}
                    </span>
                    {portfolioObj ? (
                      <span className="font-bold text-white text-base flex items-center gap-2 mt-0.5">
                        <portfolioObj.icon className={`w-4 h-4 ${portfolioObj.accentColor}`} />
                        {portfolioObj.title}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500 italic mt-0.5 block">Empty slot — click an available portfolio below to assign</span>
                    )}
                  </div>
                </div>

                {portfolioObj && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMoveUp(slotIndex)}
                      disabled={slotIndex === 0}
                      className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                      title="Move higher in ranking"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveDown(slotIndex)}
                      disabled={slotIndex >= preferences.length - 1}
                      className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                      title="Move lower in ranking"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(assignedPortfolio)}
                      className="p-2 rounded-xl text-rose-400 hover:text-rose-200 hover:bg-rose-500/20 transition-colors ml-1"
                      title="Remove from preferences"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300">
          Available Portfolios (Tap to Choose)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {PORTFOLIO_CARDS.map((item) => {
            const isSelected = preferences.includes(item.id);
            const rank = preferences.indexOf(item.id) + 1;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectPortfolio(item.id)}
                className={`p-4 sm:p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? "bg-indigo-950/20 border-indigo-500/70 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/30"
                    : preferences.length >= 3
                    ? "bg-slate-950/40 border-slate-800/80 opacity-60 hover:opacity-100"
                    : "bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-start justify-between gap-3 w-full">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-xl border ${item.bgColor} ${item.borderColor} ${item.accentColor}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-400 line-clamp-1">{item.tagline}</div>
                    </div>
                  </div>

                  {isSelected ? (
                    <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-black bg-indigo-600 text-white flex items-center gap-1 shadow-md shadow-indigo-600/30">
                      <Check className="w-3.5 h-3.5" /> #{rank}
                    </span>
                  ) : preferences.length < 3 ? (
                    <span className="shrink-0 text-[11px] font-bold text-slate-400 group-hover:text-indigo-300 bg-slate-900 group-hover:bg-slate-800 px-2 py-1 rounded-lg border border-slate-800 transition-colors">
                      + #{preferences.length + 1}
                    </span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
