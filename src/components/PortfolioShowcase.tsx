import React from "react";
import {
  Code,
  CreditCard,
  Calendar,
  PenTool,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

interface PortfolioDetails {
  id: "TECHNICAL" | "FINANCE" | "EVENTS" | "DESIGN";
  name: string;
  roleTitle: string;
  description: string;
  skills: string[];
  gradient: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  icon: React.ComponentType<{ className?: string }>;
  websiteLink?: string;
}

const PORTFOLIOS_DATA: PortfolioDetails[] = [
  {
    id: "TECHNICAL",
    name: "Technical Team",
    roleTitle: "Technical Coordinator",
    description:
      "As a Technical Coordinator, you will collaborate with the Technical Team to build, maintain, and improve the official CSI COEP Tech website (csi.coep.org.in). You will contribute to responsive web design, frontend architectures, coding challenge platforms, and technical infrastructure powering CSI flagship events and initiatives.",
    skills: ["Next.js & React", "TypeScript", "Tailwind CSS", "APIs & Databases", "Git & Deployment"],
    gradient: "from-blue-600/20 via-indigo-600/10 to-transparent",
    borderColor: "border-blue-500/30 hover:border-blue-500/60",
    badgeBg: "bg-blue-500/15 border-blue-500/30",
    badgeText: "text-blue-400",
    icon: Code,
    websiteLink: "https://csi.coep.org.in/",
  },
  {
    id: "FINANCE",
    name: "Finance Team",
    roleTitle: "Finance Coordinator",
    description:
      "As a Finance Coordinator, you will help manage CSI's financial operations, treasury budgets, documentation, corporate communications, event pitching, and corporate sponsorship coordination. You will gain practical exposure in business correspondence, pitch deck presentations, and interacting directly with industry sponsors and corporate partners.",
    skills: ["Corporate Outreach", "Sponsorship Pitching", "Budgeting", "Negotiation", "Financial Auditing"],
    gradient: "from-emerald-600/20 via-teal-600/10 to-transparent",
    borderColor: "border-emerald-500/30 hover:border-emerald-500/60",
    badgeBg: "bg-emerald-500/15 border-emerald-500/30",
    badgeText: "text-emerald-400",
    icon: CreditCard,
  },
  {
    id: "EVENTS",
    name: "Events & Publicity Team",
    roleTitle: "Events Coordinator",
    description:
      "The Events and Publicity Team plans and executes high-energy technical events, hackathons, workshops, and flagship competitions that create tangible value for students. You will collaborate across teams to coordinate logistics, run stage operations, manage crowd engagement, and drive publicity outreach across campus.",
    skills: ["Event Operations", "Logistics Planning", "Public Speaking", "Campus PR", "Team Leadership"],
    gradient: "from-purple-600/20 via-violet-600/10 to-transparent",
    borderColor: "border-purple-500/30 hover:border-purple-500/60",
    badgeBg: "bg-purple-500/15 border-purple-500/30",
    badgeText: "text-purple-400",
    icon: Calendar,
  },
  {
    id: "DESIGN",
    name: "Design & Media Team",
    roleTitle: "Design Coordinator",
    description:
      "If you enjoy visual storytelling and creative design, the Design Team offers the opportunity to shape CSI's visual identity. You will craft promotional posters, UI mockups, brochures, merchandise, and social media reels, as well as produce and edit high-impact event aftermovies that document CSI milestones.",
    skills: ["Canva", "Video Editing", "Visual Branding", "Photoshop", "Figma"],
    gradient: "from-amber-600/20 via-orange-600/10 to-transparent",
    borderColor: "border-amber-500/30 hover:border-amber-500/60",
    badgeBg: "bg-amber-500/15 border-amber-500/30",
    badgeText: "text-amber-400",
    icon: PenTool,
  },
];

export function PortfolioShowcase() {
  return (
    <section className="space-y-10 py-6" id="portfolios-section">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <Sparkles className="w-3.5 h-3.5" /> Explore Opportunities
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Choose Your Domain of Impact
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PORTFOLIOS_DATA.map((portfolio) => {
          const Icon = portfolio.icon;
          return (
            <div
              key={portfolio.id}
              className={`rounded-2xl border bg-slate-900/60 p-6 sm:p-7 relative overflow-hidden transition-all duration-300 backdrop-blur-sm flex flex-col justify-between group shadow-xl ${portfolio.borderColor}`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${portfolio.gradient} pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity`}
              />

              <div className="relative space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${portfolio.badgeBg} ${portfolio.badgeText}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-200 transition-colors">
                        {portfolio.name}
                      </h3>
                      <span className="text-xs font-semibold text-slate-400">
                        {portfolio.roleTitle}
                      </span>
                    </div>
                  </div>

                  {portfolio.websiteLink && (
                    <a
                      href={portfolio.websiteLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors text-xs flex items-center gap-1 shrink-0"
                      title="Visit Tech Website"
                    >
                      <span>Site</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <p className="text-sm text-slate-300 leading-relaxed pt-1">
                  {portfolio.description}
                </p>

                <div className="space-y-1.5 pt-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    What You Will Learn &amp; Apply:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {portfolio.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-950/80 border border-slate-800 text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Open for Second Year students
                </span>

                <a
                  href="#application-form"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 group-hover:translate-x-0.5 transition-all cursor-pointer"
                >
                  <span>Apply for this</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
