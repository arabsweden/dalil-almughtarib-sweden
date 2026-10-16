import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 space-y-3">
            <h3 className="text-lg font-bold text-white font-['Cairo',sans-serif]">
              دليل المغترب في السويد | بوابة ستوكهولم
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              مبادرة معرفية وتطبيق تفاعلي يهدف لمساعدة الجالية العربية والمسلمة في السويد على الاندماج الواعي، فهم القوانين الرسمية، وحماية الأسرة والتمتع بكافة الحقوق المدنية.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-500 pt-2">
              <span>جميع المعلومات مستندة إلى اللوائح الحكومية السويدية لعام 2026</span>
            </div>
          </div>

          <div className="md:col-span-3 space-y-2 text-xs">
            <h4 className="text-sm font-bold text-white font-['Cairo',sans-serif] mb-3">
              أقسام الدليل المعتمدة
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li><a href="#community-events" className="hover:text-white transition-colors">تقويم الفعاليات الثقافية والمجتمعية للجالية</a></li>
              <li><a href="#legal-qa-grounding" className="hover:text-white transition-colors">المستشار القانوني الموثق (Google Search Grounding)</a></li>
              <li><a href="#podcast-section" className="hover:text-white transition-colors">بودكاست صدى السويد (حوارات الأسرة والهوية)</a></li>
              <li><a href="#tax-calculator" className="hover:text-white transition-colors">حاسبة ضريبة ستوكهولم والراتب الصافي</a></li>
              <li><a href="#family-planner" className="hover:text-white transition-colors">إجازة الوالدين وعلاوة الأطفال</a></li>
              <li><a href="#citizenship-checker" className="hover:text-white transition-colors">مؤشر أهلية الجنسية والإقامة الدائمة</a></li>
              <li><a href="#muslim-life" className="hover:text-white transition-colors">مساجد ستوكهولم وأوقات الصلاة</a></li>
              <li><a href="#glossary" className="hover:text-white transition-colors">معجم المصطلحات السويدية الرسمية</a></li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-2 text-xs">
            <h4 className="text-sm font-bold text-white font-['Cairo',sans-serif] mb-3">
              إخلاء مسؤولية قانوني
            </h4>
            <p className="text-stone-400 leading-relaxed">
              هذا الموقع يوفر معلومات إرشادية وحاسبات تقريبية مبنية على البيانات المتاحة من الهيئات الرسمية (Skatteverket, Migrationsverket, Försäkringskassan). لا يُعد هذا الدليل بديلاً عن المشورة القانونية الفردية من محامٍ أو مستشار مختص في القضايا المعقدة.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} دليل المغترب في السويد. صُمم للمغتربين في ستوكهولم وكافة مدن السويد.</p>
          <div className="flex items-center gap-4">
            <a href="https://www.skatteverket.se" target="_blank" rel="noreferrer" className="hover:text-stone-300">Skatteverket</a>
            <a href="https://www.migrationsverket.se" target="_blank" rel="noreferrer" className="hover:text-stone-300">Migrationsverket</a>
            <a href="https://www.forsakringskassan.se" target="_blank" rel="noreferrer" className="hover:text-stone-300">Försäkringskassan</a>
            <a href="https://www.1177.se" target="_blank" rel="noreferrer" className="hover:text-stone-300">1177 Vårdguiden</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
