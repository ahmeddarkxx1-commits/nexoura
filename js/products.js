const products = [
    {
        id: "premium-ui-kit",
        name: "مجموعة أدوات واجهة المستخدم المميزة",
        tagline: "أسرع طريقة لبناء تطبيقات احترافية",
        description: "مكتبة كاملة بضـم أكتر من 500 عنصر وتصميم جاهز، معمولة مخصوص عشان توفر عليك شهور من الشغل.",
        fullDescription: "لو عايز تطلع مشروعك للنور بسرعة ومحتار في التصميم، المجموعة دي هتديك كل اللي محتاجه. ملفات Figma أصلية، عناصر سهلة التعديل، وألوان عصرية تخلي تطبيقك يبان احترافي من أول ثانية.",
        price: "$49",
        badge: "الأكثر مبيعاً",
        category: "UI Kits",
        image: "assets/images/ui_kit_hero_1775771666819.png",
        paymentLink: "https://accept.paymob.com/standalone/?..." 
    },
    {
        id: "saas-launch-guide",
        name: "خطة الربح من الصفر لـ 10 آلاف دولار",
        tagline: "بطل تخمين وابدأ خطوات مدروسة",
        description: "دليل عملي بيعلمك إزاي تبدأ مشروعك الرقمي الأول وتوصل لهدفك المالي بخطوات واضحة.",
        fullDescription: "الخلاصة اللي جمعناها من سنين شغل في بناء وبيع المنتجات الرقمية. الدليل ده متقسم لـ 12 فصل بيغطوا كل حاجة من أول اختيار الفكرة لحد التسويق الأوتوماتيكي اللي بيجيب لك مبيعات وأنت نايم.",
        price: "$29",
        badge: "جديد",
        category: "E-Books",
        image: "assets/images/saas_guide_hero_1775771679352.png",
        paymentLink: "https://accept.paymob.com/standalone/?..."
    },
    {
        id: "notion-startup-os",
        name: "نظام إدارة المشاريع المتكامل على Notion",
        tagline: "كل تفاصيل شغلك في مكان واحد",
        description: "أقوى قالب Notion للمؤسسين والفرلانسرز. هينظم لك مشاريعك، حساباتك، ومواعيدك في ثواني.",
        fullDescription: "بطل تتشتت بين 10 تطبيقات مختلفة. قالب Startup OS بيجمع لك خريطة الطريق، قاعدة بيانات العملاء، الحسابات، وحتى المهام اليومية في لوحة تحكم واحدة منظمة ومريحة للعين.",
        price: "$19",
        badge: "مميز",
        category: "Templates",
        image: "assets/images/notion_os_hero_1775771739545.png",
        paymentLink: "https://accept.paymob.com/standalone/?..."
    },
    {
        id: "icon-system-pro",
        name: "مجموعة الأيقونات العصرية Pro",
        tagline: "دقة، بساطة، واحترافية",
        description: "أكتر من 2000 أيقونة SVG مرسومة بدقة بيكسل واحدة عشان تليق على أي تصميم مودرن.",
        fullDescription: "أيقوناتنا مرسومة يدوي بوزن وشكل متناسق. مجهزة للويب والموبايل، وبتيجي بـ 4 أشكال مختلفة: خطوط رفيعة، عريضة، لونين، وبستايل Glassmorphism الشفاف.",
        price: "$39",
        badge: "تقييم عالي",
        category: "Graphics",
        image: "assets/images/icons_pro_hero_1775771841217.png",
        paymentLink: "https://accept.paymob.com/standalone/?..."
    },
    {
        id: "digital-marketing-blueprint",
        name: "كتاب أساسيات الربح من التسويق الرقمي",
        tagline: "دليلك الشامل لبيع أي منتج أونلاين",
        description: "كتاب بياخدك من الصفر لحد ما تعمل أول حملة إعلانية ناجحة وتحقق أرباح حقيقية.",
        fullDescription: "التسويق هو روح أي مشروع. في الكتاب ده، هتعرف إزاي تختار جمهورك، إزاي تكتب محتوى بيبيع، وإزاي تستخدم السوشيال ميديا عشان تجيب مبيعات بجد مش مجرد لايكات.",
        price: "$15",
        badge: "الأكثر مبيعاً",
        category: "E-Books",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
        paymentLink: "https://accept.paymob.com/standalone/?...",
        downloadLink: "https://example.com/download/digital-marketing"
    },
    {
        id: "freelance-mastery-course",
        name: "كورس احتراف العمل الحر 2026",
        tagline: "ازاي تبدأ من غير خبرة وتوصل لعملاء أجانب",
        description: "كورس فيديو مسجل بيشرح لك خطوات التسجيل في Upwork وFiverr وإزاي تجيب أول دولار ليك.",
        fullDescription: "لو نفسك تشتغل من البيت وبالدولار بس مش عارف تبدأ منين، الكورس ده هو الحل. هنمشي معاك خطوة بخطوة من أول فتح الحساب لحد ما تستلم فلوسك في مصر.",
        price: "$45",
        badge: "دليل المبتدئين",
        category: "Courses",
        image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=1200",
        paymentLink: "https://accept.paymob.com/standalone/?...",
        downloadLink: "https://example.com/download/freelance-mastery"
    },
    {
        id: "passive-income-guide",
        name: "دليل الدخل السلبي (Passive Income)",
        tagline: "علم فلوسك تشتغل بدالك",
        description: "إزاي تعمل انظمة أوتوماتيكية تجيب لك فلوس من غير ما تضطر تشتغل 8 ساعات يومياً.",
        fullDescription: "الدخل السلبي هو حلم أي حد، بس محتاج سيستم صح. في الدليل ده بنشرح لك 5 طرق مجربة تقدر تبدأ منهم دلوقتي وتشوف نتايج في خلال شهور بسيطة.",
        price: "$19",
        badge: "الخيار الذكي",
        category: "E-Books",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=1200",
        paymentLink: "https://accept.paymob.com/standalone/?...",
        downloadLink: "https://example.com/download/passive-income"
    },
    {
        id: "tiktok-content-mastery",
        name: "خطة صناعة المحتوى على تيك توك",
        tagline: "إزاي تتصدر التريند وتجيب عملاء",
        description: "أسرار خوارزمية تيك توك وإزاي تعمل فيديوهات بتجيب ملايين المشاهدات وتسوق لمنتجاتك.",
        fullDescription: "تيك توك هو المنصة الأسرع نمواً حالياً. في الدليل ده بنشرح لك إزاي تصور، إزاي تختار الهاشتاجات الصح، وإزاي تحول المشاهدات لفلوس حقيقية في جيبك.",
        price: "$12",
        badge: "تريند",
        category: "Courses",
        image: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?auto=format&fit=crop&q=80&w=1200",
        paymentLink: "https://accept.paymob.com/standalone/?...",
        downloadLink: "https://example.com/download/tiktok-mastery"
    },
    {
        id: "faceless-youtube-guide",
        name: "دليل اليوتيوب بدون ظهور (Faceless)",
        tagline: "اكسب من اليوتيوب من غير ما تطلع بوشك",
        description: "كل الأدوات والبرامج اللي محتاجها عشان تعمل قناة يوتيوب ناجحة وتحقق دخل سلبي من الإعلانات.",
        fullDescription: "كتير مننا بيبقى نفسه يبدأ يوتيوب بس مبيحبش يظهر قدام الكاميرا. الدليل ده هو دليلك الشامل لعمل قنوات ناجحة بتعتمد على التعليق الصوتي واللقطات الجاهزة والذكاء الاصطناعي.",
        price: "$27",
        badge: "مميز",
        category: "E-Books",
        image: "https://images.unsplash.com/photo-1541873676946-84099901021e?auto=format&fit=crop&q=80&w=1200",
        paymentLink: "https://accept.paymob.com/standalone/?...",
        downloadLink: "https://example.com/download/faceless-youtube"
    }
];

export default products;
