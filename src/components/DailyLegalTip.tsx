import React, { useState, useEffect } from 'react';
import { DAILY_LEGAL_TIPS, DailyLegalTipItem } from '../data/dailyLegalTips';
import {
  Sparkles, ExternalLink, ChevronRight, ChevronLeft,
  Check, Share2, Lightbulb, Scale, X, ShieldCheck
} from 'lucide-react';

export const DailyLegalTip: React.FC = () => {
  // Determine daily tip index based on the day of the year
  const getDailyIndex = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return dayOfYear % DAILY_LEGAL_TIPS.length;
  };

  const [currentIndex, setCurrentIndex] = useState<number>(getDailyIndex);
  const [copied, setCopied] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  const tip: DailyLegalTipItem = DAILY_LEGAL_TIPS[currentIndex] || DAILY_LEGAL_TIPS[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % DAILY_LEGAL_TIPS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + DAILY_LEGAL_TIPS.length) % DAILY_LEGAL_TIPS.length);
  };

  const handleCopy = () => {
    const textToCopy = `نصيحة قانونية في السويد (${tip.categoryLabelAr}):\n${tip.headlineAr}\n\n${tip.summaryAr}\n\nالمرجع: ${tip.swedishLawRef} - ${tip.officialSource.nameAr}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isDismissed) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3">
        <button
          type="button"
          onClick={() => setIsDismissed(false)}
          className="text-[11px] font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-3 py-1 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-700" />
          <span>إظهار نصيحة اليوم القانونية</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-amber-50/70 border-b border-amber-200/70 text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Main Tip Badge & Content */}
          <div className="flex items-start sm:items-center gap-2.5 flex-1 min-w-0">
            <div className="flex items-center gap-1.5 shrink-0 mt-0.5 sm:mt-0">
              <span className="p-1 rounded-md bg-amber-900 text-amber-100 flex items-center justify-center">
                <Lightbulb className="w-3.5 h-3.5" />
              </span>
              <span className="text-[11px] font-extrabold text-amber-950 whitespace-nowrap">
                نصيحة اليوم:
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${tip.categoryBadgeColor}`}
              >
                {tip.categoryLabelAr}
              </span>
            </div>

            <div className="text-xs text-stone-800 leading-relaxed min-w-0">
              <strong className="text-stone-950 font-bold ml-1">
                {tip.headlineAr}:
              </strong>
              <span className="text-stone-700 font-medium line-clamp-1 sm:line-clamp-none">
                {tip.summaryAr}
              </span>
            </div>
          </div>

          {/* Right Controls: Law Ref, Next/Prev, Copy & Close */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto text-xs">
            <a
              href={tip.officialSource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-mono text-stone-600 hover:text-stone-900 bg-white/80 border border-amber-200/80 px-2 py-1 rounded-md transition-colors"
              title={`المصدر: ${tip.officialSource.nameAr} (${tip.swedishLawRef})`}
            >
              <span>{tip.officialSource.nameSv}</span>
              <ExternalLink className="w-3 h-3 text-stone-400" />
            </a>

            <div className="flex items-center border border-amber-200/80 bg-white/80 rounded-md overflow-hidden">
              <button
                type="button"
                onClick={handlePrev}
                className="p-1 text-stone-600 hover:text-stone-900 hover:bg-amber-100/60 transition-colors cursor-pointer"
                title="النصيحة السابقة"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="p-1 text-stone-600 hover:text-stone-900 hover:bg-amber-100/60 transition-colors cursor-pointer"
                title="النصيحة التالية"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="p-1 text-stone-600 hover:text-stone-900 bg-white/80 border border-amber-200/80 rounded-md hover:bg-amber-100/60 transition-colors cursor-pointer"
              title="نسخ النصيحة"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="p-1 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              title="إخفاء"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
