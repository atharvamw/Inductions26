import React, { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
  textSize?: string;
}

export function MarkdownRenderer({
  content,
  className = "",
  textSize = "text-sm",
}: MarkdownRendererProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!content) {
    return <span className="text-slate-500 italic">No description provided.</span>;
  }

  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeBlockLines: string[] = [];
  let codeBlockLang = "";
  let listItems: Array<{ text: string; lineIndex: number }> = [];
  let isNumberedList = false;

  const handleCopyCode = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const parseInlineMarkdown = (text: string): React.ReactNode[] => {
    if (!text) return [];

    const parts: React.ReactNode[] = [];
    let remaining = text;
    let keyIdx = 0;

    while (remaining.length > 0) {
      const codeMatch = remaining.match(/^`([^`]+)`/);
      if (codeMatch) {
        parts.push(
          <code
            key={keyIdx++}
            className="bg-slate-900 border border-slate-800 text-indigo-300 font-mono text-[12px] px-1.5 py-0.5 rounded-md"
          >
            {codeMatch[1]}
          </code>
        );
        remaining = remaining.slice(codeMatch[0].length);
        continue;
      }

      const boldMatch = remaining.match(/^(\*\*|__)(.*?)\1/);
      if (boldMatch) {
        parts.push(
          <strong key={keyIdx++} className="font-extrabold text-slate-100">
            {parseInlineMarkdown(boldMatch[2])}
          </strong>
        );
        remaining = remaining.slice(boldMatch[0].length);
        continue;
      }

      const italicMatch = remaining.match(/^(\*|_)(.*?)\1/);
      if (italicMatch) {
        parts.push(
          <em key={keyIdx++} className="italic text-slate-200">
            {parseInlineMarkdown(italicMatch[2])}
          </em>
        );
        remaining = remaining.slice(italicMatch[0].length);
        continue;
      }

      const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        const url = linkMatch[2];
        const isExternal = url.startsWith("http://") || url.startsWith("https://");
        parts.push(
          <a
            key={keyIdx++}
            href={url}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noreferrer" : undefined}
            className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 font-semibold inline-flex items-center gap-1 transition-colors"
          >
            {linkMatch[1]}
            {isExternal && <ExternalLink className="w-3 h-3 inline-block opacity-75" />}
          </a>
        );
        remaining = remaining.slice(linkMatch[0].length);
        continue;
      }

      const nextSpecial = remaining.search(/[`*_\[]/);
      if (nextSpecial === -1) {
        parts.push(remaining);
        break;
      } else if (nextSpecial === 0) {
        parts.push(remaining[0]);
        remaining = remaining.slice(1);
      } else {
        parts.push(remaining.slice(0, nextSpecial));
        remaining = remaining.slice(nextSpecial);
      }
    }

    return parts;
  };

  const flushList = () => {
    if (listItems.length === 0) return;

    const listNodes = listItems.map(({ text: item }, idx) => (
      <li key={idx} className="my-0.5 leading-relaxed">
        {parseInlineMarkdown(item)}
      </li>
    ));

    if (isNumberedList) {
      blocks.push(
        <ol key={`ol-${blocks.length}`} className={`list-decimal list-inside space-y-1.5 my-2 text-slate-100 ${textSize} pl-1 font-medium`}>
          {listNodes}
        </ol>
      );
    } else {
      blocks.push(
        <ul key={`ul-${blocks.length}`} className={`list-disc list-inside space-y-1.5 my-2 text-slate-100 ${textSize} pl-1 font-medium`}>
          {listNodes}
        </ul>
      );
    }

    listItems = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        const codeText = codeBlockLines.join("\n");
        const blockIdx = blocks.length;
        blocks.push(
          <div key={`code-${blockIdx}`} className="my-3 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-lg">
            <div className="bg-slate-900/90 border-b border-slate-800 px-3.5 py-1.5 flex items-center justify-between">
              <span className="text-[11px] font-mono text-indigo-400 font-semibold uppercase tracking-wider">
                {codeBlockLang || "code"}
              </span>
              <button
                type="button"
                onClick={() => handleCopyCode(codeText, blockIdx)}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 px-2 py-0.5 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {copiedIndex === blockIdx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 text-[11px]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3.5 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed scrollbar-thin">
              <code>{codeText}</code>
            </pre>
          </div>
        );
        inCodeBlock = false;
        codeBlockLines = [];
        codeBlockLang = "";
      } else {
        flushList();
        inCodeBlock = true;
        codeBlockLang = line.trim().slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    if (line.startsWith("# ")) {
      flushList();
      blocks.push(
        <h1 key={`h1-${i}`} className="text-base sm:text-lg font-extrabold text-slate-100 tracking-tight my-2.5 pb-1 border-b border-slate-800/60 flex items-center gap-2">
          {parseInlineMarkdown(line.slice(2))}
        </h1>
      );
      continue;
    }
    if (line.startsWith("## ")) {
      flushList();
      blocks.push(
        <h2 key={`h2-${i}`} className="text-sm sm:text-base font-bold text-indigo-300 tracking-tight my-2 flex items-center gap-2">
          {parseInlineMarkdown(line.slice(3))}
        </h2>
      );
      continue;
    }
    if (line.startsWith("### ")) {
      flushList();
      blocks.push(
        <h3 key={`h3-${i}`} className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider my-1.5">
          {parseInlineMarkdown(line.slice(4))}
        </h3>
      );
      continue;
    }

    if (line.startsWith("> ")) {
      flushList();
      blocks.push(
        <blockquote key={`quote-${i}`} className="my-2.5 border-l-3 border-indigo-500 bg-indigo-500/10 rounded-r-xl p-3 text-xs sm:text-sm text-indigo-200 italic font-medium">
          {parseInlineMarkdown(line.slice(2))}
        </blockquote>
      );
      continue;
    }

    const unorderedMatch = line.match(/^[\s]*[-*]\s+(.*)/);
    if (unorderedMatch) {
      if (isNumberedList && listItems.length > 0) flushList();
      isNumberedList = false;
      listItems.push({ text: unorderedMatch[1], lineIndex: i });
      continue;
    }

    const orderedMatch = line.match(/^[\s]*\d+\.\s+(.*)/);
    if (orderedMatch) {
      if (!isNumberedList && listItems.length > 0) flushList();
      isNumberedList = true;
      listItems.push({ text: orderedMatch[1], lineIndex: i });
      continue;
    }

    if (line.trim() === "") {
      flushList();
      blocks.push(<div key={`space-${i}`} className="h-1.5" />);
      continue;
    }

    flushList();
    blocks.push(
      <p key={`p-${i}`} className={`${textSize} text-slate-100 leading-relaxed my-1.5`}>
        {parseInlineMarkdown(line)}
      </p>
    );
  }

  flushList();

  return <div className={`space-y-1 ${className}`}>{blocks}</div>;
}
