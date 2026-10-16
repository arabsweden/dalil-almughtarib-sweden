import React from 'react';
import { Phone, Shield, ExternalLink, AlertCircle, HeartPulse, HelpCircle } from 'lucide-react';
import { OFFICIAL_SOURCES } from '../data/swedenData';

export const OfficialContactsBar: React.FC = () => {
  const hotlines = [
    { number: '112', title: 'طوارئ فورية', desc: 'إسعاف، شرطة، إطفاء (تهديد مباشر للحياة)', color: 'bg-rose-900 text-white' },
    { number: '114 14', title: 'شرطة السويد (غير طارئ)', desc: 'البلاغات العادية، بطاقة الهوية، السرقات البسيطة', color: 'bg-stone-800 text-white' },
    { number: '1177', title: 'دليل الرعاية الصحية', desc: 'استشارة ممرض مجاناً 24/7 وحجز المراكز الصحية', color: 'bg-amber-900 text-white' },
    { number: '113 13', title: 'معلومات الأزمات والحوادث', desc: 'المعلومات الرسمية أثناء الكوارث والعواصف الكبرى', color: 'bg-stone-800 text-white' },
  ];

  return (
    <div className="space-y-6" id="official-contacts">
      {/* Emergency Hotlines Strip */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-stone-800 mb-6 gap-2">
          <div>
            <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block">
              أرقام الاتصال الرسمية الإلزامية في السويد
            </span>
            <h3 className="text-xl font-bold text-white mt-0.5 font-['Cairo',sans-serif]">
              أرقام الطوارئ، الرعاية الصحية والخدمات الوطنية
            </h3>
          </div>
          <span className="text-xs text-stone-400">متاحة مجاناً من أي هاتف في السويد</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {hotlines.map((h) => (
            <div key={h.number} className="bg-stone-800/90 border border-stone-700/70 p-4 rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-stone-300">{h.title}</span>
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold text-amber-400 font-mono tracking-tight tabular-nums mb-1" dir="ltr">
                  {h.number}
                </div>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed border-t border-stone-700/60 pt-2 mt-2">
                {h.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Official Authorities Directory */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-stone-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-stone-900 font-['Cairo',sans-serif]">
              بوابة الدوائر والمؤسسات الحكومية السويدية الموثقة
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              روابط مباشرة ومؤكدة إلى البوابات الرقمية الرسمية وأرقام خدمة العملاء
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {OFFICIAL_SOURCES.map((source) => (
            <div key={source.name} className="p-4 bg-[#FBF9F5] rounded-xl border border-stone-200/80 flex flex-col justify-between hover:border-amber-700/40 transition-colors">
              <div>
                <div className="text-xs font-bold text-stone-900 mb-1 leading-snug">
                  {source.name}
                </div>
                <p className="text-xs text-stone-600 leading-relaxed mb-3">
                  {source.description}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-200 space-y-1.5 text-xs">
                <div className="text-stone-700 font-mono text-[11px]" dir="ltr">
                  📞 {source.tel}
                </div>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 text-amber-900 font-semibold hover:underline"
                >
                  <span>الموقع الرسمي</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
