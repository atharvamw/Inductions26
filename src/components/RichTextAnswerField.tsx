import React, { useRef, useState } from "react";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Eye,
  Edit3,
  AlertCircle,
} from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface RichTextAnswerFieldProps {
  label: string;
  description?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
  minChars?: number;
  maxChars?: number;
  error?: string;
  rows?: number;
}

export function RichTextAnswerField({
  label,
  description,
  value,
  onChange,
  placeholder,
  required = true,
  minChars = 10,
  maxChars = 2000,
  error,
  rows = 5,
}: RichTextAnswerFieldProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormatting = (prefix: string, suffix = "", defaultText = "") => {
    if (!textareaRef.current) {
      onChange(value + prefix + defaultText + suffix);
      return;
    }

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);

    const contentToWrap = selected || defaultText;
    const replacement = prefix + contentToWrap + suffix;
    const newText = value.substring(0, start) + replacement + value.substring(end);

    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + contentToWrap.length;
      textarea.setSelectionRange(
        selected ? start : start + prefix.length,
        selected ? start + replacement.length : newCursorPos
      );
    }, 0);
  };

  const charCount = value.trim().length;

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <label className="text-base sm:text-lg font-bold text-white tracking-[0.2px] flex items-start sm:items-center gap-2 leading-snug">
            <span>{label}</span>
            {required ? (
              <span className="text-rose-400 font-bold text-base" title="Required field">*</span>
            ) : (
              <span className="text-[11px] font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full">(Optional)</span>
            )}
          </label>

          <span className="text-xs text-slate-400 font-mono shrink-0">
            {charCount} / {maxChars} chars {minChars > 0 && charCount < minChars && <span className="text-amber-400 font-sans text-[11px]">(min {minChars})</span>}
          </span>
        </div>

        {description && (
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{description}</p>
        )}
      </div>

      <div
        className={`rounded-2xl border transition-colors overflow-hidden ${
          error
            ? "border-rose-500/60 bg-rose-950/10"
            : "border-slate-800 bg-slate-950 focus-within:border-indigo-500/80"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-900/80 border-b border-slate-800/80">
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={activeTab === "preview"}
              onClick={() => insertFormatting("**", "**", "bold text")}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-colors"
              title="Bold (**text**)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={activeTab === "preview"}
              onClick={() => insertFormatting("*", "*", "italic text")}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-colors"
              title="Italic (*text*)"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-slate-800 mx-0.5" />
            <button
              type="button"
              disabled={activeTab === "preview"}
              onClick={() => insertFormatting("# ", "", "Main Heading")}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-colors"
              title="Heading 1 (# Heading)"
            >
              <Heading1 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={activeTab === "preview"}
              onClick={() => insertFormatting("## ", "", "Subheading")}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-colors"
              title="Heading 2 (## Heading)"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-slate-800 mx-0.5" />
            <button
              type="button"
              disabled={activeTab === "preview"}
              onClick={() => insertFormatting("- ", "", "Bullet point")}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-colors"
              title="Bulleted List (- item)"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={activeTab === "preview"}
              onClick={() => insertFormatting("1. ", "", "First item")}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-colors"
              title="Numbered List (1. item)"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center p-0.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("write")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === "write"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Edit3 className="w-3 h-3" /> Write
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === "preview"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Eye className="w-3 h-3" /> Preview
            </button>
          </div>
        </div>

        {activeTab === "write" ? (
          <textarea
            ref={textareaRef}
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxChars}
            className="w-full p-4 bg-transparent text-slate-100 placeholder:text-slate-600 text-sm focus:outline-none resize-y leading-relaxed font-sans"
          />
        ) : (
          <div className="p-4 min-h-[120px] bg-slate-950/50 text-slate-200 text-sm leading-relaxed overflow-y-auto">
            {value.trim() ? (
              <MarkdownRenderer content={value} />
            ) : (
              <span className="text-slate-500 italic">No text written yet. Switch to &quot;Write&quot; tab to formulate your response.</span>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="text-xs text-rose-400 flex items-center gap-1.5 pt-0.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
