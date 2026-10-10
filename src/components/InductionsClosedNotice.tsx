import React from "react";
import {
  Lock,
  Clock,
  CheckCircle2,
  ExternalLink,
  Shield,
  Calendar,
} from "lucide-react";
import { InductionStatus } from "../lib/validators";
import { EXTERNAL_LINKS } from "../config/api";

interface InductionsClosedNoticeProps {
  status: InductionStatus;
}

export function InductionsClosedNotice({ status }: InductionsClosedNoticeProps) {
  const autoCloseDate = status.autoCloseAt ? new Date(status.autoCloseAt) : null;
  const formattedDate = autoCloseDate
    ? autoCloseDate.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : null;

  return (
    <div className="rounded-3xl border border-amber-500/25 bg-slate-900/80 p-6 sm:p-12 text-center max-w-2xl mx-auto shadow-2xl relative overflow-hidden backdrop-blur-md">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(245,158,11,0.08),transparent_75%)] pointer-events-none" />

      <div className="relative space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/10">
          {status.isAutoClosed ? (
            <Clock className="w-8 h-8" />
          ) : (
            <Lock className="w-8 h-8" />
          )}
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/10 border border-amber-500/30 text-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Submissions Closed</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {status.closedTitle || "Inductions are Currently Closed"}
          </h3>

          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
            {status.closedMessage ||
              "Thank you for your overwhelming interest in CSI COEP! Applications for Second Year (SY) Inductions are now officially closed."}
          </p>

          {formattedDate && (
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950/60 border border-slate-800 px-3 py-1 rounded-full">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Deadline concluded: <strong className="text-slate-200">{formattedDate}</strong></span>
              </span>
            </div>
          )}
        </div>

        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 text-left space-y-3 shadow-inner">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Already Applied?</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            All submitted applications are actively being reviewed by the CSI Executive Committee &amp; Portfolio Leads. 
            Shortlisted candidates for <strong>Round 2 Personal Interviews</strong> will be notified via their registered college email and the official WhatsApp group.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href={EXTERNAL_LINKS.MAIN_WEBSITE}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2"
          >
            <span>Visit CSI COEP Website</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <a
            href={EXTERNAL_LINKS.PORTAL_LOGIN}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600/90 hover:bg-indigo-600 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-200" />
            <span>Member Portal Login</span>
          </a>
        </div>
      </div>
    </div>
  );
}
