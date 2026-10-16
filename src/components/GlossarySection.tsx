import React, { useState } from 'react';
import { GLOSSARY_TERMS, GlossaryTerm } from '../data/swedenData';
import { BookOpen, Search, Copy, Check, Lightbulb } from 'lucide-react';

export const GlossarySection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedTerm, setCopiedTerm] = useState<string | null>(null);

  const categories = ['all', ...Array.from(new Set(GLOSSARY_TERMS.map(t => t.category)))];

  const filteredTerms = GLOSSARY_TERMS.filter(term => {
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      term.swedish.toLowerCase().includes(query) ||
      term.arabic.toLowerCase().includes(query) ||
      term.pronunciation.toLowerCase().includes(query) ||
      term.definition.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTerm(text);
    setTimeout(() => setCopiedTerm(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden" id="glossary">
      <div className="p-6 md:p-8 border-b border-stone-100 bg-[#FBF9F5]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>معجم المغترب السويدي الرسمي</span>
              <span aria-hidden="true">·</span>
              <span>Ordlista för nyanlända</span>
            </div>
            <h2 className="text-2xl font-bold text-stone-900 font-['Cairo',sans-serif]">
              دليل المصطلحات الحكومية والقانونية مع النطق والشرح العملي
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
              افهم ما تعنيه الرسائل الحكومية التي تصلك في صندوق البريد (Kivra أو البوست) وما تسألك عنه الدوائر الرسمية في السويد.
            </p>
          </div>
          <div className="text-xs text-stone-500 font-mono bg-white px-3 py-1.5 rounded-lg border border-stone-200 self-start md:self-auto">
            {filteredTerms.length} من {GLOSSARY_TERMS.length} مصطلح
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mt-6 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث بالسويدية أو بالعربية (مثال: BankID, VAB, Skatt, Personnummer)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm focus:border-amber-700 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all placeholder:text-stone-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-amber-900 text-white shadow-sm'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                {cat === 'all' ? 'جميع التصنيفات' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Terms */}
      <div className="p-6 md:p-8">
        {filteredTerms.length === 0 ? (
          <div className="text-center py-12 text-stone-500">
            <p className="text-sm">لم يتم العثور على مصطلح يطابق &quot;{searchQuery}&quot;.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="mt-3 text-xs text-amber-900 font-semibold underline"
            >
              إعادة تعيين البحث
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTerms.map((t) => (
              <div
                key={t.swedish}
                className="bg-[#FBF9F5] p-5 rounded-xl border border-stone-200/80 hover:border-amber-700/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="text-base font-bold text-stone-900 font-['Plus_Jakarta_Sans',sans-serif]" dir="ltr">
                        {t.swedish}
                      </div>
                      <div className="text-xs text-amber-900 font-semibold font-['Cairo',sans-serif]">
                        {t.arabic}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(t.swedish)}
                      className="p-1.5 text-stone-400 hover:text-stone-800 rounded-md hover:bg-white transition-colors"
                      title="نسخ المصطلح السويدي"
                    >
                      {copiedTerm === t.swedish ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-stone-500 mb-3">
                    <span className="italic font-mono">طريقة النطق: {t.pronunciation}</span>
                    <span aria-hidden="true">·</span>
                    <span>{t.category}</span>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed mb-3">
                    {t.definition}
                  </p>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-stone-200 text-[11px] text-stone-600 flex items-start gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span className="leading-relaxed"><strong>نصيحة عملية:</strong> {t.practicalTip}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
