import React, { useState } from 'react';
import { 
  Search, ShieldCheck, ExternalLink, Sparkles, AlertCircle, 
  Send, Copy, Check, RefreshCw, HelpCircle, BookOpen, Globe
} from 'lucide-react';

interface GroundingSource {
  title: string;
  url: string;
}

interface LegalQueryResponse {
  answer: string;
  sources: GroundingSource[];
  groundingSearchQueries?: string[];
}

interface LegalAssistantGroundingProps {
  externalQuery?: string;
}

export const LegalAssistantGrounding: React.FC<LegalAssistantGroundingProps> = ({ externalQuery }) => {
  const [question, setQuestion] = useState<string>(externalQuery || '');
  const [category, setCategory] = useState<string>('هجرة وإقامة');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<LegalQueryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  React.useEffect(() => {
    if (externalQuery) {
      setQuestion(externalQuery);
    }
  }, [externalQuery]);

  const presetQuestions = [
    {
      label: 'شروط الإقامة الدائمة 2026',
      cat: 'هجرة وإقامة',
      q: 'ما هي الشروط المحدّثة للحصول على الإقامة الدائمة (PUT) من تصريح العمل أو اللجوء في السويد؟',
    },
    {
      label: 'التعامل مع السوسيال وبلاغ المدرسة',
      cat: 'أسرة وسوسيال',
      q: 'ما هي حقوقي القانونية وخطوات التصرف إذا فتحت الخدمات الاجتماعية (Socialtjänsten) تحقيقاً إثر بلاغ قلق من المدرسة؟',
    },
    {
      label: 'شرط الدخل والإعالة الذاتية',
      cat: 'هجرة وإقامة',
      q: 'كم يبلغ الحد الأدنى المطلوب للراتب ومواصفات السكن لتحقيق شرط الإعالة الذاتية (Försörjningskrav) لم الشمل؟',
    },
    {
      label: 'حقوق إنهاء العمل وفترة التجربة',
      cat: 'عمل ونقابات',
      q: 'ما هي حقوق الموظف في فترة التجربة (Provanställning) وفق قانون حماية العمل LAS وما هي مهلة الإنهاء؟',
    },
  ];

  const handleAsk = async (queryText?: string, catText?: string) => {
    const q = (queryText || question).trim();
    const c = catText || category;

    if (!q) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ask-legal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: q, category: c }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'فشل في استلام الرد من الخادم.');
      }

      setResult(data);
      if (queryText) setQuestion(queryText);
      if (catText) setCategory(catText);
    } catch (err: any) {
      console.error('Error querying legal assistant:', err);
      setError(err?.message || 'حدث خطأ في الاتصال. يرجى التأكد من تشغيل الخادم والمحاولة ثانية.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.answer) return;
    navigator.clipboard.writeText(result.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden" id="legal-qa-grounding">
      {/* Header Bar */}
      <div className="p-6 md:p-8 border-b border-stone-100 bg-[#FBF9F5]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>استشارة قانونية موثقة بلحظتها</span>
              <span aria-hidden="true">·</span>
              <span>Google Search Grounding الرسمي</span>
            </div>
            <h2 className="text-2xl font-bold text-stone-900 font-['Cairo',sans-serif]">
              اسأل المستشار القانوني السويدي الموثق
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
              اطرح أي استفسار دقيق حول قوانين الهجرة، مصلحة الضرائب، السوسيال، أو حقوق العمل في السويد، واحصل على إجابة مدعومة بالبحث المباشر في المواقع الرسمية السويدية المعتمدة.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-stone-600 bg-white px-3 py-1.5 rounded-lg border border-stone-200 self-start md:self-auto">
            <Globe className="w-3.5 h-3.5 text-amber-700" />
            <span>بحث مباشر في اللوائح السويدية 2026</span>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {/* Preset Prompt Buttons */}
        <div className="mb-6">
          <span className="text-xs font-semibold text-stone-500 block mb-2">
            أسئلة شائعة مطروحة من الجاليات يمكنك تجربتها بنقرة واحدة:
          </span>
          <div className="flex flex-wrap gap-2">
            {presetQuestions.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isLoading}
                onClick={() => handleAsk(preset.q, preset.cat)}
                className="text-xs px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer text-right disabled:opacity-50"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Box */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isLoading}
              className="px-3.5 py-3 rounded-xl border border-stone-300 bg-white text-xs font-semibold text-stone-700 focus:border-amber-700 focus:ring-2 focus:ring-amber-200 focus:outline-none"
            >
              <option value="هجرة وإقامة">قوانين الهجرة والإقامة (Migrationsverket)</option>
              <option value="أسرة وسوسيال">الأسرة والأطفال والخدمات الاجتماعية (Socialtjänsten)</option>
              <option value="ضرائب ورواتب">الضرائب والمالية (Skatteverket)</option>
              <option value="عمل ونقابات">قوانين العمل وحماية التوظيف (LAS / Arbetsmiljö)</option>
              <option value="سكن وإيجارات">حقوق المستأجرين والسكن (Hyresrätt)</option>
              <option value="تعليم وجامعات">التعليم واللغة ودعم الطلاب (CSN / SFI)</option>
            </select>

            <div className="relative flex-1">
              <textarea
                rows={2}
                placeholder="اكتب سؤالك القانوني أو الإجرائي هنا (مثال: ما هي شروط تمديد تصريح العمل إذا تم تغيير المهنة؟)..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={isLoading}
                className="w-full pr-4 pl-12 py-3 rounded-xl border border-stone-300 text-sm text-stone-900 focus:border-amber-700 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all placeholder:text-stone-400 resize-none"
              />
              <button
                type="button"
                disabled={isLoading || !question.trim()}
                onClick={() => handleAsk()}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2.5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
                title="إرسال الاستشارة"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="mt-8 p-8 bg-[#FBF9F5] rounded-2xl border border-stone-200 text-center space-y-3">
            <div className="inline-flex p-3 bg-amber-100 rounded-full text-amber-900">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
            <h4 className="text-sm font-bold text-stone-900">
              جاري فحص القوانين واللوائح السويدية الرسمية عبر Google Search Grounding...
            </h4>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              يتم البحث المباشر في مواقع Migrationsverket و Skatteverket والجريدة الرسمية السويدية لضمان دقة وتوثيق المعلومات لعام 2026.
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
            <div>
              <strong>تنبيه:</strong> {error}
            </div>
          </div>
        )}

        {/* Result Output Card */}
        {result && !isLoading && (
          <div className="mt-8 bg-[#FBF9F5] rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-base font-bold text-stone-900">
                    الإجابة القانونية المعتمدة
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 bg-white px-3 py-1.5 rounded-lg border border-stone-200 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'تم النسخ' : 'نسخ الإجابة'}</span>
                </button>
              </div>

              {/* Formatted Answer Body */}
              <div className="text-xs sm:text-sm text-stone-800 leading-relaxed whitespace-pre-line space-y-3 font-sans">
                {result.answer}
              </div>

              {/* Verified Sources from Search Grounding */}
              {result.sources && result.sources.length > 0 && (
                <div className="pt-6 border-t border-stone-200">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-amber-700" />
                    <span>المصادر الحكومية والسويدية الرسمية الموثقة (Google Grounding Sources):</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.sources.map((source, idx) => (
                      <a
                        key={idx}
                        href={source.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-200 hover:border-amber-700/50 rounded-lg text-xs text-stone-700 hover:text-amber-950 transition-colors shadow-2xs max-w-md truncate"
                      >
                        <span className="truncate">{source.title || source.url}</span>
                        <ExternalLink className="w-3 h-3 text-stone-400 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Grounding Search Queries Footnote */}
              {result.groundingSearchQueries && result.groundingSearchQueries.length > 0 && (
                <div className="pt-2 text-[11px] text-stone-400 font-mono">
                  <span>عمليات البحث المرجعية المنفذة: </span>
                  {result.groundingSearchQueries.join(' · ')}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
