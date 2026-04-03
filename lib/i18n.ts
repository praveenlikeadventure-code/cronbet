export type Locale = 'en' | 'ru' | 'hi' | 'pt' | 'es' | 'tr' | 'fr' | 'de' | 'ar'

export const SUPPORTED_LOCALES: Locale[] = ['en', 'ru', 'hi', 'pt', 'es', 'tr', 'fr', 'de', 'ar']
export const DEFAULT_LOCALE: Locale = 'en'
export const LOCALE_COOKIE = 'NEXT_LOCALE'

export const languages: Record<Locale, { name: string; nativeName: string; flag: string; dir: 'ltr' | 'rtl' }> = {
  en: { name: 'English',    nativeName: 'English',    flag: '🇬🇧', dir: 'ltr' },
  ru: { name: 'Russian',    nativeName: 'Русский',    flag: '🇷🇺', dir: 'ltr' },
  hi: { name: 'Hindi',      nativeName: 'हिंदी',       flag: '🇮🇳', dir: 'ltr' },
  pt: { name: 'Portuguese', nativeName: 'Português',  flag: '🇧🇷', dir: 'ltr' },
  es: { name: 'Spanish',    nativeName: 'Español',    flag: '🇪🇸', dir: 'ltr' },
  tr: { name: 'Turkish',    nativeName: 'Türkçe',     flag: '🇹🇷', dir: 'ltr' },
  fr: { name: 'French',     nativeName: 'Français',   flag: '🇫🇷', dir: 'ltr' },
  de: { name: 'German',     nativeName: 'Deutsch',    flag: '🇩🇪', dir: 'ltr' },
  ar: { name: 'Arabic',     nativeName: 'العربية',    flag: '🇸🇦', dir: 'rtl' },
}

/** Maps ISO 3166-1 alpha-2 country codes to a locale */
export const countryToLocale: Record<string, Locale> = {
  // Russian-speaking CIS
  RU: 'ru', BY: 'ru', KZ: 'ru', UZ: 'ru', TJ: 'ru', TM: 'ru', KG: 'ru', AZ: 'ru', AM: 'ru', GE: 'ru',
  // India
  IN: 'hi',
  // Portuguese
  BR: 'pt', PT: 'pt', AO: 'pt', MZ: 'pt', CV: 'pt', GW: 'pt', ST: 'pt', TL: 'pt',
  // Spanish
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', PE: 'es', CL: 'es', VE: 'es',
  EC: 'es', BO: 'es', PY: 'es', UY: 'es', DO: 'es', GT: 'es', HN: 'es',
  SV: 'es', NI: 'es', CR: 'es', PA: 'es', CU: 'es', GQ: 'es',
  // Turkish
  TR: 'tr',
  // French
  FR: 'fr', SN: 'fr', CI: 'fr', ML: 'fr', BF: 'fr', NE: 'fr', TG: 'fr',
  BJ: 'fr', CG: 'fr', CD: 'fr', GA: 'fr', CM: 'fr', MG: 'fr', RW: 'fr',
  BI: 'fr', DJ: 'fr', KM: 'fr', MU: 'fr', GN: 'fr', MR: 'fr', LU: 'fr', BE: 'fr',
  // German
  DE: 'de', AT: 'de', LI: 'de',
  // Arabic
  SA: 'ar', AE: 'ar', EG: 'ar', MA: 'ar', DZ: 'ar', TN: 'ar',
  LY: 'ar', SD: 'ar', IQ: 'ar', SY: 'ar', JO: 'ar', LB: 'ar',
  KW: 'ar', QA: 'ar', BH: 'ar', OM: 'ar', YE: 'ar', PS: 'ar',
}

/** Maps BCP 47 language tags (lower-cased) to locales */
const acceptLangToLocale: Record<string, Locale> = {
  ru: 'ru', 'ru-ru': 'ru',
  hi: 'hi', 'hi-in': 'hi',
  pt: 'pt', 'pt-br': 'pt', 'pt-pt': 'pt',
  es: 'es', 'es-es': 'es', 'es-mx': 'es', 'es-ar': 'es', 'es-co': 'es',
  tr: 'tr', 'tr-tr': 'tr',
  fr: 'fr', 'fr-fr': 'fr', 'fr-be': 'fr', 'fr-ca': 'fr',
  de: 'de', 'de-de': 'de', 'de-at': 'de', 'de-ch': 'de',
  ar: 'ar', 'ar-sa': 'ar', 'ar-ae': 'ar', 'ar-eg': 'ar',
}

export function localeFromAcceptLanguage(header: string): Locale | null {
  const tags = header.split(',').map((s) => s.split(';')[0].trim().toLowerCase())
  for (const tag of tags) {
    if (acceptLangToLocale[tag]) return acceptLangToLocale[tag]
    const base = tag.split('-')[0]
    if (acceptLangToLocale[base]) return acceptLangToLocale[base]
  }
  return null
}

// ---------------------------------------------------------------------------
// Translations
// ---------------------------------------------------------------------------

type T = {
  nav: {
    home: string; compare: string; bestBonuses: string; blog: string; compareSites: string
  }
  hero: {
    badge: string; titleBefore: string; titleHighlight: string; titleAfter: string
    subtitle: string; compareBtn: string; bonusesBtn: string
  }
  stats: {
    monthlyVisitors: string; sitesReviewed: string; bestBonus: string; independentReviews: string
  }
  sections: {
    top5Title: string; top5Subtitle: string; viewAll: string
    allSitesTitle: string; allSitesSubtitle: string; faqTitle: string
  }
  responsible: {
    title: string; description: string; learnMore: string
  }
  footer: {
    description: string; quickLinks: string; legal: string; safeGambling: string
    ageOnly: string; responsibleGambling: string; independentReviews: string
    disclaimer: string; copyright: string; affiliateNotice: string
  }
  language: { select: string }
}

const en: T = {
  nav: {
    home: 'Home', compare: 'Compare', bestBonuses: 'Best Bonuses',
    blog: 'Blog', compareSites: 'Compare Sites',
  },
  hero: {
    badge: 'Trusted by 100,000+ bettors worldwide',
    titleBefore: 'Find the', titleHighlight: 'Best Betting Site', titleAfter: 'for You',
    subtitle: 'We independently compare top betting platforms so you get the biggest bonuses, best odds, and most trusted sites.',
    compareBtn: 'Compare All Sites →', bonusesBtn: 'View Best Bonuses',
  },
  stats: {
    monthlyVisitors: 'Monthly Visitors', sitesReviewed: 'Sites Reviewed',
    bestBonus: 'Best Bonus', independentReviews: 'Independent Reviews',
  },
  sections: {
    top5Title: 'Top 5 Betting Sites', top5Subtitle: 'Hand-picked by our expert team',
    viewAll: 'View all →', allSitesTitle: 'All Betting Sites Compared',
    allSitesSubtitle: 'Filter and sort to find your perfect match.',
    faqTitle: 'Frequently Asked Questions',
  },
  responsible: {
    title: 'Gamble Responsibly',
    description: 'Betting should be fun. Never bet more than you can afford to lose.',
    learnMore: 'Learn More',
  },
  footer: {
    description: 'Your trusted guide to the best online betting sites. We compare platforms to help you make informed decisions.',
    quickLinks: 'Quick Links', legal: 'Legal', safeGambling: 'Safe Gambling',
    ageOnly: '18+ Only', responsibleGambling: 'Responsible Gambling',
    independentReviews: 'Independent Reviews',
    disclaimer: 'Gambling involves risk. Please only gamble with money you can afford to lose.',
    copyright: 'All rights reserved. cronbet.com is an affiliate website.',
    affiliateNotice: 'This site contains affiliate links. We may receive compensation for clicks/sign-ups.',
  },
  language: { select: 'Language' },
}

const ru: T = {
  nav: {
    home: 'Главная', compare: 'Сравнить', bestBonuses: 'Лучшие бонусы',
    blog: 'Блог', compareSites: 'Сравнить сайты',
  },
  hero: {
    badge: 'Доверяют более 100 000 игроков по всему миру',
    titleBefore: 'Найдите', titleHighlight: 'лучший букмекерский сайт', titleAfter: 'для себя',
    subtitle: 'Мы независимо сравниваем лучшие букмекерские платформы, чтобы вы получили максимальные бонусы, лучшие коэффициенты и самые надёжные сайты.',
    compareBtn: 'Сравнить все сайты →', bonusesBtn: 'Лучшие бонусы',
  },
  stats: {
    monthlyVisitors: 'Посетителей в месяц', sitesReviewed: 'Сайтов проверено',
    bestBonus: 'Лучший бонус', independentReviews: 'Независимые обзоры',
  },
  sections: {
    top5Title: 'Топ-5 букмекеров', top5Subtitle: 'Подобраны нашей командой экспертов',
    viewAll: 'Смотреть все →', allSitesTitle: 'Все букмекеры в сравнении',
    allSitesSubtitle: 'Фильтруйте и сортируйте для идеального выбора.',
    faqTitle: 'Часто задаваемые вопросы',
  },
  responsible: {
    title: 'Играйте ответственно',
    description: 'Ставки должны приносить удовольствие. Никогда не ставьте больше, чем можете позволить себе потерять.',
    learnMore: 'Узнать больше',
  },
  footer: {
    description: 'Ваш надёжный гид по лучшим онлайн-букмекерским сайтам.',
    quickLinks: 'Быстрые ссылки', legal: 'Правовая информация', safeGambling: 'Безопасная игра',
    ageOnly: 'Только 18+', responsibleGambling: 'Ответственная игра',
    independentReviews: 'Независимые обзоры',
    disclaimer: 'Ставки связаны с риском. Ставьте только те деньги, которые готовы потерять.',
    copyright: 'Все права защищены. cronbet.com — партнёрский сайт.',
    affiliateNotice: 'Сайт содержит партнёрские ссылки. Мы получаем вознаграждение за переходы.',
  },
  language: { select: 'Язык' },
}

const hi: T = {
  nav: {
    home: 'होम', compare: 'तुलना', bestBonuses: 'बेस्ट बोनस',
    blog: 'ब्लॉग', compareSites: 'साइट्स की तुलना',
  },
  hero: {
    badge: 'दुनिया भर में 1,00,000+ बेटर्स का विश्वास',
    titleBefore: 'अपने लिए सबसे अच्छी', titleHighlight: 'बेटिंग साइट', titleAfter: 'खोजें',
    subtitle: 'हम आपके लिए सबसे बड़े बोनस, बेहतरीन ऑड्स और सबसे भरोसेमंद साइट्स के लिए टॉप बेटिंग प्लेटफॉर्म की स्वतंत्र रूप से तुलना करते हैं।',
    compareBtn: 'सभी साइट्स की तुलना करें →', bonusesBtn: 'बेस्ट बोनस देखें',
  },
  stats: {
    monthlyVisitors: 'मासिक विज़िटर', sitesReviewed: 'साइट्स समीक्षित',
    bestBonus: 'बेस्ट बोनस', independentReviews: 'स्वतंत्र समीक्षाएं',
  },
  sections: {
    top5Title: 'टॉप 5 बेटिंग साइट्स', top5Subtitle: 'हमारी विशेषज्ञ टीम द्वारा चुनी गई',
    viewAll: 'सभी देखें →', allSitesTitle: 'सभी बेटिंग साइट्स की तुलना',
    allSitesSubtitle: 'अपना परफेक्ट मैच खोजने के लिए फ़िल्टर करें।',
    faqTitle: 'अक्सर पूछे जाने वाले सवाल',
  },
  responsible: {
    title: 'जिम्मेदारी से जुआ खेलें',
    description: 'बेटिंग मनोरंजन के लिए होनी चाहिए। कभी भी उससे अधिक न लगाएं जो आप खो सकते हैं।',
    learnMore: 'और जानें',
  },
  footer: {
    description: 'सर्वश्रेष्ठ ऑनलाइन बेटिंग साइट्स के लिए आपका भरोसेमंद गाइड।',
    quickLinks: 'त्वरित लिंक', legal: 'कानूनी', safeGambling: 'सुरक्षित जुआ',
    ageOnly: 'केवल 18+', responsibleGambling: 'जिम्मेदार जुआ',
    independentReviews: 'स्वतंत्र समीक्षाएं',
    disclaimer: 'जुए में जोखिम है। केवल वही पैसा लगाएं जो आप खो सकते हैं।',
    copyright: 'सर्वाधिकार सुरक्षित। cronbet.com एक एफिलिएट वेबसाइट है।',
    affiliateNotice: 'इस साइट में एफिलिएट लिंक हैं।',
  },
  language: { select: 'भाषा' },
}

const pt: T = {
  nav: {
    home: 'Início', compare: 'Comparar', bestBonuses: 'Melhores Bônus',
    blog: 'Blog', compareSites: 'Comparar Sites',
  },
  hero: {
    badge: 'Com a confiança de mais de 100.000 apostadores em todo o mundo',
    titleBefore: 'Encontre o', titleHighlight: 'Melhor Site de Apostas', titleAfter: 'para Você',
    subtitle: 'Comparamos de forma independente as melhores plataformas de apostas para que você obtenha os maiores bônus, melhores odds e sites mais confiáveis.',
    compareBtn: 'Comparar Todos os Sites →', bonusesBtn: 'Ver Melhores Bônus',
  },
  stats: {
    monthlyVisitors: 'Visitantes Mensais', sitesReviewed: 'Sites Avaliados',
    bestBonus: 'Melhor Bônus', independentReviews: 'Avaliações Independentes',
  },
  sections: {
    top5Title: 'Top 5 Sites de Apostas', top5Subtitle: 'Selecionados pela nossa equipe especializada',
    viewAll: 'Ver todos →', allSitesTitle: 'Todos os Sites Comparados',
    allSitesSubtitle: 'Filtre e ordene para encontrar sua combinação perfeita.',
    faqTitle: 'Perguntas Frequentes',
  },
  responsible: {
    title: 'Aposte com Responsabilidade',
    description: 'Apostar deve ser divertido. Nunca aposte mais do que pode perder.',
    learnMore: 'Saiba Mais',
  },
  footer: {
    description: 'Seu guia de confiança para os melhores sites de apostas online.',
    quickLinks: 'Links Rápidos', legal: 'Legal', safeGambling: 'Jogo Seguro',
    ageOnly: 'Apenas 18+', responsibleGambling: 'Jogo Responsável',
    independentReviews: 'Avaliações Independentes',
    disclaimer: 'Apostas envolvem risco. Aposte apenas o que pode perder.',
    copyright: 'Todos os direitos reservados. cronbet.com é um site afiliado.',
    affiliateNotice: 'Este site contém links de afiliados.',
  },
  language: { select: 'Idioma' },
}

const es: T = {
  nav: {
    home: 'Inicio', compare: 'Comparar', bestBonuses: 'Mejores Bonos',
    blog: 'Blog', compareSites: 'Comparar Sitios',
  },
  hero: {
    badge: 'Con la confianza de más de 100.000 apostadores en todo el mundo',
    titleBefore: 'Encuentra el', titleHighlight: 'Mejor Sitio de Apuestas', titleAfter: 'para Ti',
    subtitle: 'Comparamos de forma independiente las mejores plataformas de apuestas para que obtengas los mejores bonos, cuotas y sitios más confiables.',
    compareBtn: 'Comparar Todos los Sitios →', bonusesBtn: 'Ver Mejores Bonos',
  },
  stats: {
    monthlyVisitors: 'Visitantes Mensuales', sitesReviewed: 'Sitios Revisados',
    bestBonus: 'Mejor Bono', independentReviews: 'Reseñas Independientes',
  },
  sections: {
    top5Title: 'Top 5 Sitios de Apuestas', top5Subtitle: 'Seleccionados por nuestro equipo de expertos',
    viewAll: 'Ver todos →', allSitesTitle: 'Todos los Sitios Comparados',
    allSitesSubtitle: 'Filtra y ordena para encontrar tu combinación perfecta.',
    faqTitle: 'Preguntas Frecuentes',
  },
  responsible: {
    title: 'Apuesta de Forma Responsable',
    description: 'Apostar debe ser divertido. Nunca apuestes más de lo que puedes permitirte perder.',
    learnMore: 'Más Información',
  },
  footer: {
    description: 'Tu guía de confianza para los mejores sitios de apuestas en línea.',
    quickLinks: 'Enlaces Rápidos', legal: 'Legal', safeGambling: 'Juego Seguro',
    ageOnly: 'Solo +18', responsibleGambling: 'Juego Responsable',
    independentReviews: 'Reseñas Independientes',
    disclaimer: 'Las apuestas conllevan riesgo. Apuesta solo lo que puedas perder.',
    copyright: 'Todos los derechos reservados. cronbet.com es un sitio afiliado.',
    affiliateNotice: 'Este sitio contiene enlaces de afiliados.',
  },
  language: { select: 'Idioma' },
}

const tr: T = {
  nav: {
    home: 'Ana Sayfa', compare: 'Karşılaştır', bestBonuses: 'En İyi Bonuslar',
    blog: 'Blog', compareSites: 'Siteleri Karşılaştır',
  },
  hero: {
    badge: "Dünya genelinde 100.000'den fazla bahisçi tarafından güvenilen",
    titleBefore: 'Sizin İçin En İyi', titleHighlight: 'Bahis Sitesini', titleAfter: 'Bulun',
    subtitle: 'En büyük bonusları, en iyi oranları ve en güvenilir siteleri almanız için en iyi bahis platformlarını bağımsız olarak karşılaştırıyoruz.',
    compareBtn: 'Tüm Siteleri Karşılaştır →', bonusesBtn: 'En İyi Bonusları Gör',
  },
  stats: {
    monthlyVisitors: 'Aylık Ziyaretçi', sitesReviewed: 'İncelenen Site',
    bestBonus: 'En İyi Bonus', independentReviews: 'Bağımsız İnceleme',
  },
  sections: {
    top5Title: 'En İyi 5 Bahis Sitesi', top5Subtitle: 'Uzman ekibimiz tarafından seçildi',
    viewAll: 'Tümünü gör →', allSitesTitle: 'Tüm Bahis Siteleri Karşılaştırması',
    allSitesSubtitle: 'Mükemmel eşleşmenizi bulmak için filtreleyin.',
    faqTitle: 'Sık Sorulan Sorular',
  },
  responsible: {
    title: 'Sorumlu Bahis',
    description: 'Bahis eğlenceli olmalıdır. Kaybetmeyi göze alamayacağınız miktardan fazlasını yatırmayın.',
    learnMore: 'Daha Fazla Bilgi',
  },
  footer: {
    description: 'En iyi online bahis sitelerine güvenilir rehberiniz.',
    quickLinks: 'Hızlı Bağlantılar', legal: 'Yasal', safeGambling: 'Güvenli Oyun',
    ageOnly: 'Yalnızca 18+', responsibleGambling: 'Sorumlu Oyun',
    independentReviews: 'Bağımsız İnceleme',
    disclaimer: 'Bahis risk içerir. Sadece kaybedebileceğiniz miktarda oynayın.',
    copyright: 'Tüm hakları saklıdır. cronbet.com bir bağlı kuruluş sitesidir.',
    affiliateNotice: 'Bu site bağlı kuruluş bağlantıları içerir.',
  },
  language: { select: 'Dil' },
}

const fr: T = {
  nav: {
    home: 'Accueil', compare: 'Comparer', bestBonuses: 'Meilleurs Bonus',
    blog: 'Blog', compareSites: 'Comparer les Sites',
  },
  hero: {
    badge: 'Approuvé par plus de 100 000 parieurs dans le monde',
    titleBefore: 'Trouvez le', titleHighlight: 'Meilleur Site de Paris', titleAfter: 'pour Vous',
    subtitle: 'Nous comparons indépendamment les meilleures plateformes de paris pour vous offrir les plus grands bonus, les meilleures cotes et les sites les plus fiables.',
    compareBtn: 'Comparer Tous les Sites →', bonusesBtn: 'Voir les Meilleurs Bonus',
  },
  stats: {
    monthlyVisitors: 'Visiteurs Mensuels', sitesReviewed: 'Sites Évalués',
    bestBonus: 'Meilleur Bonus', independentReviews: 'Avis Indépendants',
  },
  sections: {
    top5Title: 'Top 5 Sites de Paris', top5Subtitle: "Sélectionnés par notre équipe d'experts",
    viewAll: 'Voir tout →', allSitesTitle: 'Tous les Sites Comparés',
    allSitesSubtitle: 'Filtrez et triez pour trouver votre correspondance parfaite.',
    faqTitle: 'Questions Fréquentes',
  },
  responsible: {
    title: 'Jouez de Façon Responsable',
    description: "Les paris doivent être amusants. Ne pariez jamais plus que ce que vous pouvez vous permettre de perdre.",
    learnMore: 'En Savoir Plus',
  },
  footer: {
    description: 'Votre guide de confiance pour les meilleurs sites de paris en ligne.',
    quickLinks: 'Liens Rapides', legal: 'Mentions Légales', safeGambling: 'Jeu Responsable',
    ageOnly: '18+ Seulement', responsibleGambling: 'Jeu Responsable',
    independentReviews: 'Avis Indépendants',
    disclaimer: 'Les paris comportent des risques. Ne pariez que ce que vous pouvez vous permettre de perdre.',
    copyright: 'Tous droits réservés. cronbet.com est un site affilié.',
    affiliateNotice: 'Ce site contient des liens affiliés.',
  },
  language: { select: 'Langue' },
}

const de: T = {
  nav: {
    home: 'Startseite', compare: 'Vergleichen', bestBonuses: 'Beste Boni',
    blog: 'Blog', compareSites: 'Seiten vergleichen',
  },
  hero: {
    badge: 'Von über 100.000 Wettern weltweit vertraut',
    titleBefore: 'Finden Sie die', titleHighlight: 'Beste Wettseite', titleAfter: 'für Sie',
    subtitle: 'Wir vergleichen unabhängig die besten Wettplattformen, damit Sie die größten Boni, besten Quoten und vertrauenswürdigsten Seiten erhalten.',
    compareBtn: 'Alle Seiten vergleichen →', bonusesBtn: 'Beste Boni ansehen',
  },
  stats: {
    monthlyVisitors: 'Monatliche Besucher', sitesReviewed: 'Bewertete Seiten',
    bestBonus: 'Bester Bonus', independentReviews: 'Unabhängige Bewertungen',
  },
  sections: {
    top5Title: 'Top 5 Wettseiten', top5Subtitle: 'Von unserem Expertenteam ausgewählt',
    viewAll: 'Alle anzeigen →', allSitesTitle: 'Alle Wettseiten im Vergleich',
    allSitesSubtitle: 'Filtern und sortieren Sie für Ihre perfekte Auswahl.',
    faqTitle: 'Häufig gestellte Fragen',
  },
  responsible: {
    title: 'Verantwortungsvolles Spielen',
    description: 'Wetten sollte Spaß machen. Setzen Sie niemals mehr, als Sie sich leisten können zu verlieren.',
    learnMore: 'Mehr erfahren',
  },
  footer: {
    description: 'Ihr vertrauensvoller Ratgeber für die besten Online-Wettseiten.',
    quickLinks: 'Schnelllinks', legal: 'Rechtliches', safeGambling: 'Sicheres Spielen',
    ageOnly: 'Nur 18+', responsibleGambling: 'Verantwortungsvolles Spielen',
    independentReviews: 'Unabhängige Bewertungen',
    disclaimer: 'Wetten birgt Risiken. Setzen Sie nur, was Sie sich leisten können zu verlieren.',
    copyright: 'Alle Rechte vorbehalten. cronbet.com ist eine Affiliate-Website.',
    affiliateNotice: 'Diese Seite enthält Affiliate-Links.',
  },
  language: { select: 'Sprache' },
}

const ar: T = {
  nav: {
    home: 'الرئيسية', compare: 'مقارنة', bestBonuses: 'أفضل المكافآت',
    blog: 'المدونة', compareSites: 'قارن المواقع',
  },
  hero: {
    badge: 'موثوق به من قبل أكثر من 100,000 مراهن حول العالم',
    titleBefore: 'ابحث عن', titleHighlight: 'أفضل موقع رهانات', titleAfter: 'المناسب لك',
    subtitle: 'نقارن بشكل مستقل أفضل منصات الرهان للحصول على أكبر المكافآت وأفضل الأسعار والمواقع الأكثر موثوقية.',
    compareBtn: '← قارن جميع المواقع', bonusesBtn: 'عرض أفضل المكافآت',
  },
  stats: {
    monthlyVisitors: 'زوار شهريًا', sitesReviewed: 'مواقع تمت مراجعتها',
    bestBonus: 'أفضل مكافأة', independentReviews: 'مراجعات مستقلة',
  },
  sections: {
    top5Title: 'أفضل 5 مواقع رهانات', top5Subtitle: 'اختارها فريقنا من الخبراء',
    viewAll: 'عرض الكل ←', allSitesTitle: 'مقارنة جميع مواقع الرهان',
    allSitesSubtitle: 'قم بالتصفية والفرز للعثور على مطابقتك المثالية.',
    faqTitle: 'الأسئلة المتكررة',
  },
  responsible: {
    title: 'القمار بمسؤولية',
    description: 'يجب أن تكون الرهانات ممتعة. لا تراهن أبداً بأكثر مما يمكنك تحمل خسارته.',
    learnMore: 'اعرف المزيد',
  },
  footer: {
    description: 'دليلك الموثوق لأفضل مواقع الرهان عبر الإنترنت.',
    quickLinks: 'روابط سريعة', legal: 'قانوني', safeGambling: 'القمار الآمن',
    ageOnly: '18+ فقط', responsibleGambling: 'القمار المسؤول',
    independentReviews: 'مراجعات مستقلة',
    disclaimer: 'القمار ينطوي على مخاطر. لا تقامر إلا بما يمكنك تحمل خسارته.',
    copyright: 'جميع الحقوق محفوظة. cronbet.com موقع تابع.',
    affiliateNotice: 'يحتوي هذا الموقع على روابط تابعة.',
  },
  language: { select: 'اللغة' },
}

export const translations: Record<Locale, T> = { en, ru, hi, pt, es, tr, fr, de, ar }

export function getTranslations(locale: Locale | string | undefined): T {
  const key = (locale as Locale) || DEFAULT_LOCALE
  return translations[key] || translations[DEFAULT_LOCALE]
}
