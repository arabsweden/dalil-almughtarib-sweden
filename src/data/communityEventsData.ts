export interface CommunityEvent {
  id: string;
  titleAr: string;
  titleSv: string;
  category: 'family' | 'culture' | 'youth_career' | 'kids' | 'sports' | 'nature';
  categoryLabelAr: string;
  dateStr: string; // e.g. "2026-10-24"
  timeStr: string; // e.g. "11:00 - 16:00"
  locationName: string;
  locationAddress: string;
  transitStation: string;
  organizer: string;
  descriptionAr: string;
  highlights: string[];
  isFree: boolean;
  targetAudience: string;
  rsvpCount: number;
}

export const COMMUNITY_EVENTS: CommunityEvent[] = [
  {
    id: 'event-kista-heritage-day',
    titleAr: 'ملتقى العائلات العربية: يوم التراث والخط العربي وأنشطة الأطفال',
    titleSv: 'Arabiska Familjedagen i Kista: Kultur & Barnaktiviteter',
    category: 'family',
    categoryLabelAr: 'عائلي وثقافي',
    dateStr: '2026-10-24',
    timeStr: '11:00 - 17:00',
    locationName: 'مركز شيستا الثقافي (Kista Träff)',
    locationAddress: 'Kista Torg 7, 164 42 Kista',
    transitStation: 'محطة مترو شيستا (T-bana Kista - الخط الأزرق)',
    organizer: 'رابطة الصداقة الثقافية بستوكهولم بالتعاون مع بلدية ستوكهولم',
    descriptionAr: 'يوم مفتوح يجمع العائلات العربية في العاصمة للاحتفاء بالتراث واللغة. يشتمل على ورش حية لفن الخط العربي، مسابقات تفاعلية للأطفال لتعزيز لغة الضاد، معرض حرف يدوية، وركن للشاي والقهوة والحلويات التقليدية.',
    highlights: ['ورشة خط عربي للأطفال مع فنان محترف', 'عروض حكايات شعبية', 'ركن تعارف وتواصل بين الأسر الجديدة والقديمة', 'ضيافة مجانية'],
    isFree: true,
    targetAudience: 'العائلات والأطفال من كافة الأعمار',
    rsvpCount: 148,
  },
  {
    id: 'event-sodermalm-career-salon',
    titleAr: 'صالون التوجيه المهني: أسرار المقابلة السويدية وبناء شبكة العلاقات',
    titleSv: 'Karriärkväll för Nyanlända: Nätverk & CV-coaching',
    category: 'youth_career',
    categoryLabelAr: 'شبابي ومهني',
    dateStr: '2026-10-28',
    timeStr: '17:30 - 20:30',
    locationName: 'قاعة ميديورياربلاتسن (Medborgarhuset Södermalm)',
    locationAddress: 'Götgatan 54, 118 26 Stockholm',
    transitStation: 'محطة ميديورياربلاتسن (T-bana Medborgarplatsen)',
    organizer: 'مبادرة رواد الأعمال والمهندسين العرب في السويد',
    descriptionAr: 'أمسية مخصصة للشباب والباحثين عن عمل والخريجين الجدد لمساعدتهم على دخول سوق العمل السويدي. يقدم مستشارون توظيف مراجعات مباشرة ومجانية للسير الذاتية (CV)، وشرحاً عملياً لثقافة الفيكا وبناء شبكة العلاقات المهنية (Nätverka).',
    highlights: ['مراجعة فردية للسيرة الذاتية السويدية', 'محاكاة لمقابلة عمل حقيقية', 'جلسة فنجان قهوة (Fika) مع مديري توظيف في شركات سويدية'],
    isFree: true,
    targetAudience: 'الخريجون، المهنيون، والباحثون عن عمل',
    rsvpCount: 89,
  },
  {
    id: 'event-tensta-arabic-reading-club',
    titleAr: 'مهرجان القصة ونادي القراءة للطفل العربي (نقرأ معاً)',
    titleSv: 'Barnens Bokfestival: Sagostund på Arabiska',
    category: 'kids',
    categoryLabelAr: 'أطفال وتعليم',
    dateStr: '2026-11-01',
    timeStr: '13:00 - 16:00',
    locationName: 'مكتبة تينستا العامة (Tensta Bibliotek)',
    locationAddress: 'Tingstorget 4, 163 61 Spånga',
    transitStation: 'محطة تينستا (T-bana Tensta - الخط الأزرق)',
    organizer: 'قسم اللغات بمكتبات بلدية ستوكهولم',
    descriptionAr: 'فعالية تهدف إلى غرس حب القراءة باللغة العربية في نفوس أبناء الجالية في السويد. تتضمن قراءة قصص شائقة باللغة العربية الفصحى، مسرح دمى، وتبادل كتب الأطفال بين الأهالي لتشجيع المكتبة المنزلية.',
    highlights: ['جلسات حكواتي تفاعلية', 'توزيع كتب وقصص أطفال هدايا', 'استعارة كتب عربية عبر بطاقة المكتبة المجانية'],
    isFree: true,
    targetAudience: 'الأطفال من سن 4 إلى 12 سنة وأولياء أمورهم',
    rsvpCount: 112,
  },
  {
    id: 'event-haga-nature-walk',
    titleAr: 'جولة المشي في خريف ستوكهولم والشواء العائلي في حديقة هاغا',
    titleSv: 'Höstvandring & Familjegrill i Hagaparken',
    category: 'nature',
    categoryLabelAr: 'ترفيهي وطبيعة',
    dateStr: '2026-11-07',
    timeStr: '10:30 - 15:30',
    locationName: 'حديقة قصر هاغا الملكي (Hagaparken - Solna)',
    locationAddress: 'Hagaparken, 169 70 Solna',
    transitStation: 'حافلة 515 من محطة Odenplan أو محطة Solna Station',
    organizer: 'نادي محبي الطبيعة في ستوكهولم',
    descriptionAr: 'نشاط بيئي وترفيهي للاستمتاع بألوان الخريف السويدي وتطبيق مبادئ حق التجوال (Allemansrätten). يشمل مسار مشي مريح حول بحيرة برونسفيكن، وألعاب خفيفة للأطفال، ثم التجمع في أماكن الشواء المرخصة لتناول الغداء.',
    highlights: ['مسار مشي خفيف 4 كم مناسب لعربات الأطفال', 'شواء عائلي في أماكن مرخصة', 'فرصة للتنفس النقي وتكوين صداقات جديدة'],
    isFree: true,
    targetAudience: 'الجميع (أفراد، عائلات، شباب، كبار سن)',
    rsvpCount: 175,
  },
  {
    id: 'event-skarholmen-mothers-circle',
    titleAr: 'حلقة حوار الأمهات: التربية المتوازنة والتواصل مع المدرسة والروضة',
    titleSv: 'Mammakretsen: Positivt Föräldraskap & Skolsamverkan',
    category: 'family',
    categoryLabelAr: 'أسرة وتربية',
    dateStr: '2026-11-12',
    timeStr: '10:00 - 12:30',
    locationName: 'قاعة المركز المجتمعي في إسكارهولمن (Skärholmen)',
    locationAddress: 'Bredholmstorget 4, 127 48 Skärholmen',
    transitStation: 'محطة إسكارهولمن (T-bana Skärholmen - الخط الأحمر)',
    organizer: 'شبكة أمهات ستوكهولم للدعم الأسري',
    descriptionAr: 'مساحة دافئة وآمنة للأمهات لتبادل التجارب حول تربية الأطفال والمراهقين في السويد. تتطرق الجلسة إلى إدارة وقت الشاشات، أساليب التربية الإيجابية الحديثة، وكيفية التعامل مع اجتماعات المعلمين (Utvecklingssamtal) بثقة ودون قلق.',
    highlights: ['حوار تفاعلي تديره أخصائية نفسية أسرية', 'مشاركة حلول واقعية مجربة بين الأمهات', 'مكان مخصص لرعاية الرضع أثناء اللقاء'],
    isFree: true,
    targetAudience: 'الأمهات وربات البيوت',
    rsvpCount: 64,
  },
  {
    id: 'event-spanga-football-cup',
    titleAr: 'بطولة كأس الصداقة لكرة القدم لشباب الجاليات في ستوكهولم',
    titleSv: 'Gemenskapscupen i Fotboll: Ungdomsturnering',
    category: 'sports',
    categoryLabelAr: 'رياضي وشبابي',
    dateStr: '2026-11-21',
    timeStr: '09:00 - 16:00',
    locationName: 'ملاعب سبونغا الرياضية المغطاة (Spånga IP Fotbollshall)',
    locationAddress: 'Solhems Hagväg 2, 163 56 Spånga',
    transitStation: 'محطة قطار الضواحي سبونغا (Pendeltåg Spånga)',
    organizer: 'جمعية شباب ستوكهولم الرياضية',
    descriptionAr: 'بطولة مصغرة لكرة القدم الخماسية داخل الصالات لتعزيز الروح الرياضية والصحة البدنية والتواصل بين شباب الجالية في أحياء ستوكهولم المختلفة (شيستا، رينكيبي، بوتشيركا، سودرمالم، هاندن).',
    highlights: ['مشاركة 12 فريقاً من مختلف الضواحي', 'ميداليات وجوائز تشجيعية', 'أجواء عائلية مشجعة مع مشروبات ومأكولات خفيفة'],
    isFree: true,
    targetAudience: 'الشباب واليافعون والجمهور المشجع',
    rsvpCount: 220,
  }
];
