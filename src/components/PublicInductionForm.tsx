import React, { useState, useEffect } from "react";
import {
  User,
  Briefcase,
  PenTool,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Loader2,
  Send,
  FileCheck,
  X,
  RotateCcw,
  Link2,
  ExternalLink,
} from "lucide-react";
import { PortfolioPreferenceSelector } from "./PortfolioPreferenceSelector";
import { RichTextAnswerField } from "./RichTextAnswerField";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { LinkedinIcon, GithubIcon } from "./SocialIcons";
import {
  PortfolioType,
  PORTFOLIO_LABELS,
} from "../lib/validators";
import { API_ENDPOINTS, EXTERNAL_LINKS } from "../config/api";

interface FormData {
  fullName: string;
  mis: string;
  collegeEmail: string;
  preferences: PortfolioType[];
  whyJoin: string;
  experience: string;
  skillsAndTools: string;
  contribution: string;
  whySelect: string;
  linkedinUrl: string;
  githubUrl: string;
}

const INITIAL_FORM: FormData = {
  fullName: "",
  mis: "",
  collegeEmail: "",
  preferences: [],
  whyJoin: "",
  experience: "",
  skillsAndTools: "",
  contribution: "",
  whySelect: "",
  linkedinUrl: "",
  githubUrl: "",
};

const STORAGE_KEY = "csi_inductions_draft_v1";

interface InductionDraft {
  formData: FormData;
  currentStep: number;
  lastSavedAt: number;
}

export function PublicInductionForm() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);
  const [isDraftRestored, setIsDraftRestored] = useState<boolean>(false);
  const [hasRestoredBanner, setHasRestoredBanner] = useState<boolean>(false);

  const steps = [
    { number: 1, title: "Applicant Profile", shortTitle: "Profile" },
    { number: 2, title: "Portfolio Preferences", shortTitle: "Portfolio" },
    { number: 3, title: "Interest & Experience", shortTitle: "Interest" },
    { number: 4, title: "Skills & Contribution", shortTitle: "Skills" },
    { number: 5, title: "Review & Submit", shortTitle: "Review" },
  ];

  // 1. Restore draft and current step from localStorage on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (typeof window === "undefined") return;
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed: Partial<InductionDraft> = JSON.parse(saved);
          if (parsed && typeof parsed === "object") {
            let hasContent = false;
            if (parsed.formData && typeof parsed.formData === "object") {
              const restoredData: FormData = {
                fullName: parsed.formData.fullName || "",
                mis: parsed.formData.mis || "",
                collegeEmail: parsed.formData.collegeEmail || "",
                preferences: Array.isArray(parsed.formData.preferences) ? parsed.formData.preferences : [],
                whyJoin: parsed.formData.whyJoin || "",
                experience: parsed.formData.experience || "",
                skillsAndTools: parsed.formData.skillsAndTools || "",
                contribution: parsed.formData.contribution || "",
                whySelect: parsed.formData.whySelect || "",
                linkedinUrl: parsed.formData.linkedinUrl || "",
                githubUrl: parsed.formData.githubUrl || "",
              };
              setFormData(restoredData);
              hasContent =
                Boolean(restoredData.fullName.trim()) ||
                Boolean(restoredData.mis.trim()) ||
                Boolean(restoredData.collegeEmail.trim()) ||
                restoredData.preferences.length > 0 ||
                Boolean(restoredData.whyJoin.trim()) ||
                Boolean(restoredData.experience.trim()) ||
                Boolean(restoredData.linkedinUrl.trim()) ||
                Boolean(restoredData.githubUrl.trim()) ||
                Boolean(restoredData.skillsAndTools.trim()) ||
                Boolean(restoredData.contribution.trim()) ||
                Boolean(restoredData.whySelect.trim());
            }
            if (
              typeof parsed.currentStep === "number" &&
              parsed.currentStep >= 1 &&
              parsed.currentStep <= 5
            ) {
              setCurrentStep(parsed.currentStep);
            }
            if (hasContent) {
              setHasRestoredBanner(true);
            }
          }
        }
      } catch (err) {
        console.warn("Failed to restore draft from localStorage:", err);
      } finally {
        setIsDraftRestored(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // 2. Debounced auto-save draft to localStorage whenever user modifies data or steps
  useEffect(() => {
    if (!isDraftRestored || submittedAppId) return;

    const timer = setTimeout(() => {
      try {
        if (typeof window === "undefined") return;
        const hasContent =
          formData.fullName.trim() !== "" ||
          formData.mis.trim() !== "" ||
          formData.collegeEmail.trim() !== "" ||
          formData.preferences.length > 0 ||
          formData.whyJoin.trim() !== "" ||
          formData.experience.trim() !== "" ||
          formData.skillsAndTools.trim() !== "" ||
          formData.contribution.trim() !== "" ||
          formData.whySelect.trim() !== "" ||
          formData.linkedinUrl.trim() !== "" ||
          formData.githubUrl.trim() !== "" ||
          currentStep > 1;

        if (hasContent) {
          const draft: InductionDraft = {
            formData,
            currentStep,
            lastSavedAt: Date.now(),
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
        }
      } catch (err) {
        console.warn("Failed to auto-save draft to localStorage:", err);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [formData, currentStep, isDraftRestored, submittedAppId]);

  const handleClearDraft = () => {
    if (window.confirm("Are you sure you want to clear your saved draft and start fresh?")) {
      try {
        if (typeof window !== "undefined") {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (err) {
        console.warn("Failed to remove draft:", err);
      }
      setFormData(INITIAL_FORM);
      setCurrentStep(1);
      setErrors({});
      setHasRestoredBanner(false);
    }
  };

  // Step 1 Validation
  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) {
      errs.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      errs.fullName = "Full name must be at least 2 characters";
    }

    if (!formData.mis.trim()) {
      errs.mis = "MIS is required";
    } else if (!/^[0-9]{9}$/.test(formData.mis.trim())) {
      errs.mis = "MIS must be exactly 9 digits (e.g. 612515001)";
    }

    if (!formData.collegeEmail.trim()) {
      errs.collegeEmail = "College email is required";
    } else if (!formData.collegeEmail.toLowerCase().endsWith("@coeptech.ac.in")) {
      errs.collegeEmail = "Must be a valid @coeptech.ac.in college email";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (formData.preferences.length < 3) {
      errs.preferences = "Please choose and rank all 3 distinct portfolio preferences";
    } else if (new Set(formData.preferences).size !== 3) {
      errs.preferences = "All 3 preferences must be distinct";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 3 Validation
  const validateStep3 = () => {
    const errs: Record<string, string> = {};
    if (!formData.whyJoin.trim() || formData.whyJoin.trim().length < 10) {
      errs.whyJoin = "Please provide an answer (minimum 10 characters)";
    }
    if (!formData.experience.trim() || formData.experience.trim().length < 10) {
      errs.experience = "Please describe your relevant experience (minimum 10 characters)";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 4 Validation
  const validateStep4 = () => {
    const errs: Record<string, string> = {};
    if (!formData.skillsAndTools.trim() || formData.skillsAndTools.trim().length < 5) {
      errs.skillsAndTools = "Please list your relevant skills and tools (min 5 characters)";
    }
    if (!formData.contribution.trim() || formData.contribution.trim().length < 10) {
      errs.contribution = "Please describe your contribution (min 10 characters)";
    }
    if (!formData.whySelect.trim() || formData.whySelect.trim().length < 10) {
      errs.whySelect = "Please explain why we should select you (min 10 characters)";
    }
    if (formData.linkedinUrl && formData.linkedinUrl.trim()) {
      let url = formData.linkedinUrl.trim();
      if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
      try {
        const parsed = new URL(url);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
          errs.linkedinUrl = "Please enter a valid URL (e.g. https://linkedin.com/in/username)";
        }
      } catch {
        errs.linkedinUrl = "Please enter a valid URL (e.g. https://linkedin.com/in/username)";
      }
    }
    if (formData.githubUrl && formData.githubUrl.trim()) {
      let url = formData.githubUrl.trim();
      if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
      try {
        const parsed = new URL(url);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
          errs.githubUrl = "Please enter a valid URL (e.g. https://github.com/username)";
        }
      } catch {
        errs.githubUrl = "Please enter a valid URL (e.g. https://github.com/username)";
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    setSubmitError(null);
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep === 3 && !validateStep3()) return;
    if (currentStep === 4 && !validateStep4()) return;

    setCurrentStep((prev) => Math.min(steps.length, prev + 1));
    window.scrollTo({ top: document.getElementById("application-form")?.offsetTop || 0, behavior: "smooth" });
  };

  const handlePrev = () => {
    setSubmitError(null);
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: document.getElementById("application-form")?.offsetTop || 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!validateStep1() || !validateStep2() || !validateStep3() || !validateStep4()) {
      setSubmitError("Some required fields are missing or invalid. Please review each step.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      fullName: formData.fullName.trim(),
      mis: formData.mis.trim(),
      collegeEmail: formData.collegeEmail.trim().toLowerCase(),
      preference1: formData.preferences[0],
      preference2: formData.preferences[1],
      preference3: formData.preferences[2],
      whyJoin: formData.whyJoin.trim(),
      experience: formData.experience.trim(),
      skillsAndTools: formData.skillsAndTools.trim(),
      contribution: formData.contribution.trim(),
      whySelect: formData.whySelect.trim(),
      linkedinUrl: formData.linkedinUrl.trim() || null,
      githubUrl: formData.githubUrl.trim() || null,
    };

    try {
      const res = await fetch(API_ENDPOINTS.SUBMIT_APPLICATION, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        try {
          if (typeof window !== "undefined") {
            localStorage.removeItem(STORAGE_KEY);
          }
        } catch (storageErr) {
          console.warn("Failed to clear induction draft after submission:", storageErr);
        }
        setSubmittedAppId(data.data.id);
        window.scrollTo({ top: document.getElementById("application-form")?.offsetTop || 0, behavior: "smooth" });
      } else {
        setSubmitError(
          data.error?.message ||
            "Unable to submit application. Please check your answers and try again."
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error submitting application. Please try again.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success Confirmation Screen
  if (submittedAppId) {
    return (
      <div className="rounded-3xl border border-emerald-500/30 bg-slate-900/90 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />

        <div className="relative space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Application Confirmed
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Thank You, {formData.fullName}!
            </h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Your application for CSI COEP SY Inductions 2026 has been safely received.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left max-w-sm mx-auto space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Application Reference ID
            </div>
            <div className="font-mono text-indigo-400 font-bold text-sm tracking-wide">
              {submittedAppId}
            </div>
            <div className="text-[11px] text-slate-400 pt-1">
              Confirmation dispatched to: <span className="text-slate-200">{formData.collegeEmail}</span>
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-950 border-2 border-emerald-500/40 text-left max-w-lg mx-auto shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative space-y-3.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Crucial Next Step
                </span>
                <span className="text-xs text-slate-400">· Real-time interview updates</span>
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  Join the Official CSI WhatsApp Group
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                  The <strong className="text-white">exact schedule of interviews</strong>, individual slot allocations, and critical announcements will be posted directly in this group. Join now so you don&apos;t miss your slot!
                </p>
              </div>

              <div className="pt-1">
                <a
                  href={EXTERNAL_LINKS.WHATSAPP_GROUP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-extrabold text-sm sm:text-base shadow-lg shadow-[#25D366]/25 hover:shadow-[#25D366]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.101-.477-.15-.678.15-.2.301-.779.978-.955 1.179-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.786-1.677-2.087-.176-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.15-.176.2-.301.301-.502.1-.2.05-.376-.025-.526-.075-.15-.678-1.631-.93-2.235-.244-.588-.493-.508-.678-.518-.176-.008-.376-.01-.577-.01-.201 0-.527.075-.803.376-.276.301-1.054 1.029-1.054 2.509 0 1.48 1.079 2.908 1.23 3.109.15.201 2.124 3.243 5.145 4.549.719.311 1.28.497 1.718.636.722.23 1.379.197 1.9.12.58-.087 1.78-.727 2.03-1.43.251-.703.251-1.305.176-1.43-.075-.126-.276-.201-.577-.352z" />
                    <path d="M12.002 2C6.485 2 2 6.484 2 12c0 1.977.574 3.82 1.564 5.378L2.25 21.75l4.502-1.28A9.957 9.957 0 0012.002 22C17.518 22 22 17.516 22 12c0-5.516-4.482-10-9.998-10zm0 18.25c-1.613 0-3.125-.45-4.417-1.235l-.317-.193-2.678.762.768-2.607-.208-.33A8.204 8.204 0 013.75 12c0-4.55 3.702-8.25 8.252-8.25 4.549 0 8.248 3.7 8.248 8.25 0 4.55-3.699 8.25-8.248 8.25z" />
                  </svg>
                  <span>Join Official CSI WhatsApp Group</span>
                  <ArrowRight className="w-4 h-4 ml-0.5 shrink-0" />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <a
              href={EXTERNAL_LINKS.MAIN_WEBSITE}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              <span>Visit CSI COEP Official Website</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl p-6 sm:p-10 backdrop-blur-md" id="application-form">
      {hasRestoredBanner && (
        <div className="mb-6 p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-xs sm:text-sm text-indigo-200 flex items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span>
              Restored your saved answers from previous session (resumed at <strong>{steps[currentStep - 1]?.title}</strong>).
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleClearDraft}
              className="text-slate-400 hover:text-rose-300 underline text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Start fresh
            </button>
            <button
              type="button"
              onClick={() => setHasRestoredBanner(false)}
              className="p-1 rounded-md text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Step Progress Tracker */}
      <div className="mb-8 space-y-4">
        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-indigo-500 via-indigo-400 to-purple-500 h-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>

        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center">
          {steps.map((s) => (
            <div
              key={s.number}
              className={`space-y-1 transition-colors ${
                currentStep === s.number
                  ? "text-indigo-400 font-bold"
                  : currentStep > s.number
                  ? "text-slate-300 font-medium"
                  : "text-slate-600"
              }`}
            >
              <div className="text-xs sm:text-sm font-bold truncate sm:whitespace-normal">
                <span className="hidden md:inline">{s.title}</span>
                <span className="md:hidden">{s.shortTitle}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {submitError && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold">Submission Issue</div>
            <div>{submitError}</div>
          </div>
        </div>
      )}

      {/* Step 1: Personal Details */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white tracking-[0.2px] flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-400" /> Candidate Identification
            </h3>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-2">
              <label className="text-base sm:text-lg font-bold text-white tracking-[0.2px] flex items-center gap-1.5">
                Q1. Full Name <span className="text-rose-400 text-base font-bold">*</span>
              </label>
              <input
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Atharva Wadekar"
                maxLength={100}
                className="w-full min-w-0 rounded-lg border px-3 py-2 bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 h-12 text-base focus:border-indigo-500 outline-none transition-colors"
              />
              {errors.fullName && <p className="text-xs text-rose-400">{errors.fullName}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-base sm:text-lg font-bold text-white tracking-[0.2px] flex items-center gap-1.5">
                Q2. MIS Number (9 Digits) <span className="text-rose-400 text-base font-bold">*</span>
              </label>
              <input
                value={formData.mis}
                onChange={(e) => setFormData({ ...formData, mis: e.target.value.replace(/[^0-9]/g, "") })}
                placeholder="e.g. 612515001"
                maxLength={9}
                className="w-full min-w-0 rounded-lg border px-3 py-2 bg-slate-950 border-slate-800 font-mono text-white placeholder:text-slate-600 h-12 text-base focus:border-indigo-500 outline-none transition-colors"
              />
              {errors.mis && <p className="text-xs text-rose-400">{errors.mis}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-base sm:text-lg font-bold text-white tracking-[0.2px] flex items-center gap-1.5">
                Q3. College Email ID (@coeptech.ac.in) <span className="text-rose-400 text-base font-bold">*</span>
              </label>
              <input
                type="email"
                value={formData.collegeEmail}
                onChange={(e) => setFormData({ ...formData, collegeEmail: e.target.value })}
                placeholder="wadekaram23.comp@coeptech.ac.in"
                className="w-full min-w-0 rounded-lg border px-3 py-2 bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 h-12 text-base focus:border-indigo-500 outline-none transition-colors"
              />
              {errors.collegeEmail && <p className="text-xs text-rose-400">{errors.collegeEmail}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Preferences */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-[0.2px] flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-400" /> Q4. Portfolio Preferences (1st, 2nd, 3rd) <span className="text-rose-400 text-base font-bold">*</span>
            </h3>
          </div>

          <PortfolioPreferenceSelector
            preferences={formData.preferences}
            onChange={(newPrefs) => setFormData({ ...formData, preferences: newPrefs })}
            error={errors.preferences}
          />
        </div>
      )}

      {/* Step 3: Motivation & Experience */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white tracking-[0.2px] flex items-center gap-2">
              <PenTool className="w-5 h-5 text-indigo-400" /> Motivation &amp; Experience
            </h3>
          </div>

          <div className="space-y-10 sm:space-y-12">
            <RichTextAnswerField
              label="Q5. Why are you interested in joining this portfolio?"
              description="Explain your motivation for your chosen portfolio and what you aspire to learn or contribute."
              value={formData.whyJoin}
              onChange={(val) => setFormData({ ...formData, whyJoin: val })}
              placeholder="I am passionate about..."
              required={true}
              minChars={10}
              error={errors.whyJoin}
              rows={5}
            />

            <RichTextAnswerField
              label="Q6. Relevant experience in your preferred portfolios"
              description="Describe any prior projects, tools used, clubs, competitions, or past events. If you have no prior experience, explain what you are eager to build or learn."
              value={formData.experience}
              onChange={(val) => setFormData({ ...formData, experience: val })}
              placeholder="Previous projects, technologies, or club activities..."
              required={true}
              minChars={10}
              error={errors.experience}
              rows={4}
            />
          </div>
        </div>
      )}

      {/* Step 4: Skills & Contribution */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white tracking-[0.2px] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" /> Skills &amp; CSI Contribution
            </h3>
          </div>

          <div className="space-y-10 sm:space-y-12">
            <RichTextAnswerField
              label="Q7. Specific skills and tools you know that would benefit your chosen portfolios"
              description="e.g. Next.js, Figma, Canva, Premiere Pro, Financial Excel, Public Relations, Python, etc."
              value={formData.skillsAndTools}
              onChange={(val) => setFormData({ ...formData, skillsAndTools: val })}
              placeholder="Tools, frameworks, and skillsets..."
              required={true}
              minChars={5}
              error={errors.skillsAndTools}
              rows={4}
            />

            <RichTextAnswerField
              label="Q8. How would you contribute to the success of CSI COEP as a coordinator?"
              description="Describe your dedication, teamwork, ideas for new initiatives, and cross-portfolio support."
              value={formData.contribution}
              onChange={(val) => setFormData({ ...formData, contribution: val })}
              placeholder="As a coordinator, I will contribute by..."
              required={true}
              minChars={10}
              error={errors.contribution}
              rows={4}
            />

            <RichTextAnswerField
              label="Q9. Why should we select you as a CSI COEP coordinator?"
              description="What makes you stand out? Share your work ethic, problem-solving mindset, and commitment."
              value={formData.whySelect}
              onChange={(val) => setFormData({ ...formData, whySelect: val })}
              placeholder="You should select me because..."
              required={true}
              minChars={10}
              error={errors.whySelect}
              rows={4}
            />

            <div className="pt-6 border-t border-slate-800/80 space-y-5">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-indigo-400" /> Professional &amp; Project Profiles (Optional)
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Share your LinkedIn or GitHub profiles so leads can review your code repositories, projects, and past experience.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-base sm:text-lg font-bold text-white tracking-[0.2px] flex items-center gap-1.5">
                    LinkedIn Profile Link <span className="text-[11px] font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full">(Optional)</span>
                  </label>
                  <div className="relative flex items-center">
                    <LinkedinIcon className="absolute left-3.5 w-4 h-4 text-blue-400 pointer-events-none" />
                    <input
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full min-w-0 rounded-lg border px-3 py-2 bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 h-12 pl-10 text-base focus:border-indigo-500 outline-none transition-colors"
                    />
                  </div>
                  {errors.linkedinUrl && <p className="text-xs text-rose-400">{errors.linkedinUrl}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-base sm:text-lg font-bold text-white tracking-[0.2px] flex items-center gap-1.5">
                    GitHub Profile Link <span className="text-[11px] font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full">(Optional)</span>
                  </label>
                  <div className="relative flex items-center">
                    <GithubIcon className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      placeholder="https://github.com/username"
                      className="w-full min-w-0 rounded-lg border px-3 py-2 bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 h-12 pl-10 text-base focus:border-indigo-500 outline-none transition-colors"
                    />
                  </div>
                  {errors.githubUrl && <p className="text-xs text-rose-400">{errors.githubUrl}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Review & Submit */}
      {currentStep === 5 && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white tracking-[0.2px] flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-indigo-400" /> Verify Your Application
            </h3>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Personal Details</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div>
                <span className="text-[11px] text-slate-500 block">Full Name</span>
                <span className="font-bold text-white">{formData.fullName}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">MIS Number</span>
                <span className="font-mono font-bold text-slate-200">{formData.mis}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">College Email</span>
                <span className="text-slate-200">{formData.collegeEmail}</span>
              </div>
            </div>

            {(formData.linkedinUrl || formData.githubUrl) && (
              <div className="pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs">
                {formData.linkedinUrl && (
                  <div className="flex items-center gap-1.5 text-blue-400">
                    <LinkedinIcon className="w-3.5 h-3.5 shrink-0" />
                    <a href={formData.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1 truncate max-w-xs">
                      <span className="truncate">{formData.linkedinUrl}</span>
                      <ExternalLink className="w-3 h-3 shrink-0 opacity-60" />
                    </a>
                  </div>
                )}
                {formData.githubUrl && (
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <GithubIcon className="w-3.5 h-3.5 shrink-0" />
                    <a href={formData.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1 truncate max-w-xs">
                      <span className="truncate">{formData.githubUrl}</span>
                      <ExternalLink className="w-3 h-3 shrink-0 opacity-60" />
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Portfolio Rankings</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {formData.preferences.map((p, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-indigo-600 text-white font-extrabold flex items-center justify-center text-[11px]">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-slate-200">{PORTFOLIO_LABELS[p]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Written Responses</div>

            <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-1.5">
              <div className="text-xs font-bold text-slate-300">Q5. Why interested in joining:</div>
              <div className="text-xs text-slate-400">
                <MarkdownRenderer content={formData.whyJoin} />
              </div>
            </div>

            {formData.experience && (
              <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-1.5">
                <div className="text-xs font-bold text-slate-300">Q6. Relevant experience:</div>
                <div className="text-xs text-slate-400">
                  <MarkdownRenderer content={formData.experience} />
                </div>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-1.5">
              <div className="text-xs font-bold text-slate-300">Q7. Skills &amp; tools:</div>
              <div className="text-xs text-slate-400">
                <MarkdownRenderer content={formData.skillsAndTools} />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-1.5">
              <div className="text-xs font-bold text-slate-300">Q8. CSI contribution:</div>
              <div className="text-xs text-slate-400">
                <MarkdownRenderer content={formData.contribution} />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-1.5">
              <div className="text-xs font-bold text-slate-300">Q9. Why should we select you:</div>
              <div className="text-xs text-slate-400">
                <MarkdownRenderer content={formData.whySelect} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between gap-4">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handlePrev}
            disabled={isSubmitting}
            className="border border-slate-800 bg-slate-950 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        ) : (
          <div />
        )}

        {currentStep < steps.length ? (
          <button
            type="button"
            onClick={handleNext}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer transition-all"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Submitting Application...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Submit Application
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
