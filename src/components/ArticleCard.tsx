import React from 'react';
import { GuideTopic } from '../data/swedenData';
import { ArrowLeft, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ArticleCardProps {
  topic: GuideTopic;
  onReadMore: (topic: GuideTopic) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ topic, onReadMore }) => {
  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'law': return 'القانون والحقوق';
      case 'tax': return 'الضرائب والمالية';
      case 'family': return 'تربية الأطفال والأسرة';
      case 'education': return 'الدراسة واللغة';
      case 'life': return 'الحياة اليومية';
      case 'tourism': return 'السياحة والطبيعة';
      default: return 'دليل عام';
    }
  };

  return (
    <article className="bg-white rounded-2xl border border-stone-200/80 p-6 flex flex-col justify-between hover:border-amber-700/40 hover:shadow-sm transition-all group">
      <div>
        {/* Unboxed clean metadata with typographic separators */}
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-2.5">
          <span className="font-semibold text-amber-900">{getCategoryLabel(topic.category)}</span>
          <span aria-hidden="true">·</span>
          <span>{topic.titleSv}</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1 font-mono">
            <Clock className="w-3 h-3 text-stone-400" />
            {topic.readTimeMin} د
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-stone-900 font-['Cairo',sans-serif] group-hover:text-amber-950 transition-colors leading-snug mb-2.5">
          {topic.titleAr}
        </h3>

        {/* Summary */}
        <p className="text-xs text-stone-600 leading-relaxed mb-4">
          {topic.summaryAr}
        </p>

        {/* Key Points snippet */}
        <div className="space-y-1.5 mb-5 border-t border-stone-100 pt-3">
          {topic.keyPoints.slice(0, 2).map((point, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-stone-700 leading-snug">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-700 shrink-0 mt-1.5" />
              <span className="line-clamp-2">{point}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
        <span className="text-[11px] text-stone-500">
          المصدر: {topic.officialSource}
        </span>
        <button
          type="button"
          onClick={() => onReadMore(topic)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 hover:text-amber-950 group/btn transition-colors cursor-pointer"
        >
          <span>قراءة التفاصيل القانونية</span>
          <ArrowLeft className="w-3.5 h-3.5 group-hover/btn:-translate-x-1 transition-transform" />
        </button>
      </div>
    </article>
  );
};
