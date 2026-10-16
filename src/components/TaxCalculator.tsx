import React, { useState, useId } from 'react';
import { STOCKHOLM_TAX_RATES } from '../data/swedenData';
import { Calculator, HelpCircle, CheckCircle, Info, ExternalLink } from 'lucide-react';

export const TaxCalculator: React.FC = () => {
  const [grossSalary, setGrossSalary] = useState<number>(36000);
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('Stockholms stad');
  const [isMemberOfChurch, setIsMemberOfChurch] = useState<boolean>(false);
  const grossSalaryInputId = useId();
  const municipalitySelectId = useId();

  const currentRateObj = STOCKHOLM_TAX_RATES.find(m => m.municipality === selectedMunicipality) || STOCKHOLM_TAX_RATES[0];
  const municipalRate = currentRateObj.ratePercent / 100;
  
  // Begravningsavgift in Stockholm is ~0.065% - 0.25% depending on parish; standard is ~0.25%
  const funeralFeeRate = 0.0025;
  // Church tax (Svenska kyrkan) is ~1.0% if member
  const churchRate = isMemberOfChurch ? 0.0105 : 0;
  
  const totalBaseTaxRate = municipalRate + funeralFeeRate + churchRate;

  // Calculation approximation based on Skatteverket tax table brackets (2024-2026)
  // Grundavdrag (Basic deduction) ~ 17,000 - 40,000 SEK/year depending on income
  const annualGross = grossSalary * 12;
  let annualGrundavdrag = 24000;
  if (annualGross < 60000) {
    annualGrundavdrag = Math.max(16800, annualGross * 0.35);
  } else if (annualGross < 150000) {
    annualGrundavdrag = 22000;
  } else if (annualGross < 400000) {
    annualGrundavdrag = 38000;
  } else {
    annualGrundavdrag = Math.max(16800, 38000 - (annualGross - 400000) * 0.04);
  }
  const monthlyGrundavdrag = annualGrundavdrag / 12;

  // Taxable income
  const taxableIncome = Math.max(0, grossSalary - monthlyGrundavdrag);
  const preliminaryMunicipalTax = taxableIncome * totalBaseTaxRate;

  // Jobbskatteavdrag (Earned income tax credit)
  // For monthly incomes between 20k-50k, jobbskatteavdrag reduces tax by approx 2,500 - 3,800 SEK/mo
  let monthlyJobbskatteavdrag = 0;
  if (grossSalary > 10000) {
    if (grossSalary <= 35000) {
      monthlyJobbskatteavdrag = (grossSalary - 10000) * 0.13 + 500;
    } else if (grossSalary <= 60000) {
      monthlyJobbskatteavdrag = 3750 + (grossSalary - 35000) * 0.02;
    } else {
      monthlyJobbskatteavdrag = 4250;
    }
  }

  // State tax (Statlig skatt): 20% on monthly income above ~51,200 SEK (615,000 SEK/year)
  const stateTaxThreshold = 51200;
  let stateTax = 0;
  if (grossSalary > stateTaxThreshold) {
    stateTax = (grossSalary - stateTaxThreshold) * 0.20;
  }

  // Net tax
  const netMunicipalTax = Math.max(0, preliminaryMunicipalTax - monthlyJobbskatteavdrag);
  const totalTax = Math.round(netMunicipalTax + stateTax);
  const netSalary = Math.round(grossSalary - totalTax);
  const effectiveTaxPercent = grossSalary > 0 ? ((totalTax / grossSalary) * 100).toFixed(1) : '0';

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden" id="tax-calculator">
      <div className="p-6 md:p-8 border-b border-stone-100 bg-[#FBF9F5]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1">
              <Calculator className="w-4 h-4 text-amber-700" />
              <span>أداة رسمية تفاعلية</span>
              <span aria-hidden="true">·</span>
              <span>محدّثة لستوكهولم 2026</span>
            </div>
            <h2 className="text-2xl font-bold text-stone-900 font-['Cairo',sans-serif]">
              حاسبة الراتب الصافي والضرائب في ستوكهولم (Brutto till Netto)
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
              احسب دخلك الفعلي بدقة بناءً على ضريبة بلديتك في ستوكهولم، مع خصم العمل (Jobbskatteavdrag) والحدود الرسمية لمصلحة الضرائب السويدية.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-500 self-start md:self-auto bg-white px-3 py-1.5 rounded-lg border border-stone-200">
            <span>المصدر: مصلحة الضرائب Skatteverket</span>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Input Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <label htmlFor={grossSalaryInputId} className="block text-sm font-semibold text-stone-800 mb-2">
                الراتب الشهري الإجمالي (Bruttolön) بالكرون السويدي
              </label>
              <div className="relative">
                <input
                  id={grossSalaryInputId}
                  type="number"
                  step="1000"
                  min="0"
                  max="300000"
                  value={grossSalary}
                  onChange={(e) => setGrossSalary(Number(e.target.value) || 0)}
                  className="w-full pl-14 pr-4 py-3 rounded-xl border border-stone-300 text-stone-900 text-lg font-bold focus:border-amber-600 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all tabular-nums text-left"
                  dir="ltr"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-semibold text-sm">
                  SEK
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2.5">
                {[25000, 32000, 38000, 45000, 55000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setGrossSalary(preset)}
                    className={`text-xs px-2.5 py-1 rounded-md border transition-colors tabular-nums ${
                      grossSalary === preset
                        ? 'bg-amber-900 text-white border-amber-900'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {preset.toLocaleString()} كرون
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor={municipalitySelectId} className="block text-sm font-semibold text-stone-800 mb-2">
                البلدية في محافظة ستوكهولم (Kommun)
              </label>
              <select
                id={municipalitySelectId}
                value={selectedMunicipality}
                onChange={(e) => setSelectedMunicipality(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-white text-stone-800 text-sm focus:border-amber-600 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all"
              >
                {STOCKHOLM_TAX_RATES.map((item) => (
                  <option key={item.municipality} value={item.municipality}>
                    {item.municipalityAr} — {item.ratePercent}%
                  </option>
                ))}
              </select>
              <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                نسبة ضريبة البلدية تشمل ضريبة المقاطعة (Region Stockholm) لدعم المستشفيات والمواصلات.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/70">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isMemberOfChurch}
                  onChange={(e) => setIsMemberOfChurch(e.target.checked)}
                  className="mt-1 w-4 h-4 text-amber-700 rounded border-stone-300 focus:ring-amber-500"
                />
                <div>
                  <span className="text-sm font-semibold text-stone-800 block">
                    عضو في الكنيسة السويدية (Kyrkoavgift)
                  </span>
                  <span className="text-xs text-stone-500 block leading-relaxed mt-0.5">
                    كشخص مسلم، أنت معفى تلقائياً من ضريبة الكنيسة (~1.05%). يُدفع فقط رسم الدفن العام (Begravningsavgift) بحوالي 0.25% الذي يضمن لكل مقيم قبراً ورعاية مجانية.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Results Card */}
          <div className="lg:col-span-7 bg-stone-900 text-white rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-6">
                <div>
                  <span className="text-xs uppercase tracking-wider text-amber-400 block font-mono">
                    الصافي المستلم في حسابك البنكي
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">الراتب الصافي (Nettolön)</h3>
                </div>
                <div className="text-left" dir="ltr">
                  <div className="text-3xl md:text-4xl font-extrabold text-amber-400 font-mono tabular-nums">
                    {netSalary.toLocaleString()} <span className="text-lg font-normal text-stone-400">SEK</span>
                  </div>
                  <span className="text-xs text-stone-400">شهرياً في حسابك البنكي</span>
                </div>
              </div>

              {/* Progress Visualizer */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs text-stone-300 font-mono">
                  <span>الصافي: {(100 - Number(effectiveTaxPercent)).toFixed(1)}%</span>
                  <span>إجمالي المقتطع: {effectiveTaxPercent}%</span>
                </div>
                <div className="h-3.5 bg-stone-800 rounded-full overflow-hidden flex" dir="ltr">
                  <div
                    className="bg-amber-500 h-full transition-all duration-300"
                    style={{ width: `${100 - Number(effectiveTaxPercent)}%` }}
                    title="الراتب الصافي"
                  />
                  <div
                    className="bg-stone-600 h-full transition-all duration-300"
                    style={{ width: `${effectiveTaxPercent}%` }}
                    title="الضريبة المقتطعة"
                  />
                </div>
              </div>

              {/* Breakdown Details */}
              <div className="space-y-3 divide-y divide-stone-800/80 text-sm">
                <div className="flex justify-between pt-2">
                  <span className="text-stone-300">الراتب الإجمالي المتفق عليه (Brutto)</span>
                  <span className="font-mono tabular-nums text-white" dir="ltr">{grossSalary.toLocaleString()} SEK</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-stone-300">
                    ضريبة البلدية والمقاطعة ({currentRateObj.ratePercent}%)
                  </span>
                  <span className="font-mono tabular-nums text-stone-200" dir="ltr">
                    -{Math.round(preliminaryMunicipalTax).toLocaleString()} SEK
                  </span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    خصم ضريبة العمل الإيجابي (Jobbskatteavdrag)
                  </span>
                  <span className="font-mono tabular-nums text-emerald-400 font-semibold" dir="ltr">
                    +{Math.round(monthlyJobbskatteavdrag).toLocaleString()} SEK
                  </span>
                </div>
                {stateTax > 0 && (
                  <div className="flex justify-between pt-2">
                    <span className="text-amber-400">
                      ضريبة الدولة (20% على الجزء فوق 51,200 كرون)
                    </span>
                    <span className="font-mono tabular-nums text-amber-400" dir="ltr">
                      -{Math.round(stateTax).toLocaleString()} SEK
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-3 font-semibold text-base">
                  <span className="text-stone-100">إجمالي الضريبة الشهرية الفعلية</span>
                  <span className="font-mono tabular-nums text-rose-300" dir="ltr">
                    {totalTax.toLocaleString()} SEK ({effectiveTaxPercent}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Note box */}
            <div className="mt-6 pt-4 border-t border-stone-800 flex items-start gap-3 bg-stone-800/40 p-3.5 rounded-xl">
              <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-stone-300 leading-relaxed">
                <strong>ملاحظة للمغترب:</strong> الضريبة الفعلية التي تدفعها ({effectiveTaxPercent}%) أقل بكثير من النسبة الاسمية ({currentRateObj.ratePercent}%) بفضل خصم ضريبة العمل. هذا المبلغ يمول التعليم المجاني، الرعاية الصحية الشاملة، ورعاية الأطفال.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
