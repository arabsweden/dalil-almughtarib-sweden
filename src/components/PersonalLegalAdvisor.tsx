import React, { useState } from 'react';
import {
  LEGAL_CASE_STUDIES,
  CONTRACT_CHECKLIST,
  LegalCaseStudy,
  CaseOption,
  ContractCheckItem,
} from '../data/legalCaseStudies';
import {
  Scale,
  Briefcase,
  Building2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  User,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Check,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

interface PersonalLegalAdvisorProps {
  onAskCustomQuestion?: (query: string) => void;
}

export const PersonalLegalAdvisor: React.FC<PersonalLegalAdvisorProps> = ({ onAskCustomQuestion }) => {
  const [activeAdvisorTab, setActiveAdvisorTab] = useState<'simulations' | 'checklist'>('simulations');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCase, setSelectedCase] = useState<LegalCaseStudy>(LEGAL_CASE_STUDIES[0]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFullLegalDetails, setShowFullLegalDetails] = useState<boolean>(true);

  // Contract checklist state: record "yes" | "no" | "unsure" for each item id
  const [checklistAnswers, setChecklistAnswers] = useState<Record<string, 'yes' | 'no' | 'unsure'>>({});

  const categories = [
    { id: 'all', label: 'كافة الحالات' },
    { id: 'work_contract', label: 'عقود العمل وقانون LAS' },
    { id: 'skatteverket', label: 'مصلحة الضرائب Skatteverket' },
    { id: 'permits_pay', label: 'الأجور وتصاريح العمل' },
    { id: 'leave_family', label: 'الإجازات وحماية الأسرة' },
  ];

  const filteredCases = LEGAL_CASE_STUDIES.filter((c) =>
    selectedCategory === 'all' ? true : c.category === selectedCategory
  );

  const activeOption: CaseOption | undefined = selectedCase.options.find(
    (opt) => opt.id === selectedOptionId
  );

  // Compute contract safety score
  const totalChecklistItems = CONTRACT_CHECKLIST.length;
  const answeredCount = Object.keys(checklistAnswers).length;
  const yesCount = Object.values(checklistAnswers).filter((v) => v === 'yes').length;
  const noCount = Object.values(checklistAnswers).filter((v) => v === 'no').length;
  const unsureCount = Object.values(checklistAnswers).filter((v) => v === 'unsure').length;
  const safetyScore = totalChecklistItems > 0 ? Math.round((yesCount / totalChecklistItems) * 100) : 0;

  const handleSelectCase = (c: LegalCaseStudy) => {
    setSelectedCase(c);
    setSelectedOptionId(null);
  };

  const handleSetChecklistAnswer = (itemId: string, answer: 'yes' | 'no' | 'unsure') => {
    setChecklistAnswers((prev) => ({
      ...prev,
      [itemId]: answer,
    }));
  };

  const handleResetChecklist = () => {
    setChecklistAnswers({});
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden" id="personal-legal-advisor">
      {/* Top Banner / Editorial Header */}
      <div className="p-6 md:p-8 border-b border-stone-200 bg-[#FBF9F5]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 uppercase tracking-wider mb-1">
              <Scale className="w-4 h-4 text-amber-800" />
              <span>المستشار القانوني الشخصي</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 font-mono text-emerald-800 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                قوانين العمل والضرائب السويدية المحدثة
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900 font-['Cairo',sans-serif]">
              محاكي القضايا القانونية وعقود العمل في السويد
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
              تعلّم كيف تتصرف كالمحترفين في المواقف الحساسة: فحص وتوقيع عقود العمل، التعامل مع مصلحة الضرائب (Skatteverket)، حماية حقوقك ضد الفصل التعسفي وفق قانون (LAS)، ومتطلبات تصاريح العمل والإجازات الأسرية.
            </p>
          </div>

          {/* Sub-Tabs Switcher */}
          <div className="flex items-center p-1 bg-stone-100 rounded-xl shrink-0 self-start md:self-auto border border-stone-200">
            <button
              type="button"
              onClick={() => setActiveAdvisorTab('simulations')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeAdvisorTab === 'simulations'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>محاكي الحالات الواقعية</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveAdvisorTab('checklist')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeAdvisorTab === 'checklist'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>مُدقّق عقد العمل السويدي</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeAdvisorTab === 'simulations' ? (
        <div className="p-6 md:p-8 space-y-8">
          {/* Category Pills Filter */}
          <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-stone-100">
            <span className="text-xs font-bold text-stone-500 ml-2">تصنيف الحالات:</span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (5 cols): Case Cards List */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-1">
                <span>اختر حالة للمحاكاة ({filteredCases.length})</span>
                <span className="text-stone-400">انقر للتطبيق</span>
              </div>

              {filteredCases.map((c) => {
                const isSelected = c.id === selectedCase.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectCase(c)}
                    className={`w-full text-right p-4 rounded-xl border transition-all cursor-pointer block ${
                      isSelected
                        ? 'bg-amber-50/60 border-amber-800/40 shadow-xs ring-1 ring-amber-800/20'
                        : 'bg-[#FBF9F5] border-stone-200 hover:bg-stone-50 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-md">
                        {c.badgeAr}
                      </span>
                      <span className="text-[11px] font-mono text-stone-500">
                        مستوى {c.difficulty}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-stone-900 leading-snug line-clamp-2">
                      {c.titleAr}
                    </h4>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-stone-500 border-t border-stone-200/60 pt-2">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-stone-400" />
                        {c.protagonist.name} ({c.protagonist.role})
                      </span>
                      <span className="flex items-center gap-1 font-mono text-stone-400">
                        <MapPin className="w-3 h-3" />
                        {c.protagonist.city}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column (8 cols): Interactive Simulator Workspace */}
            <div className="lg:col-span-8 space-y-6">
              {/* Scenario Stage Card */}
              <div className="bg-[#FBF9F5] border border-stone-200 rounded-2xl p-6 relative">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-amber-800" />
                    {selectedCase.categoryLabelAr}
                  </span>
                  <span className="text-xs font-mono text-stone-500 bg-white px-2.5 py-1 rounded-md border border-stone-200">
                    {selectedCase.titleSv}
                  </span>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-stone-900 leading-snug mb-3 font-['Cairo',sans-serif]">
                  {selectedCase.titleAr}
                </h3>

                {/* Scenario Narrative */}
                <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200/90 shadow-2xs text-stone-800 text-xs sm:text-sm leading-relaxed mb-4">
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-stone-500">
                    <span className="w-2 h-2 rounded-full bg-amber-600" />
                    <span>سيناريو الواقع العملي:</span>
                  </div>
                  {selectedCase.scenarioAr}
                </div>

                {/* The Dilemma Question */}
                <div className="p-3 bg-amber-100/60 border border-amber-300/60 rounded-xl text-xs sm:text-sm font-bold text-amber-950 flex items-center gap-2 mb-5">
                  <HelpCircle className="w-4 h-4 text-amber-800 shrink-0" />
                  <span>{selectedCase.keyQuestionAr}</span>
                </div>

                {/* Interactive Options Choice Bar */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-stone-700 block">
                    اضغط لاختيار الإجراء الذي تراه صائباً لتكتشف حكم القانون السويدي وعواقبه:
                  </span>

                  <div className="grid grid-cols-1 gap-3">
                    {selectedCase.options.map((opt, idx) => {
                      const isChosen = selectedOptionId === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSelectedOptionId(opt.id)}
                          className={`w-full text-right p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                            isChosen
                              ? opt.verdictType === 'correct'
                                ? 'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-400'
                                : opt.verdictType === 'danger'
                                ? 'bg-rose-50 border-rose-400 ring-1 ring-rose-400'
                                : 'bg-amber-50 border-amber-400 ring-1 ring-amber-400'
                              : 'bg-white border-stone-200 hover:border-stone-400 hover:bg-stone-50/80'
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold font-mono mt-0.5 ${
                              isChosen
                                ? opt.verdictType === 'correct'
                                  ? 'bg-emerald-600 text-white'
                                  : opt.verdictType === 'danger'
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-amber-600 text-white'
                                : 'bg-stone-100 text-stone-700 border border-stone-300'
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>

                          <div className="flex-1">
                            <h5 className="text-xs sm:text-sm font-bold text-stone-900 leading-snug">
                              {opt.titleAr}
                            </h5>
                            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                              {opt.descriptionAr}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Verdict Feedback Box */}
                {activeOption && (
                  <div
                    className={`mt-6 p-5 rounded-2xl border transition-all ${
                      activeOption.verdictType === 'correct'
                        ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                        : activeOption.verdictType === 'danger'
                        ? 'bg-rose-50/90 border-rose-300 text-rose-950'
                        : 'bg-amber-50/90 border-amber-300 text-amber-950'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2 font-bold text-sm">
                      {activeOption.verdictType === 'correct' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                      ) : activeOption.verdictType === 'danger' ? (
                        <XCircle className="w-5 h-5 text-rose-700 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
                      )}
                      <span>{activeOption.verdictTitleAr}</span>
                    </div>

                    <div className="space-y-2 text-xs sm:text-sm leading-relaxed">
                      <div>
                        <strong className="block text-stone-900 mb-0.5">التحليل والسند القانوني:</strong>
                        <p className="text-stone-700">{activeOption.legalAnalysisAr}</p>
                      </div>

                      <div className="pt-1 border-t border-black/10">
                        <strong className="block text-stone-900 mb-0.5">التبعات والنتائج الواقعية:</strong>
                        <p className="text-stone-700">{activeOption.consequencesAr}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Comprehensive Legal Roadmap & Authority Foundation */}
              <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-stone-900" />
                    <h4 className="text-base font-bold text-stone-900">
                      المرجعية القانونية وخطة العمل الموصى بها
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowFullLegalDetails(!showFullLegalDetails)}
                    className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{showFullLegalDetails ? 'طي التفاصيل' : 'عرض التفاصيل'}</span>
                    {showFullLegalDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {showFullLegalDetails && (
                  <div className="space-y-6">
                    {/* Law Articles Box */}
                    <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <strong className="text-xs font-bold text-stone-900">
                          {selectedCase.legalFoundation.lawNameAr}
                        </strong>
                        <span className="text-xs font-mono text-stone-600 bg-white px-2 py-0.5 rounded border border-stone-200">
                          {selectedCase.legalFoundation.lawNameSv}
                        </span>
                      </div>
                      <p className="text-xs text-stone-700 leading-relaxed">
                        {selectedCase.legalFoundation.summaryAr}
                      </p>

                      {/* Applicable articles */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {selectedCase.legalFoundation.applicableArticles.map((art, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] bg-white border border-stone-300 text-stone-700 px-2 py-0.5 rounded font-mono"
                          >
                            {art}
                          </span>
                        ))}
                      </div>

                      {selectedCase.legalFoundation.recentUpdates2024_2026 && (
                        <div className="mt-2 pt-2 border-t border-stone-200 text-xs text-amber-900 flex items-start gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                          <span>
                            <strong>تحديثات 2024-2026:</strong> {selectedCase.legalFoundation.recentUpdates2024_2026}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Step-by-Step Action Roadmap */}
                    <div>
                      <h5 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-3">
                        خطة العمل الإجرائية خطوة بخطوة:
                      </h5>
                      <div className="space-y-3">
                        {selectedCase.actionRoadmap.map((item) => (
                          <div
                            key={item.step}
                            className="flex items-start gap-3 p-3.5 rounded-xl border border-stone-200 bg-[#FBF9F5]"
                          >
                            <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-bold font-mono shrink-0">
                              {item.step}
                            </span>
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                                <h6 className="text-xs sm:text-sm font-bold text-stone-900">
                                  {item.title}
                                </h6>
                                {item.deadline && (
                                  <span className="text-[11px] font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                    المهلة: {item.deadline}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-stone-600 leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Essential Documents Needed */}
                    <div>
                      <h5 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                        الوثائق والمستندات الرسمية التي يجب توفيرها:
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {selectedCase.essentialDocuments.map((doc, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg border border-stone-200 bg-white text-xs space-y-1"
                          >
                            <div className="font-bold text-stone-900">{doc.nameAr}</div>
                            <div className="font-mono text-[11px] text-stone-500">{doc.nameSv}</div>
                            <div className="text-[11px] text-stone-600">{doc.whyNeeded}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Authorities & Links */}
                    <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-stone-500">الجهات الرسمية المرجعية:</span>
                        {selectedCase.officialAuthorities.map((auth, idx) => (
                          <a
                            key={idx}
                            href={auth.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-medium transition-colors"
                          >
                            <span>{auth.nameAr}</span>
                            <ExternalLink className="w-3 h-3 text-stone-400" />
                          </a>
                        ))}
                      </div>

                      {onAskCustomQuestion && (
                        <button
                          type="button"
                          onClick={() => onAskCustomQuestion(selectedCase.titleAr)}
                          className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                          <span>طرح استفسار مخصص حول هذه الحالة</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Tab 2: Interactive Swedish Employment Contract Checklist (Arbetsavtals-koll) */
        <div className="p-6 md:p-8 space-y-8">
          {/* Header Description & Gauge */}
          <div className="bg-[#FBF9F5] rounded-2xl border border-stone-200 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-2">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                  أداة الفحص الذاتي التفاعلية
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-stone-900">
                  مُدقّق عقد العمل السويدي (Arbetsavtals-koll)
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  قبل توقيع أي عقد عمل في السويد، راجع البنود الـ 7 الحاسمة وفق قانون العمل السويدي (LAS) واتفاقيات سوق العمل. حدد وضع كل بند في عقدك لتحصل على تقييم فوري لمستوى الأمان والحماية القانونية.
                </p>
              </div>

              {/* Safety Score Card */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-stone-200 p-5 text-center shadow-2xs space-y-3">
                <span className="text-xs font-semibold text-stone-500 block">
                  درجة أمان وحصانة العقد
                </span>

                <div className="flex items-center justify-center gap-2">
                  <span
                    className={`text-4xl font-extrabold font-mono ${
                      safetyScore >= 80
                        ? 'text-emerald-700'
                        : safetyScore >= 50
                        ? 'text-amber-700'
                        : 'text-stone-700'
                    }`}
                  >
                    {safetyScore}%
                  </span>
                  <span className="text-xs text-stone-400 font-mono">
                    ({yesCount} من {totalChecklistItems} بنود مكتملة)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      safetyScore >= 80
                        ? 'bg-emerald-600'
                        : safetyScore >= 50
                        ? 'bg-amber-500'
                        : 'bg-stone-400'
                    }`}
                    style={{ width: `${safetyScore}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                  <span>تمت الإجابة: {answeredCount}/{totalChecklistItems}</span>
                  {answeredCount > 0 && (
                    <button
                      type="button"
                      onClick={handleResetChecklist}
                      className="text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>إعادة البدء</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-stone-800 flex items-center gap-2">
              <span>البنود والشروط الإلزامية في عقود العمل السويدية:</span>
              <span className="text-xs font-normal text-stone-500">
                (أجب بنعم، لا، أو غير متأكد)
              </span>
            </h4>

            <div className="space-y-3">
              {CONTRACT_CHECKLIST.map((item, idx) => {
                const answer = checklistAnswers[item.id];
                return (
                  <div
                    key={item.id}
                    className={`p-4 sm:p-5 rounded-xl border transition-all ${
                      answer === 'yes'
                        ? 'bg-emerald-50/40 border-emerald-300'
                        : answer === 'no'
                        ? 'bg-rose-50/40 border-rose-300'
                        : answer === 'unsure'
                        ? 'bg-amber-50/40 border-amber-300'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      {/* Left: Question details */}
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-mono text-stone-500 font-bold">#{idx + 1}</span>
                          <span className="font-bold text-stone-900">{item.categoryAr}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-stone-500 text-[11px] bg-stone-100 px-1.5 py-0.5 rounded">
                            {item.swedishTerm}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              item.importance === 'حرج جداً'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {item.importance}
                          </span>
                        </div>

                        <h5 className="text-sm sm:text-base font-bold text-stone-900">
                          {item.questionAr}
                        </h5>

                        <p className="text-xs text-stone-600 leading-relaxed">
                          {item.explanationAr}
                        </p>

                        {/* If answered NO or UNSURE, show specific warning tip */}
                        {(answer === 'no' || answer === 'unsure') && (
                          <div className="mt-2 p-2.5 rounded-lg bg-white border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                            <span>
                              <strong>تنبيه قانوني:</strong> {item.dangerAlertAr}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Right: 3 Action Radio Buttons */}
                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-start">
                        <button
                          type="button"
                          onClick={() => handleSetChecklistAnswer(item.id, 'yes')}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                            answer === 'yes'
                              ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>نعم، موجود</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSetChecklistAnswer(item.id, 'no')}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                            answer === 'no'
                              ? 'bg-rose-700 text-white border-rose-700 shadow-2xs'
                              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>غير موجود</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSetChecklistAnswer(item.id, 'unsure')}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                            answer === 'unsure'
                              ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>لست متأكداً</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Result Guidance Box */}
          <div className="p-6 rounded-2xl bg-[#FBF9F5] border border-stone-200 space-y-4">
            <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>نصائح ختامية للمفاوضة وتوقيع العقود في السويد:</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed">
              <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-1">
                <strong className="block text-stone-900">1. استشارة النقابة قبل التوقيع</strong>
                <p className="text-stone-600">
                  يحق لك كمرشح إرسال مسودة العقد للنقابة المتخصصة (مثل Unionen أو Sveriges Ingenjörer) لتدقيقها مجاناً قبل التوقيع.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-1">
                <strong className="block text-stone-900">2. لا توقع على تنازلات شفهية</strong>
                <p className="text-stone-600">
                  أي وعود تتعلق بعلاوات، سيارة عمل، أو سداد تكاليف السفر يجب أن تسجل خطياً في الملحق (Bilaga)، فالقانون السويدي يرجح العقود المكتوبة عند النزاع.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-1">
                <strong className="block text-stone-900">3. الانضمام لصندوق البطالة (A-kassa)</strong>
                <p className="text-stone-600">
                  سجل نفسك في صندوق البطالة من أول يوم عمل، فالأقدمية لا تبدأ إلا من تاريخ سداد الاشتراك الشهري (حوالي 140 كرونة/شهر).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
