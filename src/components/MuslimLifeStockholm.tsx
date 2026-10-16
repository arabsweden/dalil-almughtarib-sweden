import React, { useState } from 'react';
import { STOCKHOLM_MOSQUES, MosqueInfo } from '../data/swedenData';
import { Compass, Moon, MapPin, Navigation, Info, ExternalLink, ShieldCheck, Sun } from 'lucide-react';

export const MuslimLifeStockholm: React.FC = () => {
  const [selectedMosque, setSelectedMosque] = useState<MosqueInfo>(STOCKHOLM_MOSQUES[0]);
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);

  // Prayer times calculation for Stockholm (approximate standard prayer timetable for Stockholm latitude 59.33° N)
  // Autumn/Spring day sample
  const today = new Date();
  const dateFormatted = today.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const prayerTimesStockholm = [
    { name: 'الفجر (Fajr)', time: '04:52', note: 'وفق التقدير النسبي المعتمد لمساجد ستوكهولم' },
    { name: 'الشروق (Soluppgång)', time: '06:58', note: 'شروق الشمس الفلكي في ستوكهولم' },
    { name: 'الظهر (Dhuhr)', time: '12:35', note: 'زوال الشمس' },
    { name: 'العصر (Asr)', time: '15:18', note: 'مذهب الجمهور (ظل المثل الواحد)' },
    { name: 'المغرب (Maghrib)', time: '18:10', note: 'غروب قرص الشمس تماماً' },
    { name: 'العشاء (Isha)', time: '19:42', note: 'غيبوبة الشفق / التقدير المعتمد' },
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <div className="space-y-8" id="muslim-life">
      {/* Editorial Overview with Mosque Image */}
      <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-2">
                <Moon className="w-4 h-4 text-amber-700" />
                <span>دليل الجالية والمسلم في ستوكهولم</span>
                <span aria-hidden="true">·</span>
                <span>مركز المجتمع والأسرة</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-stone-900 font-['Cairo',sans-serif] leading-tight mb-3">
                المساجد، مواقيت الصلاة في خطوط العرض العليا، والحياة الإسلامية
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                يعيش في ستوكهولم مجتمع إسلامي متنوع وحيوي. يوفر هذا الدليل معلومات موثقة حول المساجد الكبرى، أوقات الصلاة في الصيف والشتاء وفق فتاوى مساجد السويد والمجلس الأوروبي، وشبكة المتاجر الحلال، بالإضافة إلى الحقوق القانونية لدفن المسلمين في المقابر المخصصة.
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-xs text-stone-500 block">خط العرض للعاصمة</span>
                <span className="text-sm font-bold text-stone-900 font-mono">59.3293° N</span>
              </div>
              <div>
                <span className="text-xs text-stone-500 block">اتجاه القبلة من ستوكهولم</span>
                <span className="text-sm font-bold text-amber-800 font-mono">138° جنوب شرق</span>
              </div>
              <div>
                <span className="text-xs text-stone-500 block">صلاة الجمعة المركزية</span>
                <span className="text-sm font-bold text-stone-900">خطبتان لتفادي الزحام</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full bg-stone-100">
            <img
              src="/src/assets/images/stockholm_community_mosque_1792141154079.jpg"
              alt="مسجد ستوكهولم الكبير"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent flex items-end p-4">
              <span className="text-xs text-stone-200 font-medium">
                مسجد ستوكهولم الكبير (جامع زايد) في سودرمالم
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Prayer Schedule & High Latitude Rulings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Daily Schedule Card */}
        <div className="lg:col-span-7 bg-stone-900 text-white rounded-2xl p-6 md:p-8 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-800 mb-6 gap-2">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block">
                مواقيت الصلاة المعتمدة في ستوكهولم
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">{dateFormatted}</h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-stone-400 bg-stone-800/80 px-3 py-1.5 rounded-lg border border-stone-700/60 self-start sm:self-auto">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>القبلة: 138° (SE)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {prayerTimesStockholm.map((p) => (
              <div
                key={p.name}
                className="bg-stone-800/70 border border-stone-700/60 p-3.5 rounded-xl hover:border-amber-500/50 transition-colors"
              >
                <span className="text-xs text-stone-400 block mb-1">{p.name}</span>
                <div className="text-2xl font-extrabold text-amber-400 font-mono tracking-tight tabular-nums" dir="ltr">
                  {p.time}
                </div>
                <span className="text-[10px] text-stone-400 block mt-1 line-clamp-1">{p.note}</span>
              </div>
            ))}
          </div>

          {/* High Latitude Guidance Box */}
          <div className="mt-6 p-4 bg-stone-800/50 rounded-xl border border-stone-700/70 space-y-2">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-400" />
              فقه مواقيت الصلاة في السويد (الليالي البيضاء وقصر النهار)
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              <strong>في الصيف (مايو – يوليو):</strong> لا يغيب الشفق الفلكي الأحمر في ستوكهولم وتستمر الليالي البيضاء. تعتمد مساجد ستوكهولم جدول <strong>التقدير النسبي</strong>، ويجوز عند المشقة البالغة للعاملين والطلاب الجمع الصوري أو جمع التقديم/التأخير بين المغرب والعشاء وفق فتوى المجلس الأوروبي للإفتاء والبحوث.
            </p>
            <p className="text-xs text-stone-300 leading-relaxed">
              <strong>في الشتاء (نوفمبر – يناير):</strong> يقصر النهار كثيراً وتتقارب صلوات الظهر والعصر والمغرب خلال ساعات قليلة، لذا يحرص الموظفون على أخذ استراحة قصيرة للوضوء والصلاة في أوقاتها.
            </p>
          </div>
        </div>

        {/* Stockholm Mosques Directory */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 md:p-8 border border-stone-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-stone-900 font-['Cairo',sans-serif]">
              أهم مساجد محافظة ستوكهولم
            </h3>
            <span className="text-xs text-stone-500">اختر مسجداً للتفاصيل</span>
          </div>

          {/* Mosque Selector List */}
          <div className="space-y-2">
            {STOCKHOLM_MOSQUES.map((m) => (
              <button
                key={m.nameSv}
                type="button"
                onClick={() => setSelectedMosque(m)}
                className={`w-full text-right p-3 rounded-xl border transition-all ${
                  selectedMosque.nameSv === m.nameSv
                    ? 'border-amber-900 bg-amber-50/50 text-amber-950 shadow-sm'
                    : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="text-sm font-bold">{m.nameAr}</div>
                <div className="text-xs text-stone-500 flex items-center gap-2 mt-0.5">
                  <span>{m.nameSv}</span>
                  <span aria-hidden="true">·</span>
                  <span>{m.district}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Selected Mosque Details */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-3 mt-4">
            <div>
              <span className="text-xs font-semibold text-amber-900 block mb-1">العنوان ومحطة المواصلات:</span>
              <div className="text-xs text-stone-800 font-mono flex items-center justify-between bg-white p-2.5 rounded-lg border border-stone-200" dir="ltr">
                <span className="truncate">{selectedMosque.address}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(selectedMosque.address)}
                  className="text-xs text-amber-900 hover:underline font-sans ml-2 shrink-0 font-medium"
                >
                  {copiedAddress ? 'تم النسخ!' : 'نسخ'}
                </button>
              </div>
              <div className="text-xs text-stone-600 mt-1.5 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span>{selectedMosque.transitStation}</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-stone-700 block mb-1.5">الخدمات والمرافق:</span>
              <ul className="text-xs text-stone-600 space-y-1">
                {selectedMosque.facilities.map((fac, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-700 shrink-0" />
                    <span>{fac}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-stone-500 border-t border-stone-200 pt-2 leading-relaxed">
              {selectedMosque.notes}
            </p>
          </div>
        </div>
      </div>

      {/* Islamic Burials & Halal Food Hubs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Islamic Cemeteries */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-stone-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>حقوق الدفن الإسلامي في السويد</span>
          </div>
          <h3 className="text-lg font-bold text-stone-900">
            المقابر الإسلامية ورسوم الدفن (Begravningsavgift)
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            وفق القانون السويدي، كل مقيم مسجل يدفع شهرياً رسم الدفن العام عبر الضرائب. هذا الرسم يضمن قانونياً لكل متوفى مسلماً كان أم غيره قطعة قبر وتجهيز مكان الدفن مجاناً في مقابر البلدية.
          </p>
          <div className="space-y-2 text-xs text-stone-700 bg-[#FBF9F5] p-3.5 rounded-xl border border-stone-200">
            <div className="font-semibold text-stone-900">أقسام دفن المسلمين في ستوكهولم:</div>
            <ul className="space-y-1 list-disc list-inside text-stone-600">
              <li><strong>مقبرة سكوغشيركوغوردن (Skogskyrkogården):</strong> تضم قسماً إسلامياً كبيراً باتجاه القبلة، وهي مدرجة في قائمة اليونسكو.</li>
              <li><strong>مقبرة ستراند كيركوغوردن (Strandkyrkogården):</strong> في منطقة تينيسكوج جنوب ستوكهولم، وفيها مصلى وقاعات مجهزة.</li>
            </ul>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed">
            <strong>نصيحة للجالية:</strong> ينصح بالاشتراك في "صندوق الجنائز الإسلامي" التابع لمسجد ستوكهولم الكبير (Begravningskassan) برسم رمزي بسيط يغطي تكاليف الغُسل، الكفن، ونقل الجثمان والتنسيق مع البلدية.
          </p>
        </div>

        {/* Halal Food & Markets */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-stone-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-amber-700" />
            <span>التسوق واللحوم الحلال</span>
          </div>
          <h3 className="text-lg font-bold text-stone-900">
            أبرز مناطق ومتاجر الأغذية الحلال في ستوكهولم
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            تنتشر في مختلف أحياء ستوكهولم أسواق متخصصة توفر اللحوم المذبوحة حلالاً والمنتجات العربية والشرقية بأسعار تنافسية:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <strong className="block text-stone-900 mb-0.5">شيستا (Kista)</strong>
              <span className="text-stone-600">سوق Kista Grossen والمتاجر حول المركز.</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <strong className="block text-stone-900 mb-0.5">اسكار هولمن (Skärholmen)</strong>
              <span className="text-stone-600">سوق الخضار المفتوح والقصابين المعتمدين.</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <strong className="block text-stone-900 mb-0.5">تينستا ورينكيبي (Tensta/Rinkeby)</strong>
              <span className="text-stone-600">متاجر متخصصة في الأطعمة والحلويات والتوابل.</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <strong className="block text-stone-900 mb-0.5">بوتشيركا (Fittja/Alby)</strong>
              <span className="text-stone-600">متاجر اللحوم والمخابز العربية التركية.</span>
            </div>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed">
            بالإضافة إلى ذلك، توفر سلاسل السوبرماركت السويدية الكبرى مثل ICA Maxi و Willy:s و Coop أجنحة مخصصة للمنتجات الحلال المعتمدة (Halalmärkt).
          </p>
        </div>
      </div>
    </div>
  );
};
