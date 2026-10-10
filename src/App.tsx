import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ArrowRight,
  Shield,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  Lock,
} from "lucide-react";
import { PortfolioShowcase } from "./components/PortfolioShowcase";
import { PublicInductionForm } from "./components/PublicInductionForm";
import { InductionsClosedNotice } from "./components/InductionsClosedNotice";
import type { InductionStatus } from "./lib/validators";
import { API_ENDPOINTS, EXTERNAL_LINKS } from "./config/api";

const DEFAULT_STATUS: InductionStatus = {
  isOpen: true,
  manualIsOpen: true,
  isAutoClosed: false,
  autoCloseAt: null,
  closedTitle: "Inductions are Currently Closed",
  closedMessage:
    "Thank you for your overwhelming interest in CSI COEP! Applications for Second Year (SY) Inductions are now officially closed.",
  updatedAt: new Date().toISOString(),
};

export function App() {
  const [status, setStatus] = useState<InductionStatus>(DEFAULT_STATUS);

  useEffect(() => {
    let isMounted = true;
    fetch(API_ENDPOINTS.GET_STATUS)
      .then((res) => {
        if (!res.ok) throw new Error("Status endpoint not available");
        return res.json();
      })
      .then((payload) => {
        if (isMounted && payload?.success && payload.data) {
          setStatus(payload.data);
        }
      })
      .catch(() => {
        // Fallback gracefully to default open status
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const autoCloseDate = status.autoCloseAt ? new Date(status.autoCloseAt) : null;
  const formattedDeadline = autoCloseDate
    ? autoCloseDate.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : null;

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white relative overflow-x-hidden font-sans">
      {/* Fixed Subtle Gradient Mesh Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 inset-x-0 h-[650px] bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(99,102,241,0.12),transparent_75%)]" />
        <div className="absolute top-1/3 -right-48 w-[38rem] h-[38rem] bg-[radial-gradient(circle,rgba(168,85,247,0.06),transparent_70%)]" />
        <div className="absolute bottom-1/4 -left-48 w-[38rem] h-[38rem] bg-[radial-gradient(circle,rgba(59,130,246,0.06),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:32px_32px] opacity-15 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_35%,#000_30%,transparent_85%)]" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-3.5">
            <img
              src={`${import.meta.env.BASE_URL}csi-logo.png`}
              alt="CSI COEP Logo"
              width={49}
              height={49}
              className="h-[45px] w-[45px] sm:h-[49px] sm:w-[49px] object-contain shrink-0"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-white text-base tracking-tight leading-tight">
                CSI COEP
              </span>
              <span className="text-[10px] sm:text-[11px] text-indigo-300 font-medium tracking-normal leading-tight">
                Computer Society of India
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={EXTERNAL_LINKS.MAIN_WEBSITE}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-white transition-colors hidden sm:flex items-center gap-1"
            >
              <span>Main Website</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href={EXTERNAL_LINKS.PORTAL_LOGIN}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>Portal Login</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-16">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-6 pt-4 sm:pt-8">
          {status.isOpen ? (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 shadow-lg shadow-indigo-500/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {formattedDeadline
                  ? `Applications Open · Closes ${formattedDeadline}`
                  : "Applications Now Open for Academic Year 2026"}
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 border border-amber-500/25 text-amber-300 shadow-lg shadow-amber-500/10">
              <Lock className="w-3.5 h-3.5" />
              <span>
                {status.isAutoClosed
                  ? "Applications Concluded (Scheduled Deadline Passed)"
                  : "Applications Currently Closed"}
              </span>
            </div>
          )}

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            CSI COEP <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Second Year (SY) Inductions
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {status.isOpen
              ? "Step forward to lead, innovate, and build. Join the core organizing team of COEP's premier computer society across Technical, Finance, Events, and Design portfolios."
              : "Applications for the current selection cycle have concluded. Thank you to all candidates who submitted their candidacy!"}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {status.isOpen ? (
              <a
                href="#application-form"
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-xl shadow-indigo-600/30 flex items-center gap-2"
              >
                <span>Apply for Inductions</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            ) : (
              <a
                href="#application-form"
                className="px-6 py-3 rounded-2xl bg-amber-600/90 hover:bg-amber-500 text-white font-bold text-sm transition-all shadow-xl shadow-amber-600/20 flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>View Closure Announcement</span>
              </a>
            )}
            <a
              href="#portfolios-section"
              className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-semibold text-sm transition-all flex items-center gap-2"
            >
              <span>Explore Portfolios</span>
              <ChevronDown className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* Portfolio Showcase */}
        <PortfolioShowcase />

        {/* Application Form Section */}
        <section id="application-form" className="space-y-6 pt-6 scroll-mt-12">
          {status.isOpen ? (
            <>
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Official Application Form
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Submit Your Candidacy
                </h2>
              </div>

              <PublicInductionForm />
            </>
          ) : (
            <InductionsClosedNotice status={status} />
          )}
        </section>

        {/* FAQs Section */}
        <section className="p-6 sm:p-8 rounded-3xl bg-slate-900/50 border border-slate-800/80 space-y-6 shadow-xl backdrop-blur-sm">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <HelpCircle className="w-3.5 h-3.5" /> Clarity &amp; Guidance
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div className="flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-indigo-500/40 transition-colors shadow-md space-y-4">
              <div className="space-y-2">
                <h4 className="font-bold text-white text-base sm:text-lg flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
                  Who is eligible to apply?
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed pl-5">
                  Second Year (SY) undergraduate students enrolled at COEP Technological University from Computer Science &amp; Engineering (CSE) and Artificial Intelligence &amp; Machine Learning (AIML) departments are eligible to apply.
                </p>
              </div>
              <div className="pl-5">
                <span className="inline-flex items-center text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
                  SY CSE &amp; AIML Students Only
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-purple-500/40 transition-colors shadow-md space-y-4">
              <div className="space-y-2">
                <h4 className="font-bold text-white text-base sm:text-lg flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
                  Can I apply for more than one portfolio?
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed pl-5">
                  Yes! In the form you can rank up to three distinct portfolios (Preference 1, 2, and 3) across Technical, Finance, Events, and Design teams.
                </p>
              </div>
              <div className="pl-5">
                <span className="inline-flex items-center text-xs font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full">
                  Rank 3 Preferences (P1, P2, P3)
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-pink-500/40 transition-colors shadow-md space-y-4">
              <div className="space-y-2">
                <h4 className="font-bold text-white text-base sm:text-lg flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500 shrink-0" />
                  What is the selection process?
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed pl-5">
                  Round 1 evaluates your submitted application answers and portfolio work. Shortlisted candidates are invited for a Round 2 Personal Interview with portfolio heads.
                </p>
              </div>
              <div className="pl-5">
                <div className="inline-flex items-center gap-2 text-xs font-semibold">
                  <span className="px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/25 text-pink-300">Round 1: Review</span>
                  <span className="text-slate-600">&rarr;</span>
                  <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300">Round 2: Interview</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-emerald-500/40 transition-colors shadow-md space-y-4">
              <div className="space-y-2">
                <h4 className="font-bold text-white text-base sm:text-lg flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  How will I receive updates &amp; schedules?
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed pl-5">
                  You will receive an automated confirmation email upon submission. Exact interview schedules, individual slot allocations, and announcements are shared in our WhatsApp group.
                </p>
              </div>
              <div className="pl-5">
                <a
                  href={EXTERNAL_LINKS.WHATSAPP_GROUP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-emerald-300 hover:text-white text-xs sm:text-sm font-semibold transition-all group shadow-sm"
                >
                  <svg className="w-3.5 h-3.5 fill-[#25D366] group-hover:fill-white shrink-0 transition-colors" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.101-.477-.15-.678.15-.2.301-.779.978-.955 1.179-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.786-1.677-2.087-.176-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.15-.176.2-.301.301-.502.1-.2.05-.376-.025-.526-.075-.15-.678-1.631-.93-2.235-.244-.588-.493-.508-.678-.518-.176-.008-.376-.01-.577-.01-.201 0-.527.075-.803.376-.276.301-1.054 1.029-1.054 2.509 0 1.48 1.079 2.908 1.23 3.109.15.201 2.124 3.243 5.145 4.549.719.311 1.28.497 1.718.636.722.23 1.379.197 1.9.12.58-.087 1.78-.727 2.03-1.43.251-.703.251-1.305.176-1.43-.075-.126-.276-.201-.577-.352z" />
                    <path d="M12.002 2C6.485 2 2 6.484 2 12c0 1.977.574 3.82 1.564 5.378L2.25 21.75l4.502-1.28A9.957 9.957 0 0012.002 22C17.518 22 22 17.516 22 12c0-5.516-4.482-10-9.998-10zm0 18.25c-1.613 0-3.125-.45-4.417-1.235l-.317-.193-2.678.762.768-2.607-.208-.33A8.204 8.204 0 013.75 12c0-4.55 3.702-8.25 8.252-8.25 4.549 0 8.248 3.7 8.248 8.25 0 4.55-3.699 8.25-8.248 8.25z" />
                  </svg>
                  <span>Join WhatsApp Group &rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 space-y-2">
          <p className="text-slate-400 font-semibold">
            Computer Society of India (CSI) · COEP Technological University
          </p>
          <p>© {new Date().getFullYear()} CSI COEP. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
