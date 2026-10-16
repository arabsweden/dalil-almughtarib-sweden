import React from 'react';
import { GuideTopic } from '../data/swedenData';
import { X, ExternalLink, CheckCircle2, AlertTriangle, HelpCircle, BookOpen, Clock } from 'lucide-react';

interface TopicDetailModalProps {
  topic: GuideTopic | null;
  onClose: () => void;
}

export const TopicDetailModal: React.FC<TopicDetailModalProps> = ({ topic, onClose }) => {
  if (!topic) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-start justify-between gap-4 z-10">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
              <span className="font-semibold text-amber-900">{topic.titleSv}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-stone-400" />
                قراءة {topic.readTimeMin} دقائق
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-stone-900 font-['Cairo',sans-serif] leading-snug">
              {topic.titleAr}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors shrink-0"
            aria-label="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-8">
          {/* Summary Banner */}
          <div className="p-4 bg-[#FBF9F5] rounded-xl border border-stone-200/80">
            <p className="text-sm text-stone-700 leading-relaxed font-medium">
              {topic.summaryAr}
            </p>
            <div className="mt-3 pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs text-stone-500">
              <span>المصدر المعتمد: {topic.officialSource}</span>
              <a
                href={topic.officialUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1 text-amber-900 font-semibold hover:underline"
              >
                <span>مراجعة النص القانوني الرسمي</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Key Points */}
          <div>
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              النقاط الجوهرية التي يجب أن تعرفها
            </h3>
            <div className="space-y-2">
              {topic.keyPoints.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700 bg-stone-50 p-3 rounded-lg border border-stone-200/70 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-800 shrink-0 mt-1.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Content Chapters */}
          <div className="space-y-6">
            <h3 className="text-base font-bold text-stone-900 border-b border-stone-200 pb-2">
              التفاصيل والإرشادات القانونية والعملية
            </h3>
            {topic.detailedContent.map((chapter, idx) => (
              <div key={idx} className="space-y-3">
                <h4 className="text-sm font-bold text-stone-900">
                  {chapter.heading}
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {chapter.text}
                </p>

                {chapter.practicalAdvice && (
                  <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-950 flex items-start gap-2 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                    <span><strong>نصيحة عملية مجربة:</strong> {chapter.practicalAdvice}</span>
                  </div>
                )}

                {chapter.commonMistake && (
                  <div className="p-3 bg-rose-50/70 border border-rose-200/80 rounded-xl text-xs text-rose-950 flex items-start gap-2 leading-relaxed">
                    <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                    <span><strong>خطأ شائع يجب تفاديه:</strong> {chapter.commonMistake}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Steps */}
          {topic.steps && topic.steps.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-700" />
                خطة العمل خطوة بخطوة (Checklist)
              </h3>
              <div className="space-y-2">
                {topic.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-[#FBF9F5] rounded-xl border border-stone-200 text-xs text-stone-800">
                    <span className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQs */}
          {topic.faqs && topic.faqs.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-700" />
                أسئلة متكررة وإجاباتها الرسمية
              </h3>
              <div className="space-y-3">
                {topic.faqs.map((faq, idx) => (
                  <div key={idx} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                    <div className="text-xs font-bold text-stone-900">س: {faq.q}</div>
                    <div className="text-xs text-stone-600 leading-relaxed">ج: {faq.a}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-stone-50 px-6 py-4 border-t border-stone-200 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            المعلومات محدثة ومطابقة للقوانين السويدية السارية
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors"
          >
            إغلاق الدليل
          </button>
        </div>
      </div>
    </div>
  );
};
