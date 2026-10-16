export interface DailyLegalTipItem {
  id: string;
  category: 'tenant' | 'employee';
  categoryLabelAr: string;
  categoryBadgeColor: string;
  headlineAr: string;
  summaryAr: string;
  practicalActionAr: string;
  swedishLawRef: string;
  officialSource: {
    nameSv: string;
    nameAr: string;
    url: string;
  };
}

export const DAILY_LEGAL_TIPS: DailyLegalTipItem[] = [
  {
    id: 'tip-tenant-overpriced-rent',
    category: 'tenant',
    categoryLabelAr: 'حقوق المستأجر',
    categoryBadgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    headlineAr: 'استرداد الإيجار الزائد من الباطن بأثر رجعي لمدة تصل لعامين',
    summaryAr: 'إذا كنت تستأجر شقة من الباطن (Andrahandsuthyrning) ودفع المؤجر إيجاراً أعلى من الإيجار المعقول (Skälig hyra)، يحق لك استرداد كامل الفارق الزائد مع الفوائد بأثر رجعي لمدة تصل إلى عامين عبر لجنة شؤون الإيجار (Hyresnämnden) مجاناً.',
    practicalActionAr: 'احتفظ بجميع إيصالات التحويل البنكي وعقد الإيجار، ولا تدفع نقداً أبداً حتى تتمكن من إثبات المبالغ المسددة.',
    swedishLawRef: '12 kap. 55 f § Jordabalken (Hyreslagen)',
    officialSource: {
      nameSv: 'Sveriges Domstolar (Hyresnämnden)',
      nameAr: 'لجنة شؤون الإيجار بمحاكم السويد',
      url: 'https://www.domstol.se/amnen/hyra-bostadsratt-och-arrende/hyra-av-bostad/hyra-i-andra-hand/',
    },
  },
  {
    id: 'tip-employee-vacation-summer',
    category: 'employee',
    categoryLabelAr: 'حقوق الموظف',
    categoryBadgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    headlineAr: 'حقك القانوني في 4 أسابيع إجازة متتالية خلال الصيف',
    summaryAr: 'يضمن قانون الإجازات السويدي (Semesterlagen) للموظف الحق في أخذ 4 أسابيع إجازة صيفية متتالية خلال الفترة من يونيو إلى أغسطس (Huvudsemester)، بالإضافة لصرف مكافأة إجازة إضافية (Semestertillägg).',
    practicalActionAr: 'يجب على صاحب العمل إبلاغك بجدول الإجازات الصيفية قبل شهرين على الأقل من بدء موعد إجازتك.',
    swedishLawRef: '12 § Semesterlag (1977:480)',
    officialSource: {
      nameSv: 'Riksdagen',
      nameAr: 'البرلمان السويدي (قانون الإجازات)',
      url: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/semesterlag-1977480_sfs-1977-480/',
    },
  },
  {
    id: 'tip-tenant-eviction-protection',
    category: 'tenant',
    categoryLabelAr: 'حقوق المستأجر',
    categoryBadgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    headlineAr: 'حظر الإخلاء القسري الفوري دون حكم قضائي وتنفيذ رسمي',
    summaryAr: 'لا يملك المؤجر أي سلطة قانونية لتغيير أقفال الشقة أو إخراجك أو رمي أمتعتك، حتى في حال وجود خلاف أو تأخر في الإيجار. الإخلاء يتطلب حكماً قضائياً وتنفيذاً حصرياً من هيئة الجباية السويدية (Kronofogden).',
    practicalActionAr: 'إذا هددك المؤجر بتغيير القفل، أبلغه كتابياً بأن ذلك يعد جريمة جنائية (Egenmäktigt förfarande) يعاقب عليها القانون، واطلب مساندة الشرطة (114 14) فوراً.',
    swedishLawRef: 'Brottsbalken 8 kap. 8 § & Kronofogden vräkningsregler',
    officialSource: {
      nameSv: 'Kronofogden',
      nameAr: 'هيئة الجباية والتنفيذ السويدية',
      url: 'https://kronofogden.se/forebygga-och-los-konflikter/for-privatpersoner/om-du-riskerar-att-bli-vrakt',
    },
  },
  {
    id: 'tip-employee-vab-protection',
    category: 'employee',
    categoryLabelAr: 'حقوق الموظف',
    categoryBadgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    headlineAr: 'حماية كاملة عند رعاية طفلك المريض (VAB) بدون إذن مسبق',
    summaryAr: 'يحق لك التوقف الفوري عن العمل لرعاية طفلك المريض دون حاجة لموافقة مسبقة من رب العمل، ولا يحق له معاقبتك أو خصم رصيد إجازتك، حيث تعوضك مؤسسة التأمينات (Försäkringskassan) ببدل VAB اليومي.',
    practicalActionAr: 'أبلغ مديرك في صباح يوم الغياب وسجل الطلب في تطبيق Försäkringskassan في نفس اليوم.',
    swedishLawRef: 'Föräldraledighetslag (1995:584)',
    officialSource: {
      nameSv: 'Försäkringskassan',
      nameAr: 'مصلحة التأمينات الاجتماعية السويدية',
      url: 'https://www.forsakringskassan.se/privatperson/foralder/vab',
    },
  },
  {
    id: 'tip-tenant-secondhand-furnishing-limit',
    category: 'tenant',
    categoryLabelAr: 'حقوق المستأجر',
    categoryBadgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    headlineAr: 'الحد الأقصى لزيادة أثاث الشقة المفروشة هو 15% فقط',
    summaryAr: 'إذا كانت الشقة المستأجرة مفروشة بالكامل، يُسمح للمؤجر بإضافة نسبة لا تزيد عن 15% كحد أقصى كبدل استهلاك للأثاث فوق الإيجار الأساسي للشقة. أي زيادة تفوق 15% تعتبر باطلة ويجب استردادها.',
    practicalActionAr: 'اطلب من المؤجر إظهار إشعار الإيجار الأصلي (Hyresavi) الموجه له من شركة السكن للتأكد من قيمة الإيجار الحقيقي.',
    swedishLawRef: '12 kap. 55 § Jordabalken (Hyreslagen)',
    officialSource: {
      nameSv: 'Hyresgästföreningen',
      nameAr: 'جمعية المستأجرين السويدية',
      url: 'https://www.hyresgastforeningen.se/stod-och-rad/hyra-i-andra-hand/',
    },
  },
  {
    id: 'tip-employee-written-notice',
    category: 'employee',
    categoryLabelAr: 'حقوق الموظف',
    categoryBadgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    headlineAr: 'الفصل الشفهي غير قانوني ويلزم بإنذار خطي وبيان الأسباب',
    summaryAr: 'وفق قانون حماية العمل (LAS)، يجب أن يكون قرار إنهاء الخدمة مكتوباً ومسلماً باليد أو بالبريد المسجل، ويتضمن كيفية الطعن فيه، مع إلزام المشغل بتقديم أسباب موضوعية واضحة (Sakliga skäl).',
    practicalActionAr: 'لا توقع على أي استقالة طوعية شفهية؛ فالاستقالة تضيع حقك في مهلة الإخطار وتعرضك لغرامة حرمان مدتها 45 يوماً لدى صندوق البطالة (A-kassa).',
    swedishLawRef: '8–10 §§ Lag (1982:80) om anställningsskydd (LAS)',
    officialSource: {
      nameSv: 'Arbetsdomstolen',
      nameAr: 'محكمة العمل السويدية',
      url: 'https://www.domstol.se/arbetsdomstolen/',
    },
  },
  {
    id: 'tip-tenant-notice-period-one-month',
    category: 'tenant',
    categoryLabelAr: 'حقوق المستأجر',
    categoryBadgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    headlineAr: 'حق المستأجر من الباطن في مهلة إنهاء شهر واحد للمساكن الخاصة',
    summaryAr: 'إذا استأجرت مسكناً خاصاً أو فيلا أو شقة تمليك (Bostadsrätt) بموجب قانون تأجير المساكن الخاصة (Privatuthyrningslagen)، يحق لك كمستأجر إنهاء العقد بمهلة شهر تقويمي واحد فقط حتى لو نص العقد على 3 أشهر.',
    practicalActionAr: 'يُحسب الشهر التقويمي حتى نهاية الشهر الميلادي التالي لتاريخ إرسال الإشعار الخطي للمؤجر.',
    swedishLawRef: '3 § Lag (2012:978) om uthyrning av egen bostad',
    officialSource: {
      nameSv: 'Riksdagen',
      nameAr: 'قانون تأجير المساكن الخاصة السويدي',
      url: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-2012978-om-uthyrning-av-egen-bostad_sfs-2012-978/',
    },
  },
  {
    id: 'tip-employee-overtime-compensation',
    category: 'employee',
    categoryLabelAr: 'حقوق الموظف',
    categoryBadgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    headlineAr: 'حقك في تعويض ساعات العمل الإضافية (Övertidsersättning)',
    summaryAr: 'ساعات العمل التي تزيد عن 40 ساعة أسبوعياً تخضع لقانون وقت العمل (Arbetstidslagen). الاتفاقيات الجماعية تلزم صاحب العمل بدفع بدل مالي إضافي بنسبة تتراوح بين 50% إلى 100% فوق الراتب الساعي العادي أو منح إجازة تعويضية مضاعفة.',
    practicalActionAr: 'سجل ساعات عملك الفعلية يومياً في دفتر خاص أو تطبيق، ولا تقبل التنازل عن بدل الإضافي إلا باتفاقية مكتوبة تزيد من راتبك الأساسي أو إجازاتك السنوية.',
    swedishLawRef: 'Arbetstidslag (1982:673)',
    officialSource: {
      nameSv: 'Arbetsmiljöverket',
      nameAr: 'هيئة بيئة العمل السويدية',
      url: 'https://www.av.se/arbetsmiljoarbete-och-inspektioner/lagar-och-regler-om-arbetsmiljo/arbetstidslagen/',
    },
  },
];
