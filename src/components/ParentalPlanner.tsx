import React, { useState } from 'react';
import { Baby, Calendar, Heart, ShieldCheck, DollarSign, Clock } from 'lucide-react';

export const ParentalPlanner: React.FC = () => {
  const [childrenCount, setChildrenCount] = useState<number>(2);
  const [parentSalary, setParentSalary] = useState<number>(34000);
  const [activeTab, setActiveTab] = useState<'leave' | 'benefit' | 'vab'>('leave');

  // Daily parental benefit calculation based on SGI (Sjukpenninggrundande inkomst)
  // SGI cap is approx 10 prisbasbelopp (~573,000 SEK annual / 47,750 SEK monthly)
  const cappedMonthlySalary = Math.min(parentSalary, 47750);
  const annualSgi = cappedMonthlySalary * 12;
  // SGI day compensation is roughly SGI * 0.97 * 0.8 / 365
  const dailyIncomeLevelBenefit = Math.round((annualSgi * 0.97 * 0.8) / 365);
  const minimumDailyBenefit = 180; // SEK per day for the 90 minimum level days

  // Child benefit (Barnbidrag) + Flerbarnstillägg (Multi-child supplement)
  const basePerChild = 1250;
  const baseTotal = childrenCount * basePerChild;
  let flerbarnstillagg = 0;
  if (childrenCount === 2) flerbarnstillagg = 150;
  else if (childrenCount === 3) flerbarnstillagg = 730;
  else if (childrenCount === 4) flerbarnstillagg = 1740;
  else if (childrenCount >= 5) flerbarnstillagg = 2990 + (childrenCount - 5) * 1250;

  const totalMonthlyBarnbidrag = baseTotal + flerbarnstillagg;

  // VAB calculation (Vård av barn): around 80% of salary per day
  const dailyVabBenefit = Math.round((annualSgi * 0.97 * 0.8) / 260);

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden" id="family-planner">
      <div className="p-6 md:p-8 border-b border-stone-100 bg-[#FBF9F5]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1">
              <Baby className="w-4 h-4 text-amber-700" />
              <span>نظام الأسرة والطفل في السويد</span>
              <span aria-hidden="true">·</span>
              <span>Försäkringskassan</span>
            </div>
            <h2 className="text-2xl font-bold text-stone-900 font-['Cairo',sans-serif]">
              حاسبة ومخطط إجازة الوالدين وعلاوات الأطفال (Föräldraledighet)
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
              احسب أيام إجازة الأبوة والأمومة (480 يوماً)، مبالغ التعويض اليومي، وعلاوة الطفل الشهرية المعفاة من الضريبة بالكامل.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg self-start md:self-auto">
            <button
              onClick={() => setActiveTab('leave')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'leave'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              إجازة الوالدين (480 يوم)
            </button>
            <button
              onClick={() => setActiveTab('benefit')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'benefit'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              علاوة الطفل (Barnbidrag)
            </button>
            <button
              onClick={() => setActiveTab('vab')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'vab'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              إجازة رعاية الطفل المريض (VAB)
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {activeTab === 'leave' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-stone-800 mb-2">
                  راتب الوالد/الوالدة الشهري قبل الضريبة (Bruttolön)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="1000"
                    min="10000"
                    max="100000"
                    value={parentSalary}
                    onChange={(e) => setParentSalary(Number(e.target.value) || 0)}
                    className="w-full pl-14 pr-4 py-3 rounded-xl border border-stone-300 text-stone-900 text-lg font-bold focus:border-amber-600 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all tabular-nums text-left"
                    dir="ltr"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-semibold text-sm">
                    SEK
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-1.5">
                  الحد الأقصى للراتب المحسوب لتعويض إجازة الوالدين هو حوالي 47,750 كرون شهرياً (10 prisbasbelopp).
                </p>
              </div>

              <div className="bg-[#FBF9F5] p-4 rounded-xl border border-stone-200/80 space-y-3">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-700" />
                  تقسيم الـ 480 يوماً قانونياً
                </h4>
                <div className="space-y-2 text-xs text-stone-700">
                  <div className="flex justify-between items-center py-1 border-b border-stone-200">
                    <span>390 يوماً بمستوى الدخل (Sjukpenningnivå)</span>
                    <strong className="text-stone-900 font-mono">حوالي 80% من الراتب</strong>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-stone-200">
                    <span>90 يوماً بالمستوى الأدنى (Lägstanivå)</span>
                    <strong className="text-stone-900 font-mono">180 كرون / يوم</strong>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span>90 يوماً محجوزة حصراً للأب + 90 يوماً للأم</span>
                    <strong className="text-amber-800">لا يمكن التنازل عنها</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-stone-50 rounded-2xl p-6 border border-stone-200">
              <h3 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-700" />
                تقدير التعويض اليومي والشهري من Försäkringskassan
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-stone-200">
                  <span className="text-xs text-stone-500 block mb-1">التعويض اليومي (لمدة 390 يوم)</span>
                  <div className="text-2xl font-bold text-stone-900 font-mono tabular-nums" dir="ltr">
                    ~{dailyIncomeLevelBenefit} <span className="text-sm font-normal text-stone-500">SEK/يوم</span>
                  </div>
                  <span className="text-xs text-emerald-700 block mt-1">يخضع لضريبة الدخل العادية</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200">
                  <span className="text-xs text-stone-500 block mb-1">التعويض الشهري الكامل التقريبي</span>
                  <div className="text-2xl font-bold text-amber-800 font-mono tabular-nums" dir="ltr">
                    ~{(dailyIncomeLevelBenefit * 30).toLocaleString()} <span className="text-sm font-normal text-stone-500">SEK</span>
                  </div>
                  <span className="text-xs text-stone-500 block mt-1">إذا أخذت 7 أيام أسبوعياً</span>
                </div>
              </div>

              <div className="space-y-3 text-xs text-stone-600 leading-relaxed bg-white p-4 rounded-xl border border-stone-200">
                <p>
                  <strong>💡 نصيحة ذكية للمغتربين:</strong> يمكنك توفير أيام الإجازة عبر أخذ 4 أو 5 أيام فقط في الأسبوع بدلاً من 7 أيام لتمديد فترة بقائك مع طفلك في المنزل لأكثر من سنة ونصف، مع الحفاظ على راتب مريح.
                </p>
                <p>
                  <strong>⚠️ تنبيه حماية الدخل (SGI):</strong> بعد بلوغ الطفل عامه الأول، يجب أخذ 5 أيام إجازة والدية على الأقل في الأسبوع أو العمل 100% للحفاظ على مستوى دخلك التأميني المحمي (SGI).
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'benefit' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-stone-800 mb-2">
                  عدد الأطفال في الأسرة (دون سن 16 عاماً)
                </label>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setChildrenCount(num)}
                      className={`w-11 h-11 rounded-xl font-bold text-base transition-all ${
                        childrenCount === num
                          ? 'bg-amber-900 text-white shadow-sm'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-stone-500 mt-2">
                  تمنح الدولة 1,250 كرون شهرياً لكل طفل، بالإضافة إلى علاوة الأطفال المتعددين (Flerbarnstillägg) بدءاً من الطفل الثاني.
                </p>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <ShieldCheck className="w-4 h-4" />
                  ميزة استثنائية: معفاة تماماً من الضرائب
                </div>
                <p className="leading-relaxed">
                  أموال علاوة الأطفال (Barnbidrag) لا تخصم منها أي ضريبة، وتودع في 20 من كل شهر تلقائياً بمجرد تسجيل ولادة الطفل أو وصوله إلى السويد وإصدار رقمه الشخصي.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 bg-stone-900 text-white rounded-2xl p-6 md:p-8">
              <span className="text-xs uppercase tracking-wider text-amber-400 font-mono block">
                مجموع المساعدات الشهرية للأسرة
              </span>
              <div className="text-3xl md:text-4xl font-extrabold text-amber-400 font-mono mt-1 mb-6 tabular-nums" dir="ltr">
                {totalMonthlyBarnbidrag.toLocaleString()} <span className="text-lg font-normal text-stone-400">SEK / شهر</span>
              </div>

              <div className="space-y-3 border-t border-stone-800 pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-300">علاوة الأطفال الأساسية ({childrenCount} × 1,250 كرون)</span>
                  <span className="font-mono text-white" dir="ltr">{baseTotal.toLocaleString()} SEK</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-400">علاوة الأطفال المتعددين (Flerbarnstillägg)</span>
                  <span className="font-mono text-emerald-400 font-bold" dir="ltr">+{flerbarnstillagg.toLocaleString()} SEK</span>
                </div>
                <div className="flex justify-between border-t border-stone-800 pt-3 font-bold text-base">
                  <span className="text-white">المجموع السنوي المعفى من الضرائب</span>
                  <span className="font-mono text-amber-400" dir="ltr">{(totalMonthlyBarnbidrag * 12).toLocaleString()} SEK</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vab' && (
          <div className="bg-[#FBF9F5] p-6 rounded-2xl border border-stone-200 space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-100 rounded-xl text-amber-800 shrink-0">
                <Heart className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-stone-900">
                  ما هي إجازة رعاية الطفل المريض (VAB - Vård av barn)؟
                </h3>
                <p className="text-sm text-stone-700 leading-relaxed">
                  إذا أصيب طفلك بنزلة برد، حمى أو أي مرض واستدعى بقاءك معه في المنزل أو أخذه للطبيب، يعوضك صندوق التأمينات (Försäkringskassan) عن الأيام التي غبت فيها عن عملك بنسبة تقارب 80% من دخلك المعتاد.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-white p-4 rounded-xl border border-stone-200">
                <div className="text-xs text-stone-500 mb-1">التعويض اليومي المتوقع لراتبك</div>
                <div className="text-xl font-bold text-stone-900 font-mono" dir="ltr">
                  ~{dailyVabBenefit} SEK/يوم
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-stone-200">
                <div className="text-xs text-stone-500 mb-1">الحد الأقصى للأيام سنوياً</div>
                <div className="text-xl font-bold text-amber-800 font-mono">
                  120 يوماً / طفل
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-stone-200">
                <div className="text-xs text-stone-500 mb-1">السن القانوني المشمول</div>
                <div className="text-xl font-bold text-stone-900 font-mono">
                  من 8 أشهر حتى 12 سنة
                </div>
              </div>
            </div>

            <div className="text-xs text-stone-600 bg-white p-3.5 rounded-xl border border-stone-200 leading-relaxed">
              <strong>خطوات التبليغ السليمة:</strong> أولاً أبلغ صاحب العمل في الصباح، ثم ادخل على تطبيق (Försäkringskassan) وسجل بلاغ VAB في نفس اليوم. بعد عودة الطفل للروضة أو المدرسة، تقدم بطلب دفع التعويض (Ansök om ersättning). إذا زاد المرض عن 7 أيام متواصلة، ستحتاج لتقرير طبي من المركز الصحي 1177.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
