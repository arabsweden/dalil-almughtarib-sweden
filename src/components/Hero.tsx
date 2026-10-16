import React from 'react';
import { Search, Compass, BookOpen, Shield, Calculator, Baby, Heart, Radio, Calendar, Scale } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
}) => {
  const categoryShortcuts = [
    { id: 'all', label: 'كافة الأقسام', icon: BookOpen },
    { id: 'advisor', label: 'المستشار القانوني الشخصي', icon: Scale },
    { id: 'events', label: 'فعاليات الجالية', icon: Calendar },
    { id: 'podcast', label: 'بودكاست صدى السويد', icon: Radio },
    { id: 'family', label: 'تربية الأولاد والسوسيال', icon: Baby },
    { id: 'law', label: 'القانون والحقوق', icon: Shield },
    { id: 'tax', label: 'الضريبة والراتب', icon: Calculator },
    { id: 'education', label: 'الدراسة واللغة SFI', icon: BookOpen },
    { id: 'life', label: 'الحياة اليومية والمساجد', icon: Compass },
    { id: 'tourism', label: 'السياحة والطبيعة', icon: Heart },
  ];

  return (
    <div className="relative border-b border-stone-200 bg-[#FBF9F5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text & Search Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Unboxed Metadata */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-stone-500 uppercase tracking-wider">
              <span className="text-amber-900 font-bold">بوابة ستوكهولم الشاملة</span>
              <span aria-hidden="true">·</span>
              <span>دليل رسمي موثق</span>
              <span aria-hidden="true">·</span>
              <span>تحديثات 2026</span>
              <span aria-hidden="true">·</span>
              <span>للمغترب العربي والمسلم</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 font-['Cairo',sans-serif] leading-[1.2] text-balance">
              دليلك الموثوق لحياة متوازنة ومستقرة في مملكة السويد
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl">
              إجابات مؤكدة مبنية على القوانين الرسمية: الهجرة والإقامة الدائمة، السوسيال وحماية الطفل، الضرائب وحساب الراتب الصافي في ستوكهولم، الدراسة، والمساجد والحياة المجتمعية.
            </p>

            {/* Interactive Search Bar */}
            <div className="relative max-w-xl">
              <Search className="w-5 h-5 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ابحث عن أي موضوع (مثلاً: السوسيال، الجنسية، الراتب الصافي، SFI، صلاة الجمعة)..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pr-12 pl-4 py-3.5 rounded-xl border border-stone-300 bg-white text-stone-900 shadow-sm focus:border-amber-900 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all placeholder:text-stone-400 text-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 font-semibold"
                >
                  مسح
                </button>
              )}
            </div>

            {/* Category Segmented Buttons */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-stone-500 block mb-2.5">
                تصفح المحاور الستة الأساسية:
              </span>
              <div className="flex flex-wrap gap-2">
                {categoryShortcuts.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => onSelectCategory(cat.id)}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                        isActive
                          ? 'bg-amber-900 text-white shadow-sm'
                          : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-200' : 'text-stone-500'}`} />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Stockholm Hero Image Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-md aspect-16/10 lg:aspect-4/3 bg-stone-100 group">
              <img
                src="/src/assets/images/hero_stockholm_guide_1792141152681.jpg"
                alt="بانوراما العاصمة السويدية ستوكهولم"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent flex flex-col justify-end p-5 text-white">
                <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold mb-1">
                  <span>ستوكهولم (Stockholm)</span>
                  <span aria-hidden="true">·</span>
                  <span>عاصمة الجمال والفرص</span>
                </div>
                <p className="text-xs text-stone-200 leading-snug">
                  تضم أكثر من 26 بلدية وأكثر من 2.4 مليون نسمة في إقليم العاصمة، مع تنوع سكاني وثقافي واسع.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
