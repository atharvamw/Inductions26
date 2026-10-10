import { z } from "zod";

export const PORTFOLIOS = ["TECHNICAL", "FINANCE", "EVENTS", "DESIGN"] as const;
export type PortfolioType = (typeof PORTFOLIOS)[number];

export const PORTFOLIO_LABELS: Record<PortfolioType, string> = {
  TECHNICAL: "Technical Team",
  FINANCE: "Finance Team",
  EVENTS: "Events Team",
  DESIGN: "Design Team",
};

export const misSchema = z
  .string()
  .trim()
  .regex(/^[0-9]{9}$/, "MIS must be exactly 9 digits");

export const collegeEmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Invalid email address format")
  .refine(
    (email) => email.endsWith("@coeptech.ac.in"),
    "College Email must end with @coeptech.ac.in"
  );

export const portfolioPreferencesSchema = z
  .array(z.enum(PORTFOLIOS))
  .length(3, "You must select exactly 3 preferences")
  .refine(
    (prefs) => new Set(prefs).size === 3,
    "Preferences must contain 3 distinct portfolios without duplicates"
  );

export const createInductionApplicationSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full Name must be at least 2 characters")
      .max(100, "Full Name cannot exceed 100 characters"),
    mis: misSchema,
    collegeEmail: collegeEmailSchema,
    preference1: z.enum(PORTFOLIOS, {
      message: "First portfolio preference is required",
    }),
    preference2: z.enum(PORTFOLIOS, {
      message: "Second portfolio preference is required",
    }),
    preference3: z.enum(PORTFOLIOS, {
      message: "Third portfolio preference is required",
    }),
    whyJoin: z
      .string()
      .trim()
      .min(10, "Why are you interested in joining this portfolio must be at least 10 characters")
      .max(2000, "Answer cannot exceed 2000 characters"),
    experience: z
      .string()
      .trim()
      .max(2000, "Experience cannot exceed 2000 characters")
      .optional()
      .nullable()
      .transform((val) => (val === undefined || val === null ? "" : val)),
    skillsAndTools: z
      .string()
      .trim()
      .min(5, "Skills and tools must be at least 5 characters")
      .max(2000, "Skills and tools cannot exceed 2000 characters"),
    contribution: z
      .string()
      .trim()
      .min(10, "Contribution to CSI COEP must be at least 10 characters")
      .max(2000, "Contribution cannot exceed 2000 characters"),
    whySelect: z
      .string()
      .trim()
      .min(10, "Why should we select you must be at least 10 characters")
      .max(2000, "Answer cannot exceed 2000 characters"),
    linkedinUrl: z
      .string()
      .trim()
      .optional()
      .nullable()
      .transform((val) => {
        if (!val || val.trim() === "") return null;
        let url = val.trim();
        if (!/^https?:\/\//i.test(url)) {
          url = `https://${url}`;
        }
        return url;
      })
      .refine((val) => {
        if (!val) return true;
        try {
          const parsed = new URL(val);
          return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch {
          return false;
        }
      }, "Please enter a valid LinkedIn URL (e.g. https://linkedin.com/in/username)"),
    githubUrl: z
      .string()
      .trim()
      .optional()
      .nullable()
      .transform((val) => {
        if (!val || val.trim() === "") return null;
        let url = val.trim();
        if (!/^https?:\/\//i.test(url)) {
          url = `https://${url}`;
        }
        return url;
      })
      .refine((val) => {
        if (!val) return true;
        try {
          const parsed = new URL(val);
          return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch {
          return false;
        }
      }, "Please enter a valid GitHub URL (e.g. https://github.com/username)"),
  })
  .refine(
    (data) =>
      data.preference1 !== data.preference2 &&
      data.preference1 !== data.preference3 &&
      data.preference2 !== data.preference3,
    {
      message: "First, second, and third portfolio preferences must all be distinct",
      path: ["preference2"],
    }
  );

export type CreateInductionApplicationInput = z.infer<
  typeof createInductionApplicationSchema
>;

export interface InductionStatus {
  isOpen: boolean;
  manualIsOpen: boolean;
  isAutoClosed: boolean;
  autoCloseAt: string | null;
  closedTitle: string;
  closedMessage: string;
  updatedAt: string;
}
