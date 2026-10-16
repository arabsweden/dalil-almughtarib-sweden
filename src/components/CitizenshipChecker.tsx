import React, { useState } from 'react';
import { Shield, CheckCircle2, AlertTriangle, XCircle, ArrowRight, BookOpen } from 'lucide-react';

export const CitizenshipChecker: React.FC = () => {
  const [residenceType, setResidenceType] = useState<'put' | 'tut'>('put');
  const [permitReason, setPermitReason] = useState<'work' | 'refugee' | 'family'>('work');
  const [yearsInSweden, setYearsInSweden] = useState<number>(5);
  const [traveledMoreThanSixWeeks, setTraveledMoreThanSixWeeks] = useState<boolean>(false);
  const [hasKronofogdenDebt, setHasKronofogdenDebt] = useState<boolean>(false);
  const [hasCriminalRecord, setHasCriminalRecord] = useState<boolean>(false);
  const [hasStableIncome, setHasStableIncome] = useState<boolean>(true);

  // Evaluation logic
  const requiredYears = permitReason === 'refugee' ? 4 : 5;
  const meetsYears = yearsInSweden >= requiredYears;
  const isPut = residenceType === 'put';

  let canApplyCitizenship = false;
  let citizenshipBlockers: string[] = [];
  let citizenshipWarnings: string[] = [];

  if (!isPut) {
    citizenshipBlockers.push('حيازة الإقامة الدائمة (PUT) شرط أساسي مسبق؛ لا يمكن التقديم على الجنسية بوجود إقامة مؤقتة (TUT).');
  }

  if (!meetsYears) {
    citizenshipBlockers.push(`مدة الإقامة الفعلية غير كافية حالياً. تحتاج لإكمال ${requiredYears} سنوات متواصلة (أنت الآن ${yearsInSweden} سنوات).`);
  }

  if (hasKronofogdenDebt) {
    citizenshipBlockers.push('وجود ديون مسجلة لدى مصلحة الجباية (Kronofogden) يؤدي للرفض الفوري؛ يجب سدادها والانتظار سنتين كاملتين على الأقل.');
  }

  if (hasCriminalRecord) {
    citizenshipBlockers.push('أي سوابق جنائية أو غرامات جزائية تفرض فترة انتظار إضافية (Karenstid) تمتد من سنة إلى 7 سنوات بحسب الجرم.');
  }

  if (traveledMoreThanSixWeeks) {
    citizenshipWarnings.push('السفر خارج السويد لأكثر من 6 أسابيع في سنة تقويمية واحدة يخصم المدة الزائدة من سنوات إقامتك المحسوبة للجنسية.');
  }

  canApplyCitizenship = citizenshipBlockers.length === 0;

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden" id="citizenship-checker">
      <div className="p-6 md:p-8 border-b border-stone-100 bg-[#FBF9F5]">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1">
          <Shield className="w-4 h-4 text-amber-700" />
          <span>مقياس مصلحة الهجرة السويدية</span>
          <span aria-hidden="true">·</span>
          <span>Migrationsverket 2026</span>
        </div>
        <h2 className="text-2xl font-bold text-stone-900 font-['Cairo',sans-serif]">
          محدد الأهلية التفاعلي للجنسية السويدية والإقامة الدائمة (PUT)
        </h2>
        <p className="text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
          أجب عن الأسئلة التالية لتحصل على تقييم فوري ودقيق لمدى جاهزية ملفك لطلب الإقامة الدائمة أو الجنسية السويدية، وتجنب دفع رسوم التقديم دون استيفاء الشروط.
        </p>
      </div>

      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Question Form */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                1. نوع الإقامة الحالية في السويد
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setResidenceType('put')}
                  className={`p-3 text-right rounded-xl border text-sm font-semibold transition-all ${
                    residenceType === 'put'
                      ? 'border-amber-900 bg-amber-50/50 text-amber-950'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  إقامة دائمة (PUT)
                  <span className="block text-xs font-normal text-stone-500 mt-0.5">Permanent uppehållstillstånd</span>
                </button>
                <button
                  type="button"
                  onClick={() => setResidenceType('tut')}
                  className={`p-3 text-right rounded-xl border text-sm font-semibold transition-all ${
                    residenceType === 'tut'
                      ? 'border-amber-900 bg-amber-50/50 text-amber-950'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  إقامة مؤقتة (TUT)
                  <span className="block text-xs font-normal text-stone-500 mt-0.5">Tidsbegränsat uppehållstillstånd</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                2. سبب منح الإقامة الأصلية
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'work', label: 'عمل / استثمار', sv: 'Arbetstillstånd' },
                  { id: 'refugee', label: 'لجوء وحماية', sv: 'Flyktingstatus' },
                  { id: 'family', label: 'لم شمل أسري', sv: 'Anknytning' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPermitReason(item.id as any)}
                    className={`p-2.5 text-center rounded-xl border text-xs font-semibold transition-all ${
                      permitReason === item.id
                        ? 'border-amber-900 bg-amber-50/50 text-amber-950'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div>{item.label}</div>
                    <div className="text-[10px] text-stone-400 font-normal mt-0.5">{item.sv}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  3. عدد سنوات الإقامة القانونية في السويد
                </label>
                <span className="text-sm font-bold text-amber-900 font-mono tabular-nums">{yearsInSweden} سنوات</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={yearsInSweden}
                onChange={(e) => setYearsInSweden(Number(e.target.value))}
                className="w-full accent-amber-900"
              />
              <div className="flex justify-between text-[11px] text-stone-400 font-mono mt-1">
                <span>سنة واحدة</span>
                <span>4 سنوات (لجوء)</span>
                <span>5 سنوات (معتاد)</span>
                <span>10+ سنوات</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={traveledMoreThanSixWeeks}
                  onChange={(e) => setTraveledMoreThanSixWeeks(e.target.checked)}
                  className="mt-1 w-4 h-4 text-amber-900 rounded border-stone-300"
                />
                <span className="text-xs text-stone-700 leading-relaxed">
                  سافرت خارج السويد لأكثر من 6 أسابيع متتالية أو متفرقة في سنة واحدة
                </span>
              </label>

              <label className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasKronofogdenDebt}
                  onChange={(e) => setHasKronofogdenDebt(e.target.checked)}
                  className="mt-1 w-4 h-4 text-rose-800 rounded border-stone-300"
                />
                <span className="text-xs text-stone-700 leading-relaxed">
                  يوجد لدي دين حالي أو متأخرات مسجلة لدى مصلحة الجباية السويدية (Kronofogden)
                </span>
              </label>

              <label className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasCriminalRecord}
                  onChange={(e) => setHasCriminalRecord(e.target.checked)}
                  className="mt-1 w-4 h-4 text-rose-800 rounded border-stone-300"
                />
                <span className="text-xs text-stone-700 leading-relaxed">
                  صدر بحقي حكم قضائي أو غرامة جزائية في السويد خلال السنوات الأخيرة
                </span>
              </label>
            </div>
          </div>

          {/* Results Analysis */}
          <div className="lg:col-span-6 bg-stone-50 rounded-2xl p-6 md:p-8 border border-stone-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                {canApplyCitizenship ? (
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-stone-900">
                    {canApplyCitizenship
                      ? 'مؤهل للتقديم على الجنسية السويدية!'
                      : 'الملف يحتاج إلى استيفاء شروط إضافية'}
                  </h3>
                  <span className="text-xs text-stone-500">
                    تقييم وفق الضوابط السارية لمصلحة الهجرة (Migrationsverket)
                  </span>
                </div>
              </div>

              {/* Blockers */}
              {citizenshipBlockers.length > 0 && (
                <div className="space-y-2 mb-4">
                  <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block">
                    الشروط غير المستوفاة حالياً:
                  </span>
                  {citizenshipBlockers.map((b, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-stone-700 bg-rose-50/70 border border-rose-200 p-2.5 rounded-lg leading-relaxed">
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Warnings */}
              {citizenshipWarnings.length > 0 && (
                <div className="space-y-2 mb-4">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                    تنبيهات هامة للمدة:
                  </span>
                  {citizenshipWarnings.map((w, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-stone-700 bg-amber-50/70 border border-amber-200 p-2.5 rounded-lg leading-relaxed">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              )}

              {canApplyCitizenship && (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-900 leading-relaxed mb-4 space-y-2">
                  <p className="font-semibold">
                    ✓ استوفيت شرط المدة ({requiredYears} سنوات) ولديك إقامة دائمة وسجل نظيف من الديون والجرائم.
                  </p>
                  <p>
                    يمكنك الآن تقديم طلبك إلكترونياً عبر BankID على موقع Migrationsverket ودفع الرسوم (1500 كرون للشخص البالغ). ستحتاج لإرسال جواز سفرك الأصلي فقط عندما تطلبه مصلحة الهجرة للتحقق.
                  </p>
                </div>
              )}
            </div>

            {/* Next Step Box */}
            <div className="mt-4 pt-4 border-t border-stone-200">
              <h4 className="text-xs font-bold text-stone-900 mb-2">الخطوة القادمة الموصى بها:</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {!isPut
                  ? 'ركز أولاً على تثبيت عقد عملك (Tillsvidare) براتب كافٍ لتأمين شروط الإقامة الدائمة (PUT) قبل التفكير في الجنسية.'
                  : hasKronofogdenDebt
                  ? 'قم فوراً بتسديد أي مبالغ لـ Kronofogden، واحصل على شهادة خطية تفيد بانتهاء الملف، واحسب سنتين كاملتين من تاريخ آخر سداد.'
                  : 'راجع المقال التفصيلي في قسم "القانون والحقوق" لمعرفة كيفية استخدام المادة 12 لتسريع قرارك.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
