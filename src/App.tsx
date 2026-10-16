import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ArticleCard } from './components/ArticleCard';
import { TaxCalculator } from './components/TaxCalculator';
import { ParentalPlanner } from './components/ParentalPlanner';
import { CitizenshipChecker } from './components/CitizenshipChecker';
import { MuslimLifeStockholm } from './components/MuslimLifeStockholm';
import { GlossarySection } from './components/GlossarySection';
import { PodcastSection } from './components/PodcastSection';
import { PersonalLegalAdvisor } from './components/PersonalLegalAdvisor';
import { LegalAssistantGrounding } from './components/LegalAssistantGrounding';
import { CommunityEventsCalendar } from './components/CommunityEventsCalendar';
import { DailyLegalTip } from './components/DailyLegalTip';
import { AdminAudioStudio } from './components/AdminAudioStudio';
import { OfficialContactsBar } from './components/OfficialContactsBar';
import { TopicDetailModal } from './components/TopicDetailModal';
import { Footer } from './components/Footer';
import { GUIDE_TOPICS, GuideTopic } from './data/swedenData';
import { BookOpen, Sparkles, Shield, Calculator, Baby, Heart, Compass, CheckCircle2, ArrowRight, Radio } from 'lucide-react';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalTopic, setActiveModalTopic] = useState<GuideTopic | null>(null);
  const [prefilledLegalQuestion, setPrefilledLegalQuestion] = useState<string>('');
  const [showAdminAudio, setShowAdminAudio] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('admin') === 'audio';
    }
    return false;
  });

  // Filtered topics based on search and category
  const filteredTopics = useMemo(() => {
    return GUIDE_TOPICS.filter((t) => {
      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        t.titleAr.toLowerCase().includes(query) ||
        t.titleSv.toLowerCase().includes(query) ||
        t.summaryAr.toLowerCase().includes(query) ||
        t.keyPoints.some((p) => p.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleNavigateSection = (sectionId: string) => {
    if (sectionId === 'all') {
      setSelectedCategory('all');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (sectionId === 'advisor') {
      const el = document.getElementById('personal-legal-advisor');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'events') {
      const el = document.getElementById('community-events');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'assistant') {
      const el = document.getElementById('legal-qa-grounding');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'podcast') {
      setSelectedCategory('podcast');
      const el = document.getElementById('podcast-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'law' || sectionId === 'family' || sectionId === 'tax') {
      setSelectedCategory(sectionId);
      const el = document.getElementById(sectionId === 'tax' ? 'tax-calculator' : sectionId === 'family' ? 'family-planner' : 'articles-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'muslim') {
      const el = document.getElementById('muslim-life');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'glossary') {
      const el = document.getElementById('glossary');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'contacts') {
      const el = document.getElementById('official-contacts');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (showAdminAudio) {
    return <AdminAudioStudio onCloseAdmin={() => setShowAdminAudio(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-900 font-['Cairo',sans-serif] selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      {/* Top Bar Header adhering to Top Bar contract */}
      <Header onNavigateSection={handleNavigateSection} activeSection={selectedCategory} />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Daily Legal Tip Window at the Top of Home Page */}
        <DailyLegalTip />

        {/* Hero & Search Area */}
        <Hero
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            if (cat === 'advisor' || cat === 'events' || cat === 'podcast' || cat === 'tax' || cat === 'family' || cat === 'muslim') {
              handleNavigateSection(cat);
            } else {
              setSelectedCategory(cat);
              const el = document.getElementById('articles-section');
              if (el && cat !== 'all') el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
          {/* Section 1: Detailed Articles & Verified Roadmaps */}
          <section id="articles-section" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-4">
              <div>
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                  الأدلة المعرفية الموثقة
                </span>
                <h2 className="text-2xl font-bold text-stone-900 font-['Cairo',sans-serif]">
                  {selectedCategory === 'all'
                    ? 'كافة محاور الدليل في السويد وستوكهولم'
                    : selectedCategory === 'law'
                    ? 'محور القانون، الهجرة، وحقوق العمل والإيجار'
                    : selectedCategory === 'family'
                    ? 'محور الأسرة، السوسيال، ورعاية الأطفال'
                    : selectedCategory === 'tax'
                    ? 'محور الضرائب، الراتب الصافي، والمالية'
                    : selectedCategory === 'education'
                    ? 'محور الدراسة، اللغة السويدية SFI، والجامعات'
                    : selectedCategory === 'life'
                    ? 'محور الحياة اليومية والمساجد في ستوكهولم'
                    : 'محور السياحة والطبيعة وحق التجوال'}
                </h2>
              </div>
              <div className="text-xs text-stone-500 font-mono">
                {filteredTopics.length} موضوع متاح
              </div>
            </div>

            {filteredTopics.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500">
                <p className="text-base font-semibold">لم نعثر على نتائج مطابقة لبحثك.</p>
                <p className="text-xs mt-1">جرب البحث بكلمات أخرى أو اختر &quot;كافة الأقسام&quot;.</p>
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                  className="mt-4 px-4 py-2 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                >
                  إظهار كل المواضيع
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTopics.map((topic) => (
                  <ArticleCard
                    key={topic.id}
                    topic={topic}
                    onReadMore={(t) => setActiveModalTopic(t)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Section: Personal Legal Advisor with simulated case studies & contract checklist */}
          <section>
            <PersonalLegalAdvisor
              onAskCustomQuestion={(query) => {
                setPrefilledLegalQuestion(`استشارة قانونية حول قضية: ${query} - ما هي أحدث البنود القانونية والإجراءات العملية المعتمدة في السويد؟`);
                const el = document.getElementById('legal-qa-grounding');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
          </section>

          {/* Section: Interactive Legal Assistant with Google Search Grounding */}
          <section>
            <LegalAssistantGrounding externalQuery={prefilledLegalQuestion} />
          </section>

          {/* Feature Spotlight: Raising Children & Family Life in Stockholm */}
          <section className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              <div className="lg:col-span-5 relative min-h-[280px] lg:min-h-full bg-stone-100">
                <img
                  src="/src/assets/images/stockholm_family_life_1792141154147.jpg"
                  alt="حياة الأسرة والتربية في حدائق ستوكهولم"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent flex items-end p-5">
                  <span className="text-xs text-stone-200 font-medium">
                    حدائق ستوكهولم والمساحات الآمنة لنمو الأطفال
                  </span>
                </div>
              </div>

              <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
                    <Baby className="w-4 h-4 text-amber-700" />
                    <span>ملف الأسرة والتربية المتوازنة</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-stone-900 font-['Cairo',sans-serif] leading-tight mb-2">
                    كيف تربي أطفالك في السويد بأمان، استقرار، واعتزاز بالهوية؟
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
                    تربية الأبناء في السويد لا تعني التخلي عن قيمك أو العيش في خوف دائم من المؤسسات؛ بل تعني فهم القوانين والتعاون الإيجابي مع المدرسة. القوانين السويدية توفر للطفل حماية صارمة من العنف الجسدي والنفسي، وتمنح الأسرة إجازات رعاية مدفوعة ودعماً مالياً واجتماعياً متقدماً.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-[#FBF9F5] rounded-xl border border-stone-200">
                      <strong className="block text-stone-900 mb-1">التواصل الاستباقي مع المدرسة</strong>
                      <span className="text-stone-600">افتتاح حوار دوري مع المعلمين يزيل أي سوء فهم ثقافي قبل أن يتحول لقلق.</span>
                    </div>
                    <div className="p-3 bg-[#FBF9F5] rounded-xl border border-stone-200">
                      <strong className="block text-stone-900 mb-1">حقك في مترجم معتمد (Tolk)</strong>
                      <span className="text-stone-600">طلب مترجم رسمي بلغتك الأم مجاني تماماً ويضمن نقل أفكارك بدقة كاملة.</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const topic = GUIDE_TOPICS.find((t) => t.id === 'family-social-services-truth');
                      if (topic) setActiveModalTopic(topic);
                    }}
                    className="px-4 py-2 text-xs font-bold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors"
                  >
                    قراءة الدليل الكامل حول السوسيال وقانون LVU
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('family-planner');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 rounded-lg hover:bg-stone-200 transition-colors"
                  >
                    حساب إجازة الوالدين وعلاوة الطفل
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Podcast on Expat Issues, Parenting & Identity */}
          <section>
            <PodcastSection />
          </section>

          {/* Section 3: Community Events & Cultural Calendar in Stockholm */}
          <section>
            <CommunityEventsCalendar />
          </section>

          {/* Section 4: Interactive Swedish Tax & Salary Calculator */}
          <section>
            <TaxCalculator />
          </section>

          {/* Section 3: Parental Planner & Family Benefits */}
          <section>
            <ParentalPlanner />
          </section>

          {/* Section 4: Migrationsverket Citizenship & PUT Checker */}
          <section>
            <CitizenshipChecker />
          </section>

          {/* Section 5: Muslim Life in Stockholm (Mosques, Prayer Times, Halal) */}
          <section>
            <MuslimLifeStockholm />
          </section>

          {/* Section 6: Official Swedish-Arabic Expat Glossary */}
          <section>
            <GlossarySection />
          </section>

          {/* Section 7: Emergency & Official Contacts Bar */}
          <section>
            <OfficialContactsBar />
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modal Reader for in-depth articles */}
      <TopicDetailModal
        topic={activeModalTopic}
        onClose={() => setActiveModalTopic(null)}
      />
    </div>
  );
}
