import React, { useState } from 'react';
import { COMMUNITY_EVENTS, CommunityEvent } from '../data/communityEventsData';
import { 
  Calendar as CalendarIcon, MapPin, Clock, Users, PlusCircle, 
  Check, Share2, ExternalLink, Filter, Search, Tag, Sparkles, Navigation, X
} from 'lucide-react';

export const CommunityEventsCalendar: React.FC = () => {
  const [eventsList, setEventsList] = useState<CommunityEvent[]>(COMMUNITY_EVENTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userRsvps, setUserRsvps] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal for proposing an event
  const [isProposeModalOpen, setIsProposeModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'family' | 'culture' | 'youth_career' | 'kids' | 'sports' | 'nature'>('family');
  const [newDate, setNewDate] = useState('2026-11-28');
  const [newTime, setNewTime] = useState('14:00 - 18:00');
  const [newLocation, setNewLocation] = useState('');
  const [newTransit, setNewTransit] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newOrganizer, setNewOrganizer] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const categories = [
    { id: 'all', label: 'جميع الفعاليات' },
    { id: 'family', label: 'عائلي وأسرة' },
    { id: 'youth_career', label: 'شبابي وتوجيه مهني' },
    { id: 'kids', label: 'أطفال وتعليم لغة' },
    { id: 'nature', label: 'طبيعة وترفيه' },
    { id: 'sports', label: 'رياضة وصحة' },
  ];

  const filteredEvents = eventsList.filter((event) => {
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      event.titleAr.toLowerCase().includes(q) ||
      event.titleSv.toLowerCase().includes(q) ||
      event.locationName.toLowerCase().includes(q) ||
      event.transitStation.toLowerCase().includes(q) ||
      event.descriptionAr.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const toggleRsvp = (id: string) => {
    const isRsvpd = !!userRsvps[id];
    setUserRsvps(prev => ({ ...prev, [id]: !isRsvpd }));
    setEventsList(prev => prev.map(ev => {
      if (ev.id === id) {
        return { ...ev, rsvpCount: ev.rsvpCount + (isRsvpd ? -1 : 1) };
      }
      return ev;
    }));
  };

  const handleCopyLocation = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generateGoogleCalendarUrl = (event: CommunityEvent) => {
    // Generate simple Google Calendar URL
    const title = encodeURIComponent(event.titleAr);
    const details = encodeURIComponent(`${event.descriptionAr}\n\nالمحطة الأقرب: ${event.transitStation}\nالمنظم: ${event.organizer}`);
    const location = encodeURIComponent(`${event.locationName}, ${event.locationAddress}`);
    // Basic date parsing format: YYYYMMDDTHHmmSS
    const dateFormatted = event.dateStr.replace(/-/g, '');
    const startTime = `${dateFormatted}T100000Z`;
    const endTime = `${dateFormatted}T160000Z`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startTime}/${endTime}`;
  };

  const handleProposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLocation.trim()) return;

    const newEv: CommunityEvent = {
      id: `custom-event-${Date.now()}`,
      titleAr: newTitle.trim(),
      titleSv: 'Gemenskapsaktivitet',
      category: newCategory,
      categoryLabelAr: categories.find(c => c.id === newCategory)?.label || 'فعالية مجتمعية',
      dateStr: newDate || '2026-11-28',
      timeStr: newTime || '14:00 - 18:00',
      locationName: newLocation.trim(),
      locationAddress: newLocation.trim(),
      transitStation: newTransit.trim() || 'محطة مترو ستوكهولم',
      organizer: newOrganizer.trim() || 'مبادرة مجتمعية محلية',
      descriptionAr: newDescription.trim() || 'فعالية تهدف لتعزيز الروابط بين أبناء الجالية.',
      highlights: ['لقاء تواصل وتعارف', 'أنشطة مجتمعية مفيدة'],
      isFree: true,
      targetAudience: 'الجميع',
      rsvpCount: 1,
    };

    setEventsList(prev => [newEv, ...prev]);
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setIsProposeModalOpen(false);
      // Reset form
      setNewTitle('');
      setNewLocation('');
      setNewTransit('');
      setNewDescription('');
      setNewOrganizer('');
    }, 1500);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden" id="community-events">
      {/* Editorial Header with Community Gathering Photo */}
      <div className="border-b border-stone-100 bg-[#FBF9F5]">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-2">
                <CalendarIcon className="w-4 h-4 text-amber-700" />
                <span>تقويم الأنشطة والمجتمع</span>
                <span aria-hidden="true">·</span>
                <span>ستوكهولم الكبرى 2026</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-stone-900 font-['Cairo',sans-serif] leading-tight mb-3">
                تقويم الفعاليات الثقافية والاجتماعية للجالية في ستوكهولم
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed max-w-xl">
                مساحتك للتواصل وبناء الصداقات: ملتقيات عائلية، ورش تعليم اللغة العربية والخط، أندية قراءة الأطفال، أمسيات التوجيه المهني، والأنشطة الرياضية والطبيعية في مختلف أحياء العاصمة.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setIsProposeModalOpen(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>اقتراح فعالية أو نشاط للجالية</span>
              </button>
              <div className="text-xs text-stone-500 font-mono">
                {eventsList.length} فعالية مجتمعية مؤكدة
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[240px] lg:min-h-full bg-stone-100">
            <img
              src="/src/assets/images/stockholm_community_event_1792142202352.jpg"
              alt="ملتقى الجالية الثقافي في ستوكهولم"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent flex items-end p-4 text-white">
              <span className="text-xs text-stone-200 font-medium">
                ملتقى ثقافي وعائلي في بيت الثقافة بستوكهولم
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-6 md:p-8 border-b border-stone-100 bg-white">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث بالحي أو اسم الفعالية (مثال: شيستا، سودرمالم، أطفال)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:border-amber-700 focus:ring-2 focus:ring-amber-200 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="p-6 md:p-8 bg-[#FBF9F5]">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 text-stone-500 bg-white rounded-xl border border-stone-200 p-8">
            <p className="text-sm font-semibold">لا توجد فعاليات مطابقة للبحث حالياً.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="mt-3 text-xs text-amber-900 font-bold underline"
            >
              إظهار كل الفعاليات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((ev) => {
              const isRsvpd = !!userRsvps[ev.id];
              return (
                <div
                  key={ev.id}
                  className="bg-white rounded-2xl border border-stone-200/90 p-5 flex flex-col justify-between hover:border-amber-800/40 hover:shadow-sm transition-all"
                >
                  <div>
                    {/* Top Row: Date & Category */}
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-3 border-b border-stone-100 pb-2.5">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900">
                        <CalendarIcon className="w-3.5 h-3.5 text-amber-700" />
                        <span className="font-mono tabular-nums">{ev.dateStr}</span>
                      </div>
                      <span className="text-[11px] text-stone-500">{ev.categoryLabelAr}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-stone-900 font-['Cairo',sans-serif] leading-snug mb-1.5">
                      {ev.titleAr}
                    </h3>
                    <div className="text-[11px] text-stone-400 font-sans mb-3 line-clamp-1" dir="ltr">
                      {ev.titleSv}
                    </div>

                    {/* Time & Location */}
                    <div className="space-y-1.5 text-xs text-stone-600 mb-4 bg-stone-50 p-3 rounded-xl border border-stone-100">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="font-mono tabular-nums">{ev.timeStr}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                        <span className="leading-snug">{ev.locationName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-stone-500 pt-1 border-t border-stone-200/60">
                        <Navigation className="w-3 h-3 text-stone-400 shrink-0" />
                        <span className="truncate">{ev.transitStation}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-stone-600 leading-relaxed mb-4">
                      {ev.descriptionAr}
                    </p>

                    {/* Highlights */}
                    <div className="space-y-1 mb-4">
                      {ev.highlights.slice(0, 2).map((h, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-stone-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-700 shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-stone-100 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-stone-500 font-mono">
                        <Users className="w-3.5 h-3.5 text-stone-400" />
                        <span>{ev.rsvpCount} مهتم / حاضر</span>
                      </div>
                      {ev.isFree && (
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          دخول مجاني
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => toggleRsvp(ev.id)}
                        className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isRsvpd
                            ? 'bg-emerald-800 text-white shadow-xs'
                            : 'bg-stone-900 hover:bg-stone-800 text-white'
                        }`}
                      >
                        {isRsvpd ? <Check className="w-3.5 h-3.5" /> : null}
                        <span>{isRsvpd ? 'أنا مهتم (تم التسجيل)' : 'سجل اهتمامك'}</span>
                      </button>

                      <a
                        href={generateGoogleCalendarUrl(ev)}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 flex items-center justify-center gap-1.5 transition-colors"
                        title="إضافة إلى تقويم Google"
                      >
                        <CalendarIcon className="w-3.5 h-3.5 text-stone-500" />
                        <span>إضافة للتقويم</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Propose Event Modal */}
      {isProposeModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div 
            className="bg-white rounded-2xl max-w-lg w-full p-6 border border-stone-200 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  اقتراح فعالية جديدة للجالية في ستوكهولم
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  شارك نشاطاً ثقافياً، عائلياً، أو تعليمياً مع المجتمع
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsProposeModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formSuccess ? (
              <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-emerald-900">تمت إضافة الفعالية بنجاح إلى التقويم!</h4>
                <p className="text-xs text-emerald-700">ستظهر الفعالية الآن في قائمة أنشطة الجالية.</p>
              </div>
            ) : (
              <form onSubmit={handleProposeSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">عنوان الفعالية بالعربية *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: ورشة رسم وتلوين للأطفال في سودرمالم"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:border-amber-700 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">تصنيف الفعالية</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:border-amber-700 focus:outline-none bg-white"
                    >
                      <option value="family">عائلي وأسرة</option>
                      <option value="youth_career">شبابي ومهني</option>
                      <option value="kids">أطفال وتعليم</option>
                      <option value="nature">طبيعة وترفيه</option>
                      <option value="sports">رياضة وصحة</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">الجهة أو المبادرة المنظمة</label>
                    <input
                      type="text"
                      placeholder="اسم الجمعية أو المجموعة"
                      value={newOrganizer}
                      onChange={(e) => setNewOrganizer(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:border-amber-700 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">التاريخ</label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:border-amber-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">الوقت</label>
                    <input
                      type="text"
                      placeholder="مثال: 14:00 - 18:00"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:border-amber-700 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">مكان الإقامة والعنوان *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: مركز ثقافة الشباب، Kista Torg"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:border-amber-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">محطة المواصلات الأقرب (SL)</label>
                  <input
                    type="text"
                    placeholder="مثال: T-bana Kista أو Pendeltåg Spånga"
                    value={newTransit}
                    onChange={(e) => setNewTransit(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:border-amber-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">نبذة عن الفعالية وأهدافها</label>
                  <textarea
                    rows={3}
                    placeholder="اشرح باختصار برنامج الفعالية وما سيستفيده الحاضرون..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:border-amber-700 focus:outline-none resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsProposeModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-stone-600 hover:bg-stone-100 font-semibold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-amber-900 hover:bg-amber-800 text-white font-semibold"
                  >
                    إضافة الفعالية للتقويم
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
