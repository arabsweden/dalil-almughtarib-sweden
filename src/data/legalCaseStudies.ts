export interface CaseOption {
  id: string;
  titleAr: string;
  descriptionAr: string;
  isRecommended: boolean;
  verdictType: 'correct' | 'warning' | 'danger';
  verdictTitleAr: string;
  legalAnalysisAr: string;
  consequencesAr: string;
}

export interface LegalCaseStudy {
  id: string;
  category: 'work_contract' | 'skatteverket' | 'permits_pay' | 'leave_family';
  categoryLabelAr: string;
  badgeAr: string;
  titleAr: string;
  titleSv: string;
  difficulty: 'مبتدئ' | 'متوسط' | 'متقدم';
  scenarioAr: string;
  protagonist: {
    name: string;
    role: string;
    city: string;
  };
  keyQuestionAr: string;
  options: CaseOption[];
  legalFoundation: {
    lawNameSv: string;
    lawNameAr: string;
    applicableArticles: string[];
    summaryAr: string;
    recentUpdates2024_2026?: string;
  };
  actionRoadmap: {
    step: number;
    title: string;
    description: string;
    deadline?: string;
  }[];
  essentialDocuments: {
    nameSv: string;
    nameAr: string;
    whyNeeded: string;
  }[];
  officialAuthorities: {
    nameSv: string;
    nameAr: string;
    url: string;
  }[];
}

export const LEGAL_CASE_STUDIES: LegalCaseStudy[] = [
  {
    id: 'case-provanstallning-dismissal',
    category: 'work_contract',
    categoryLabelAr: 'عقود العمل وقانون LAS',
    badgeAr: 'حالة شديدة الشيوع',
    titleAr: 'إنهاء عقد التجربة فجأة دون إبداء أسباب: ما هي حقوقك القانونية؟',
    titleSv: 'Avbrytande av provanställning enligt LAS',
    difficulty: 'متوسط',
    scenarioAr: 'بدأ "عمر" مهندس برمجيات عقداً تجريبياً (Provanställning) لمدة 6 أشهر مع شركة في كستا (Kista) باستوكهولم. بعد 4 أشهر من العمل الجاد، استدعاه المدير فجأة يوم الخميس وأبلغه شفهياً: "غداً سيكون آخر يوم عمل لك، ولا داعي للحضور الأسبوع القادم لأن أسلوبك لا يلائم الفريق تماماً". لم يتلقَ عمر أي إنذار كتابي مسبق ولم يُمنح أي مهلة إشعار.',
    protagonist: {
      name: 'عمر',
      role: 'مهندس برمجيات',
      city: 'ستوكهولم (Kista)',
    },
    keyQuestionAr: 'ما هو الموقف القانوني السليم الذي ينبغي لعمر اتخاذه فوراً وفقاً لقانون حماية العمل (LAS)؟',
    options: [
      {
        id: 'opt-accept-leave',
        titleAr: 'الامتثال للطلب وتسليم اللابتوب والمغادرة فوراً يوم الجمعة',
        descriptionAr: 'افتراض أن فترة التجربة تمنح صاحب العمل الحق المطلق في طرد الموظف بنفس اليوم دون حقوق.',
        isRecommended: false,
        verdictType: 'danger',
        verdictTitleAr: 'خطأ جسيم يضيع حقك في مهلة الإخطار والتعويض المالي',
        legalAnalysisAr: 'وفق المادة 31 من قانون LAS، يلزم صاحب العمل بإخطار الموظف قبل 14 يوماً على الأقل (Underrättelse) قبل إنهاء التجربة، وإخطار النقابة إذا كان الموظف عضواً. المغادرة الفورية دون اعتراض تعد موافقة ضمنية تسقط حقك في راتب الـ 14 يوماً.',
        consequencesAr: 'تخسر راتب أسبوعين إضافيين على الأقل، وتفقد فرصة طلب تفاوض نقابي لمعرفة سبب الإلغاء.',
      },
      {
        id: 'opt-written-notice-facket',
        titleAr: 'المطالبة بإشعار خطي رسمي مهلته أسبوعان والتواصل الفوري مع النقابة (Facket)',
        descriptionAr: 'تذكير رب العمل بالمادة 31 من LAS، وطلب كتاب رسمي (Skriftligt besked) مع الاستمرار في تقاضي الراتب والمطالبة بجلسة استيضاح (Överläggning).',
        isRecommended: true,
        verdictType: 'correct',
        verdictTitleAr: 'الإجراء القانوني الصحيح 100% والمحمي بموجب القانون',
        legalAnalysisAr: 'حتى لو كان لرب العمل الحق في إنهاء التجربة دون إثبات "أسباب موضوعية"، إلا أن القانون يُلزمه بإشعار مدته 14 يوماً مدفوعة الأجر. وإذا كان عمر عضواً في النقابة (مثل Unionen أو Sveriges Ingenjörer)، يلزم صاحب العمل أيضاً بإخطار النقابة قبل 14 يوماً، وللنقابة حق طلب اجتماع فوري (Överläggning). وإذا خالف رب العمل ذلك، يحق لعمر المطالبة بتعويض عن الضرر العام (Allmänt skadestånd).',
        consequencesAr: 'تحصل على راتب 14 يوماً على الأقل، وتلزم الشركة بتقديم وثيقة إنهاء قانونية تفيدك في الحصول على إعانة البطالة A-kassa دون فترة حرمان.',
      },
      {
        id: 'opt-refuse-and-sue',
        titleAr: 'رفض القرار والامتناع عن المغادرة ورفع دعوى فورية بالفصل التعسفي (Sakliga skäl)',
        descriptionAr: 'الادعاء بأن صاحب العمل ليس لديه مبرر موضوعي لفصله ومقاضاته أمام محكمة العمل (Arbetsdomstolen) لإلغاء الفصل.',
        isRecommended: false,
        verdictType: 'warning',
        verdictTitleAr: 'تفسير قانوني غير دقيق لفترة التجربة',
        legalAnalysisAr: 'المادة 6 من قانون LAS تنص بوضوح على أن عقد التجربة يمكن إنهاؤه دون الحاجة لتقديم أسباب موضوعية (Sakliga skäl)، ما لم يكن الإنهاء مبنياً على أسباب تمييزية محظورة (مثل الدين، العرق، الجنسية، أو إجازة الأبوة) المحمية بقانون التمييز (Diskrimineringslagen).',
        consequencesAr: 'ستخسر الدعوى أمام المحكمة وتتحمل مصاريف التقاضي الباهظة ما لم يكن هناك دليل قاطع على التمييز المحظور.',
      },
    ],
    legalFoundation: {
      lawNameSv: 'Lag (1982:80) om anställningsskydd (LAS)',
      lawNameAr: 'قانون حماية العمل السويدي (LAS)',
      applicableArticles: ['المادة 6 (عقد التجربة Provanställning)', 'المادة 31 (مهلة الإخطار Underrättelse قبل 14 يوماً)', 'المادة 38 (التعويض المالي عن الإخلال الإجرائي)'],
      summaryAr: 'فترة التجربة حدها الأقصى 6 أشهر غير قابلة للتمديد. يجوز إنهاؤها دون تبرير موضوعي، لكن بشرط إلزامي بإشعار خطي مدفوع لمدة لا تقل عن 14 يوماً وإبلاغ النقابة ذات الصلة.',
      recentUpdates2024_2026: 'التعديلات الحديثة على قانون LAS عززت سرعة تحول عقود العمل المؤقتة (Särskild visstidsanställning) إلى عقود دائمة بعد 12 شهراً، وشددت الرقابة على التمييز أثناء فترة التجربة.',
    },
    actionRoadmap: [
      {
        step: 1,
        title: 'أرسل بريداً إلكترونياً توثيقياً في نفس اليوم',
        description: 'اكتب لمديرك وقسم الموارد البشرية (HR): "بناءً على محادثتنا الشفهية، يرجى تزويدي بقرار الإنهاء الخطي الرسمي (Skriftligt besked) وفق المادة 31 من LAS مع تحديد تاريخ انتهاء مهلة الـ 14 يوماً القانونية".',
        deadline: 'خلال 24 ساعة من المحادثة الشفهية',
      },
      {
        step: 2,
        title: 'تواصل مع نقابتك العمالية (Facket)',
        description: 'إذا كنت عضواً، افتح بلاغاً فورياً واطلب تمثيلهم القانوني لطلب جلسة استيضاح ومراجعة مستحقاتك من الإجازات وساعات العمل الإضافية.',
        deadline: 'قبل انقضاء أسبوع من الإشعار',
      },
      {
        step: 3,
        title: 'اطلب شهادة صاحب العمل (Arbetsgivarintyg)',
        description: 'اطلب رفع الشهادة مباشرة إلى بوابة صندوق البطالة (A-kassa) لحساب متوسط ساعاتك وراتبك لضمان تدفق الدخل البديل.',
        deadline: 'قبل آخر يوم عمل فعلي',
      },
    ],
    essentialDocuments: [
      {
        nameSv: 'Skriftligt besked om avbrytande',
        nameAr: 'إشعار خطي رسمي بإنهاء التجربة',
        whyNeeded: 'يثبت تاريخ التبليغ وبدء سريان مهلة الـ 14 يوماً الرسمية لحفظ راتبك.',
      },
      {
        nameSv: 'Arbetsgivarintyg för a-kassa',
        nameAr: 'شهادة عمل لصندوق البطالة',
        whyNeeded: 'الوثيقة الأساسية لحساب مخصصات البطالة وعدم تطبيق غرامة الإيقاف المؤقت.',
      },
      {
        nameSv: 'Lönespecifikation',
        nameAr: 'كشف الراتب النهائي وقسيمة الإجازات المتراكمة (Slutlön)',
        whyNeeded: 'للتأكد من صرف أيام الإجازة غير المستعملة (Semesterersättning) ومكافأة التقاعد.',
      },
    ],
    officialAuthorities: [
      {
        nameSv: 'Arbetsdomstolen',
        nameAr: 'محكمة العمل السويدية',
        url: 'https://www.domstol.se/arbetsdomstolen/',
      },
      {
        nameSv: 'Unionen fackförbund',
        nameAr: 'نقابة يونيون للمهنيين وموظفي القطاع الخاص',
        url: 'https://www.unionen.se',
      },
    ],
  },
  {
    id: 'case-skatteverket-folkbokforing',
    category: 'skatteverket',
    categoryLabelAr: 'التعامل مع مصلحة الضرائب Skatteverket',
    badgeAr: 'تحديثات أمنية ورقابية مشددة',
    titleAr: 'رسالة فحص القيد المدني والتحقق من العنوان السكني (Folkbokföringsutredning)',
    titleSv: 'Utredning om bosättning och folkbokföringsbrott',
    difficulty: 'متقدم',
    scenarioAr: 'انتقلت "فاطمة" وأسرتها للسكن في شقة مستأجرة من الباطن (Andra hand) في سولنتونا (Sollentuna). صاحب الشقة طلب منها عدم تسجيل عنوانها رسمياً على الشقة بحجة أنه لم يحصل بعد على إذن جمعية السكن (BRF)، واقترح أن تسجل عنوانها لدى صديقة في تينستا (Tensta) وتضع اسمها كـ (c/o). بعد 3 أشهر، تلقت فاطمة بريداً مسجلاً في كيفرا (Kivra) من مصلحة الضرائب يفيد بفتح تحقيق (Utredning) حول دقة قيدها السكني ويطلب تقديم إثباتات الإقامة الفعلية خلال 14 يوماً.',
    protagonist: {
      name: 'فاطمة',
      role: 'مترجمة ومقيمة',
      city: 'ستوكهولم (Sollentuna)',
    },
    keyQuestionAr: 'ما هي الخطوات القانونية العاجلة لتفادي تهمة مخالفة القيد المدني (Folkbokföringsbrott) والغرامات الجنائية؟',
    options: [
      {
        id: 'opt-ignore-or-fake',
        titleAr: 'تجاهل الرسالة أو الادعاء بأنها تعيش فعلاً عند صديقتها',
        descriptionAr: 'تكرار أن عنوان صديقتها هو مسكنها الفعلي لإخفاء السكن غير المرخص عن مصلحة الضرائب.',
        isRecommended: false,
        verdictType: 'danger',
        verdictTitleAr: 'مخاطرة جنائية مباشرة بموجب قانون القيد المدني المعدل',
        legalAnalysisAr: 'منذ عام 2018 تم تشديد قانون القيد المدني (Folkbokföringslagen) واعتبار تسجيل عنوان وهمي أو غير مطابق للواقع جريمة جنائية (Folkbokföringsbrott) عقوبتها الغرامة المالية أو الحبس لمدة تصل إلى سنتين في الحالات الجسيمة. مفتشو Skatteverket يقومون بزيارات ميدانية والتحقق من فواتير الكهرباء وعقود الإيجار وحركات البطاقات البنكية.',
        consequencesAr: 'إحالة الملف إلى الادعاء العام، تسجيل سابقة جنائية تعيق تجديد الإقامة والجنسية، وفقدان مخصصات السكن وبدل الأطفال (Bostadsbidrag).',
      },
      {
        id: 'opt-declare-actual-residence',
        titleAr: 'تصحيح العنوان فوراً وتقديم عقد الإيجار الفعلي مع بيان الحقيقة لـ Skatteverket',
        descriptionAr: 'توضيح أن مصلحة الضرائب تهتم بعنوان سكنك الواقعي فقط، ولا علاقة لها بخلافات جمعية البناء مع المؤجر.',
        isRecommended: true,
        verdictType: 'correct',
        verdictTitleAr: 'المسار القانوني الصحيح والآمن 100%',
        legalAnalysisAr: 'مصلحة الضرائب السويدية تطبق مبدأ الإقامة الفعلية (Faktisk bosättning): يجب أن يُسجل الشخص حيث ينام ويقضي راحته اليومية. لا يشترط قانون القيد المدني موافقة المؤجر لتسجيل قيدك؛ فقيدك على عنوانك الفعلي يحميك من التهم الجنائية. تقديم عقد الإيجار الفعلي وفواتير الخدمات يثبت حسن نيتك ويغلق التحقيق.',
        consequencesAr: 'تجنب الملاحقة الجنائية، تثبيت حقوق أطفالك في المدارس والمستوصف المحلي الصحيح، وضمان قانونية استلام المراسلات والمساعدات.',
      },
      {
        id: 'opt-box-address',
        titleAr: 'شراء عنوان صندوق بريدي خاص (Postbox) لتسجيل القيد عليه',
        descriptionAr: 'محاولة استخدام صناديق البريد التجارية كعنوان رسمي بديل عن الشقة.',
        isRecommended: false,
        verdictType: 'warning',
        verdictTitleAr: 'إجراء غير مقبول قانونياً للقيد المدني',
        legalAnalysisAr: 'لا يقبل Skatteverket تسجيل الأشخاص على صناديق البريد (Boxadresser) كعنوان قيد سكني (Bostadsadress). القيد يتطلب عقاراً سكنياً مسجلاً في السجل الوطني للعقارات.',
        consequencesAr: 'سيتم تسجيلك تلقائياً كـ "بدون عنوان معروف" (Utan känd hemvist) مما يوقف BankID والخدمات البنكية والصحية.',
      },
    ],
    legalFoundation: {
      lawNameSv: 'Folkbokföringslag (1991:481)',
      lawNameAr: 'قانون القيد المدني السويدي',
      applicableArticles: ['المادة 6 (واجب القيد في مكان الإقامة الفعلي)', 'المادة 42 (عقوبات القيد الوهمي Folkbokföringsbrott)'],
      summaryAr: 'كل شخص مقيم في السويد ملزم بالإبلاغ عن عنوانه الفعلي خلال أسبوع من الانتقال. تقديم معلومات مضللة عمداً أو إهمالاً يعرض لعقوبات جزائية وتأثيرات سلبية على الإقامة والجنسية.',
      recentUpdates2024_2026: 'منحت التعديلات الأخيرة مصلحة الضرائب صلاحيات التفتيش الميداني والربط المباشر مع سجلات استهلاك الكهرباء وشركات الاتصالات للكشف عن العناوين الوهمية.',
    },
    actionRoadmap: [
      {
        step: 1,
        title: 'الرد على استفسار Skatteverket قبل الموعد النهائي',
        description: 'ادخل عبر BankID وأجب على الأسئلة بصدق: اذكر عنوان الشقة التي تسكن فيها فعلياً وتاريخ الانتقال إليها واسم المالك الحقيقي.',
        deadline: 'خلال 14 يوماً من تاريخ الاستدعاء',
      },
      {
        step: 2,
        title: 'تقديم استمارة تغيير العنوان (Flyttanmälan) الرسمية',
        description: 'سجل عنوانك الصحيح رسمياً برقم الشقة المكون من 4 أرقام (Lgh-nummer) عبر موقع skatteverket.se بدون أي رسوم.',
        deadline: 'فوراً بالتزامن مع الرد',
      },
      {
        step: 3,
        title: 'إرفاق إثباتات السكن الفعلية',
        description: 'أرفق نسخة من عقد الإيجار من الباطن، كشوف التحويلات البنكية الشهرية للإيجار، وأي فواتير تثبت إقامتك العائلية هناك.',
      },
    ],
    essentialDocuments: [
      {
        nameSv: 'Svar på förfrågan om folkbokföring',
        nameAr: 'استمارة الرد على استفسار القيد المدني',
        whyNeeded: 'الرد الرسمي المكتوب والموقع لتفادي صدور قرار غيابي بتسجيلك بدون عنوان.',
      },
      {
        nameSv: 'Andrahandsavtal & Betalningsbevis',
        nameAr: 'عقد الإيجار وإثباتات الدفع البنكية',
        whyNeeded: 'دليل حاسم على حسن النية وتحديد الموقع الجغرافي لسكنك الفعلي.',
      },
    ],
    officialAuthorities: [
      {
        nameSv: 'Skatteverket',
        nameAr: 'مصلحة الضرائب السويدية (قسم القيد المدني)',
        url: 'https://www.skatteverket.se/privat/folkbokforing.html',
      },
    ],
  },
  {
    id: 'case-work-permit-salary-threshold',
    category: 'permits_pay',
    categoryLabelAr: 'الأجور وتصاريح العمل',
    badgeAr: 'قانون الهجرة والعمل 2024-2026',
    titleAr: 'الحد الأدنى لراتب تصريح العمل (Lönegolv): كيف تتصرف إذا حاول رب العمل تخفيض راتبك؟',
    titleSv: 'Försörjningskrav och lönevillkor för arbetstillstånd',
    difficulty: 'متقدم',
    scenarioAr: 'يقيم "سامر" في ستوكهولم بتصريح عمل (Arbetstillstånd) في قطاع المطاعم والضيافة. مع رفع الحكومة السويدية للحد الأدنى الإلزامي للأجور لتصاريح العمل إلى 80% من متوسط الأجور السويدية (حوالي 28,480+ كرونة لعام 2024 ومستمر بالتحديث)، طلب منه صاحب العمل توقيع ملحق عقد صوري بالراتب الجديد، على أن يعيد له سامر 5,000 كرونة شهرياً نقداً في يده (Under bordet)، مهدداً إياه بإلغاء الكفالة في حال رفض.',
    protagonist: {
      name: 'سامر',
      role: 'مساعد إدارة وضيافة',
      city: 'ستوكهولم',
    },
    keyQuestionAr: 'ما هي العواقب القانونية لهذا التصرف، وكيف يحمي سامر إقامته ووضعه القانوني؟',
    options: [
      {
        id: 'opt-agree-cash-back',
        titleAr: 'الموافقة وإعادة المبلغ نقداً لضمان استمرار الكفالة وتجديد الإقامة',
        descriptionAr: 'اعتبار ذلك حلاً مؤقتاً لتجنب ترحيله أو فقدان وظيفته الحالية.',
        isRecommended: false,
        verdictType: 'danger',
        verdictTitleAr: 'فخ قانوني يؤدي حتماً لرفض تجديد الإقامة وترحيلك',
        legalAnalysisAr: 'مصلحة الهجرة (Migrationsverket) ومصلحة الضرائب تقومان بتدقيق متقاطع للإقرارات الضريبية الدورية والتأمينات. استرجاع أموال نقداً يترك أثراً في التحويلات، وإذا تم اكتشاف التلاعب يُلغى تصريح العمل فوراً بتهمة الاحتيال (Svek) ويُحرم الموظف من حق الإقامة حتى لو كان صاحب العمل هو المحرض.',
        consequencesAr: 'إلغاء تصريح العمل، أمر بالترحيل مع حظر دخول لمنطقة الشنغن، وخسارة أي حق في الحصول على الإقامة الدائمة (PUT).',
      },
      {
        id: 'opt-facket-change-job',
        titleAr: 'رفض التنازل والتواصل سراً مع النقابة والبحث عن صاحب عمل بديل معتمد',
        descriptionAr: 'التمسك بحقك في تقاضي الراتب كاملاً قانونياً، واستغلال مهلة الأشهر الممنوحة للبحث عن وظيفة بديلة مطابقة للشروط.',
        isRecommended: true,
        verdictType: 'correct',
        verdictTitleAr: 'الطريق القانوني السليم الذي يحفظ كرامتك وإقامتك',
        legalAnalysisAr: 'وفق قوانين العمل المعدلة، لا يستطيع رب العمل سحب تصريح العمل من تلقاء نفسه؛ فالتصريح ممنوح لك من الدولة. إذا رفضت وقام بفصلك، يمنحك القانون مهلة 3 أشهر للبحث عن صاحب عمل جديد وتقديم طلب تبديل كفالة دون مغادرة السويد. إبلاغ النقابة يمنحك حماية ومفاوضات ويضمن صرف مستحقاتك.',
        consequencesAr: 'البقاء في السويد بشكل قانوني ونظيف، الحصول على كافة حقوقك المالية والتقاعدية، والحفاظ على مسارك نحو الإقامة الدائمة.',
      },
      {
        id: 'opt-accept-half-time',
        titleAr: 'طلب تخفيض ساعات العمل للنصف لتبرير انخفاض الراتب الإجمالي',
        descriptionAr: 'اقتراح العمل بنصف دوام للتوافق مع ما يريد رب العمل دفعه.',
        isRecommended: false,
        verdictType: 'danger',
        verdictTitleAr: 'مخالفة صريحة لشروط تصريح العمل ومصيدة رفض تلقائي',
        legalAnalysisAr: 'شرط الـ Lönegolv لتصريح العمل يلزم بأن يكون الراتب الشهري الفعلي مساوياً للحد الأدنى (28,480+ كرونة) بصرف النظر عن نسبة الدوام. العمل بدوام جزئي لا يعفيك من الوصول لهذا الرقم الإجمالي شهرياً.',
        consequencesAr: 'رفض فوري لطلب التمديد من مصلحة الهجرة لأن شرط الإعالة الذاتية (God försörjning) لم يتحقق.',
      },
    ],
    legalFoundation: {
      lawNameSv: 'Utlänningslag (2005:716) & Förordning om arbetstillstånd',
      lawNameAr: 'قانون الأجانب وقرارات تصاريح العمل السويدية',
      applicableArticles: ['المادة 6:2 (شروط الراتب ومكافأة العمل)', 'متطلب الإعالة والحد الأدنى (Lönekrav för arbetstillstånd)'],
      summaryAr: 'يجب أن يكون الراتب متوافقاً مع الاتفاقيات الجماعية وألا يقل عن 80% من متوسط الأجور في السويد، مع تأمينات العمل الأربعة الإلزامية (Tjänstepension, Sjukförsäkring, Trygghetsförsäkring, Livförsäkring).',
      recentUpdates2024_2026: 'رفعت الحكومة السويدية سقف الراتب الإلزامي، وشددت إجراءات سحب التصاريح من الشركات الوهمية، مع حماية الموظف المبلغ عن الانتهاكات.',
    },
    actionRoadmap: [
      {
        step: 1,
        title: 'رفض التوقيع على أي مبالغ نقدية أو تسويات شفهية',
        description: 'حافظ على كافة المراسلات والرسائل النصية والبريد الإلكتروني التي يطلب فيها رب العمل ذلك كدليل حماية.',
      },
      {
        step: 2,
        title: 'مراجعة شروط عقدك مع نقابة القطاع (Hotell- och restaurangfacket / Unionen)',
        description: 'اطلب من النقابة مراجعة التوصيف الوظيفي وسلم الرواتب والتحقق من سداد الشركة لاشتراكات التأمين التقاعدي FORA أو Collectum.',
      },
      {
        step: 3,
        title: 'البحث عن فرصة عمل جديدة لدى شركة تمتلك اتفاقية جماعية (Kollektivavtal)',
        description: 'إذا ثبت سوء نية المشغل، تقدم لوظيفة أخرى وقدم طلب تبديل تصريح عمل لدى Migrationsverket قبل انتهاء تصريحك الحالي.',
      },
    ],
    essentialDocuments: [
      {
        nameSv: 'Anställningsavtal med bilaga om lön',
        nameAr: 'عقد العمل وملحق الأجور الرسمي',
        whyNeeded: 'الوثيقة الأساسية المقدمة للهجرة لمطابقة الراتب الفعلي.',
      },
      {
        nameSv: 'Kontoutdrag & Lönespecifikationer',
        nameAr: 'كشف الحساب البنكي وقسائم الرواتب الشهرية',
        whyNeeded: 'إثبات تحويل الراتب الخاضع للضريبة عبر البنك دون أي رد مالي.',
      },
      {
        nameSv: 'Försäkringsbesked (FORA / Collectum)',
        nameAr: 'شهادة التأمينات المهنية الإلزامية',
        whyNeeded: 'شرط حاسم تطلبه الهجرة للتأكد من عدم وجود نقص في تأمينات العامل.',
      },
    ],
    officialAuthorities: [
      {
        nameSv: 'Migrationsverket',
        nameAr: 'مصلحة الهجرة السويدية',
        url: 'https://www.migrationsverket.se',
      },
      {
        nameSv: 'Hotell- och restaurangfacket (HRF)',
        nameAr: 'نقابة عمال الفنادق والمطاعم',
        url: 'https://www.hrf.net',
      },
    ],
  },
  {
    id: 'case-parental-leave-protection',
    category: 'leave_family',
    categoryLabelAr: 'الإجازات وحماية الأسرة',
    badgeAr: 'حماية قانونية مشددة ضد التمييز',
    titleAr: 'طلب إجازة الوالدين (Föräldraledighet) ورفض المشغل أو التهديد بتخفيض الرتبة',
    titleSv: 'Föräldraledighetslagen och diskrimineringsskydd',
    difficulty: 'متوسط',
    scenarioAr: 'رزق "خالد" بمولوده الأول وأراد أخذ 3 أشهر متواصلة من إجازة الأبوة المدفوعة (Föräldraledighet) لرعاية طفله ودعم زوجته. أبلغ مديره قبل شهرين ونصف وفق القانون، لكن المدير رفض بحجة: "نحن في موسم ضغط، والرجال في شركتنا لا يأخذون أكثر من أسبوعين، وإذا أصريت سنضطر لتسليم مشاريعك لزميل آخر وقد لا تجد مكانك القديم عند عودتك".',
    protagonist: {
      name: 'خالد',
      role: 'مسؤول لوجستيات ومستودعات',
      city: 'يارفيلا (Järfälla)',
    },
    keyQuestionAr: 'ما مدى قانونية رفض رب العمل لإجازة الأبوة، وما هي دروع الحماية التي يوفرها القانون السويدي للأب؟',
    options: [
      {
        id: 'opt-cancel-paternity-leave',
        titleAr: 'التراجع عن الإجازة والاكتفاء بأيام العطلة السنوية لتجنب خسارة ترقيته',
        descriptionAr: 'الخضوع لضغط المدير خوفاً من تقييم الأداء أو النقل التعسفي.',
        isRecommended: false,
        verdictType: 'danger',
        verdictTitleAr: 'تنازل غير ضروري عن حق قانوني أصيل مكفول بقوة الدستور',
        legalAnalysisAr: 'قانون إجازة الوالدين (Föräldraledighetslagen) قانون آمر (Tvingande lag)؛ لا يجوز لأي رب عمل ولا لأي عقد فردي إسقاطه أو تقييده. كما يحظر قانون التمييز (Diskrimineringslagen) معاقبة أي موظف أو حرمانه من التطوير الوظيفي بسبب ممارسته لحقه في رعاية طفله.',
        consequencesAr: 'حرمان طفلك من حق الرعاية، وخسارة بدلات Försäkringskassan، وتشجيع صاحب العمل على الاستمرار في انتهاك حقوقك.',
      },
      {
        id: 'opt-enforce-parental-law',
        titleAr: 'تقديم الطلب كتابياً والتمسك بحقك القانوني وتفعيل مساندة النقابة ومحامي التمييز (DO)',
        descriptionAr: 'تأكيد التزامك بمهلة الشهرين، وتذكير الشركة بالمادة 16 من Föräldraledighetslagen وحق العودة لنفس المنصب بنفس الشروط.',
        isRecommended: true,
        verdictType: 'correct',
        verdictTitleAr: 'حماية قانونية مطلقة وغرامات قاسية تفرض على رب العمل عند المخالفة',
        legalAnalysisAr: 'إذا أخطر الموظف رب العمل قبل شهرين (أو وفق ما تحدده الاتفاقية الجماعية)، فلا يملك صاحب العمل أي سلطة لرفض الإجازة. المادة 16 تحظر صراحة أي تصرف سلبي (Missgynnande) تجاه الموظف، ويضمن القانون عودته لنفس مهامه براتب متكافئ شاملاً الزيادات الدورية. مخالفة ذلك تتيح للموظف الحصول على تعويضات مالية ضخمة عبر المحكمة أو عبر وسيط التمييز (Diskrimineringsombudsmannen - DO).',
        consequencesAr: 'أخذ إجازتك كاملة بسلام وطمأنينة، تقاضي مخصصاتك من مصلحة التأمينات Försäkringskassan، وحماية وظيفتك بقوة القانون.',
      },
      {
        id: 'opt-fake-sick-leave',
        titleAr: 'أخذ إجازة مرضية كبديل لتفادي المواجهة المباشرة مع المدير',
        descriptionAr: 'محاولة الحصول على تقرير طبي لتبرير الغياب دون ذكر رعاية الطفل.',
        isRecommended: false,
        verdictType: 'warning',
        verdictTitleAr: 'احتيال تأميني يعرضك لإلغاء التعويضات والتحقيق',
        legalAnalysisAr: 'الادعاء بالمرض للحصول على تعويض sjukpenning بدلاً من föräldrapenning يعد احتيالاً على مؤسسة الضمان الاجتماعي (Bidragsbrott).',
        consequencesAr: 'مطالبتك بإرجاع الأموال مع فوائد وغرامات، وفقدان ميزة إجازة الوالدين المحمية قانونياً.',
      },
    ],
    legalFoundation: {
      lawNameSv: 'Föräldraledighetslag (1995:584)',
      lawNameAr: 'قانون إجازة الوالدين السويدي',
      applicableArticles: ['المادة 4 (الحق الكامل في الإجازة)', 'المادة 13 (مهلة الإخطار قبل شهرين على الأقل)', 'المادة 16 (حظر الإضرار بالموظف Missgynnandeförbud)'],
      summaryAr: 'يحق لكل من الأم والأب التمتع بإجازة رعاية الطفل حتى بلوغه سن الثامنة أو إنهاء الصف الأول، مع حظر كامل لأي تمييز أو تخفيض في الأجر أو تغيير المهام دون موافقة العامل.',
      recentUpdates2024_2026: 'توسيع إمكانية نقل جزء من أيام الإجازة بين الوالدين أو لشخص قريب وفق التعديلات الأخيرة المعتمدة لتسهيل التوازن الأسري.',
    },
    actionRoadmap: [
      {
        step: 1,
        title: 'إرسال طلب الإجازة الخطي (Skriftlig ledighetsansökan)',
        description: 'أرسل الطلب عبر البريد الإلكتروني الرسمي واذكر فيه تاريخ البداية والنهاية المحدد، مع الإشارة إلى أن الطلب مقدم قبل أكثر من شهرين.',
        deadline: 'قبل شهرين على الأقل من بدء الإجازة',
      },
      {
        step: 2,
        title: 'التقديم على البوابة الإلكترونية لـ Försäkringskassan',
        description: 'سجل الأيام التي ترغب في أخذ البدل المالي عنها (Begär föräldrapenning) واحتفظ بنسخة من تأكيد الطلب.',
      },
      {
        step: 3,
        title: 'توثيق أي تهديد شفهي أو تلميح بالمعاقبة الوظيفية',
        description: 'إذا كرر المدير كلامه، اطلب منه وضعه كتابياً أو أرسل ملخصاً بما دار في الاجتماع عبر الإيميل وأبلغ ممثل السلامة (Skyddsombud) أو النقابة.',
      },
    ],
    essentialDocuments: [
      {
        nameSv: 'Ledighetsansökan föräldraledighet',
        nameAr: 'طلب إجازة الوالدين الرسمي المكتوب',
        whyNeeded: 'إثبات تاريخ تسليم الإخطار قبل مهلة الشهرين القانونية.',
      },
      {
        nameSv: 'Beslut från Försäkringskassan',
        nameAr: 'قرار مصلحة التأمينات بصرف البدل المالي اليومي',
        whyNeeded: 'لتحديد الأيام المدفوعة وأساس الراتب المحسوب (SGI).',
      },
    ],
    officialAuthorities: [
      {
        nameSv: 'Försäkringskassan',
        nameAr: 'مصلحة التأمينات الاجتماعية السويدية',
        url: 'https://www.forsakringskassan.se',
      },
      {
        nameSv: 'Diskrimineringsombudsmannen (DO)',
        nameAr: 'أمين مظالم شؤون التمييز السويدي',
        url: 'https://www.do.se',
      },
    ],
  },
];

export interface ContractCheckItem {
  id: string;
  categoryAr: string;
  questionAr: string;
  swedishTerm: string;
  importance: 'حرج جداً' | 'مهم' | 'موصى به';
  explanationAr: string;
  dangerAlertAr: string;
}

export const CONTRACT_CHECKLIST: ContractCheckItem[] = [
  {
    id: 'chk-kollektivavtal',
    categoryAr: 'الاتفاقية الجماعية',
    questionAr: 'هل يذكر العقد صراحة خضوع الشركة لاتفاقية جماعية (Kollektivavtal)؟',
    swedishTerm: 'Kollektivavtalsbundenhet',
    importance: 'حرج جداً',
    explanationAr: 'الاتفاقية الجماعية تضمن لك حداً أدنى للأجور، زيادات سنوية إلزامية، تعويض العمل الإضافي، وتأمين التقاعد المهني (Tjänstepension). غيابها يعني أنك مضطر للتفاوض الفردي على كل تفصيلة.',
    dangerAlertAr: 'إذا لم تكن الشركة موقعة على اتفاقية، يجب التأكد من إدراج بند خطي صريح يلزم الشركة بسداد تأمين تقاعدي مهني (Tjänstepension) بنسبة لا تقل عن 4.5% - 30% من الراتب.',
  },
  {
    id: 'chk-form-of-employment',
    categoryAr: 'شكل ونوع التوظيف',
    questionAr: 'هل العقد دائم (Tillsvidare) أم تجريبي (Provanställning) أم محدد المدة؟',
    swedishTerm: 'Anställningsform',
    importance: 'حرج جداً',
    explanationAr: 'الأصل في القانون السويدي هو العقد الدائم (Tillsvidare). إذا كان تجريبياً (Provanställning)، يجب ألا يتجاوز 6 أشهر حداً أقصى مطلقاً، ويتحول تلقائياً إلى دائم في اليوم التالي للشهر السادس ما لم يتم إخطارك كتابياً.',
    dangerAlertAr: 'احذر من العقود المؤقتة المتكررة مثل (Behovsanställning) أو عقود الساعات (Timanställning) إن كنت بحاجة لتصريح إقامة عمل أو قرض سكني.',
  },
  {
    id: 'chk-salary-and-benefits',
    categoryAr: 'الراتب وساعات العمل',
    questionAr: 'هل الراتب محدد برقم ثابت (Fast månadslön) وساعات العمل 40 ساعة/أسبوعياً؟',
    swedishTerm: 'Månadslön & Arbetstidsmått',
    importance: 'حرج جداً',
    explanationAr: 'يجب تحديد الراتب الأساسي قبل الضريبة بوضوح. لحاملي تصاريح العمل لعام 2024-2026، يجب ألا يقل الراتب عن 80% من متوسط الأجور في السويد (28,480+ كرونة).',
    dangerAlertAr: 'الاعتماد على العمولات أو المكافآت المتغيرة دون راتب أساسي كافٍ قد يعرض تصريح العمل للرفض التلقائي من Migrationsverket.',
  },
  {
    id: 'chk-notice-period',
    categoryAr: 'مهلة الإشعار والاستقالة',
    questionAr: 'ما هي مهلة الإخطار عند إنهاء الخدمة (Uppsägningstid) المحددة في العقد؟',
    swedishTerm: 'Uppsägningstid enligt LAS',
    importance: 'مهم',
    explanationAr: 'وفق قانون LAS، تبدأ مهلة الإشعار من شهر واحد كحد أدنى وترتفع مع سنوات الخدمة لتصل إلى 6 أشهر لمن أمضى 10 سنوات. أي شرط يقل عن شهر يعد باطلاً بحكم القانون.',
    dangerAlertAr: 'تأكد من أن مهلة الإشعار متماثلة بين الطرفين ولا تلزمك بمهلة طويلة جداً مع إعطاء صاحب العمل مهلة قصيرة مجحفة.',
  },
  {
    id: 'chk-vacation-days',
    categoryAr: 'الإجازات السنوية',
    questionAr: 'هل يضمن العقد 25 يوم إجازة سنوية مدفوعة الأجر كحد أدنى؟',
    swedishTerm: 'Semesterdagar enligt Semesterlagen',
    importance: 'مهم',
    explanationAr: 'ينص قانون الإجازات السويدي (Semesterlagen) على حق الموظف في 25 يوم إجازة سنوياً، مع صرف مكافأة إجازة إضافية (Semestertillägg) لا تقل عن 0.43% - 0.8% من الراتب عن كل يوم إجازة مأخوذ.',
    dangerAlertAr: 'لا يحق لرب العمل حرمانك من أخذ 4 أسابيع متتالية في فصل الصيف (يونيو - أغسطس) إلا بمبررات استثنائية جداً مدعومة باتفاقية نقابية.',
  },
  {
    id: 'chk-occupational-pension',
    categoryAr: 'التقاعد المهني والتأمينات',
    questionAr: 'هل الشركة ملزمة بتسجيلك في تأمينات العمل الجماعية (Collectum أو FORA)؟',
    swedishTerm: 'Tjänstepension och AFA Försäkring',
    importance: 'حرج جداً',
    explanationAr: 'التقاعد الحكومي العام وحده لا يكفي لعيش كريم في السويد؛ التقاعد المهني (Tjänstepension) يشكل ثلث راتبك التقاعدي المستقبلي. كما تشمل التأمينات تعويض حوادث العمل والوفاة والعجز.',
    dangerAlertAr: 'لحاملي تصاريح العمل، أي شهر ينقص فيه سداد رب العمل للتأمين المهني قد يتسبب في إلغاء الإقامة فوراً عند تقديم طلب التمديد.',
  },
  {
    id: 'chk-non-compete',
    categoryAr: 'شروط عدم المنافسة والمحاسبة',
    questionAr: 'هل يحتوي العقد على شرط مبالغ فيه لمنع العمل لدى المنافسين (Konkurrensklausul)؟',
    swedishTerm: 'Konkurrensklausuler',
    importance: 'موصى به',
    explanationAr: 'شروط منع المنافسة بعد الاستقالة تخضع لقيود مشددة بموجب الاتفاقيات السويدية، ويجب ألا تزيد مدتها عن 9 إلى 18 شهراً كحد أقصى، مع إلزام الشركة بدفع تعويض شهري للموظف يصل لـ 60% من راتبه خلال فترة المنع.',
    dangerAlertAr: 'أي بند يمنعك من العمل في مجالك لسنوات دون تعويض مالي يعد شرطاً باطلاً أو قابلاً للإلغاء لدى محكمة العمل.',
  },
];
